# 🎯 Whisper of Hope - Quick Reference Guide

## 📱 For End Users

### Accessing the App
```
🌐 Website: https://your-deployed-domain.com
📱 Mobile: Works on phones, tablets, and desktop
🔐 Login: Create account or register
```

### Main Features (Navigation)

#### 🏠 Home Page
- Learn about the platform
- Read inspiring quotes
- Get started with support
- Learn about our mission

#### 📖 Stories/Reports Section
**Create a Story**:
1. Click "Share Story" button
2. Add a title
3. Write your story (anonymous)
4. Optional: Upload evidence
5. Click "Submit Report"

**Engage with Stories**:
- ❤️ **Like**: Click heart to celebrate others' bravery
- 💬 **Comment**: Add supportive comments
- 📤 **Share**: Share to Twitter, Facebook, LinkedIn, WhatsApp

#### 🤖 AI Therapist (Chat Section)
1. Click "Chat" in main menu
2. Select "AI Therapist" tab
3. Type your concerns/feelings
4. Get professional, compassionate responses

**Best Keywords for Support**:
- Stress, anxiety, overwhelm
- Grief, loss, sadness
- Relationships, family
- Abuse, violence, harassment
- Self-care, tiredness
- Hope, healing

#### ✨ Motivational Quotes
- **Home Page**: Click "Read Inspiring Quotes" button
- **Reports Page**: Click "Inspiration" button
- Auto-rotating or manually browse
- 20+ quotes on mental health, recovery, and hope

#### 👥 Support Network
- Connect with friends
- Join discussion groups
- Build your support circle
- Discuss safely

### Features by Device

**📱 Phone (320px+)**
- Full single-column layout
- Touch-friendly buttons
- Hamburger navigation menu
- All features accessible

**🖥️ Tablet (640px+)**
- Optimized 2-column view
- Better spacing
- More visible navigation

**💻 Desktop (1024px+)**
- Full multi-column interface
- All features at once
- Advanced interactions

### Safety & Privacy

✅ **Your Privacy**:
- All posts are anonymous
- Your name is never shown
- Anonymous IDs used instead
- No tracking of personal info

✅ **Crisis Support**:
- If keywords suggest emergency, we'll provide hotline numbers
- Immediate access to crisis resources
- Professional help contacts

✅ **Control**:
- Mute users you don't want to see
- Report inappropriate content
- Delete your own stories
- Control your visibility

---

## 👨‍💻 For Developers

### Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app component and routing |
| `src/pages/Home.tsx` | Landing page |
| `src/pages/Reports.tsx` | Stories feed |
| `src/pages/Chat.tsx` | Therapist & chat |
| `src/components/AITherapist.tsx` | AI therapist logic |
| `src/components/MotivationalQuotes.tsx` | Quotes system |
| `src/components/ReportFeed.tsx` | Social feed |
| `src/context/AppContext.tsx` | Global state |
| `tailwind.config.ts` | Design system config |

### Component Structure

```
<App>
  └─ <QueryClientProvider>
     └─ <LanguageProvider>
        └─ <AppProvider>
           └─ <ThemeProvider>
              └─ <AppContent>
                 ├─ <MainNav/Navbar>
                 ├─ <AnimatedRoutes>
                 │  └─ [Page Component]
                 │     ├─ Content
                 │     └─ Modal/Overlay (if needed)
                 └─ <Footer>
```

### Adding a Feature

1. **Create Component**:
```typescript
// src/components/MyFeature.tsx
import React from 'react';

interface MyFeatureProps {
  // Define props
}

export const MyFeature: React.FC<MyFeatureProps> = (props) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

2. **Use in Page**:
```typescript
import { MyFeature } from '@/components/MyFeature';

export default function MyPage() {
  return (
    <div>
      <MyFeature />
    </div>
  );
}
```

3. **Style with Tailwind**:
```html
<div className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
  Styled with Tailwind
</div>
```

4. **Make Responsive**:
```html
<!-- Mobile: hidden, Tablet: flex, Desktop: grid -->
<div className="hidden md:flex lg:grid grid-cols-3 gap-4">
  Responsive layout
</div>
```

### Component Patterns

**Simple Component**:
```typescript
export const SimpleComponent: React.FC = () => {
  return <div>Simple</div>;
};
```

**With Props**:
```typescript
interface Props {
  title: string;
  onClick: () => void;
}

export const WithProps: React.FC<Props> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};
```

**With State**:
```typescript
export const WithState: React.FC = () => {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
};
```

**With Context**:
```typescript
export const WithContext: React.FC = () => {
  const { currentUser } = useApp();
  
  return <div>User: {currentUser?.name}</div>;
};
```

### Responsive Breakpoints

```typescript
// Tailwind breakpoint prefixes
'sm'  = 640px    // Tablet
'md'  = 768px    // Larger tablet
'lg'  = 1024px   // Desktop
'xl'  = 1280px   // Large desktop
'2xl' = 1536px   // Extra large

// Usage examples
className="text-sm md:text-base lg:text-lg"
className="hidden md:block"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Common Patterns

**Loading State**:
```typescript
const [loading, setLoading] = useState(false);

const handleClick = async () => {
  setLoading(true);
  try {
    await doSomething();
  } finally {
    setLoading(false);
  }
};

return <button disabled={loading}>{loading ? 'Loading...' : 'Click'}</button>;
```

**Modal/Dialog**:
```typescript
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Open</button>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        Modal content
      </DialogContent>
    </Dialog>
  </>
);
```

**Form Handling**:
```typescript
const [formData, setFormData] = useState({ name: '', email: '' });

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

return (
  <form onSubmit={(e) => { e.preventDefault(); /* submit */ }}>
    <input name="name" value={formData.name} onChange={handleChange} />
  </form>
);
```

### Useful Hooks

```typescript
// Get app state
const { currentUser, reports, createReport } = useApp();

// Get translations
const { t } = useLanguage();

// Get theme
const { isDark, toggleTheme } = useTheme();

// Show notifications
const { toast } = useToast();
```

### Styling Tips

```css
/* Responsive Typography */
.text-responsive {
  @apply text-sm md:text-base lg:text-lg;
}

/* Responsive Spacing */
.p-responsive {
  @apply p-4 md:p-6 lg:p-8;
}

/* Responsive Grid */
.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6;
}

/* Responsive Flexbox */
.flex-responsive {
  @apply flex flex-col md:flex-row gap-4 md:gap-6;
}
```

### Common Mistakes to Avoid

❌ **Don't**: Use hardcoded colors
```typescript
style={{ color: '#9333ea' }}
```

✅ **Do**: Use Tailwind classes
```typescript
className="text-purple-600"
```

---

❌ **Don't**: Forget mobile responsiveness
```typescript
className="grid grid-cols-3"
```

✅ **Do**: Use responsive modifiers
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

❌ **Don't**: Create inline styles
```typescript
<div style={{padding: '16px', margin: '8px'}}>
```

✅ **Do**: Use Tailwind utilities
```typescript
<div className="p-4 m-2">
```

### Deploying Changes

```bash
# 1. Test locally
npm run dev

# 2. Build
npm run build

# 3. Check for errors
# (No errors should appear)

# 4. Push to repository
git add .
git commit -m "Add new feature"
git push origin main

# 5. Automatic deployment
# (Netlify/Vercel automatically deploys)
```

### Environment Variables

Add to `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Shadcn/UI](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)

### Build Issues?

```bash
# Clear node modules
rm -r node_modules

# Reinstall
npm install

# Clear build
rm -r dist

# Rebuild
npm run build
```

---

## 📞 Support

**User Support**: contact@whisperofhope.app
**Technical Issues**: See DEPLOYMENT.md troubleshooting section
**Feature Requests**: Create GitHub issue

---

**Version**: 1.0
**Last Updated**: November 16, 2025
**Status**: Production Ready ✅
