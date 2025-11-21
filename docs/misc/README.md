# OnlyHockey.com Documentation

**Project:** OnlyHockey.com - The Ultimate Hockey Trivia Game  
**Framework:** Next.js 15 with TypeScript  
**Database:** Supabase PostgreSQL  

---

## 🏒 Project Overview

OnlyHockey.com is a hockey trivia website featuring:

- **🎯 Trivia Arena** - Interactive hockey trivia games
- **💙 Shareables** - Hockey wisdom, greetings, and motivational content  
- **📖 Did You Know** - Hockey facts and stories
- **🛍️ Shop** - Hockey merchandise and digital products

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with 5x4 grid
│   ├── trivia-arena/      # Trivia games
│   ├── shareables/        # Shareable content
│   ├── shop/              # E-commerce
│   └── api/               # API endpoints
├── components/            # Reusable UI components
│   ├── Navbar.tsx         # Site navigation
│   ├── Footer.tsx         # Site footer
│   └── ThemeProvider.tsx  # Dark/light theme
├── shared/                # Shared types and utilities
└── utils/                 # Utility functions
```

## 🚀 Quick Start

1. **Clone and Install:**
   ```bash
   git clone <repository>
   cd aska-web
   npm install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Visit:** http://localhost:3000

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Local development setup
- **[API Documentation](./API.md)** - API endpoints and usage
- **[Brand Guidelines](./BRAND.md)** - Brand messaging and design
- **[Deployment](./DEPLOYMENT.md)** - Production deployment guide

## 🎨 Brand Identity

**Core Message:** "There Is Only Hockey!"  
**Tagline:** "L❤️VE FOR THE GAME IS ALL YOU NEED"  
**Focus:** Ultimate hockey trivia gaming experience

## 🔗 Key Links

- **Production:** https://onlyhockey.com
- **Supabase:** [Project Dashboard](https://supabase.com/dashboard)
- **Vercel:** [Deployment Dashboard](https://vercel.com/dashboard)

---

**Need Help?** Check the specific documentation files or contact the development team.
