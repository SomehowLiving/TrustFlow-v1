# UI Quick Reference Guide

## Color Palette Quick Copy

### Dark Mode (Default)
```
Background:       #0B0F14  (hsl(212, 40%, 7%))
Card:             #0F172A  (hsl(217, 55%, 13%))
Primary Accent:   #0EA5E4  (hsl(200, 98%, 55%))
Text Primary:     #E5E7EB  (hsl(210, 10%, 90%))
Text Muted:       #9CA3AF  (hsl(210, 7%, 60%))
Border:           #1F2937  (hsl(217, 33%, 17%))
Error:            #EF4444  (hsl(0, 84%, 60%))
Success:          #22C55E  (hsl(142, 71%, 45%))
```

### Light Mode
```
Background:       #F9FAFB  (hsl(210, 40%, 98%))
Card:             #FFFFFF  (hsl(0, 0%, 100%))
Text Primary:     #0F172A  (hsl(217, 55%, 13%))
Text Muted:       #6B7280  (hsl(210, 6%, 42%))
Border:           #E5E7EB  (hsl(210, 10%, 90%))
Accent:           #0EA5E4  (same teal)
```

## Spacing Rules

**Use Only These Values:**
```
space-y-2    (0.5rem between labels and inputs)
space-y-4    (1rem small gaps)
space-y-6    (1.5rem normal gaps)
space-y-8    (2rem large gaps)
py-12        (3rem page padding)
py-16        (4rem large sections)
px-4         (1rem mobile horizontal)
px-6         (1.5rem desktop horizontal)
```

**Never Use:**
- `space-y-3`, `space-y-5`, `space-y-7`
- `py-4`, `py-8`, `py-24`
- `px-2`, `px-3`, `px-5`

## Component Patterns

### Form Field
```tsx
<div className="space-y-2">
  <FormLabel className="text-sm font-medium">Label</FormLabel>
  <FormControl>
    <Input className="h-10" placeholder="..." />
  </FormControl>
  <FormMessage className="text-xs" />
</div>
```

### Button
```tsx
<Button className="w-full h-10">Action</Button>  // Full width
<Button className="h-10">Action</Button>         // Auto width
<Button size="sm" className="h-8">Compact</Button> // Small
<Button variant="ghost">Secondary</Button>       // Ghost
```

### Card/Section
```tsx
<div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
  {/* content */}
</div>
```

### Page Layout
```tsx
<main className="min-h-screen flex items-center justify-center px-4">
  <div className="w-full max-w-md space-y-8">
    {/* Header, Form, Progress */}
  </div>
</main>
```

### Icon Usage
```tsx
import { ShieldIcon, AlertIcon } from "lucide-react";

<ShieldIcon className="w-6 h-6 text-accent" />        // Large
<ShieldIcon className="w-5 h-5 text-accent" />        // Normal
<ShieldIcon className="w-4 h-4 text-muted-foreground" /> // Small
```

## Typography Sizes

| Element | Class | Usage |
|---------|-------|-------|
| H1 | `text-3xl md:text-4xl font-bold tracking-tight` | Page title |
| H2 | `text-2xl md:text-3xl font-semibold tracking-tight` | Section title |
| H3 | `text-xl font-semibold tracking-tight` | Subsection |
| Body | `text-base text-muted-foreground leading-relaxed` | Paragraph |
| Label | `text-sm font-medium` | Form labels |
| Small | `text-sm text-muted-foreground` | Descriptions |
| Tiny | `text-xs text-muted-foreground` | Hints, errors |

## Common Utilities

```tsx
// Hover states
hover:bg-card/80 transition-colors
hover:text-foreground

// Focus states
focus:outline-none focus:ring-2 focus:ring-accent

// Disabled states
disabled:opacity-50 disabled:cursor-not-allowed

// Responsive
md:text-lg                    // Larger on desktop
hidden md:block               // Hide on mobile, show on desktop
px-4 md:px-6                  // More padding on desktop

// Transparency
bg-accent/10                  // 10% opacity
bg-card/50                    // 50% opacity
```

## Icon Reference

### Common Icons (from lucide-react)
```
ShieldIcon, ShieldCheckIcon  // Security
UserIcon                      // User/People
NetworkIcon                   // Networks
CoinsIcon                     // Money/Stablecoins
Loader2Icon                   // Loading spinner
AlertIcon                     // Warning
CheckIcon                     // Success
XIcon                         // Close
ArrowRightIcon               // Next/Continue
LogInIcon                    // Login
LogOutIcon                   // Logout
MenuIcon                     // Menu/Hamburger
GithubIcon                   // GitHub link
```

## Dos ✅

- ✅ Use `text-accent` for primary actions
- ✅ Use `text-muted-foreground` for secondary text
- ✅ Apply `border-border` to all borders
- ✅ Use `space-y-*` for vertical spacing
- ✅ Center forms with `max-w-md`
- ✅ Add `rounded-lg` to cards (not `rounded-none`)
- ✅ Use `h-10` for normal buttons
- ✅ Apply `transition-colors` to interactive elements
- ✅ Test both dark and light modes
- ✅ Use semantic HTML

## Don'ts ❌

- ❌ Use bright colors (Web3 gradients)
- ❌ Create multi-column layouts
- ❌ Use random spacing values
- ❌ Add heavy shadows
- ❌ Use emojis in UI
- ❌ Apply hard shadows to elements
- ❌ Create overly dense layouts
- ❌ Mix color philosophies
- ❌ Ignore whitespace
- ❌ Use `text-white` or `text-black` directly

## Dark Mode Classes

```tsx
// Already applied globally, but for reference:
dark:bg-background     // Dark background
dark:text-foreground   // Dark text
dark:border-border     // Dark border

// Use sparingly:
dark:hover:bg-card/80  // Dark mode hover
```

## Quick Copy: Common Components

### Centered Form Page
```tsx
<main className="min-h-screen flex items-center justify-center px-4 py-12">
  <div className="w-full max-w-md space-y-8">
    <div className="space-y-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 border border-accent/20">
        <IconComponent className="w-6 h-6 text-accent" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Title</h1>
        <p className="text-sm text-muted-foreground">Subtitle</p>
      </div>
    </div>
    {/* Form content */}
  </div>
</main>
```

### Info Box
```tsx
<div className="p-4 rounded-lg bg-card/50 border border-border">
  <p className="text-xs text-muted-foreground leading-relaxed">
    Your message here
  </p>
</div>
```

### Progress Bar
```tsx
<div className="flex gap-1">
  {[1, 2, 3].map((step) => (
    <div
      key={step}
      className={`h-1 flex-1 rounded-full ${
        step <= current ? "bg-accent" : "bg-border"
      }`}
    />
  ))}
</div>
```

## Files to Reference

- **Theme**: `app/styles/trustflow-theme.css`
- **System Guide**: `UI_DESIGN_SYSTEM.md`
- **Changes**: `UI_IMPROVEMENTS.md`
- **Examples**: `app/app/page.tsx`, `app/components/login-section.tsx`
