# Supabase Integration in aska-web Project

## 🎯 What is Supabase?

**Supabase** is a Backend-as-a-Service (BaaS) platform that provides:
- **PostgreSQL Database** - Full-featured relational database
- **Real-time subscriptions** - Live data updates
- **Authentication** - User management (not currently used in aska-web)
- **Storage** - File storage (not currently used)
- **API** - Auto-generated REST API from your database schema

Think of it as: **"Firebase, but with PostgreSQL instead of NoSQL"**

---

## 🔌 How Supabase is Integrated in aska-web

### 1. **The Connection Setup**

**File:** `src/utils/supabase/server.ts`

This is your **single source of truth** for connecting to Supabase:

```typescript
export async function createServerClient() {
  // Creates a Supabase client configured for Next.js server-side usage
  // Uses environment variables for connection:
  // - NEXT_PUBLIC_SUPABASE_URL
```

**Key Features:**
- ✅ **Server-side only** - Runs on Next.js server (not exposed to browser)
- ✅ **Cookie-based sessions** - Manages user sessions securely
- ✅ **Type-safe** - TypeScript types** - Full type safety

**Environment Variables Needed:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public (safe) API key

---

## 📊 What Data is Stored in Supabase?

### **Collection Tables** (Content Library)
These store your main content:

| Table | Purpose | Used By |
|-------|---------|---------|
| `collection_wisdom` | Wisdom quotes/musings | `/api/public/wisdom/*` |
| `collection_greetings` | Greeting messages | `/api/public/greetings/*` |
| `collection_facts` | Hockey facts/statistics | Shareables system |
| `collection_motivational` | Motivational quotes | Shareables system |

**Structure:**
- Each table has: `id`, `status`, `theme`, `category`, `attribution`, `created_at`, `published_at`
- Content-specific fields (e.g., `fact_text`, `quote`, `title`)

### **Shareables Tables** (Pre-processed Collections)
These store curated daily collections:

| Table | Purpose | Used By |
|-------|---------|---------|
| `pub_shareables_facts` | Daily facts collections | `/api/public/shareables/facts` |
| `pub_shareables_motivational` | Daily motivational collections | `/api/public/shareables/motivational` |

**Structure:**
- `id` - Collection ID
- `items` - JSONB array of pre-processed content items
- `created_at` - When collection was created
- `status` - "published" or "published" or "draft"

**Why Separate Tables?**
- Collections = Individual content items (raw data)
- Shareables = Curated sets ready to display (pre-processed)

---

## 🔄 How Supabase is Used in Your API Routes

### **Pattern: Query → Filter → Return**

Every API route follows this pattern:

```typescript
// 1. Create Supabase client
const supabase = await createServerClient();

// 2. Query the database
const { data, error } = await supabase
  .from("collection_wisdom")        // Table name
  .select("id, title, from_the_box") // Fields to return
  .eq("status", "published")         // Filter: only published
  .order("published_at", { ascending: false }) // Sort
  .limit(5);                        // Limit results

// 3. Handle errors
if (error) {
  return NextResponse.json({ success: false, error: "..." }, { status: 500 });
}

// 4. Return data
return NextResponse.json({ success: true, data }, { headers: {...} });
```

### **Real Examples from Your Code**

#### Example 1: Latest Wisdom
```typescript
// src/app/api/public/wisdom/latest/route.ts
const { data, error } = await supabase
  .from("collection_wisdom")
  .select("id, title, from_the_box, theme, attribution")
  .eq("status", "published")
 ︎.order("published_at", { ascending: false })
  .limit(Math.min(limit, 100));
```

**What it does:**
- Gets latest published wisdom items
- Returns only specific fields (not all columns)
- Limits to 100 max items
- Orders by publication date (newest first)

#### Example 2: Random Greeting
```typescript
// src/app/api/public/greetings/random/route.ts
// Step 1: Get all IDs
const { data: ids } = await supabase
  .from("collection_greetings")
  .select("id")
  .eq("status", "published");

// Step 2: Pick random ID
const randomId = ids[Math.floor(Math.random() * ids.length)].id;

// Step 3: Fetch that specific item
const { data } = await supabase
  .from("collection_greetings")
  .select("id, greeting_text, attribution")
  .eq("id", randomId)
  .single();
```

**What it does:**
- Gets all published greeting IDs
- Randomly selects one
- Fetches full details of that item

#### Example 3: Shareables Collection
```typescript
// src/app/api/public/shareables/facts/route.ts
const { data, error } = await supabase
  .from("pub_shareables_facts")
  .select("id, items, created_at")
  .eq("status", "published")
  .order("created_at", { ascending: false })
  .limit(1)
  .single();
```

**What it does:**
- Gets the latest published facts collection
- Returns the pre-processed `items` array (JSONB)
- Includes metadata (id, created_at)

---

## 🔐 Security & Access Control

### **Row Level Security (RLS)**

Supabase uses **RLS policies** to control who can access what:

**Current Setup:**
- ✅ **Public read access** - Anyone can read `status = 'published'` content
- ✅ **Server-side only** - API routes run on server (not exposed to browser)
- ✅ **Filtered queries** - Always filter by `status = 'published'`

**What This Means:**
- Public users can only see published content
- Draft/archived content is hidden
- No authentication needed for public APIs

### **Why Server-Side Client?**

```typescript
// ✅ GOOD: Server-side (what you're using)
const supabase = await createServerClient(); // Runs on Next.js server

// ❌ BAD: Client-side (not used)
import { createBrowserClient } from '@supabase/ssr'; // Would expose keys
```

**Benefits:**
- API keys stay on server (never exposed to browser)
- Can use service role key for admin operations (if needed)
- Better security

---

## 📈 Data Flow: How Content Gets to Users

```
┌─────────────────┐
│  Supabase DB    │
│  (PostgreSQL)   │
│                 │
│ collection_*    │ ← Raw content items
│ pub_shareables_*│ ← Pre-processed collections
└────────┬────────┘
         │
         │ Supabase Client Query
         │
         ▼
┌─────────────────┐
│  Next.js API    │
│  Routes         │
│                 │
│ /api/public/*   │ ← Server-side queries
└────────┬────────┘
         │
         │ HTTP Request
         │
         ▼
┌─────────────────┐
│  React Pages    │
│  (Client)       │
│                 │
│ /shareables     │ ← Fetches from API
│ /did-you-know   │
│ /the-code       │
└─────────────────┘
```

**Flow:**
1. **Database** stores content (Supabase PostgreSQL)
2. **API Routes** query database (Next.js server)
3. **Pages** fetch from API (React client)
4. **Users** see content in browser

---

## 🎨 Supabase Query Builder Features Used

### **Filtering**
```typescript
.eq("status", "published")        // Equal to
.gte("created_at", date)          // Greater than or equal
.limit(10)                        // Limit results
```

### **Selecting Fields**
```typescript
.select("id, title, theme")       // Only return these columns
```

### **Ordering**
```typescript
.order("published_at", { ascending: false }) // Newest first
```

### **Single Result**
```typescript
.single()                        // Expect exactly one result
```

---

## 🔍 Current Usage Summary

### **Tables Queried:**
1. ✅ `collection_wisdom` - Wisdom content
2. ✅ `collection_greetings` - Greeting content
3. ✅ `pub_shareables_facts` - Facts collections
4. ✅ `pub_shareables_motivational` - Motivational collections

### **API Routes Using Supabase:**
- `/api/public/wisdom/latest` - Latest wisdom
- `/api/public/wisdom/random` - Random wisdom
- `/api/public/greetings/latest` - Latest greetings
- `/api/public/greetings/random` - Random greetings
- `/api/public/shareables/facts` - Facts collections
- `/api/public/shareables/motivational` - Motivational collections

### **Pages That Data:**
- `/shareables` - Shows wisdom & greetings
- `/did-you-know` - Shows facts collections
- `/the-code` - Shows motivational collections

---

## 🚀 Why Supabase?

### **Advantages:**
1. ✅ **No Database Server Management** - Supabase handles it
2. ✅ **TypeScript Support** - Full type safety
3. ✅ **Real-time Capable** - Can add live updates later
4. ✅ **PostgreSQL** - Powerful relational database
5. ✅ **Built-in Security** - RLS policies
6. ✅ **Auto-generated APIs** - Can use REST API directly (optional)

### **Current Limitations:**
- ❌ **No Authentication** - Not using Supabase Auth (could add later)
- ❌ **No Storage** - Not using file storage (could add later)
- ❌ **No Real-time** - Not using subscriptions (could add later)

**But:** You're using the core feature - **the database** - which is perfect for your needs!

---

## 📝 Key Takeaways

1. **Supabase = Your Database** - All content is stored in Supabase PostgreSQL
2. **Server-Side Only** - All queries happen on Next.js server (secure)
3. **Public APIs** - Anyone can read published content (by design)
4. **Type-Safe** - Full TypeScript support
5. **Simple Pattern** - Query → Filter → Return

---

## 🔮 Future Possibilities

You could add:
- **Authentication** - User accounts via Supabase Auth
- **Real-time Updates** - Live content updates
- **File Storage** - Images/files via Supabase Storage
- **Admin Dashboard** - Direct database access via Supabase Dashboard

But for now, **you're using Supabase perfectly** - as a secure, type-safe database backend! 🎉

