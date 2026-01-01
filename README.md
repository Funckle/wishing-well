# Wishing Well 🌟

An anonymous, passwordless app where people open "wishing wells" during tough moments to receive thoughtful, coin-engraved wishes from strangers.

## Features

### For Well Openers
- 🌟 Open a wishing well with context about what you need encouragement for
- 🔗 Get a unique shareable link + QR code
- 🎣 Fish out coins one-by-one with satisfying animations
- ⭐ Rate wishes (0-5 stars) to reward kind wishers
- 📧 Optional email notifications when wishes arrive
- 🔒 Wells auto-close after 7 days or when wish limit is reached

### For Wish Senders
- 🪙 Send wishes anonymously (no login required)
- 🎨 Compose wishes using the token system:
  - Sentence starters: "You are", "You will", "Keep", etc.
  - Descriptors: "amazing", "resilient", "brave", etc.
  - Outcomes: "you've got this", "keep shining", etc.
  - Emojis: ❤️ ⭐ 🔥 ✨ 🌱 💪 🚀
- ✍️ Unlock custom wishes at 100 points
- 🎬 Unlock GIFs at 50 points
- 🏆 Climb the leaderboard with quality wishes

### Gamification
- ⭐ Points system (ratings become points)
- 🏅 Public leaderboard
- 🎁 Unlock rewards at thresholds
- 🚫 Rate limiting (5 wishes/hour per IP)

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase
  - Authentication (Magic Link + OAuth)
  - PostgreSQL Database
  - Real-time subscriptions
  - Row Level Security
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wishing-well.git
   cd wishing-well
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project and run the schema:
   ```bash
   # Copy the contents of supabase/schema.sql and run in Supabase SQL Editor
   ```

4. Create `.env.local` from the example:
   ```bash
   cp .env.example .env.local
   ```

5. Add your Supabase credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Auth callback and error pages
│   ├── create/            # Well creation flow
│   ├── dashboard/         # User dashboard
│   ├── explore/           # Browse active wells
│   ├── leaderboard/       # Public leaderboard
│   ├── login/             # Login page
│   └── well/[shortCode]/  # Individual well pages
├── components/
│   ├── auth/              # Auth components
│   ├── ui/                # Reusable UI components
│   └── WishComposer.tsx   # Wish composition modal
├── lib/
│   ├── supabase/          # Supabase client setup
│   └── utils.ts           # Utility functions
├── store/                 # Zustand store
└── types/                 # TypeScript types
```

## Database Schema

See `supabase/schema.sql` for the complete database schema including:
- `profiles` - User profiles
- `wells` - Wishing wells
- `wishes` - Individual wishes
- `cosmetics` - Purchasable cosmetics
- `user_cosmetics` - User's owned cosmetics
- `rate_limits` - IP-based rate limiting

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Supabase

1. Create production project
2. Run schema migrations
3. Configure auth providers
4. Update environment variables

## Monetization (Planned)

- 💎 Premium cosmetics ($2-5)
- 🏢 Sponsored wells for organizations
- ❌ No paywalls, ads, or data sales

## License

MIT
