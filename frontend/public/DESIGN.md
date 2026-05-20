---
name: Lumina HR
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#bacac9'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#859493'
  outline-variant: '#3b4949'
  surface-tint: '#22dcdc'
  primary: '#48f1f0'
  on-primary: '#003737'
  primary-container: '#00d4d4'
  on-primary-container: '#005757'
  inverse-primary: '#006a6a'
  secondary: '#ffb3af'
  on-secondary: '#68000d'
  secondary-container: '#970017'
  on-secondary-container: '#ff9e99'
  tertiary: '#d1dbef'
  on-tertiary: '#273140'
  tertiary-container: '#b5bfd3'
  on-tertiary-container: '#444e5e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#54f9f9'
  primary-fixed-dim: '#22dcdc'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f4f'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3af'
  on-secondary-fixed: '#410005'
  on-secondary-fixed-variant: '#930016'
  tertiary-fixed: '#d9e3f7'
  tertiary-fixed-dim: '#bdc7db'
  on-tertiary-fixed: '#121c2b'
  on-tertiary-fixed-variant: '#3d4758'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system embodies a **Precision Minimalist** aesthetic, tailored for a high-fidelity AI HR experience. It balances the authoritative nature of enterprise SaaS with the fluid, forward-thinking energy of modern artificial intelligence. 

The visual narrative is built on "Dark Fidelity"—using deep, light-absorbing surfaces contrasted against razor-sharp glowing accents. This creates a focused environment that reduces cognitive load while maintaining a premium, "pro-tool" feel reminiscent of Linear’s utility and Notion’s structural clarity. The emotional response is one of trust, technical sophistication, and effortless intelligence.

## Colors
The palette is rooted in **Deep Navy (#07101E)**, which serves as the canvas for the entire system. 

- **Primary (Cyan Glow):** Used for AI-driven actions, progress indicators, and active states. It represents the "intelligence" layer.
- **Secondary (Coral Highlight):** Reserved for critical alerts, human-centric notifications, and secondary call-to-outs.
- **Surface & Glass:** Surface layers utilize a semi-transparent version of the navy base with a backdrop blur (12px–20px) and a subtle 1px border (#FFFFFF10) to create depth without heaviness.
- **Accents:** Use gradients sparingly, primarily blending Primary Cyan into a deep transparent navy to signify "AI Activity."

## Typography
This design system utilizes **Inter** exclusively to ensure maximum legibility and a systematic, technical feel. 

Headings should employ tighter letter-spacing (`-0.01em` to `-0.02em`) to enhance the "premium tool" aesthetic. Body text remains at default tracking for accessibility. Use `Font Weight 600` for hierarchy in UI labels and `Weight 400` for long-form data or descriptions. The contrast between high-weight headings and low-weight, dim-colored metadata (using the Neutral palette) is essential for the "Linear-like" information density.

## Layout & Spacing
The layout follows a **Hybrid Grid** model. Dashboards and data-heavy views use a 12-column fixed-width grid (max-width 1440px) to maintain information density. Chat interfaces and AI assistant panels follow a fluid, centered model with generous safe-area margins.

A strict 4px/8px baseline grid is used for all internal component spacing. Vertical rhythm is maintained by using `spacing.xl` (40px) between major sections and `spacing.md` (16px) between related content cards. On mobile, the 12-column grid collapses to a single-column stack with 16px margins, while the horizontal "Glass" navigation bar remains pinned to the bottom for ergonomic reach.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Glassmorphism**, rather than traditional heavy shadows.

- **Level 0 (Background):** Solid #07101E.
- **Level 1 (Cards/Panels):** Surface color with a 1px #FFFFFF08 border.
- **Level 2 (Modals/Popovers):** Surface color with backdrop-blur (20px), a subtle Cyan glow (0px 4px 20px #00D4D415), and a 1px #FFFFFF15 border.
- **AI Focus:** Active AI elements or focused input fields use a "Glow Border" effect—a thin CSS gradient border that transitions from Cyan to transparent.

Shadows, when used, are extremely diffused and tinted with the Navy background color to avoid a "dirty" look on dark surfaces.

## Shapes
The shape language is sophisticated and modern. 

- **Containers:** Standard cards and containers use `rounded-lg` (16px) to maintain a soft but professional look. 
- **Buttons & Inputs:** Use `rounded-md` (8px) for a more precise, functional feel.
- **Tags & Status:** Use full pill-shaped rounding to distinguish them from interactive buttons.
- **AI Avatars:** Should always be circular or use a unique "squircle" shape to signify the AI's presence within the rectangular grid of the SaaS environment.

## Components

- **Buttons:** Primary buttons are Cyan Glow with dark text. Secondary buttons are ghost-style with a 1px #FFFFFF15 border and subtle hover state that increases background opacity.
- **Inputs:** Darker than the surface level, with 1px borders. On focus, the border transitions to Primary Cyan with a 2px outer soft glow.
- **Glass Cards:** Used for the primary dashboard widgets. They feature a 20px blur and a subtle top-to-bottom gradient (transparent to #FFFFFF05).
- **Chips/Status:** Use low-opacity background fills of the status color (e.g., #FF575720 for "Action Required") with solid text of the same color.
- **AI Assistant Panel:** A persistent or slide-in glass panel with a distinct "Glow" header. Use micro-animations (pulse) on the Cyan primary color to indicate the AI is processing information.
- **Lists:** Clean, borderless rows separated by subtle 1px horizontal lines (#FFFFFF05). High-contrast icons (Primary Cyan) used for bullet points or action triggers.