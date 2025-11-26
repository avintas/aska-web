# The Shootout - Implementation Plan
## Infinite Scroll Trivia Feed with OTP Authentication

**Status:** Planning Phase  
**Target:** MVP Launch (Month 1-2)  
**Approach:** Low-friction, continuous question feed (TikTok-style)

---

## 📋 Executive Summary

### What We're Building
- **"The Shootout"** - An endless feed of hockey trivia questions
- Users scroll vertically through questions, answering as they go
- No game levels, no sets, no commitment required
- OTP-based authentication (email + 6-digit code)
- Cumulative scoring system tied to user accounts

### Why This Approach
1. **Zero Friction:** Users start playing immediately
2. **Data Collection:** Pure analytics on question difficulty and engagement
3. **Addictive UX:** Continuous dopamine hits (instant feedback)
4. **MVP-Friendly:** Simpler than building game logic systems
5. **Future-Proof:** Foundation for more complex features later

---

## 🎯 Core Requirements

### Functional Requirements
1. Display questions in continuous vertical scroll
2. Support all three trivia types: Multiple Choice, True/False, Who Am I
3. Instant feedback on answer selection (no submit button)
4. Show explanation after answer is revealed
5. Track which questions user has seen/answered
6. Prevent duplicate questions within a session
7. OTP authentication flow (email → code → play)
8. Cumulative scoring display (career stats)
9. Handle 500-1000 questions efficiently

### Non-Functional Requirements
1. Smooth scrolling performance (no lag with 1000+ items)
2. Fast question loading (pagination/infinite scroll)
3. Mobile-responsive design
4. Offline-capable question caching
5. Analytics-ready (track every interaction)

---

## 🗄️ Database Schema Design

### New Tables Required

#### 1. `user_answers` (Answer Tracking)
**Purpose:** Track every answer a user submits

```sql
Columns:
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (UUID, FOREIGN KEY → auth.users.id)
- question_type (TEXT) -- 'multiple-choice' | 'true-false' | 'who-am-i'
- question_id (BIGINT) -- ID from respective trivia table
- user_answer (TEXT) -- The answer they selected
- is_correct (BOOLEAN)
- answered_at (TIMESTAMPTZ, DEFAULT NOW())
- time_spent_ms (INTEGER) -- Optional: track how long they took

Indexes:
- (user_id, question_type, question_id) UNIQUE -- Prevent duplicate answers
- (user_id, answered_at) -- For streak calculations
- (question_type, question_id) -- For question analytics
```

**RLS Policy:**
- Users can INSERT their own answers
- Users can SELECT their own answers
- No UPDATE or DELETE (immutable history)

#### 2. `user_stats` (Cached Statistics - Optional Optimization)
**Purpose:** Pre-calculated stats to avoid expensive queries

```sql
Columns:
- user_id (UUID, PRIMARY KEY, FOREIGN KEY → auth.users.id)
- total_answered (INTEGER, DEFAULT 0)
- total_correct (INTEGER, DEFAULT 0)
- current_streak (INTEGER, DEFAULT 0)
- longest_streak (INTEGER, DEFAULT 0)
- last_answered_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ, DEFAULT NOW())

Indexes:
- (user_id) PRIMARY KEY
```

**Note:** This is optional. You can calculate stats on-the-fly from `user_answers`, but caching improves performance for leaderboards.

### Existing Tables (No Changes Needed)
- `trivia_multiple_choice` - Already exists
- `trivia_true_false` - Already exists  
- `trivia_who_am_i` - Already exists
- `auth.users` - Supabase handles this

---

## 🔐 Authentication Flow

### Phase 1: Anonymous Play (Optional - "Lazy Auth")
**Goal:** Hook users before asking for email

1. User lands on `/the-shootout` page
2. No authentication required initially
3. User answers questions (stored in LocalStorage temporarily)
4. After 5 questions, show modal: *"You're on a roll! Enter your email to save this streak."*
5. If they decline, continue anonymous (data lost on refresh)

**LocalStorage Structure:**
```json
{
  "anonymous_answers": [
    { "question_type": "multiple-choice", "question_id": 123, "is_correct": true }
  ],
  "anonymous_streak": 3
}
```

### Phase 2: OTP Authentication Flow
**Goal:** Convert anonymous user to authenticated user

1. **Email Input**
   - User types email in modal/form
   - Frontend validates email format
   - Call: `supabase.auth.signInWithOtp({ email })`

2. **Code Delivery**
   - Supabase sends 6-digit code to email
   - User receives code (stays on same page)

3. **Code Verification**
   - User enters 6-digit code
   - Call: `supabase.auth.verifyOtp({ email, token: code })`
   - Supabase creates user account (if new) or logs in (if existing)
   - Session token stored in cookies

4. **Data Migration** (If coming from anonymous play)
   - On successful auth, migrate LocalStorage answers to `user_answers` table
   - Clear LocalStorage
   - Show success message: *"Your streak has been saved!"*

### Phase 3: Persistent Session
- User remains logged in via Supabase session cookie
- No need to re-authenticate on return visits
- If session expires, prompt for email again (but remember their email)

---

## 📡 API Endpoints Required

### 1. GET `/api/the-shootout/questions`
**Purpose:** Fetch questions for the feed

**Query Parameters:**
- `limit` (default: 20) - Number of questions to return
- `offset` (default: 0) - Pagination offset
- `exclude_ids` (optional) - Comma-separated question IDs to exclude
- `question_types` (optional) - Comma-separated: "multiple-choice,true-false,who-am-i"

**Authentication:** Optional (if authenticated, excludes already-answered questions)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "type": "multiple-choice",
      "question_text": "Who won the Stanley Cup in 2023?",
      "correct_answer": "Vegas Golden Knights",
      "wrong_answers": ["Boston Bruins", "Colorado Avalanche", "Tampa Bay Lightning"],
      "explanation": "The Golden Knights won their first Stanley Cup...",
      "difficulty": "Medium",
      "theme": "championships"
    },
    {
      "id": 456,
      "type": "true-false",
      "question_text": "Wayne Gretzky scored 92 goals in a single season.",
      "is_true": true,
      "explanation": "Gretzky set this record in 1981-82...",
      "difficulty": "Easy",
      "theme": "records"
    }
  ],
  "meta": {
    "total_available": 847,
    "has_more": true
  }
}
```

**Logic:**
- If user authenticated: Exclude questions from `user_answers` WHERE `user_id = current_user`
- If anonymous: Return random questions (no exclusion)
- Randomize order within each batch
- Filter by `status = 'published'` only

### 2. POST `/api/the-shootout/answer`
**Purpose:** Submit an answer and get immediate feedback

**Authentication:** Required (or accept anonymous with session token)

**Request Body:**
```json
{
  "question_type": "multiple-choice",
  "question_id": 123,
  "user_answer": "Vegas Golden Knights",
  "time_spent_ms": 4500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "is_correct": true,
    "correct_answer": "Vegas Golden Knights",
    "explanation": "The Golden Knights won their first Stanley Cup...",
    "stats": {
      "total_answered": 47,
      "total_correct": 32,
      "shooting_percentage": 68.1,
      "current_streak": 5
    }
  }
}
```

**Logic:**
- Validate answer against question data
- Insert into `user_answers` table
- Calculate updated stats
- Return feedback immediately

### 3. GET `/api/the-shootout/stats`
**Purpose:** Get user's cumulative statistics

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "total_answered": 47,
    "total_correct": 32,
    "shooting_percentage": 68.1,
    "current_streak": 5,
    "longest_streak": 12,
    "by_difficulty": {
      "Easy": { "answered": 20, "correct": 18, "percentage": 90.0 },
      "Medium": { "answered": 20, "correct": 12, "percentage": 60.0 },
      "Hard": { "answered": 7, "correct": 2, "percentage": 28.6 }
    },
    "by_type": {
      "multiple-choice": { "answered": 30, "correct": 22 },
      "true-false": { "answered": 12, "correct": 8 },
      "who-am-i": { "answered": 5, "correct": 2 }
    }
  }
}
```

**Logic:**
- Query `user_answers` table
- Calculate stats on-the-fly (or use cached `user_stats` table)
- Group by difficulty and question type

---

## 🎨 Frontend Architecture

### Component Structure

```
src/app/the-shootout/
├── page.tsx                    # Main page component
├── components/
│   ├── QuestionFeed.tsx       # Virtualized scroll container
│   ├── QuestionCard.tsx       # Individual question display
│   │   ├── MultipleChoiceCard.tsx
│   │   ├── TrueFalseCard.tsx
│   │   └── WhoAmICard.tsx
│   ├── AnswerFeedback.tsx     # Green/Red feedback overlay
│   ├── StatsBar.tsx           # Top bar showing current stats
│   ├── AuthModal.tsx          # Email + OTP entry modal
│   └── LoadingSkeleton.tsx    # Placeholder while loading
└── hooks/
    ├── useQuestionFeed.ts     # Infinite scroll logic
    ├── useAnswerSubmission.ts # Answer handling
    └── useAuth.ts             # OTP authentication logic
```

### Key Frontend Considerations

#### 1. Virtualization (CRITICAL)
**Problem:** Rendering 1000 DOM elements = browser crash

**Solution:** Use `react-window` or `react-virtuoso`

**How It Works:**
- Only render 5-10 questions visible on screen
- As user scrolls, destroy top questions, create bottom questions
- Maintain scroll position illusion
- Fetch next batch when user nears bottom

**Library Choice:** `react-virtuoso` (recommended)
- Better TypeScript support
- Handles dynamic heights better
- Built-in infinite scroll helpers

#### 2. Question State Management
**States Per Question:**
- `unanswered` - User hasn't selected an answer yet
- `answered` - User selected answer, showing feedback
- `revealed` - Explanation is visible, ready to scroll past

**State Flow:**
```
unanswered → (user taps answer) → answered → (auto-scroll or tap) → revealed
```

#### 3. Instant Feedback UX
**Requirements:**
- No "Submit" button - answer selection = immediate submission
- Card turns green (correct) or red (incorrect) instantly
- Explanation text fades in after 500ms
- Auto-scroll to next question after 2 seconds (or manual scroll)

**Animation Timing:**
- Answer selection: 0ms (instant)
- Color change: 200ms transition
- Explanation reveal: 500ms delay, 300ms fade-in
- Auto-scroll: 2000ms delay (if enabled)

#### 4. Answer Shuffling
**For Multiple Choice:**
- Shuffle `wrong_answers` + `correct_answer` array on each render
- Ensure correct answer isn't always in same position
- Use Fisher-Yates shuffle algorithm

#### 5. Duplicate Prevention (Client-Side)
**Local State:**
- Maintain Set of answered question IDs in memory
- Before fetching new batch, send `exclude_ids` to API
- Clear set on page refresh (server handles persistence)

---

## ⚡ Performance Optimizations

### 1. Database Query Optimization

#### Problem: Excluding Already-Answered Questions
As user answers more questions, `WHERE id NOT IN (SELECT question_id FROM user_answers WHERE user_id = ?)` gets slower.

#### Solution: Pagination with Exclusion List
- Fetch questions in batches of 20
- Client maintains list of answered IDs
- Send exclusion list to API: `exclude_ids=123,456,789`
- Use `WHERE id NOT IN (123, 456, 789)` (faster than subquery)

**For 500-1000 questions:** This is fine.  
**For 10,000+ questions:** Would need different strategy (tagging system).

### 2. Caching Strategy

#### Question Data Caching
- Cache fetched questions in React state
- Don't re-fetch on scroll up (already have data)
- Only fetch new batch when scrolling down

#### Stats Caching
- Cache user stats in React state
- Update optimistically on answer submission
- Re-fetch stats every 10 answers (or on page refresh)

### 3. Image/Asset Optimization
- If questions include images, lazy-load them
- Use Next.js Image component for optimization
- Preload next 2-3 question images

### 4. Network Optimization
- Batch API calls (don't call API for every scroll event)
- Use request debouncing (wait 300ms after scroll stops)
- Implement request cancellation (cancel if user scrolls away)

---

## 🚨 Critical Implementation Gotchas

### 1. The "Duplicate Answer" Race Condition
**Problem:** User taps answer twice quickly = duplicate API calls

**Solution:**
- Disable answer buttons immediately on tap
- Use loading state to prevent double-submission
- Server-side: Use database UNIQUE constraint as backup

### 2. The "Scroll Position Jump" Issue
**Problem:** Virtualization can cause scroll position to jump when questions load

**Solution:**
- Maintain scroll position reference point
- Pre-fetch next batch before user reaches bottom
- Use `react-virtuoso`'s built-in position preservation

### 3. The "Session Expiry" Problem
**Problem:** User plays for 30 minutes, session expires, next answer fails

**Solution:**
- Check session validity before each answer submission
- If expired, show subtle re-auth prompt (don't interrupt flow)
- Auto-refresh session token in background

### 4. The "Email Typo" Issue
**Problem:** User mistypes email, code never arrives, frustrated

**Solution:**
- Frontend email validation (regex check)
- Show "Did you mean @gmail.com?" suggestions
- Allow email editing before code is sent
- Clear error messages if code doesn't arrive

### 5. The "Question Pool Exhaustion" Edge Case
**Problem:** User answers all 1000 questions, what happens next?

**Solution:**
- Show "You've answered all available questions!" message
- Offer to replay questions (with different stats)
- Or show "New questions coming soon!" message
- Track this in analytics

---

## 📊 Analytics & Tracking

### Events to Track

1. **Question View**
   - `question_viewed` - When question appears on screen
   - Data: `question_id`, `question_type`, `difficulty`

2. **Answer Submitted**
   - `answer_submitted` - When user selects answer
   - Data: `question_id`, `is_correct`, `time_spent_ms`

3. **Auth Flow**
   - `auth_email_entered` - User enters email
   - `auth_code_sent` - Code sent successfully
   - `auth_code_verified` - User verified code
   - `auth_failed` - Code verification failed

4. **Engagement**
   - `session_started` - User lands on page
   - `session_ended` - User leaves page
   - `questions_answered_in_session` - Count

5. **Performance**
   - `question_load_time` - API response time
   - `scroll_lag_detected` - If scroll feels laggy

### Questions to Answer with Analytics
- Which questions are too hard? (low correct %)
- Which questions make users leave? (high abandonment)
- What's the average session length?
- What's the conversion rate (anonymous → authenticated)?
- Which question types are most popular?

---

## 🗺️ Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal:** Basic infinite scroll with questions

- [ ] Set up `/the-shootout` page route
- [ ] Create `QuestionCard` components for all three types
- [ ] Implement basic infinite scroll (no virtualization yet)
- [ ] Create API endpoint: `GET /api/the-shootout/questions`
- [ ] Test with 100 questions

**Deliverable:** Users can scroll and see questions (no answering yet)

### Phase 2: Answer System (Week 1-2)
**Goal:** Users can answer questions and see feedback

- [ ] Create `POST /api/the-shootout/answer` endpoint
- [ ] Create `user_answers` table in Supabase
- [ ] Implement answer submission logic
- [ ] Add instant feedback UI (green/red cards)
- [ ] Add explanation display
- [ ] Test answer tracking

**Deliverable:** Users can answer questions and see if they're correct

### Phase 3: Virtualization (Week 2)
**Goal:** Handle 1000 questions smoothly

- [ ] Install `react-virtuoso`
- [ ] Refactor `QuestionFeed` to use virtualization
- [ ] Implement pre-fetching logic
- [ ] Test scroll performance with 1000 questions
- [ ] Optimize render performance

**Deliverable:** Smooth scrolling with large question sets

### Phase 4: OTP Authentication (Week 2-3)
**Goal:** Email + code authentication

- [ ] Create `AuthModal` component
- [ ] Implement email input and validation
- [ ] Integrate Supabase `signInWithOtp`
- [ ] Implement code entry UI
- [ ] Handle code verification
- [ ] Test auth flow end-to-end

**Deliverable:** Users can authenticate with email + code

### Phase 5: Stats & Scoring (Week 3)
**Goal:** Cumulative statistics display

- [ ] Create `GET /api/the-shootout/stats` endpoint
- [ ] Create `StatsBar` component
- [ ] Calculate shooting percentage, streaks
- [ ] Display stats in UI
- [ ] Test stat calculations

**Deliverable:** Users can see their career stats

### Phase 6: Duplicate Prevention (Week 3-4)
**Goal:** Don't show same question twice

- [ ] Update API to accept `exclude_ids` parameter
- [ ] Track answered questions in client state
- [ ] Send exclusion list to API
- [ ] Test with multiple sessions

**Deliverable:** Users never see the same question twice

### Phase 7: Polish & Optimization (Week 4)
**Goal:** Production-ready experience

- [ ] Add loading skeletons
- [ ] Add error handling (network failures, etc.)
- [ ] Optimize API response times
- [ ] Add analytics tracking
- [ ] Mobile responsiveness testing
- [ ] Performance testing (lighthouse scores)

**Deliverable:** MVP ready for launch

---

## 🔮 Future Enhancements (Post-MVP)

### Short-Term (Month 2-3)
- Leaderboards (top shooters, longest streaks)
- Question difficulty filtering
- Daily challenges ("Answer 10 questions today")
- Social sharing ("I got 15 in a row!")

### Medium-Term (Month 3-6)
- Question categories/tags filtering
- "Favorite" questions system
- Question review mode ("Review questions you got wrong")
- Achievements/badges system

### Long-Term (Month 6+)
- Multiplayer modes ("Shootout with friends")
- Question creation (user-generated content)
- Premium question packs
- Advanced analytics dashboard

---

## ✅ Success Metrics

### Technical Metrics
- Page load time < 2 seconds
- Scroll FPS > 60fps
- API response time < 200ms
- Zero duplicate answers in database
- Zero memory leaks after 1000 questions

### User Metrics
- Average session length > 5 minutes
- Questions answered per session > 20
- Authentication conversion rate > 30%
- Return user rate > 40% (week 2)

### Business Metrics
- Total questions answered (track growth)
- User retention (Day 1, Day 7, Day 30)
- Question difficulty distribution (are we too hard/easy?)

---

## 🛠️ Technology Stack

### Already in Use
- **Next.js 15** - React framework
- **Supabase** - Database + Auth
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### New Dependencies Needed
- **react-virtuoso** - Virtual scrolling
- **@supabase/auth-helpers-nextjs** - Auth utilities (if needed)

### Optional (Nice to Have)
- **framer-motion** - Smooth animations
- **react-hot-toast** - Toast notifications
- **zod** - Runtime validation

---

## 📝 Notes & Considerations

### Question Pool Management
- Ensure you have 500-1000 published questions before launch
- Mix of difficulties (30% Easy, 50% Medium, 20% Hard)
- Mix of question types (don't favor one type)
- Regular content updates (add 50-100 questions monthly)

### Content Quality
- All questions must have explanations
- Explanations should be educational, not just "correct/incorrect"
- Review questions for accuracy before publishing

### User Experience Philosophy
- **Speed > Perfection:** It's better to be fast than perfect
- **Feedback > Mystery:** Always show why answer was right/wrong
- **Progress > Completion:** Focus on streaks, not finishing all questions

### Technical Debt to Accept (For MVP)
- Calculating stats on-the-fly (not using cached `user_stats` table)
- Simple exclusion list (not advanced tagging system)
- No question difficulty adaptation (same questions for everyone)
- No A/B testing infrastructure

**Rationale:** Get to market fast, optimize later based on real data.

---

## 🎯 Final Assessment

### Is This Viable?
**YES** - This is an excellent MVP approach. It removes friction, collects valuable data, and creates an addictive user experience.

### Is This Technically Possible?
**YES** - All technologies are mature and well-documented. The architecture is standard for modern web apps.

### What Needs to Be Remembered?
1. **Virtualization is non-negotiable** - Don't skip this
2. **Instant feedback is critical** - No submit buttons
3. **OTP > Magic Links** - Keep users on your page
4. **Track everything** - You'll need this data later
5. **Start simple** - Add complexity only when data demands it

---

**Ready to build?** Start with Phase 1 and iterate based on user feedback. The beauty of this approach is that you can launch with Phase 1-3 and add authentication later if needed.

