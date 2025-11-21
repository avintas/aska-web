# How to Check Actual Table Names in Supabase

## Quick Check

The code is querying:
- `pub_shareables_facts`
- `pub_shareables_motivational`

But documentation mentions:
- `daily_shareables_motivational`

## Steps to Verify:

1. **Go to Supabase Dashboard**
2. **Table Editor** → See all tables
3. **Check what tables actually exist:**
   - `pub_shareables_facts`?
   - `pub_shareables_motivational`?
   - `daily_shareables_motivational`?
   - Something else?

4. **Check table structure:**
   - Does it have `status` column?
   - Does it have `publish_date` column?
   - Does it have `id` column?
   - Does it have `items` column?

## Common Issues:

### Issue 1: Wrong Table Name
- Code expects: `pub_shareables_facts`
- Actual table: `daily_shareables_facts` or `shareables_facts`

**Fix:** Update code to match actual table name

### Issue 2: Wrong Column Name
- Code expects: `status` column
- Actual table: Uses `publish_date` instead

**Fix:** Update queries to use correct column

### Issue 3: Different Structure
- Code expects: `id`, `items`, `created_at`, `status`
- Actual table: Different columns

**Fix:** Update queries to match actual structure

