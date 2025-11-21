# OnlyHockey.com - API Documentation

## 🔗 Public API Endpoints

All public APIs are available at `/api/public/` and require no authentication.

### Base URL
- **Development:** `http://localhost:3000/api/public/`
- **Production:** `https://onlyhockey.com/api/public/`

---

## 🏒 **Shareables API** (Primary Content System)

The Shareables API provides curated, pre-packaged content sets managed through the CMS. Content is stored in `pub_shareables_*` tables and delivered as ready-to-display collections.

### **Architecture Pattern**
- **CMS manages** raw content in `collection_*` tables
- **CMS packages** content into curated sets 
- **Sets stored** in `pub_shareables_*` tables with `items` arrays
- **Website consumes** packaged sets via API

---

## 📊 Facts Shareables

### Get Latest Facts Set
```http
GET /api/public/shareables/facts
```

Returns the most recent published facts collection.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fact_text": "The Stanley Cup is the oldest trophy in North American sports.",
      "fact_category": "history",
      "year": 1893,
      "theme": "history",
      "attribution": "NHL Official Records",
      "display_order": 1
    },
    {
      "id": 2,
      "fact_text": "Wayne Gretzky holds 61 NHL records.",
      "fact_category": "records",
      "year": null,
      "theme": "legends",
      "attribution": "NHL Statistics",
      "display_order": 2
    }
  ],
  "meta": {
    "id": 15,
    "created_at": "2025-11-21T10:30:00Z"
  }
}
```

### Get Specific Facts Set
```http
GET /api/public/shareables/facts?id=15
```

**Query Parameters:**
- `id`: Specific set ID to retrieve

### Get Facts Archive
```http
GET /api/public/shareables/facts?mode=archive
```

Returns metadata for past facts sets (last 20).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "created_at": "2025-11-21T10:30:00Z",
      "status": "published"
    },
    {
      "id": 14,
      "created_at": "2025-11-20T10:30:00Z", 
      "status": "published"
    }
  ]
}
```

---

## 🔥 Motivational Shareables

### Get Latest Motivational Set
```http
GET /api/public/shareables/motivational
```

Returns the most recent published motivational collection.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "quote": "You miss 100% of the shots you don't take.",
      "author": "Wayne Gretzky",
      "context": "Famous quote about taking chances",
      "theme": "opportunity",
      "category": "inspiration",
      "attribution": "The Great One",
      "display_order": 1
    },
    {
      "id": 2,
      "quote": "Hockey is a unique sport in the sense that you need each and every guy helping each other.",
      "author": "Mario Lemieux",
      "context": "On teamwork in hockey",
      "theme": "teamwork",
      "category": "leadership",
      "attribution": "NHL Legend",
      "display_order": 2
    }
  ],
  "meta": {
    "id": 8,
    "created_at": "2025-11-21T10:30:00Z"
  }
}
```

### Get Specific Motivational Set
```http
GET /api/public/shareables/motivational?id=8
```

### Get Motivational Archive
```http
GET /api/public/shareables/motivational?mode=archive
```

---

## 🔮 **Future Shareables** (Planned)

These endpoints will follow the same pattern when implemented:

### Wisdom Shareables
```http
GET /api/public/shareables/wisdom
GET /api/public/shareables/wisdom?id=123
GET /api/public/shareables/wisdom?mode=archive
```

### Greetings Shareables  
```http
GET /api/public/shareables/greetings
GET /api/public/shareables/greetings?id=123
GET /api/public/shareables/greetings?mode=archive
```

---

## ⚠️ **Legacy Endpoints** (Temporary)

These endpoints provide individual content items and will be replaced by the shareables system:

### Individual Wisdom (Temporary)
```http
GET /api/public/wisdom/random
GET /api/public/wisdom/latest?limit=10
```

### Individual Greetings (Temporary)
```http
GET /api/public/greetings/random
GET /api/public/greetings/latest?limit=10
```

**Note:** These endpoints are temporary placeholders. Use the shareables API for production applications.

---

## 🎯 Usage Examples

### JavaScript/Fetch - Get Latest Facts
```javascript
// Get latest facts set
const response = await fetch('/api/public/shareables/facts');
const { success, data, meta } = await response.json();

if (success) {
  console.log(`Facts set ${meta.id} from ${meta.created_at}`);
  data.forEach(fact => {
    console.log(`${fact.display_order}: ${fact.fact_text}`);
  });
}
```

### React Hook - Facts Shareables
```typescript
import { useEffect, useState } from 'react';

interface FactItem {
  id: number;
  fact_text: string;
  fact_category: string | null;
  year: number | null;
  theme: string | null;
  attribution: string | null;
  display_order: number;
}

interface FactsResponse {
  success: boolean;
  data: FactItem[];
  meta: {
    id: number;
    created_at: string;
  };
}

export function useFactsShareables() {
  const [facts, setFacts] = useState<FactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<FactsResponse['meta'] | null>(null);

  useEffect(() => {
    fetch('/api/public/shareables/facts')
      .then(res => res.json())
      .then(({ success, data, meta }: FactsResponse) => {
        if (success) {
          setFacts(data);
          setMeta(meta);
        }
        setLoading(false);
      });
  }, []);

  return { facts, meta, loading };
}
```

### Next.js Server Component - Motivational Shareables
```typescript
async function MotivationalDisplay() {
  const response = await fetch('http://localhost:3000/api/public/shareables/motivational');
  const { success, data, meta } = await response.json();

  if (!success) return <div>Error loading motivational content</div>;

  return (
    <div>
      <h2>Daily Motivation - Set #{meta.id}</h2>
      <p className="text-sm text-gray-500">Published: {new Date(meta.created_at).toLocaleDateString()}</p>
      
      <div className="grid gap-4 mt-4">
        {data.map((item: any) => (
          <div key={item.id} className="p-4 border rounded">
            <blockquote className="text-lg italic">"{item.quote}"</blockquote>
            {item.author && <cite className="block mt-2 text-right">— {item.author}</cite>}
            {item.context && <p className="text-sm text-gray-600 mt-2">{item.context}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Archive Browsing
```javascript
// Get archive list
const archiveResponse = await fetch('/api/public/shareables/facts?mode=archive');
const { success, data } = await archiveResponse.json();

if (success) {
  // Show archive list
  data.forEach(set => {
    console.log(`Set ${set.id} - ${new Date(set.created_at).toLocaleDateString()}`);
  });
  
  // Load specific set
  const specificSet = await fetch(`/api/public/shareables/facts?id=${data[0].id}`);
  const { data: setData } = await specificSet.json();
  console.log('Loaded historical set:', setData);
}
```

---

## 🔧 TypeScript Types

```typescript
// Shareables API Response Types
export interface ShareablesResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    id: number;
    created_at: string;
  };
  error?: string;
}

export interface ArchiveResponse {
  success: boolean;
  data: Array<{
    id: number;
    created_at: string;
    status: string;
  }>;
  error?: string;
}

// Content Item Types
export interface FactItem {
  id: number;
  fact_text: string;
  fact_category: string | null;
  year: number | null;
  theme: string | null;
  attribution: string | null;
  display_order: number;
}

export interface MotivationalItem {
  id: number;
  quote: string;
  author: string | null;
  context: string | null;
  theme: string | null;
  category: string | null;
  attribution: string | null;
  display_order: number;
}

// Future Types (when implemented)
export interface WisdomItem {
  id: number;
  title: string;
  musing: string;
  from_the_box: string;
  theme: string | null;
  category: string | null;
  attribution: string | null;
  display_order: number;
}

export interface GreetingItem {
  id: number;
  greeting_text: string;
  theme: string | null;
  attribution: string | null;
  display_order: number;
}

// Standard pub_shareables_* table structure
export interface ShareableSet<T> {
  id: number;
  items: T[];
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}
```

---

## 🚨 Error Handling

All APIs return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description",
  "details": "Additional error details (development only)",
  "code": "ERROR_CODE",
  "hint": "Helpful hint for resolution"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (no published sets available)
- `500` - Internal Server Error (database connection, etc.)

**Example Error Response:**
```json
{
  "success": false,
  "error": "No published facts shareables found",
  "details": "Database returned empty result set",
  "code": "NO_CONTENT",
  "hint": "Check if content has been published in CMS"
}
```

---

## 🔒 Performance & Caching

### Cache Headers
All successful responses include cache headers:
```http
Cache-Control: public, s-maxage=60, stale-while-revalidate=300
```

### Rate Limiting
- **Development:** No rate limiting
- **Production:** 100 requests per minute per IP

### Performance Notes
- Responses are cached at CDN level for 60 seconds
- Stale content served for up to 5 minutes while revalidating
- Archive endpoints have longer cache times

---

## 📊 **Table Structure Reference**

### pub_shareables_* Tables
All shareables tables follow this structure:

```sql
CREATE TABLE pub_shareables_facts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  items JSONB NOT NULL,           -- Array of content items
  status TEXT DEFAULT 'draft',    -- 'draft', 'published', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Items Field Structure
The `items` field contains an array of content objects:

**Facts Items:**
```json
[
  {
    "id": 1,
    "fact_text": "Content text",
    "fact_category": "category",
    "year": 2023,
    "theme": "theme",
    "attribution": "source",
    "display_order": 1
  }
]
```

**Motivational Items:**
```json
[
  {
    "id": 1,
    "quote": "Quote text",
    "author": "Author name",
    "context": "Background info",
    "theme": "theme",
    "category": "category", 
    "attribution": "source",
    "display_order": 1
  }
]
```

---

## 📝 Notes

- **Only published content:** APIs return only `status = 'published'` sets
- **Pre-packaged content:** Items are curated and packaged by CMS
- **CORS enabled:** Cross-origin requests supported
- **UTC timestamps:** All dates in UTC format
- **Flexible item count:** Sets can contain varying numbers of items

---

## 🔮 **Roadmap**

### Coming Soon
- `pub_shareables_wisdom` table and API
- `pub_shareables_greetings` table and API  
- Enhanced filtering options
- Pagination for archive mode

### Under Discussion
- Table renaming and consolidation
- Combined content type endpoints
- Advanced caching strategies

---

**Questions about the API?** Contact the development team for clarification or additional endpoint requests.
