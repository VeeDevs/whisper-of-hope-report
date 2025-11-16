# Whisper of Hope - Deployment & Testing Guide

## 🚀 Deployment Instructions

### Prerequisites
- Node.js 16+ (or use the installed version)
- npm or yarn package manager
- Supabase account (for backend)
- Environment variables configured

### Build & Deploy Steps

#### 1. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

#### 2. Production Build
```bash
# Create optimized production build
npm run build

# The build output will be in the `dist/` folder
```

#### 3. Preview Production Build Locally
```bash
npm run preview
```

#### 4. Deploy to Netlify (Recommended)
The project includes `netlify.toml` configuration.

**Option A: Using Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

**Option B: Connect GitHub repository to Netlify**
1. Push code to GitHub
2. Login to Netlify
3. Click "New site from Git"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `dist`

#### 5. Deploy to Vercel
The project includes `vercel.json` configuration.

```bash
npm install -g vercel
vercel
```

#### 6. Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Device Testing Checklist

### Mobile Testing (320px - 640px)
- [ ] Home page displays properly on small screens
- [ ] Navigation menu collapses to hamburger menu
- [ ] "Share Story" button is full-width and clickable
- [ ] Reports feed is single-column layout
- [ ] Text is readable without zooming
- [ ] Form inputs are touch-friendly (min 44px height)
- [ ] AI Therapist chat interface works on small screens
- [ ] Motivational quotes are readable and centered
- [ ] Like/Comment buttons don't overlap
- [ ] Horizontal scrolling doesn't occur

### Tablet Testing (640px - 1024px)
- [ ] Two-column layout appears for content
- [ ] Navigation shows some menu items (responsive)
- [ ] Reports display with proper spacing
- [ ] Chat interface is comfortable to use
- [ ] Buttons have appropriate size
- [ ] No content cutoff at edges

### Desktop Testing (1024px+)
- [ ] Full three-column layout where applicable
- [ ] Navigation menu shows all items horizontally
- [ ] Reports feed displays with optimal readability
- [ ] AI Therapist chat window is properly sized
- [ ] Dropdown menus work correctly
- [ ] Hover effects work as expected
- [ ] Maximum content width is respected
- [ ] Sidebar navigation (if present) displays correctly

## 🧪 Feature Testing Checklist

### AI Therapist Feature
- [ ] Chat window opens on AI tab
- [ ] Messages can be typed and sent
- [ ] Therapist responds with appropriate messages
- [ ] Keywords like "stress", "anxiety", "grief" trigger specialized responses
- [ ] GBV-related keywords show compassionate responses
- [ ] Typing indicator shows while therapist is responding
- [ ] Messages scroll to bottom automatically
- [ ] Time stamps display correctly
- [ ] Works on mobile without scrolling issues

### Motivational Quotes
- [ ] Quotes appear on home page call-to-action
- [ ] Quotes modal opens when button is clicked
- [ ] Previous/Next buttons navigate between quotes
- [ ] Indicator dots show current position
- [ ] Can click dots to jump to specific quotes
- [ ] Close button (X) closes the modal
- [ ] 20+ quotes are available
- [ ] Categories display correctly (mental-health, gbv, stress, emotional-balance, hope)
- [ ] Emojis render properly
- [ ] Quote carousel auto-plays (if enabled)

### Reports/Stories Feed
- [ ] Can create new story (if logged in)
- [ ] Story title and content appear in feed
- [ ] Stories are sorted by newest first
- [ ] Like button works and changes appearance when liked
- [ ] Like count increments
- [ ] Confetti animation appears on like
- [ ] Comment input appears at bottom of each story
- [ ] Comments can be submitted
- [ ] Share button shows platform options (Twitter, Facebook, LinkedIn, WhatsApp)
- [ ] Read more/View all comments shows expanded view
- [ ] Infinite scroll loads more stories

### Responsive UI Components
- [ ] Buttons scale appropriately on all devices
- [ ] Font sizes are readable on all screen sizes
- [ ] Spacing/padding adjusts for different screens
- [ ] Images and icons scale properly
- [ ] Cards have appropriate shadows and hover effects
- [ ] Modals/dialogs are appropriately sized
- [ ] Form inputs expand to fill available space on mobile

## 🔍 Browser Compatibility Testing

Test the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Android

## ⚡ Performance Testing

```bash
# Build the project
npm run build

# Check bundle size
npm run preview
```

Expected results:
- Initial load time: < 3 seconds
- Interactive: < 5 seconds
- Bundle size: < 500KB gzipped
- Lighthouse score: > 80

## 🔐 Security Testing

- [ ] No sensitive data in browser console
- [ ] HTTPS enabled in production
- [ ] CORS headers properly configured
- [ ] API calls use secure endpoints
- [ ] User sessions are properly managed
- [ ] XSS protection in place
- [ ] CSRF tokens where applicable

## 🆘 Crisis Feature Testing

- [ ] Crisis modal appears for keywords like "suicide", "harm", "self-injury"
- [ ] Crisis hotline numbers are visible
- [ ] Links to crisis resources work
- [ ] Modal can be closed
- [ ] Appears on multiple pages

## ♿ Accessibility Testing

- [ ] Can navigate using Tab key
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen readers can read content
- [ ] Form labels are associated with inputs
- [ ] Images have alt text
- [ ] Keyboard shortcuts work where applicable
- [ ] No keyboard traps

## 🐛 Bug Reporting

When testing, report bugs with:
1. **Device/Browser**: iPhone 12 Safari, Windows 10 Chrome, etc.
2. **Screen Size**: 375px, 768px, 1920px
3. **Steps to Reproduce**: Detailed steps to trigger the bug
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Screenshots**: Visual evidence if applicable

## 📊 Performance Optimization Tips

1. **Enable Compression**: Ensure gzip is enabled on server
2. **Cache Static Assets**: Configure appropriate cache headers
3. **CDN**: Use a CDN for static assets
4. **Image Optimization**: Use modern image formats (WebP)
5. **Code Splitting**: Leverages Vite's built-in splitting
6. **Lazy Loading**: Components load on demand

## 🚨 Deployment Checklist

- [ ] Environment variables configured on hosting platform
- [ ] Database connections tested
- [ ] Email notifications configured
- [ ] Analytics installed (if needed)
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] SSL/TLS certificate installed
- [ ] HTTPS enforced
- [ ] Domain configured
- [ ] DNS properly set up
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] CI/CD pipeline configured (if applicable)

## 📞 Support & Troubleshooting

### Common Issues

**Blank Page on Load**
- Check browser console for errors (F12)
- Ensure Supabase credentials are correct
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode

**Styles Not Loading**
- Verify Tailwind CSS is compiled
- Check CSS file in dist/assets/
- Clear browser cache
- Rebuild: `npm run build`

**API Errors**
- Check Supabase connection
- Verify environment variables
- Check CORS configuration
- Review Supabase logs

**Mobile Issues**
- Test on actual devices, not just browser dev tools
- Check viewport meta tag in index.html
- Verify touch events on buttons
- Test with different screen orientations

## 📈 Analytics Setup

To track user engagement:
1. Integrate with Google Analytics, Mixpanel, or similar
2. Track key events:
   - Story creation
   - Comments posted
   - Therapist chat initiated
   - Quote views
   - Share actions

## 🔄 Continuous Improvement

Post-deployment:
1. Monitor error logs
2. Collect user feedback
3. Track performance metrics
4. Iterate on features
5. Update documentation
6. Plan next release

---

For questions or issues, contact the development team or create an issue in the repository.
