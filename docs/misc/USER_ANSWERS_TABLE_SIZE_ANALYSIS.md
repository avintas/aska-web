# User Answers Table Size Analysis
## One Month Projection: 1,000 Users

---

## 📊 Row Size Calculation

### Per-Row Storage (PostgreSQL)

**Column Breakdown:**
- `id` (BIGINT): 8 bytes
- `user_id` (UUID): 16 bytes
- `question_type` (TEXT): ~20 bytes average ("multiple-choice" = 16 chars + overhead)
- `question_id` (BIGINT): 8 bytes
- `user_answer` (TEXT): ~30 bytes average (answer text varies, but most are short)
- `is_correct` (BOOLEAN): 1 byte
- `answered_at` (TIMESTAMPTZ): 8 bytes
- `time_spent_ms` (INTEGER): 4 bytes

**Row Overhead (PostgreSQL):**
- Tuple header: 24 bytes
- Alignment padding: ~4 bytes
- NULL bitmap: 1 byte (if any nullable columns)

**Total Per Row:** ~124 bytes (base row)

**With Indexes:**
- Each index entry adds overhead
- Indexes store key values + pointer to row

---

## 👥 User Engagement Scenarios

### Scenario 1: Conservative (Low Engagement)
**Assumptions:**
- 30% of users are active (300 users)
- Active users play 3 sessions per week
- Average 15 questions per session
- Total: 300 users × 4 weeks × 3 sessions × 15 questions = **54,000 rows**

### Scenario 2: Moderate (Realistic MVP)
**Assumptions:**
- 50% of users are active (500 users)
- Active users play 5 sessions per week
- Average 20 questions per session
- Total: 500 users × 4 weeks × 5 sessions × 20 questions = **200,000 rows**

### Scenario 3: High Engagement (Best Case)
**Assumptions:**
- 70% of users are active (700 users)
- Active users play daily (7 sessions per week)
- Average 25 questions per session
- Total: 700 users × 4 weeks × 7 sessions × 25 questions = **490,000 rows**

### Scenario 4: Super User Scenario (Worst Case for Storage)
**Assumptions:**
- 20% super users (200 users) play 50 questions/day
- 30% regular users (300 users) play 20 questions/week
- 50% casual users (500 users) play 10 questions/week
- Super: 200 × 30 days × 50 = 300,000 rows
- Regular: 300 × 4 weeks × 20 = 24,000 rows
- Casual: 500 × 4 weeks × 10 = 20,000 rows
- **Total: 344,000 rows**

---

## 💾 Storage Size Calculations

### Base Table Size

**Formula:** `Total Rows × Row Size × Overhead Factor`

PostgreSQL overhead factors:
- Table bloat: ~1.2x (20% overhead for updates/deletes, but we're INSERT-only)
- Index overhead: ~0.3x per index (indexes add storage)

**Scenario 1 (Conservative - 54,000 rows):**
- Base data: 54,000 × 124 bytes = 6.7 MB
- With overhead: 6.7 MB × 1.2 = **8.0 MB**

**Scenario 2 (Moderate - 200,000 rows):**
- Base data: 200,000 × 124 bytes = 24.8 MB
- With overhead: 24.8 MB × 1.2 = **29.8 MB**

**Scenario 3 (High Engagement - 490,000 rows):**
- Base data: 490,000 × 124 bytes = 60.8 MB
- With overhead: 60.8 MB × 1.2 = **72.9 MB**

**Scenario 4 (Super User - 344,000 rows):**
- Base data: 344,000 × 124 bytes = 42.7 MB
- With overhead: 42.7 MB × 1.2 = **51.2 MB**

### Index Size

**Indexes Required:**
1. PRIMARY KEY on `id`: ~8 bytes per row
2. UNIQUE INDEX on `(user_id, question_type, question_id)`: ~40 bytes per row
3. INDEX on `(user_id, answered_at)`: ~24 bytes per row
4. INDEX on `(question_type, question_id)`: ~16 bytes per row

**Total Index Overhead:** ~88 bytes per row × 1.2 overhead = ~106 bytes per row

**Scenario 1:** 54,000 × 106 bytes = **5.7 MB**
**Scenario 2:** 200,000 × 106 bytes = **21.2 MB**
**Scenario 3:** 490,000 × 106 bytes = **51.9 MB**
**Scenario 4:** 344,000 × 106 bytes = **36.5 MB**

### Total Table Size (Data + Indexes)

**Scenario 1 (Conservative):**
- Table: 8.0 MB
- Indexes: 5.7 MB
- **Total: 13.7 MB**

**Scenario 2 (Moderate - RECOMMENDED ESTIMATE):**
- Table: 29.8 MB
- Indexes: 21.2 MB
- **Total: 51.0 MB**

**Scenario 3 (High Engagement):**
- Table: 72.9 MB
- Indexes: 51.9 MB
- **Total: 124.8 MB**

**Scenario 4 (Super User):**
- Table: 51.2 MB
- Indexes: 36.5 MB
- **Total: 87.7 MB**

---

## 📈 Growth Projections

### Monthly Growth Rate

Assuming **Scenario 2 (Moderate)** as baseline:
- **Month 1:** 51 MB
- **Month 2:** 102 MB (if same users continue)
- **Month 3:** 153 MB
- **Year 1:** ~612 MB

**But wait!** Users will eventually exhaust the question pool (500-1000 questions). After a user answers all questions, growth slows significantly.

### Adjusted Growth (Question Pool Exhaustion)

**Phase 1: Initial Growth (Months 1-2)**
- Users discovering and playing actively
- Linear growth: ~51 MB/month

**Phase 2: Plateau (Months 3-6)**
- Most active users have answered most questions
- Growth slows: ~25 MB/month (new users + occasional replays)

**Phase 3: Steady State (Month 6+)**
- Only new users and occasional replays
- Growth: ~10-15 MB/month

**Year 1 Total:** ~400-500 MB (not linear due to exhaustion)

---

## 🎯 Recommended Estimate: **50-100 MB**

For planning purposes, assume:
- **Month 1:** 50-100 MB
- **Month 2:** 100-150 MB
- **Month 3:** 150-200 MB
- **Year 1:** 400-600 MB

This accounts for:
- Moderate user engagement
- Question pool exhaustion effect
- Some super users
- Some casual users

---

## ⚡ Performance Considerations

### Query Performance at Scale

**At 200,000 rows (Month 1 Moderate):**
- ✅ Index lookups: < 1ms
- ✅ User stats queries: < 10ms
- ✅ Duplicate prevention: < 5ms

**At 1,000,000 rows (Year 1):**
- ✅ Index lookups: < 2ms
- ✅ User stats queries: < 50ms (still acceptable)
- ⚠️ Duplicate prevention: < 20ms (may need optimization)

**At 10,000,000 rows (Year 2+):**
- ⚠️ User stats queries: 100-500ms (needs `user_stats` cache table)
- ⚠️ Duplicate prevention: 50-200ms (needs optimization)

### Optimization Triggers

**When to add `user_stats` cache table:**
- When `user_answers` exceeds 1 million rows
- When stats queries take > 100ms
- When you notice performance degradation

**When to optimize duplicate prevention:**
- When exclusion lists exceed 500 IDs
- When query time exceeds 50ms
- Consider question tagging system instead

---

## 💰 Cost Implications (Supabase)

### Supabase Free Tier Limits
- **Database Size:** 500 MB included
- **Database Egress:** 5 GB/month included

### Supabase Pro Tier ($25/month)
- **Database Size:** 8 GB included
- **Database Egress:** 50 GB/month included

### Cost Analysis

**Month 1:** 50-100 MB
- ✅ Well within free tier

**Month 6:** 200-300 MB
- ✅ Still within free tier

**Year 1:** 400-600 MB
- ✅ Still within free tier (500 MB limit)

**Year 2:** 800 MB - 1.2 GB
- ⚠️ Exceeds free tier
- 💰 Need Pro tier ($25/month) or optimize

---

## 🛡️ Data Retention Strategy

### Option 1: Keep Everything (Recommended for MVP)
- **Pros:** Complete analytics, user history, no data loss
- **Cons:** Storage grows indefinitely
- **Action:** Monitor and optimize when needed

### Option 2: Archive Old Data
- Archive answers older than 1 year to separate table
- Keep recent data for fast queries
- **Action:** Implement after Year 1 if needed

### Option 3: Aggregate Old Data
- After 6 months, aggregate daily stats
- Delete individual answer rows
- Keep only summary statistics
- **Action:** Only if storage becomes critical issue

---

## ✅ Recommendations

### For Month 1-2 (MVP Phase)
1. ✅ **No optimization needed** - 50-100 MB is trivial
2. ✅ **Monitor growth** - Track actual user engagement
3. ✅ **Set up alerts** - Get notified at 400 MB (approaching free tier limit)

### For Month 3-6 (Growth Phase)
1. ⚠️ **Consider `user_stats` cache** - If stats queries slow down
2. ⚠️ **Monitor query performance** - Watch for slow queries
3. ⚠️ **Plan for Pro tier** - If approaching 500 MB

### For Year 1+ (Scale Phase)
1. 🔧 **Implement `user_stats` cache** - Almost certainly needed
2. 🔧 **Optimize duplicate prevention** - Use smarter exclusion logic
3. 🔧 **Consider data archiving** - If storage costs become concern

---

## 📊 Summary Table

| Scenario | Rows/Month | Table Size | Index Size | Total Size |
|----------|------------|------------|------------|------------|
| Conservative | 54,000 | 8.0 MB | 5.7 MB | **13.7 MB** |
| **Moderate (Recommended)** | **200,000** | **29.8 MB** | **21.2 MB** | **51.0 MB** |
| High Engagement | 490,000 | 72.9 MB | 51.9 MB | **124.8 MB** |
| Super User Mix | 344,000 | 51.2 MB | 36.5 MB | **87.7 MB** |

**Recommended Planning Estimate:** **50-100 MB for Month 1**

This is a **very manageable** size. You won't need to worry about storage optimization for at least 6-12 months, even with 1,000 active users.

