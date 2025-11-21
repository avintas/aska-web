# OnlyHockey.com - Development Setup

## Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**
- **Supabase Account** (for database)

## 🚀 Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd aska-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### 4. Database Setup

The project uses Supabase PostgreSQL. Tables should include:

- `wisdom` - Hockey wisdom content
- `greetings` - Hockey greetings (H.U.G.s)
- `motivational` - Motivational quotes
- `facts` - Hockey facts and trivia

### 5. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 🛠️ Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── trivia-arena/      # Trivia games
│   ├── shareables/        # Shareable content
│   └── api/               # API routes
├── components/            # UI components
├── shared/                # Shared types/utils
└── utils/                 # Utility functions
```

## 🎨 Styling

- **Framework:** Tailwind CSS
- **Theme:** Dark theme with hockey colors
- **Components:** Custom components with hover effects

**Key Colors:**
- Navy: `#0a0e1a` (primary background)
- Orange: `#ff6b35` (accent color)
- Cyan: `#4cc9f0` (highlights)

## 🔧 Configuration Files

- **`next.config.js`** - Next.js configuration
- **`tailwind.config.ts`** - Tailwind CSS setup
- **`tsconfig.json`** - TypeScript configuration
- **`package.json`** - Dependencies and scripts

## 🐛 Troubleshooting

### Common Issues

**1. Supabase Connection Errors**
- Verify environment variables are correct
- Check Supabase project status
- Ensure database tables exist

**2. Build Errors**
- Run `npm run type-check` to identify TypeScript issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**3. Styling Issues**
- Verify Tailwind CSS is working: check if basic classes apply
- Clear browser cache
- Check for CSS conflicts

### Getting Help

1. Check the [API Documentation](./API.md)
2. Review [Brand Guidelines](./BRAND.md)
3. Contact the development team

---

**Ready to develop!** 🏒
