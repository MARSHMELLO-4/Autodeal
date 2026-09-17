# AutoDeal — Immersive Catalog Website Skill

## Mission

Build a **highly animated, immersive, premium vehicle catalog website** for AutoDeal.

The website should feel like a modern automotive product experience rather than a traditional dealership website.

The visual direction should take inspiration from:

* Premium automotive websites
* Modern SaaS/product landing pages
* Cinematic editorial layouts
* Apple-style product presentation
* High-end car configurators
* Modern motion-design portfolios

The goal is:

> **Make browsing vehicles feel like an experience.**

Do NOT create a generic dealership grid with cards, filters, buttons, and a navbar.

The catalog should have strong visual hierarchy, cinematic imagery, smooth transitions, scroll-driven storytelling, micro-interactions, and polished responsive behavior.

---

# 1. Design Principles

## 1.1 Premium First

Every component should feel intentional.

Avoid:

* Generic Bootstrap layouts
* Excessive rounded cards
* Basic shadows
* Default gradients
* Generic dashboard aesthetics
* Dense information dumps
* Unnecessary borders
* Huge collections of buttons
* Template-looking UI

Prefer:

* Large typography
* Strong whitespace
* Full-bleed imagery
* Layered compositions
* Subtle gradients
* Glass effects used sparingly
* Motion
* Depth
* Editorial layouts
* Asymmetric compositions
* Large visual focal points

---

# 2. Visual Identity

## Overall Feel

The visual language should be:

**Cinematic + Minimal + Futuristic + Automotive + Premium**

Think:

```text
Dark showroom
        +
Cinematic vehicle photography
        +
Large typography
        +
Smooth motion
        +
Editorial composition
```

The UI should feel closer to a premium automotive brand than a used-car marketplace.

---

# 3. Color System

Use a dark-first interface.

Suggested palette:

```text
Background:
#070707
#0D0D0D
#121212

Surface:
#171717
#1D1D1D

Primary text:
#F5F5F5

Secondary text:
#A3A3A3

Muted:
#666666

Accent:
Choose ONE strong accent.

Possible accent:
#D6FF00
or
#FF3B30
or
#00E5FF
```

Do not use every accent color.

Choose one accent and establish a consistent visual identity.

The accent should primarily be used for:

* CTA interactions
* Active filters
* Important metadata
* Hover states
* Progress indicators
* Small decorative elements

---

# 4. Typography

Typography is extremely important.

Use a modern sans-serif font.

Preferred options:

* Inter
* Geist
* Manrope
* Satoshi
* Plus Jakarta Sans

Use large typography for vehicle names and section headings.

Example:

```text
DISCOVER
YOUR NEXT
MACHINE.
```

Typography should create hierarchy before color does.

---

# 5. Landing / Hero Section

The catalog homepage should open with an immersive hero.

Do NOT immediately show a grid of cars.

Hero structure:

```text
------------------------------------------------
|                                              |
|                  [VEHICLE IMAGE]             |
|                                              |
|                                              |
|   FIND YOUR                                   |
|   NEXT MACHINE.                              |
|                                              |
|   Explore our curated collection...          |
|                                              |
|   [ EXPLORE INVENTORY ]                      |
|                                              |
|                     01 / 08                  |
------------------------------------------------
```

Vehicle imagery should occupy most of the viewport.

Possible effects:

* Slow image zoom
* Parallax movement
* Text reveal
* Image clipping animation
* Gradient overlay
* Floating metadata
* Animated pagination

Hero animation should be subtle enough to remain premium.

---

# 6. Page Loading Animation

Implement a short cinematic loading experience.

Example:

```text
AUTO
DEAL

----------------------------

Loading collection
██████████████░░░░
```

Animation duration:

~800ms–1500ms.

Do NOT create a long loading screen.

The loading transition should reveal the website using:

* clip-path
* opacity
* transform
* staggered text animation

---

# 7. Navbar

Navbar should be minimal.

Desktop:

```text
AUTO DEAL                 INVENTORY   ABOUT

                         [CONTACT]
```

Possible behavior:

* Transparent over hero
* Becomes blurred/dark on scroll
* Smooth transition
* Slight hide/show behavior while scrolling

Do not make the navbar visually dominant.

Mobile navbar:

```text
AUTO DEAL                         ☰
```

Use a fullscreen animated mobile menu.

---

# 8. Catalog Experience

The inventory section should feel like an **interactive showroom**.

Do not default to:

```text
Card
Card
Card
Card
```

Instead create a visually interesting composition.

Possible layouts:

### Layout A — Editorial Grid

```text
┌──────────────────────────────┐
│                              │
│          LARGE CAR           │
│                              │
└──────────────────────────────┘

┌───────────────┐ ┌───────────────┐
│               │ │               │
│     CAR       │ │     CAR       │
│               │ │               │
└───────────────┘ └───────────────┘
```

### Layout B — Featured Vehicle

One large featured vehicle followed by smaller vehicles.

### Layout C — Horizontal Showroom

Desktop users can horizontally scroll through selected vehicles.

Use whichever composition best fits the available data.

---

# 9. Vehicle Cards

Vehicle cards should be image-first.

Example:

```text
┌───────────────────────────────┐
│                               │
│                               │
│        VEHICLE IMAGE          │
│                               │
│                               │
│                     VIEW →    │
└───────────────────────────────┘

BMW M4 Competition
2024 · Automatic · Petrol

₹ 1,35,00,000
```

Do not put every specification inside the card.

Keep the card visually clean.

---

# 10. Vehicle Card Interactions

On hover:

* Image subtly zooms
* Card slightly expands
* Secondary information fades in
* CTA appears
* Cursor interaction changes
* Decorative elements animate

Example:

```text
Normal:

[ IMAGE ]

BMW M4
₹1.35 Cr


Hover:

[ IMAGE ZOOMED ]

BMW M4
2024 · Automatic

₹1.35 Cr

VIEW VEHICLE →
```

Animation should be smooth.

Recommended duration:

```text
300ms–700ms
```

Use easing rather than linear motion.

---

# 11. Vehicle Details Page

Clicking a vehicle should transition into a premium vehicle detail experience.

Do NOT simply navigate to:

```text
/image

title

price

description

specifications
```

Instead create a cinematic presentation.

Structure:

```text
FULLSCREEN HERO IMAGE

BMW M4
COMPETITION

₹1.35 Cr

[ ENQUIRE NOW ]

        ↓
```

Then:

```text
OVERVIEW

A detailed description...
```

Then:

```text
SPECIFICATIONS

ENGINE          2993 CC
POWER           503 HP
TRANSMISSION    AUTOMATIC
FUEL            PETROL
YEAR            2024
KM              12,000
```

Then:

```text
GALLERY

[ LARGE IMAGE ]

[ IMAGE ][ IMAGE ]
```

---

# 12. Vehicle Gallery

Vehicle gallery should be immersive.

Support:

* Large images
* Fullscreen image viewer
* Keyboard navigation
* Swipe on mobile
* Smooth transitions
* Image preloading where appropriate

Opening an image should use a modal animation.

Example:

```text
thumbnail
   ↓
scale + fade
   ↓
fullscreen image
```

---

# 13. Scroll Animations

Scrolling should feel intentional.

Use scroll-triggered animations for:

* Section reveals
* Typography
* Vehicle images
* Specifications
* Gallery
* CTAs

Preferred animation types:

```text
fade + translate
clip-path reveal
scale
parallax
horizontal movement
staggered children
```

Avoid animating everything.

Motion should establish hierarchy.

---

# 14. Scroll Progress

Consider adding a subtle scroll progress indicator.

Example:

```text
01 ━━━━━━━━━━━ 08
```

or a thin vertical indicator.

This is especially useful for cinematic vehicle detail pages.

---

# 15. Filter Experience

Filters should not dominate the UI.

Desktop:

```text
ALL
SUV
SEDAN
HATCHBACK
LUXURY
SPORTS
```

Additional filters can include:

```text
PRICE
YEAR
FUEL
TRANSMISSION
```

Use an animated filter drawer rather than permanently displaying a huge filter sidebar.

---

# 16. Search

Search should feel premium.

Example:

```text
⌕ Search vehicles

BMW M4
Mercedes AMG
Toyota Fortuner
```

When activated:

* Expand search field
* Blur background
* Display search suggestions
* Animate results

Keyboard shortcut:

```text
/
```

may focus search.

---

# 17. Empty State

If no vehicles match filters:

Do NOT display:

```text
No data found.
```

Create an intentional empty state.

Example:

```text
NOTHING MATCHED.

Try adjusting your filters
or explore the full collection.

[ RESET FILTERS ]
```

---

# 18. Real-Time Inventory

The application should support real-time inventory updates.

If a vehicle is:

* Added
* Sold
* Updated

the UI should update without requiring a full page reload.

Use the existing WebSocket infrastructure when available.

For example:

```text
VEHICLE_ADDED
VEHICLE_UPDATED
VEHICLE_SOLD
```

When a vehicle becomes sold:

Do not abruptly remove it.

Use a subtle animation:

```text
vehicle card
     ↓
fade / shrink
     ↓
removed from collection
```

---

# 19. Sold Vehicles

Sold vehicles should have clear visual communication.

Possible treatment:

```text
SOLD
```

with muted imagery.

Do not make sold inventory look like an error.

---

# 20. CTA Design

Primary CTA:

```text
EXPLORE INVENTORY →
```

Secondary:

```text
VIEW DETAILS →
```

Vehicle CTA:

```text
ENQUIRE ABOUT THIS VEHICLE →
```

Buttons should have micro-interactions.

Example:

```text
VIEW DETAILS →
```

On hover:

```text
VIEW DETAILS       →
                    →
```

or subtle directional movement.

Avoid excessive pill-shaped buttons.

---

# 21. Contact / Enquiry

Vehicle enquiry should be easy.

CTA can open an animated enquiry panel.

Example:

```text
INTERESTED IN THIS VEHICLE?

Name
Phone
Email
Message

[ SEND ENQUIRY ]
```

The panel should slide from the side or rise from the bottom on mobile.

---

# 22. AI Vehicle Description

If the backend provides AI-generated descriptions, present them naturally.

Do not label the entire UI:

```text
AI GENERATED DESCRIPTION
```

Instead make it feel like editorial copy.

Example:

```text
THE M4 EXPERIENCE

A sharp, performance-focused coupe built
for drivers who want everyday usability
without compromising on character.
```

---

# 23. Image Handling

Vehicle imagery is the primary visual asset.

Requirements:

* Lazy load below-the-fold images
* Use responsive image sizes
* Prevent layout shift
* Use object-fit correctly
* Show polished loading placeholders
* Handle broken images gracefully

Use subtle image placeholders instead of blank white boxes.

---

# 24. Performance

Animations must NOT destroy performance.

Prioritize:

```text
transform
opacity
clip-path
```

Avoid expensive continuous JavaScript animations.

Prefer:

* CSS transitions
* CSS animations
* Framer Motion / Motion where appropriate
* Intersection Observer
* requestAnimationFrame only when genuinely required

Respect:

```text
prefers-reduced-motion
```

Users who disable motion should receive a simplified experience.

---

# 25. Responsive Design

The experience must work across:

```text
1440px+
1280px
1024px
768px
480px
375px
```

Do not simply shrink desktop.

Mobile should have its own composition.

Desktop:

```text
cinematic
asymmetric
large imagery
horizontal layouts
```

Mobile:

```text
vertical storytelling
large imagery
large typography
simplified navigation
bottom-sheet interactions
```

---

# 26. Mobile Navigation

Mobile menu should feel polished.

Opening:

```text
MENU
```

should animate into:

```text
-----------------------
INVENTORY

ABOUT

CONTACT

-----------------------
```

Use staggered text animation.

---

# 27. Footer

Footer should remain minimal.

Example:

```text
AUTO DEAL

Find your next machine.

INVENTORY
ABOUT
CONTACT

Instagram
WhatsApp

© 2026 AutoDeal
```

Avoid huge generic footers.

---

# 28. Motion System

Establish consistent animation tokens.

Example:

```ts
const motion = {
  fast: 0.25,
  normal: 0.45,
  slow: 0.8,
  cinematic: 1.2,
};
```

Recommended easing:

```text
cubic-bezier(0.22, 1, 0.36, 1)
```

Use staggered animations:

```text
heading
   ↓ 80ms
description
   ↓ 80ms
CTA
   ↓ 80ms
metadata
```

Do not animate everything simultaneously.

---

# 29. Page Transitions

Navigation between pages should have a visual transition.

Possible sequence:

```text
Current page
     ↓
content fades / clips
     ↓
new page enters
     ↓
hero image reveals
     ↓
text staggers in
```

Keep transitions short enough that navigation never feels slow.

---

# 30. Cursor Interactions

Desktop may use a custom cursor for premium interactions.

Examples:

```text
VIEW
DRAG
OPEN
```

However:

* Do not replace the normal cursor everywhere.
* Do not make the cursor distracting.
* Disable custom cursor on touch devices.

---

# 31. Micro-interactions

Add subtle details such as:

* Button arrow movement
* Image zoom
* Text underline animation
* Filter transitions
* Search expansion
* Menu transitions
* Hover metadata
* Loading skeletons
* Toast animations
* Copy-to-clipboard feedback

The site should feel alive.

---

# 32. Technology Preferences

Use the project's existing stack whenever possible.

Preferred frontend stack:

```text
React
TypeScript
Tailwind CSS
Motion / Framer Motion
Redux Toolkit where already used
```

Do not introduce a new framework unnecessarily.

If the project already has an animation library, use it consistently.

---

# 33. Component Architecture

Create reusable components.

Suggested structure:

```text
components/
│
├── Navbar/
├── Hero/
├── VehicleCard/
├── VehicleGrid/
├── FeaturedVehicle/
├── Search/
├── FilterPanel/
├── VehicleGallery/
├── VehicleSpecs/
├── EnquiryPanel/
├── Footer/
├── PageTransition/
├── LoadingScreen/
└── Motion/
```

Do not put the entire catalog inside one giant component.

---

# 34. Data Architecture

Vehicle UI should consume backend data rather than hardcoded vehicle objects.

Example:

```ts
interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  images: string[];
  description?: string;
  status: "AVAILABLE" | "SOLD";
}
```

Adapt this interface to the actual backend response.

Do NOT break existing APIs simply to fit the UI.

---

# 35. Existing Backend Integration

The frontend should integrate with the existing AutoDeal backend.

Important existing concepts may include:

```text
Vehicle REST APIs
Search
Pagination
Redis caching
WebSocket inventory updates
Vehicle sold events
RabbitMQ notifications
Supabase media storage
```

Preserve these systems.

The frontend redesign should primarily improve the presentation layer.

---

# 36. API States

Every API-driven component must handle:

```text
Loading
Success
Empty
Error
Retry
```

Never leave users staring at a blank page.

---

# 37. Skeleton Loading

Skeletons should match the final composition.

Do not use generic rectangular skeletons everywhere.

For example:

```text
image skeleton
    +
title skeleton
    +
metadata skeleton
```

Animate skeletons subtly.

---

# 38. Accessibility

Despite the visual focus, accessibility remains mandatory.

Requirements:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Proper button labels
* Alt text
* Accessible dialogs
* Accessible mobile navigation
* Form labels
* Reduced motion support
* Sufficient contrast

Animations must never prevent users from accessing content.

---

# 39. SEO

Vehicle pages should expose meaningful metadata.

Use:

```text
<title>
<meta description>
OpenGraph metadata
canonical URLs
structured data where appropriate
```

Vehicle names and important content should remain actual text rather than being embedded into images.

---

# 40. Error Handling

Errors should feel part of the product.

Avoid browser-like messages such as:

```text
Something went wrong!!!
```

Prefer:

```text
WE COULDN'T LOAD THE COLLECTION.

Please try again.

[ RETRY ]
```

---

# 41. What NOT To Do

Never produce:

### Generic SaaS Dashboard

```text
Navbar
Sidebar
Cards
Cards
Cards
```

### Generic E-commerce UI

```text
Image
Title
Rating
Price
Add to cart
```

### Generic Dealership Website

```text
Cars for Sale
Filter sidebar
3-column cards
```

### Excessive Glassmorphism

Do not cover the entire interface in:

```text
blur()
rgba(255,255,255,0.1)
border-radius: 20px
```

### Excessive Gradients

Gradients should support imagery and hierarchy, not become the primary design.

### Excessive Animation

Animation should communicate hierarchy, interaction, and continuity.

It should never exist merely because animation is possible.

---

# 42. Design Quality Bar

Before considering a page complete, ask:

### Visual

* Does this look premium?
* Does it feel automotive?
* Is the hierarchy obvious?
* Is there enough whitespace?
* Are the images the visual focus?

### Motion

* Does the page have meaningful motion?
* Are transitions consistent?
* Are hover states polished?
* Do page transitions feel intentional?
* Is reduced-motion supported?

### UX

* Can users find a vehicle quickly?
* Is filtering intuitive?
* Is vehicle information readable?
* Are loading and error states handled?
* Does mobile feel intentionally designed?

### Engineering

* Are components reusable?
* Are API calls separated from presentation?
* Are animations performant?
* Are images optimized?
* Are existing APIs preserved?
* Is TypeScript used properly?

---

# 43. Implementation Strategy

Do not attempt to redesign the entire application in one enormous component.

Implement in this order:

```text
1. Global design system
       ↓
2. Navbar
       ↓
3. Loading transition
       ↓
4. Hero
       ↓
5. Inventory composition
       ↓
6. Vehicle cards
       ↓
7. Filtering/search
       ↓
8. Vehicle detail page
       ↓
9. Gallery
       ↓
10. Enquiry interaction
       ↓
11. WebSocket updates
       ↓
12. Mobile optimization
       ↓
13. Accessibility
       ↓
14. Performance optimization
```

After each major section:

* Run the application
* Check console errors
* Check TypeScript errors
* Test desktop
* Test mobile
* Verify existing API behavior

---

# 44. Final Product Vision

The finished website should feel like:

> **A digital showroom for discovering machines.**

A user should be able to land on the page and immediately experience:

```text
IMAGE
    ↓
MOTION
    ↓
TYPOGRAPHY
    ↓
VEHICLE
    ↓
DETAIL
    ↓
DISCOVERY
    ↓
ENQUIRY
```

The website should make the inventory feel valuable.

The implementation should prioritize **visual storytelling, cinematic motion, usability, performance, and maintainable React architecture**.

When forced to choose between adding another decorative effect and improving the user experience, choose the user experience.

When forced to choose between adding more information and improving visual hierarchy, improve visual hierarchy.

When forced to choose between a clever animation and a performant implementation, choose performance.

The final result should look like a **2026 premium automotive digital experience**, not a template.
