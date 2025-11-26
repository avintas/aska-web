# CMS Integration Strategy: The Shootout
## How Trivia Questions Work With Your Content Management System

---

## 🔍 Understanding Your Current CMS Architecture

### Current Pattern (Shareables System)

**For Facts, Motivational, Code, etc.:**
1. **CMS manages** raw content in `collection_*` tables
2. **CMS packages** content into curated sets
3. **Sets stored** in `pub_shareables_*` tables with `items` arrays
4. **Website consumes** packaged sets via API

**Example:**
- Raw facts in `collection_facts` table
- CMS packages into `pub_shareables_facts` table
- API endpoint: `/api/public/shareables/facts`

### Trivia Questions (Current State)

**Trivia questions are DIFFERENT:**
- Stored directly in `trivia_multiple_choice`, `trivia_true_false`, `trivia_who_am_i` tables
- **NOT** going through `collection_*` → `pub_shareables_*` pattern
- Questions have `status` field (`published` / `unpublished`)

**This suggests:** Trivia questions might be managed directly, not through CMS packaging.

---

## 🎯 Two Possible Approaches

### Option A: Direct Database Access (Simpler - Recommended for MVP)

**How It Works:**
- Trivia feed reads **directly** from `trivia_*` tables
- Filters by `status = 'published'`
- No CMS packaging needed
- CMS just manages question creation/editing

**API Endpoint:**
```
GET /api/the-shootout/questions
```

**Query Logic:**
```typescript
// Direct query to trivia tables
const { data } = await supabase
  .from('trivia_multiple_choice')
  .select('*')
  .eq('status', 'published')
  .limit(20);
```

**CMS Requirements:**
- ✅ CMS needs to be able to create/edit questions in `trivia_*` tables
- ✅ CMS needs to set `status = 'published'` when ready
- ❌ CMS does NOT need to package questions into sets
- ❌ CMS does NOT need to provide API access

**Pros:**
- ✅ Simplest implementation
- ✅ No CMS changes needed (if CMS already manages trivia tables)
- ✅ Direct access = faster queries
- ✅ More flexible (can filter by difficulty, tags, etc.)

**Cons:**
- ⚠️ Questions not "packaged" (but that's fine for infinite scroll)

---

### Option B: Shareables Pattern (More Complex - Future Consideration)

**How It Works:**
- CMS packages trivia questions into `pub_shareables_trivia` table
- Questions stored as JSON array in `items` field
- Trivia feed reads from shareables table

**API Endpoint:**
```
GET /api/public/shareables/trivia
```

**Query Logic:**
```typescript
// Read from shareables table
const { data } = await supabase
  .from('pub_shareables_trivia')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false })
  .limit(1)
  .single();

// Extract items array
const questions = data.items; // Array of question objects
```

**CMS Requirements:**
- ✅ CMS needs to create `pub_shareables_trivia` table
- ✅ CMS needs to package questions into sets
- ✅ CMS needs to manage set publishing
- ⚠️ More complex CMS workflow

**Pros:**
- ✅ Consistent with other content types
- ✅ CMS controls question sets/curation
- ✅ Can version question sets

**Cons:**
- ❌ More complex to implement
- ❌ Less flexible (can't easily filter individual questions)
- ❌ Not ideal for infinite scroll (need to unpack sets)

---

## ✅ Recommended Approach: Option A (Direct Access)

### Why Direct Access is Better for Infinite Scroll

1. **Infinite Scroll Needs Individual Questions**
   - Feed loads 20 questions at a time
   - Needs to filter/exclude specific questions
   - Needs to randomize order
   - Shareables pattern (packaged sets) doesn't fit this use case

2. **Performance**
   - Direct queries are faster
   - Can use database indexes efficiently
   - Can filter by difficulty, tags, etc. at query time

3. **Flexibility**
   - Can exclude answered questions easily
   - Can adjust difficulty mix dynamically
   - Can add new filters without CMS changes

4. **Simplicity**
   - No packaging step needed
   - CMS just manages questions directly
   - Website reads directly from source

---

## 🔌 What Your CMS Needs to Provide

### Minimum Requirements (Option A)

**1. Database Access to Trivia Tables**
- CMS must be able to read/write to:
  - `trivia_multiple_choice`
  - `trivia_true_false`
  - `trivia_who_am_i`

**2. Status Management**
- CMS must be able to set `status = 'published'` or `'unpublished'`
- Website will only show `status = 'published'` questions

**3. Question Fields**
- CMS must support all question fields:
  - `question_text`
  - `correct_answer`
  - `wrong_answers` (for multiple-choice)
  - `is_true` (for true-false)
  - `explanation`
  - `difficulty`
  - `tags`
  - `theme`
  - `category`

### CMS API Access (Not Required!)

**Important:** The trivia feed does NOT need CMS API access.

**Why:**
- Trivia feed reads directly from Supabase database
- Uses same database connection as rest of website
- CMS and website share the same database

**Architecture:**
```
CMS → Writes to → Supabase Database (trivia_* tables)
                                    ↓
Website → Reads from → Supabase Database (trivia_* tables)
```

**No API needed between CMS and Website!** They both use the same database.

---

## 📋 Implementation Details

### API Endpoint Structure

**GET `/api/the-shootout/questions`**

**Query Parameters:**
- `limit` (default: 20) - Number of questions
- `offset` (default: 0) - Pagination
- `question_types` (optional) - Comma-separated: "multiple-choice,true-false,who-am-i"
- `difficulty` (optional) - Filter by difficulty
- `exclude_ids` (optional) - Comma-separated question IDs to exclude

**Implementation:**
```typescript
export async function GET(request: NextRequest) {
  const supabase = await createServerClient();
  
  // Get query parameters
  const limit = parseInt(searchParams.get('limit') || '20');
  const questionTypes = searchParams.get('question_types')?.split(',') || 
    ['multiple-choice', 'true-false', 'who-am-i'];
  
  // Fetch from each trivia table
  const questions = [];
  
  for (const type of questionTypes) {
    const tableName = getTableName(type); // e.g., 'trivia_multiple_choice'
    
    const { data } = await supabase
      .from(tableName)
      .select('*')
      .eq('status', 'published')
      .limit(limit);
    
    // Add type field and transform
    questions.push(...data.map(q => ({
      ...q,
      type: type
    })));
  }
  
  // Randomize and return
  return NextResponse.json({
    success: true,
    data: shuffle(questions).slice(0, limit)
  });
}
```

### Status Filtering

**Critical:** Only show published questions

```typescript
.eq('status', 'published')
```

**Why:**
- CMS can create/edit questions with `status = 'unpublished'`
- These won't appear in feed until CMS publishes them
- Allows CMS to prepare questions before making them live

---

## 🔄 CMS Workflow (What CMS Needs to Do)

### Creating Questions

1. **CMS creates question** in appropriate `trivia_*` table
2. **Sets `status = 'unpublished'`** (default)
3. **Question is NOT visible** in trivia feed yet

### Publishing Questions

1. **CMS sets `status = 'published'`**
2. **Question immediately appears** in trivia feed
3. **No deployment needed** - live immediately

### Editing Questions

1. **CMS edits question** in database
2. **If `status = 'published'`**, changes appear immediately
3. **If `status = 'unpublished'`**, changes don't affect live feed

### Unpublishing Questions

1. **CMS sets `status = 'unpublished'`**
2. **Question disappears** from feed immediately
3. **Existing answers preserved** (if user already answered it)

---

## 🗄️ Database Schema Requirements

### Existing Tables (No Changes Needed)

**`trivia_multiple_choice`**
- Must have `status` column (`published` / `unpublished`)
- Must have all question fields

**`trivia_true_false`**
- Must have `status` column
- Must have all question fields

**`trivia_who_am_i`**
- Must have `status` column
- Must have all question fields

### RLS Policies (If Needed)

**For Public Access:**
```sql
-- Allow public read access to published questions
CREATE POLICY "Public can read published questions"
ON trivia_multiple_choice
FOR SELECT
USING (status = 'published');
```

**For CMS Access:**
- CMS needs full CRUD access (via service role key)
- Not restricted by RLS policies

---

## 🎨 CMS UI Considerations

### What CMS Should Show

1. **Question List View**
   - Show all questions (published + unpublished)
   - Filter by status
   - Filter by type (multiple-choice, true-false, who-am-i)
   - Filter by difficulty

2. **Question Editor**
   - All question fields
   - Status toggle (Published / Unpublished)
   - Preview mode

3. **Bulk Actions**
   - Publish multiple questions
   - Unpublish multiple questions
   - Delete questions

### Status Indicators

- 🟢 **Published** - Visible in trivia feed
- 🔴 **Unpublished** - Not visible in trivia feed
- 🟡 **Draft** - Being edited (if you add this status)

---

## 📊 Analytics & Monitoring

### What CMS Can Track

**Question Performance** (if you add analytics later):
- Which questions are answered most?
- Which questions are too hard? (low correct %)
- Which questions make users leave?

**But for MVP:** Just focus on publishing questions. Analytics can come later.

---

## ✅ Summary: CMS Requirements

### What CMS MUST Provide

1. ✅ **Database Access** - Read/write to `trivia_*` tables
2. ✅ **Status Management** - Set `status = 'published'` / `'unpublished'`
3. ✅ **Question CRUD** - Create, read, update, delete questions

### What CMS Does NOT Need to Provide

1. ❌ **API Access** - Website reads directly from database
2. ❌ **Packaging System** - No need to package questions into sets
3. ❌ **Special Endpoints** - Standard database access is enough

### Architecture Diagram

```
┌─────────────┐
│     CMS     │
│  (Manages)  │
└──────┬──────┘
       │
       │ Writes questions
       │ Sets status
       ▼
┌─────────────────────┐
│  Supabase Database  │
│                     │
│  trivia_multiple_   │
│    choice           │
│  trivia_true_false  │
│  trivia_who_am_i    │
│                     │
│  status='published' │
└──────┬──────────────┘
       │
       │ Reads questions
       │ Filters by status
       ▼
┌─────────────┐
│   Website   │
│  (Displays) │
└─────────────┘
```

**No API needed!** Both CMS and Website use the same database.

---

## 🚀 Next Steps

1. **Verify CMS Access** - Confirm CMS can read/write to `trivia_*` tables
2. **Verify Status Field** - Confirm `status` column exists and works
3. **Test Publishing** - Create test question, publish it, verify it appears
4. **Build API Endpoint** - Create `/api/the-shootout/questions` endpoint
5. **Test Integration** - Verify questions flow from CMS → Database → Website

**Bottom Line:** Your CMS just needs standard database access. No special API needed!

