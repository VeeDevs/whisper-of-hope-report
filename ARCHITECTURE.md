# Whisper of Hope - Architecture & Component Documentation

## 🏗️ Project Structure

```
whisper-of-hope-report/
├── src/
│   ├── components/
│   │   ├── AITherapist.tsx              # AI therapist chat interface
│   │   ├── MotivationalQuotes.tsx       # Quotes slideshow/popup
│   │   ├── ReportFeed.tsx               # Facebook-like stories feed
│   │   ├── ReportForm.tsx               # Create new story
│   │   ├── PollForm.tsx                 # Create polls
│   │   ├── CommentForm.tsx              # Comment on stories
│   │   ├── MainNav.tsx                  # Home page navigation
│   │   ├── Navbar.tsx                   # Secondary navigation
│   │   ├── Footer.tsx                   # Footer component
│   │   ├── ThemeToggle.tsx              # Dark/light mode
│   │   ├── LanguageSelector.tsx         # i18n selector
│   │   ├── CrisisModal.tsx              # Crisis support modal
│   │   ├── StealthMode.tsx              # Privacy mode
│   │   ├── HopeSlideshow.tsx            # Inspirational carousel
│   │   ├── ParticleNetworkBackground.tsx # Animated background
│   │   ├── ui/                          # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── ... (30+ UI components)
│   │
│   ├── pages/
│   │   ├── Home.tsx                     # Landing page
│   │   ├── Reports.tsx                  # Stories feed page
│   │   ├── Chat.tsx                     # Chat/support page (with AI Therapist)
│   │   ├── Auth.tsx                     # Authentication page
│   │   ├── Login.tsx                    # Login page
│   │   ├── Register.tsx                 # Registration page
│   │   ├── About.tsx                    # About page
│   │   ├── Contact.tsx                  # Contact page
│   │   ├── Terms.tsx                    # Terms of service
│   │   ├── Privacy.tsx                  # Privacy policy
│   │   ├── ReportDetail.tsx             # Single story detail view
│   │   └── NotFound.tsx                 # 404 page
│   │
│   ├── context/
│   │   ├── AppContext.tsx               # Global app state
│   │   ├── appContextCore.ts            # Context logic
│   │   ├── LanguageContext.tsx          # i18n context
│   │   └── ThemeContext.tsx             # Theme context
│   │
│   ├── hooks/
│   │   ├── use-app.ts                   # App context hook
│   │   ├── use-theme.ts                 # Theme hook
│   │   ├── use-toast.ts                 # Toast notifications
│   │   └── use-mobile.tsx               # Responsive design hook
│   │
│   ├── services/
│   │   ├── notifications.ts             # Notification service
│   │   ├── rewards.ts                   # Reward system
│   │   └── storage.ts                   # Local storage service
│   │
│   ├── types/
│   │   ├── index.ts                     # Global types
│   │   ├── rewards.ts                   # Reward types
│   │   └── supabase.ts                  # Database types
│   │
│   ├── utils/
│   │   ├── crisisDetection.ts           # Crisis keyword detection
│   │   └── utils.ts                     # Utility functions
│   │
│   ├── lib/
│   │   ├── supabase.ts                  # Supabase client
│   │   └── utils.ts                     # Helper utilities
│   │
│   ├── App.tsx                          # Main app component
│   ├── App.css                          # Global styles
│   ├── index.css                        # Tailwind & base styles
│   └── main.tsx                         # Entry point
│
├── supabase/
│   ├── config.toml                      # Supabase config
│   └── migrations/                      # Database migrations
│
├── public/
│   └── robots.txt                       # SEO robots file
│
├── index.html                           # HTML entry point
├── package.json                         # Dependencies
├── tsconfig.json                        # TypeScript config
├── tailwind.config.ts                   # Tailwind CSS config
├── vite.config.ts                       # Vite config
├── eslint.config.js                     # ESLint rules
├── postcss.config.js                    # PostCSS config
├── netlify.toml                         # Netlify config
├── vercel.json                          # Vercel config
├── FEATURES.md                          # Feature documentation
└── DEPLOYMENT.md                        # Deployment guide
```

## 🎯 Key Components Explained

### 1. AITherapist Component
**Location**: `src/components/AITherapist.tsx`

**Purpose**: Provides 24/7 AI-powered mental health support

**Features**:
- Keyword-based intelligent responses
- Specialized guidance for:
  - Stress and pressure
  - Anxiety and worry
  - Grief and loss
  - Relationship issues
  - Self-care
  - GBV trauma
- Real-time chat interface
- Message history with timestamps
- Loading indicators
- Responsive design for all devices

**Key Functions**:
```typescript
detectKeyword(text: string): string | null
generateResponse(userMessage: string): string
handleSend(): Promise<void>
```

### 2. MotivationalQuotes Component
**Location**: `src/components/MotivationalQuotes.tsx`

**Purpose**: Display daily affirmations in two modes

**Props**:
```typescript
interface MotivationalQuotesProps {
  autoPlay?: boolean;        // Auto-rotate quotes
  interval?: number;         // Interval in ms
  mode?: 'slideshow' | 'popup';
  onClose?: () => void;
}
```

**Features**:
- 20+ curated quotes
- Categories: Mental Health, GBV, Stress, Emotional Balance, Hope
- Slideshow mode with auto-play
- Popup modal mode
- Navigation dots
- Previous/Next buttons
- Animated transitions

### 3. ReportFeed Component
**Location**: `src/components/ReportFeed.tsx`

**Purpose**: Display community stories in Facebook-like feed

**Features**:
- Anonymous story posting
- Like functionality with confetti animation
- Comment system
- Share to social platforms
- Infinite scroll
- Engagement statistics (likes, comments, shares)
- View count tracking

**Key Functions**:
```typescript
handleLike(reportId: string): void
handleComment(reportId: string): Promise<void>
handleShare(report: ReportWithDetails): void
shareToSocialMedia(report, platform): void
loadMore(): void
```

### 4. Chat Page with AI Therapist
**Location**: `src/pages/Chat.tsx`

**Structure**:
- AI Therapist tab (default)
- Support Network tab
- Discussion Groups tab
- Direct Chat tab

**Responsive Behavior**:
- Mobile: AI visible first, other tabs accessible via tab list
- Tablet: All tabs equally visible with responsive spacing
- Desktop: Full navigation with descriptions

## 🎨 Design System

### Color Palette
```
Primary (Mental Health): Purple-600 (#9333ea)
Secondary (Support): Blue-600 (#2563eb)
Success (Actions): Green-600 (#16a34a)
Warning (Crisis): Red-600 (#dc2626)
Neutral: Slate (50-900)
Gradients: 
  - Purple → Pink
  - Blue → Indigo
  - Purple via Pink to Red
```

### Typography
```
Headings:   Bold, 2.25rem → 3.75rem
Body:       Regular, 1rem
Small:      Regular, 0.875rem
Monospace:  Code blocks and technical content
```

### Spacing Scale
```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### Responsive Breakpoints
```
Mobile:   320px - 639px
Tablet:   640px - 1023px
Desktop:  1024px+
```

## 🔄 Data Flow Architecture

### Global State Management
```
AppContext (AppProvider)
├── currentUser: User | null
├── session: Session | null
├── reports: Report[]
├── createReport(): void
├── addCommentToReport(): void
├── likeReport(): void
└── refreshReports(): void

LanguageContext (LanguageProvider)
├── currentLanguage: string
└── t(): string (translation function)

ThemeContext (ThemeProvider)
├── isDarkMode: boolean
└── toggleTheme(): void
```

### Component Hierarchy
```
App
├── QueryClientProvider
├── LanguageProvider
│   └── AppProvider
│       └── ThemeProvider
│           └── AppContent
│               ├── BrowserRouter
│               │   ├── Toaster (notifications)
│               │   ├── TermsModal
│               │   ├── MainNav / Navbar
│               │   ├── AnimatedRoutes
│               │   │   ├── Home (with MainNav)
│               │   │   ├── Reports (with Navbar)
│               │   │   ├── Chat (with Navbar & AITherapist)
│               │   │   ├── Auth pages
│               │   │   └── Utility pages
│               │   └── Footer
```

## 📡 API Integration

### Supabase Integration
**File**: `src/lib/supabase.ts`

**Tables**:
- `users`: User profiles and auth
- `reports`: Anonymous stories
- `comments`: Story comments
- `likes`: Like tracking
- `rewards`: User rewards
- `notifications`: Push notifications
- `friends`: Support network
- `groups`: Discussion groups

### Key Functions
```typescript
// Authentication
supabase.auth.signUp()
supabase.auth.signInWithPassword()
supabase.auth.signOut()

// Reports
supabase.from('reports').insert()
supabase.from('reports').select()
supabase.from('reports').delete()

// Comments & Interactions
supabase.from('comments').insert()
supabase.from('likes').insert()
```

## 🎭 Theme & Styling

### Tailwind CSS Configuration
**File**: `tailwind.config.ts`

**Custom Classes**:
```css
.animated-gradient-bg { /* Gradient animation */ }
.glass-effect { /* Glassmorphism */ }
.whisper-* { /* Custom color utility */ }
```

### Dark Mode Support
- System preference detection
- Manual toggle available
- All components support dark mode
- Automatic CSS variable switching

## 🔐 Security & Privacy

### Data Protection
- Anonymous user IDs instead of real names
- Encryption for sensitive data
- HTTPS-only transmission
- Supabase security policies

### Crisis Detection
**File**: `src/utils/crisisDetection.ts`

Detects keywords like:
- "suicide", "self-harm", "death"
- "abuse", "violence", "harm"
- Emergency hotlines provided

### Session Management
- Secure token storage
- Automatic logout on inactivity
- Session persistence
- Logout on account deletion

## 🚀 Performance Optimizations

1. **Code Splitting**: Vite automatically splits bundles
2. **Lazy Loading**: Routes load on demand
3. **Image Optimization**: Use WebP format when available
4. **Caching**: Service workers for offline support
5. **Bundle Analysis**: Monitor with `npm run build`

## 🧪 Testing Strategy

### Unit Tests (Future Implementation)
```typescript
// Test individual components
describe('AITherapist', () => {
  it('detects stress keywords')
  it('generates appropriate responses')
  it('formats messages correctly')
})
```

### Integration Tests (Future)
```typescript
// Test component interaction
describe('ReportFeed', () => {
  it('creates and displays reports')
  it('handles likes and comments')
  it('shares to social media')
})
```

### E2E Tests (Future)
```typescript
// Test user workflows
describe('User Journey', () => {
  it('logs in, shares story, likes comment')
  it('accesses AI therapist, gets support')
  it('views motivational quotes')
})
```

## 📚 Dependencies Overview

### Core Framework
- **react**: UI library
- **react-router-dom**: Routing
- **typescript**: Type safety

### Styling & Animation
- **tailwindcss**: Utility-first CSS
- **framer-motion**: Animations
- **lucide-react**: Icons
- **@radix-ui/***: Accessible components

### State & Data
- **@tanstack/react-query**: Data fetching
- **@supabase/supabase-js**: Backend
- **react-hook-form**: Form handling
- **zod**: Schema validation

### Build Tools
- **vite**: Fast build tool
- **@vitejs/plugin-react-swc**: Fast refresh
- **typescript**: Type checking

## 🔮 Future Enhancements

1. **Enhanced Analytics**: Track user engagement
2. **Video Support**: Video stories and therapist
3. **Offline Mode**: Progressive Web App (PWA)
4. **Multi-language**: More languages (currently basic i18n)
5. **Peer Support Groups**: Real-time video groups
6. **Resource Library**: Video courses and articles
7. **Integration**: SMS alerts, notifications
8. **Mobile Apps**: React Native ports

---

**Last Updated**: November 2025
**Maintainer**: Development Team
**License**: Proprietary
