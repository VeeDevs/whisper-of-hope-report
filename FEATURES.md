# Whisper of Hope - Mental Health & Support Platform

A modern, responsive web application for mental health awareness, GBV support, and community healing with AI-powered professional guidance.

## 🌟 Features

### 1. **AI Therapist Assistant** 
- 24/7 professional mental health support powered by AI
- Specialized guidance for:
  - Stress management
  - Anxiety and worry
  - Grief and loss
  - Relationship issues
  - Self-care and emotional balance
  - Gender-based violence (GBV) trauma support
- Keyword-based intelligent responses that detect user concerns
- Real-time chat interface with typing indicators
- Accessible from the Chat section

### 2. **Motivational Quotes System**
- **20+ Daily Affirmations** covering:
  - Mental health awareness
  - Gender-based violence recovery
  - Stress management
  - Emotional balance
  - Hope and resilience
- **Two Display Modes:**
  - **Popup Mode**: Modal display on home page with navigation
  - **Slideshow Mode**: Auto-rotating carousel with manual controls
- Categories: Mental Health, GBV, Stress, Emotional Balance, Hope
- Auto-play with adjustable intervals (default: 8 seconds)

### 3. **Facebook-Like Reports/Stories Feed**
- **Post Creation**: Anonymous story sharing with title and detailed content
- **Social Interactions**:
  - Like button with celebration confetti animation (dopamine reward)
  - Comment system for community support
  - Share functionality (native share or social media integration)
  - Share to: Twitter, Facebook, LinkedIn, WhatsApp
- **Infinite Scroll**: Automatic loading of more stories as you scroll
- **View Stats**: Real-time counts of likes, comments, and shares
- **Community Moderation**: Report and mute options for users

### 4. **Responsive Design (Mobile, Tablet, Desktop)**
- **Mobile-First Approach**: Optimized for phones (320px+)
- **Tablet Support**: Improved layouts for tablets (768px+)
- **Desktop Experience**: Full-featured desktop interface (1024px+)
- **Features:**
  - Flexible grid layouts
  - Touch-friendly buttons (minimum 44px tap targets)
  - Responsive typography (scales from mobile to desktop)
  - Adaptive navigation (hamburger menus on mobile)
  - Responsive images and spacing
  - Safe areas for notch/status bars

### 5. **Support Network & Chat**
- Build personal support networks with friends
- Create and join discussion groups
- Real-time messaging (when friends/groups selected)
- AI Therapist as primary support resource

### 6. **Safety & Privacy Features**
- Complete anonymity for reports
- Anonymous IDs instead of real names
- Evidence upload support
- Crisis detection and immediate support routing
- Stealth mode for sensitive browsing

### 7. **Gamification & Rewards**
- Confetti celebration on likes
- Reward tracking system
- Achievement notifications
- Check-in reminders for wellbeing

## 📱 Responsive Breakpoints

```
Mobile:   320px - 639px   (phones)
Tablet:   640px - 1023px  (tablets, landscape phones)
Desktop:  1024px+         (desktop, laptops, TVs)
```

## 🎨 UI Components

### Core Pages
- **Home**: Hero section with feature highlights and motivational quotes
- **Reports**: Community stories feed with creation and interaction
- **Chat**: AI therapist, support network, discussion groups
- **Auth**: Secure login and registration
- **About**: Platform information and mission
- **Contact**: Support and feedback form
- **Privacy & Terms**: Legal documentation

### Reusable Components
- AITherapist: Intelligent chat interface
- MotivationalQuotes: Popup and slideshow modes
- ReportFeed: Facebook-like social feed
- ReportForm: Anonymous story submission
- CommentForm: Supportive comment interface
- MainNav: Primary navigation
- Navbar: Secondary page navigation

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 12.23
- **State Management**: React Query 5.56
- **Component Library**: shadcn/ui (Radix UI)
- **Backend**: Supabase
- **Language**: TypeScript 5.5
- **Build Tool**: Vite 5.4
- **Bundle Optimization**: Canvas Confetti for celebrations

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📝 Usage Guide

### For Users
1. **Register/Login** to create your account
2. **Share Your Story** anonymously in the Reports section
3. **Connect** with others through the Support Network
4. **Seek Support** from the AI Therapist 24/7
5. **Find Inspiration** in the Motivational Quotes
6. **Engage** by liking, commenting, and sharing others' stories

### For Developers
- Components are in `src/components/`
- Pages are in `src/pages/`
- Hooks in `src/hooks/`
- Context providers in `src/context/`
- Styling with Tailwind CSS classes
- Responsive design: mobile-first, then scale up

## 🔐 Privacy & Security

- All reports are anonymous by default
- No personal identifiable information is stored in reports
- Evidence files are encrypted
- Secure authentication with Supabase
- GDPR-compliant data handling
- Privacy policy available on the platform

## 🆘 Crisis Support

The platform includes:
- Crisis detection system that identifies emergency keywords
- Immediate crisis modal with hotline numbers
- Resources for urgent mental health support
- Safe referral to professional crisis services

## 📊 Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes
- Focus indicators on interactive elements
- Semantic HTML structure

## 🔄 Updates & Maintenance

- Responsive design tested on:
  - iPhone (375px - 812px)
  - iPad (768px - 1024px)
  - Android phones (360px - 540px)
  - Desktop monitors (1920px+)

- All interactive features tested for:
  - Touch interactions on mobile
  - Mouse interactions on desktop
  - Keyboard accessibility
  - Performance on slow networks

## 📞 Support

For issues, bugs, or feature requests:
- Contact: contact@whisperofhope.app
- Submit feedback through the Contact page
- Privacy concerns: See Privacy Policy

## 📄 License

Proprietary - Mental Health Support Platform

## 🙏 Acknowledgments

- Built with compassion for mental health awareness
- Dedicated to survivors of trauma and abuse
- Supporting gender-based violence survivors
- Community-driven mental wellness platform

---

**Whisper of Hope** - Where every voice is heard, and healing begins.
