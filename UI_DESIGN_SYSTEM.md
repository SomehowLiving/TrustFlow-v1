# TrustFlow UI Design System

## Design Philosophy

**Tone**: Calm · Trustworthy · Technical · Minimal

We've adopted the design language of Stripe, Linear, and Vercel — applications trusted to handle money and critical infrastructure.

- Clean and boring = real money
- Minimal but purposeful
- Whitespace > density
- Dark mode by default (light mode supported)

## Color Palette

### Dark Mode (Default)
- **Background**: `#0B0F14` (near-black, slightly blue)
- **Card**: `#0F172A` (slightly lighter for depth)
- **Text Primary**: `#E5E7EB` (light gray)
- **Text Muted**: `#9CA3AF` (medium gray)
- **Border**: `#1F2937` (subtle)
- **Accent (Primary)**: `#0EA5E4` (teal - primary action color)
- **Error**: `#EF4444` (red)
- **Success**: `#22C55E` (green)

### Light Mode
- **Background**: `#F9FAFB` (off-white)
- **Card**: `#FFFFFF` (pure white)
- **Text Primary**: `#0F172A` (near-black)
- **Text Muted**: `#6B7280` (medium gray)
- **Border**: `#E5E7EB` (light gray)
- **Accent**: Same teal `#0EA5E4`

## Why Teal for Primary?

- **Green psychology** → Money, go, trust
- **Stable, not hype** → Not the neon/gradient Web3 style
- **Accessible** → High contrast on both dark and light backgrounds
- **Professional** → Used by leading fintech apps

## Layout & Spacing System

### Golden Rules
1. **Fewer elements, more whitespace**
2. **Never force multi-column layouts**
3. **Max-width of 2xl (28rem) for forms**
4. **Use consistent spacing units**

### Spacing Values (Tailwind)
- `space-y-2` - Tight (between form labels and inputs)
- `space-y-4` - Small gap between sections
- `space-y-6` - Normal gap between form groups
- `space-y-8` - Large gap for major sections
- `py-12` - Page padding (top/bottom)
- `py-16` - Large page sections

### Width Constraints
- Forms: `max-w-md` (28rem)
- Content: `max-w-2xl` or `max-w-3xl`
- Avoid: `max-w-4xl+`, sidebars, multi-column layouts

## Component Patterns

### Page Header
```tsx
<div className="space-y-4 mb-8">
  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 border border-accent/20">
    <IconComponent className="w-6 h-6 text-accent" />
  </div>
  <div className="space-y-2">
    <h1 className="text-2xl md:text-3xl font-bold">Title</h1>
    <p className="text-sm text-muted-foreground">Subtitle or description</p>
  </div>
</div>
```

### Form Field
```tsx
<div className="space-y-2">
  <FormLabel className="text-sm font-medium">Label *</FormLabel>
  <FormControl>
    <Input className="h-10" placeholder="..." />
  </FormControl>
  <FormMessage className="text-xs" />
</div>
```

### Card / Section
```tsx
<div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm space-y-3">
  {/* content */}
</div>
```

### Button
- Primary action: `<Button className="w-full h-10">Action</Button>`
- Secondary: `<Button variant="ghost">Action</Button>`
- Heights: `h-9` (compact), `h-10` (normal), `h-12` (large)

## Typography Scale

- **H1**: `text-3xl md:text-4xl font-bold tracking-tight`
- **H2**: `text-2xl md:text-3xl font-semibold tracking-tight`
- **H3**: `text-xl font-semibold tracking-tight`
- **Body**: `text-base text-muted-foreground leading-relaxed`
- **Small**: `text-sm text-muted-foreground`
- **Tiny**: `text-xs text-muted-foreground`

## Dark Mode Only Sections

Some areas are intentionally **dark-only** for better visual hierarchy:
- Landing page hero
- Dashboard backgrounds
- Modal/dialog overlays

Use `dark:` prefixes sparingly. Default = dark, then add light mode overrides if needed.

## Component States

### Disabled
```tsx
disabled:opacity-50 disabled:cursor-not-allowed
```

### Hover
```tsx
hover:bg-card/80 transition-colors
```

### Focus
```tsx
focus:outline-none focus:ring-2 focus:ring-accent
```

## Icons

- **Icon Size**: `w-4 h-4` (small), `w-5 h-5` (normal), `w-6 h-6` (large)
- **Icon Color**: `text-accent` for primary, `text-muted-foreground` for secondary
- **Spacing**: `mr-2` (after text), `ml-2` (before text)

From Lucide:
```tsx
import { ShieldIcon, AlertIcon, CheckIcon } from "lucide-react";
```

## Progress Indicators

### Linear Progress
```tsx
<div className="flex gap-1">
  {steps.map((step) => (
    <div
      key={step}
      className={`h-1 flex-1 rounded-full ${
        step <= current ? "bg-accent" : "bg-border"
      }`}
    />
  ))}
</div>
```

## Responsive Breakpoints

- **Default**: Mobile-first (max: 640px)
- **md**: Tablet (768px+)
- **lg**: Desktop (1024px+)
- **xl**: Large desktop (1280px+)

Use `md:` and `lg:` prefixes sparingly. Prefer single-column layouts.

## Dos and Don'ts

### ✅ Do
- Use subtle borders (`border-border`)
- Embrace whitespace
- Keep forms single-column
- Use consistent icon sizes
- Test in both dark and light modes
- Use semantic color meanings (green=success, red=error)

### ❌ Don't
- Use bright gradients or neon colors
- Create dense layouts
- Add unnecessary animations
- Use emojis in UI (data-focused)
- Mix color philosophies (fintech vs. Web3)
- Create hover effects that feel sluggish

## Accessibility

- Ensure `text-xs` is always paired with sufficient contrast
- Use semantic HTML
- Include descriptive form labels
- Provide error messages in forms
- Maintain keyboard navigation
- Test with screen readers

## Example: Improved Form

```tsx
<div className="min-h-screen flex items-center justify-center px-4">
  <div className="w-full max-w-md space-y-8">
    {/* Header */}
    <div className="space-y-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 border border-accent/20">
        <ShieldIcon className="w-6 h-6 text-accent" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Title</h1>
        <p className="text-sm text-muted-foreground">Subtitle</p>
      </div>
    </div>

    {/* Form */}
    <form className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Label</label>
        <input className="w-full h-10 px-3 rounded-md border border-border bg-input text-foreground" />
      </div>
      <button className="w-full h-10 rounded-md bg-accent text-primary-foreground font-medium hover:bg-accent/90 transition-colors">
        Submit
      </button>
    </form>

    {/* Progress */}
    <div className="flex gap-1">
      <div className="h-1 flex-1 rounded-full bg-accent" />
      <div className="h-1 flex-1 rounded-full bg-border" />
      <div className="h-1 flex-1 rounded-full bg-border" />
    </div>
  </div>
</div>
```

## Future Considerations

- Light mode by choice (not forced)
- High contrast mode for accessibility
- Custom font loading (maintain system fonts for now)
- Animation guidelines (keep it subtle)
