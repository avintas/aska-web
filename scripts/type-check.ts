#!/usr/bin/env node
/**
 * Type Check Script
 *
 * Checks for common TypeScript type errors that might pass locally
 * but fail in strict CI/CD environments (like Vercel).
 *
 * Patterns checked:
 * 1. Supabase query variable reassignment with .single() or .maybeSingle()
 * 2. Other type-related anti-patterns
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

interface Issue {
  file: string;
  line: number;
  pattern: string;
  message: string;
}

const issues: Issue[] = [];
const srcDir = join(process.cwd(), "src");

// Get files from command line args (for lint-staged) or scan entire src directory
const filesToCheck = process.argv
  .slice(2)
  .filter((arg) => arg.endsWith(".ts") || arg.endsWith(".tsx"));
const shouldCheckAll = filesToCheck.length === 0;

// Pattern: Query variable reassignment in general (less strict, catches more cases)
const QUERY_REASSIGNMENT_GENERAL = /query\s*=\s*query\./g;

function checkFile(filePath: string): void {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relativePath = relative(process.cwd(), filePath);

  // More targeted check: look for lines with "let query =" followed by lines with "query = query."
  const letQueryMatches = [...content.matchAll(/let\s+query\s*=/g)];

  for (const letMatch of letQueryMatches) {
    const startIndex = letMatch.index!;
    const afterLet = content.substring(startIndex, startIndex + 1000); // Check next 1000 chars

    // Check if there's a reassignment with .single() or .maybeSingle()
    if (
      /query\s*=\s*query\.[\s\S]*?\.(single|maybeSingle)\(\)/.test(afterLet)
    ) {
      const lineNumber = content.substring(0, startIndex).split("\n").length;
      issues.push({
        file: relativePath,
        line: lineNumber,
        pattern: "query reassignment with .single()/.maybeSingle()",
        message:
          "Reassigning a query variable after calling .single() or .maybeSingle() changes the return type and causes TypeScript errors in strict mode. Use a ternary operator or separate variables instead.",
      });
    }
  }

  // Check for general query reassignment (might indicate similar issues)
  const generalMatches = [...content.matchAll(QUERY_REASSIGNMENT_GENERAL)];
  for (const match of generalMatches) {
    const lineNumber = content.substring(0, match.index!).split("\n").length;
    const lineContent = lines[lineNumber - 1].trim();

    // Only flag if it's a Supabase query pattern
    if (
      lineContent.includes("supabase") ||
      lineContent.includes("from(") ||
      lineContent.includes(".select(")
    ) {
      // Check if this is part of a .single() chain
      const context = content.substring(
        Math.max(0, match.index! - 200),
        Math.min(content.length, match.index! + 200),
      );

      if (context.includes(".single()") || context.includes(".maybeSingle()")) {
        // Check if we haven't already reported this
        const alreadyReported = issues.some(
          (issue) => issue.file === relativePath && issue.line === lineNumber,
        );

        if (!alreadyReported) {
          issues.push({
            file: relativePath,
            line: lineNumber,
            pattern: "query reassignment in Supabase query",
            message:
              "Reassigning query variables can cause type errors. Consider using a ternary operator or building the query conditionally.",
          });
        }
      }
    }
  }
}

function walkDirectory(dir: string): void {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (
        !entry.startsWith(".") &&
        entry !== "node_modules" &&
        entry !== ".next"
      ) {
        walkDirectory(fullPath);
      }
    } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
      checkFile(fullPath);
    }
  }
}

// Main execution
console.log("🔍 Running type check for common TypeScript issues...\n");

try {
  if (shouldCheckAll) {
    walkDirectory(srcDir);
  } else {
    // Check only provided files
    for (const file of filesToCheck) {
      const fullPath = join(process.cwd(), file);
      if (fullPath.startsWith(srcDir)) {
        checkFile(fullPath);
      }
    }
  }
} catch (error) {
  console.error("Error scanning files:", error);
  process.exit(1);
}

if (issues.length > 0) {
  console.error("❌ Found potential type issues:\n");

  // Group by file
  const issuesByFile = new Map<string, Issue[]>();
  for (const issue of issues) {
    if (!issuesByFile.has(issue.file)) {
      issuesByFile.set(issue.file, []);
    }
    issuesByFile.get(issue.file)!.push(issue);
  }

  for (const [file, fileIssues] of issuesByFile) {
    console.error(`📄 ${file}:`);
    for (const issue of fileIssues) {
      console.error(`   Line ${issue.line}: ${issue.pattern}`);
      console.error(`   ⚠️  ${issue.message}\n`);
    }
  }

  console.error(
    "\n💡 Tip: These patterns can cause TypeScript errors in strict CI/CD environments.\n",
  );
  process.exit(1);
} else {
  console.log("✅ No type issues found!\n");
  process.exit(0);
}
