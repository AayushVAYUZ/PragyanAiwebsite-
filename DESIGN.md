# DESIGN.md
# Pragyan AI — Cinematic Enterprise AI Website

## 1. Project Overview

This project is a premium, cinematic enterprise AI website for **Pragyan AI**.

The website should not feel like a conventional SaaS landing page. It should feel like a **digital film that the user controls with scrolling**.

The visual reference establishes a dark, futuristic, intelligent and premium aesthetic built around:

- Near-black environments
- Deep navy / midnight-blue atmospheres
- Electric violet and cyan energy
- Photographic realism
- Minimal editorial typography
- Strong depth and perspective
- Thin technical lines
- Subtle particles and light trails
- Large cinematic compositions
- Restrained, sophisticated UI

The site's opening experience is a continuous narrative:

1. The Eye
2. The Gate of PAI
3. Enter
4. Pass Through the Gate

After the cinematic opening, the website transitions into the enterprise content experience.

---

## 2. Core Design Philosophy

### Brand personality

The interface should communicate:

- Intelligent
- Premium
- Futuristic
- Human
- Precise
- Confident
- Transformational
- Enterprise-grade
- Technologically sophisticated
- Visually restrained

The site should feel closer to a **premium technology film / digital experience** than a generic AI startup website.

### Design principle

**Technology should be felt before it is explained.**

Visual storytelling comes first. Content then explains the business value.

Avoid visual noise. Every glow, particle, line, image and piece of typography should have a reason to exist.

---

## 3. Visual Reference Rules

Use the provided website screenshot as the primary art-direction reference.

The screenshot is a reference for:

- Composition
- Visual hierarchy
- Atmosphere
- Color relationships
- Lighting
- Typography scale
- Section structure
- Image treatment
- Navigation
- Spacing
- Cinematic storytelling

Do NOT treat the screenshot as a pixel-perfect page to reproduce.

The final interface should be an original implementation that maintains the same visual language and level of polish.

---

## 4. Color System

### Primary background

```text
Void Black:        #03040A
Near Black:        #050711
Deep Navy:         #070B18
Midnight Blue:     #0A1024
```

Use these as layered backgrounds rather than one flat black.

### Primary energy colors

```text
Electric Violet:   #8B2DFF
Deep Violet:       #5418C8
Neon Purple:       #B339FF
Electric Blue:     #176BFF
Neon Cyan:         #26C6FF
Deep Blue:         #0D2F78
```

### Text

```text
Primary White:     #F5F7FF
Soft White:        #D8DBE8
Secondary Text:    #A2A8BC
Muted Text:        #727991
```

### Structural colors

```text
Border:            rgba(160, 175, 220, 0.22)
Subtle Border:     rgba(160, 175, 220, 0.12)
Glass Surface:     rgba(10, 15, 35, 0.52)
```

Do not use large solid areas of saturated purple or blue.

Energy colors should primarily appear through:

- Glow
- Lighting
- Gradients
- Reflections
- Borders
- Particles
- Atmospheric effects
- Interactive states

---

## 5. Gradients

Gradients should be subtle and atmospheric.

### Primary cinematic gradient

```text
#03040A → #071027 → #03040A
```

### Violet energy

```text
#4A0DA8 → #8B2DFF → #C14DFF
```

### Blue energy

```text
#062A78 → #176BFF → #26C6FF
```

### Violet-blue atmospheric glow

Use a blurred combination of violet and cyan rather than a hard gradient.

Example:

```text
radial-gradient(
  circle,
  rgba(139,45,255,0.30) 0%,
  rgba(23,107,255,0.18) 35%,
  transparent 72%
)
```

Gradients should remain dark outside the focal area.

---

## 6. Typography

### Typeface

Use a modern, clean, premium sans-serif.

Preferred direction:

- Inter
- Geist
- Manrope
- Satoshi
- Neue Haas Grotesk style alternatives

Avoid decorative sci-fi fonts.

### Headline style

Large editorial headlines.

Typical characteristics:

- Light to regular weight
- Tight but comfortable line height
- Short line lengths
- Strong contrast against dark backgrounds
- Sentence case rather than all caps

Example:

> A smarter tomorrow  
> is already looking at us.

### Section labels

Small uppercase technical labels.

Example:

```text
01 — THE EYE
02 — THE GATE OF PAI
08 — CAPABILITIES
```

Characteristics:

- 9–12px desktop
- Medium weight
- Letter spacing: 0.16em–0.24em
- High contrast but not pure white

### Supporting copy

Readable, understated, slightly muted.

Characteristics:

- 14–18px desktop
- 1.45–1.65 line height
- Maximum width around 420–520px

### Navigation

Very small, compact and minimal.

Avoid oversized navigation.

---

## 7. Typography Scale

Desktop baseline:

```text
Display:       72–120px
Hero heading:  52–80px
H1:            48–68px
H2:            36–52px
H3:            22–30px
Body Large:    18px
Body:          14–16px
Small:         12px
Micro:         9–11px
```

Use responsive scaling rather than fixed desktop sizes.

Mobile:

```text
Display:       48–72px
H1:            40–52px
H2:            32–40px
H3:            20–26px
Body:          14–16px
Small:         10–12px
```

---

## 8. Grid and Layout

Use a wide editorial grid.

### Desktop

Recommended:

```text
12-column grid
Max width: 1440–1600px
Outer gutter: 32–64px
Column gap: 20–32px
```

Content should not always be centered.

Favor:

- Asymmetry
- Left-aligned editorial blocks
- Large open negative space
- Full-bleed imagery
- Split compositions
- Edge-aligned technical elements

### Section rhythm

Use generous vertical spacing.

Do not compress content to fit more information on screen.

The site should breathe.

---

## 9. Navigation

The top navigation should remain minimal and refined.

Reference structure:

```text
Pragyan ai                         Who We Are
                                   What We Do
                                   Capabilities
                                   Products
                                   Use Cases
                                   Insights

                                   [ Talk to Us ]
```

Guidelines:

- Transparent background over cinematic scenes
- Very subtle fixed position
- Small typography
- Minimal divider treatment
- CTA should be compact
- Navigation must not compete with the hero

When the cinematic experience becomes extremely intense, navigation may reduce its visual opacity.

---

## 10. Buttons

Buttons should be compact and premium.

### Primary CTA

Characteristics:

- Thin subtle border
- Dark translucent surface
- Soft violet glow on hover
- Small arrow indicator
- Rounded pill shape, but not excessively rounded

Example:

```text
Explore Capabilities  →
```

### Secondary CTA

Use minimal text + arrow.

Avoid large conventional SaaS buttons.

### Hover behavior

Hover should feel technological but restrained:

- Border becomes brighter
- Slight glow
- Arrow moves slightly
- Background gains subtle illumination
- No dramatic scale bounce

---

# 11. Cinematic Opening

The first four frames represent one continuous cinematic sequence.

They are NOT independent pages.

The conceptual story:

```text
THE EYE
    ↓
discover the intelligence

THE GATE
    ↓
approach the intelligence

ENTER
    ↓
reach the threshold

PASS THROUGH
    ↓
enter the world of Pragyan AI
```

---

## 12. Frame 01 — THE EYE

### Composition

Use an extreme close-up of a realistic human eye.

The scene is almost entirely dark.

The eye should emerge from darkness through subtle illumination.

Inside the iris/pupil:

- Small rectangular gate
- Electric violet outline
- Electric blue secondary edge
- Soft inner glow
- Very subtle reflection on the iris

The gate starts small.

### Content

```text
01 — THE EYE

A smarter tomorrow
is already looking at us.

Pragyan ai
Intelligence for Efficient Results
```

### Behavior concept

The initial frame should feel almost still.

The viewer should be intrigued before the movement begins.

---

## 13. Frame 02 — THE GATE OF PAI

The camera has moved out of the eye and toward the gateway.

The eye is no longer the dominant element.

### Gate

The gateway becomes much larger.

Surround it with:

- Blue atmospheric energy
- Violet edge glow
- Radial particles
- Fine energy filaments
- Volumetric lighting
- Depth fog
- Subtle lens bloom

### Content

```text
02 — THE GATE OF PAI

The Gate of PAI

A doorway to intelligence,
possibilities and real outcomes.
```

Supporting navigation:

```text
DISCOVER
UNDERSTAND
SOLVE
TRANSFORM
```

### Important

Frame 02 should look unmistakably like a continuation of Frame 01.

---

## 14. Frame 03 — ENTER

The camera is now very close to the gateway.

A human silhouette appears.

### Composition

- Huge glowing gateway
- Small human silhouette
- Strong sense of scale
- Deep portal interior
- Strong forward perspective
- Rays moving outward toward viewer

### Content

```text
03 — ENTER

Step into
a more intelligent
tomorrow.
```

Right-side words:

```text
EXPLORE
EXPERIENCE
ENVISION
EVOLVE
```

The human silhouette should remain anonymous.

No identifiable face.

---

## 15. Frame 04 — PASS THROUGH THE GATE

This is the climax of the cinematic sequence.

The viewer is effectively crossing the portal.

### Visual behavior

The gate should become so large that it extends beyond the viewport.

The scene should transform into:

- Violet light
- Blue light
- Particle streaks
- Radial rays
- Energy trails
- Atmospheric distortion
- Forward motion

The original eye environment should disappear.

### Content

```text
04 — PASS THROUGH THE GATE

Beyond borders.
Into intelligence.
```

The frame should prepare the viewer for the main website experience.

---

# 16. Cinematic Motion Principles

The scroll position controls the cinematic timeline.

Conceptually:

```text
scroll progress
      ↓
animation timeline
      ↓
camera movement
      ↓
scene transformation
```

Do not implement the cinematic sequence as simple section-to-section fades.

### Motion characteristics

Motion should feel:

- Continuous
- Cinematic
- Heavy
- Smooth
- Spatial
- Intentional
- Physically believable

Avoid:

- Bounce
- Elastic UI transitions
- Rapid card animations
- Excessive micro-interactions
- Random movement

---

## 17. Camera Movement

Think of the opening as a virtual camera traveling through a scene.

Approximate progression:

```text
Frame 01
Camera: close to eye

Frame 02
Camera: approaching gate

Frame 03
Camera: directly facing gate

Frame 04
Camera: passing through gate
```

Elements should move according to depth.

Example conceptual layer speeds:

```text
Background        0.1x
Atmosphere        0.3x
Particles         0.5x
Light rays        0.8x
Gate              1.0x
Human             1.1x
Foreground glow   1.4x
```

These are design guidelines, not literal implementation values.

---

## 18. Scroll Behavior

The first cinematic section should occupy multiple viewport heights.

Recommended conceptual structure:

```text
Cinematic wrapper: ~400–600vh
Scene viewport:    100vh sticky
```

The actual values should be tuned after implementation.

The scene remains visually pinned while scroll progress drives the timeline.

---

## 19. Main Website Transition

After Frame 04, the cinematic environment should resolve into the normal website.

The first destination is:

## Frame 05 — THE BELIEF

Transition concept:

```text
Portal
  ↓
Energy
  ↓
Light bloom
  ↓
Energy collapses
  ↓
Darkness / particles
  ↓
"The Belief"
```

The transition should feel like the viewer has arrived somewhere new.

---

# 20. Section 05 — THE BELIEF

Core message:

```text
AI doesn't
start with a model.

It starts with
the right questions.
```

Visual language:

- Dark network / intelligence diagram
- Central glowing node
- Connected questions
- Subtle violet/blue network lines
- Minimal cards around the central intelligence

Question cards can communicate:

```text
What are we trying to improve?
Where are decisions taking too long?
What information is hard to access?
Where can AI create real business value?
What data do we already have?
What should not be rebuilt?
```

---

# 21. Section 06 — OUR JOURNEY

Message:

```text
Pragyan ai is new.
Our AI journey isn't.
```

Use a cinematic landscape or mountain environment.

Introduce a glowing path connecting milestones.

Timeline:

```text
2015
Engineering Possibilities

2018
Scaled Delivery

2021
Embraced AI

2024
Built Pragyan ai

2026+
Amplifying Impact
```

The timeline should remain understated.

---

# 22. Section 07 — PRISM

Message:

```text
From AI possibility
to business value.
```

Present PRISM as a methodology rather than a generic process diagram.

Five stages:

```text
01 ORIENT
Understand the business.

02 DISPERSE
Explore possibilities.

03 SPECTRUM
Evaluate what matters.

04 REFRACT
Design the right solution.

05 EMERGE
Build. Deploy. Improve.
```

Use a crystalline / geometric intelligence visual.

---

# 23. Section 08 — CAPABILITIES

Message:

```text
Intelligence
across the enterprise.
```

Five capability pillars:

```text
Strategy & Advisory
Data & AI Engineering
Intelligent Applications
Platform Modernization
Managed Intelligence
```

Cards should feel like precision instruments, not generic SaaS cards.

---

# 24. Section 09 — PROOF / CASE STUDIES

Message:

```text
AI that
has left the lab.
```

Show case study cards with rich imagery.

Example content:

```text
CASE STUDY 01
5 Days → 3 Seconds

Claims Processing
for a Leading P&C Firm
```

```text
CASE STUDY 02
From Data
to Decisions

AI-Powered Insights for
a Global Manufacturer
```

Emphasize measurable business outcomes.

---

# 25. Section 10 — WHAT WE'VE BUILT

Message:

```text
We build with AI.
We build AI too.
```

Product cards:

```text
ReX
Intelligent Talent Exchange

Minuta
Turn Meetings into Momentum
```

Use image-rich product surfaces.

---

# 26. Section 11 — USE CASES

Message:

```text
Where could intelligence
change your business?
```

Industry cards:

```text
BFSI
Manufacturing
Logistics
Healthcare
Retail & Ecommerce
```

Use cinematic industrial photography.

---

# 27. Section 12 — CLIENT PROOF

Message:

```text
What changes
when intelligence works.
```

Use:

- Testimonial
- Client impact statement
- Subtle futuristic image
- Trust-oriented composition

Example testimonial style:

> “AI brought clarity, speed and real business value to our AI approach.”

Keep quotes short and credible.

---

# 28. Section 13 — HOW WE THINK

Message:

```text
Ideas for a more
intelligent tomorrow.
```

Use editorial insight cards.

Example topics:

```text
Rethinking AI Adoption in Enterprise
From Data to Decisions
The Human Side of AI Transformation
```

This section should feel more editorial than sales-oriented.

---

# 29. Section 14 — READY TO EXPLORE

Closing CTA:

```text
What needs
to work better?

Let's build what's next. Together.
```

Use a large cinematic arc / horizon / intelligence visual.

Central phrase:

```text
INTELLIGENCE
FOR EFFICIENT RESULTS
```

CTA:

```text
Talk to Us →
```

This is one of the most visually important moments after the opening.

---

# 30. Footer

Footer should retain the cinematic visual language.

Include:

```text
Pragyan ai
Intelligence for Efficient Results

Stay in the loop
[ email input ]

Who We Are
How We Work
Capabilities
Products
Use Cases
Insights
```

Also include:

```text
Privacy
Terms
Contact
© 2026 Pragyan AI. All rights reserved.
```

Keep the footer visually sparse.

---

# 31. Cards

Cards should NOT dominate the design.

Use cards primarily for:

- Case studies
- Products
- Capabilities
- Insights
- Industry use cases

### Card style

```text
Background:
rgba(8, 13, 31, 0.55)

Border:
rgba(160, 175, 220, 0.20)

Radius:
10–16px

Shadow:
soft atmospheric shadow

Hover:
subtle violet/blue illumination
```

Avoid oversized rounded rectangles.

---

# 32. Image Direction

Photography should feel:

- Realistic
- Cinematic
- High contrast
- Dark
- Premium
- Editorial
- Slightly mysterious

Preferred subjects:

- Industrial environments
- Manufacturing
- Data centers
- Modern architecture
- Healthcare environments
- Logistics
- Financial environments
- Human silhouettes
- Mountains / landscapes
- Futuristic but believable technology

Avoid obvious AI stock imagery.

Avoid humanoid robots and cliché glowing brains unless specifically required.

---

# 33. Lighting Direction

Lighting is one of the most important elements of the brand.

Use:

- Violet rim lighting
- Cyan edge lighting
- Blue atmospheric backlight
- Very soft bloom
- Controlled highlights
- Deep shadows

Light sources should often appear to come from the gateway or an intelligent system within the scene.

---

# 34. Particle System Aesthetic

Particles should feel like:

- Intelligent data
- Energy
- Information flow
- Dust illuminated by light
- Digital atmosphere

They should not look like stars or fireworks.

Particle density should increase during major cinematic moments.

---

# 35. Borders and Dividers

Use very thin structural lines.

Preferred:

```text
1px solid rgba(160,175,220,0.16)
```

Dividers should create a technical editorial grid.

Never use thick borders.

---

# 36. Glassmorphism

Glass should be subtle.

Use:

```text
Low opacity
Strong background blur
Low saturation
Thin border
Very soft inner highlight
```

Avoid the "everything is glass" aesthetic.

Glass is an accent, not the primary visual language.

---

# 37. Animation System

The website should eventually be implemented using a robust scroll animation system.

Recommended implementation direction:

```text
React / Next.js
+
GSAP
+
ScrollTrigger
+
Canvas / WebGL / Three.js where appropriate
```

The final implementation should allow scroll position to drive:

- Camera movement
- Scale
- Position
- Opacity
- Blur
- Glow intensity
- Particle speed
- Light rays
- Perspective
- Scene transitions
- Typography choreography

Do not rely only on basic CSS transitions for the cinematic intro.

---

# 38. Performance Principles

The website must still feel fast despite its cinematic visuals.

Priorities:

1. Optimize image dimensions
2. Use modern image formats
3. Lazy-load non-critical imagery
4. Avoid unnecessary DOM animation
5. Prefer transforms and opacity for standard UI motion
6. Use GPU-friendly effects carefully
7. Reduce particle count on weaker devices
8. Respect reduced-motion preferences
9. Avoid huge uncompressed assets
10. Keep the initial viewport lightweight

The opening experience is the highest visual priority and should also receive the highest performance attention.

---

# 39. Responsive Design

### Desktop

Desktop is the primary cinematic presentation.

Use:

- Large compositions
- Wide imagery
- Asymmetric layouts
- Full viewport scenes
- Multi-column editorial layouts

### Tablet

Reduce:

- Typography size
- Horizontal complexity
- Number of simultaneous visual elements

### Mobile

Do not simply shrink the desktop layout.

Recompose scenes.

For the cinematic intro:

- Keep the gateway centered
- Reduce peripheral elements
- Simplify particles
- Simplify navigation
- Preserve the sense of camera movement

The story must remain understandable even if visual complexity is reduced.

---

# 40. Accessibility

Maintain:

- Strong text contrast
- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible CTA labels
- Reduced-motion support

For users who prefer reduced motion, provide a calmer version of the cinematic sequence.

The content and narrative must remain understandable without motion.

---

# 41. Design Hierarchy

Every viewport should have one dominant visual idea.

Priority order:

```text
1. Cinematic image / environment
2. Main headline
3. Primary CTA
4. Supporting copy
5. Secondary navigation
6. Technical decoration
```

Do not let decorative elements compete with the headline.

---

# 42. Anti-Patterns

Do not introduce:

- Generic AI brains
- Robot illustrations
- Generic SaaS dashboards
- Huge gradients covering the whole screen
- Excessive rounded cards
- Excessive glassmorphism
- Rainbow neon
- Cartoon 3D illustrations
- Excessive animations
- Random particle movement
- Bouncy UI
- Dense navigation
- Overly small body text
- Inconsistent glow colors
- Unrelated imagery

The experience should always feel like one coherent world.

---

# 43. Stitch Workflow

Build the project progressively.

Do NOT generate all 15 screens at once.

Recommended order:

```text
1. Establish design system
2. Frame 01 — The Eye
3. Refine Frame 01
4. Frame 02 — The Gate
5. Refine Frame 02
6. Frame 03 — Enter
7. Refine Frame 03
8. Frame 04 — Pass Through
9. Refine Frame 04
10. Validate cinematic continuity
11. Build Frames 05–07
12. Build Frames 08–10
13. Build Frames 11–13
14. Build Frames 14–15
15. Build the Stitch prototype
16. Export to Antigravity
```

Each cinematic frame should be designed as a **keyframe in one continuous scene**.

---

# 44. Stitch Prompting Rules

When generating a frame in Stitch:

- Always refer to the previous frame when continuity matters.
- Keep the same typography and design system.
- Keep the same portal geometry.
- Keep lighting progression consistent.
- Increase/decrease visual intensity deliberately.
- Do not redesign the navigation from scratch.
- Do not change colors arbitrarily.
- Do not introduce new visual styles without purpose.

Example instruction:

> Create Frame 02 as a direct continuation of Frame 01. The camera has physically moved forward. Preserve the gate geometry, lighting language, typography and navigation from Frame 01.

---

# 45. Antigravity Handoff

When the Stitch designs are approved, use them as the visual blueprint for the production implementation.

Antigravity should treat:

```text
Frames 01–04
```

as cinematic keyframes rather than separate pages.

The implementation should create a continuous scroll-controlled timeline.

Conceptually:

```text
scroll progress
      ↓
0.00 — Eye
0.25 — Gate
0.50 — Enter
0.75 — Portal threshold
1.00 — Through
      ↓
Belief section
```

These percentages are conceptual and should be tuned during development.

---

# 46. Core Rule

The single most important rule for the entire project:

> **The website should feel like a story unfolding through intelligence, not a collection of sections describing intelligence.**

The user should feel that they are **entering a world**, then discovering what the company does.

The cinematic opening creates emotion.

The middle sections create understanding.

The proof sections create trust.

The final CTA creates action.
