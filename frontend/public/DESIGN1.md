---
name: PeopleBot Light
colors:
  surface: '#f9f9ff'
  surface-dim: '#d1daee'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#e0e8fd'
  surface-container-highest: '#dae3f7'
  on-surface: '#131c2a'
  on-surface-variant: '#3b4949'
  inverse-surface: '#283140'
  inverse-on-surface: '#ecf1ff'
  outline: '#6b7a79'
  outline-variant: '#bacac9'
  surface-tint: '#006a6a'
  primary: '#006a6a'
  on-primary: '#ffffff'
  primary-container: '#00d4d4'
  on-primary-container: '#005757'
  inverse-primary: '#22dcdc'
  secondary: '#585f66'
  on-secondary: '#ffffff'
  secondary-container: '#dce3eb'
  on-secondary-container: '#5e656c'
  tertiary: '#b6212a'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffa8a3'
  on-tertiary-container: '#9d081b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#54f9f9'
  primary-fixed-dim: '#22dcdc'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f4f'
  secondary-fixed: '#dce3eb'
  secondary-fixed-dim: '#c0c7cf'
  on-secondary-fixed: '#151c22'
  on-secondary-fixed-variant: '#40484e'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#930016'
  background: '#f9f9ff'
  on-background: '#131c2a'
  surface-variant: '#dae3f7'
typography:
  headline-xl:
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
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  container-margin: 32px
  gutter: 24px
---

## Brand & Style

The design system embodies a friendly, high-performance professional atmosphere tailored for human-centric AI interactions. Drawing inspiration from modern Apple-inspired aesthetics, the UI prioritizes clarity, generous whitespace, and a sense of "digital air." 

The style is **Corporate / Modern** with a lean toward **Glassmorphism** for navigational elements. It avoids the coldness of traditional enterprise software by using soft blue ambient gradients and vibrant cyan accents, creating an environment that feels intelligent yet approachable. The target audience includes modern teams and individuals who value efficiency and high-quality craft in their digital tools.

## Colors

The palette is anchored by a high-energy **Cyan** primary color, used for key actions and brand presence. The background strategy utilizes a base of pure white (`#FFFFFF`) layered over soft, organic gradients of **#F0F7FF** to provide depth without clutter.

- **Primary (#00D4D4):** High-impact actions, toggle states, and active indicators.
- **Secondary / Surface (#F0F7FF):** Subtle background fills and section delimiters.
- **Text / Neutral (#07101E):** Deep navy for maximum legibility and professional weight.
- **Accent (#FF5757):** Reserved for notifications, critical alerts, or minor decorative highlights to provide a warm counter-point to the cool cyan.

## Typography

This design system exclusively utilizes **Inter**, a typeface designed for screens, to maintain a systematic and utilitarian feel that remains highly readable. 

Hierarchy is established through weight and slight negative letter-spacing on larger headlines to give them a "tight," editorial look. Body text should always use the `neutral` deep navy for optimal contrast. For mobile devices, headline sizes scale down to prevent awkward line breaks while maintaining the same weight and character.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop (1280px max-width) and a **Fluid Grid** for mobile devices. 

- **Desktop:** 12-column grid with 24px gutters and 40px+ margins to emphasize the minimalist, premium feel.
- **Mobile:** 4-column grid with 16px gutters and 20px margins.
- **Rhythm:** An 8px base unit governs all spatial relationships. Components are separated by "large" (24px) or "extra-large" (40px) increments to ensure the UI feels uncrowded and professional.

## Elevation & Depth

Visual hierarchy is managed through **Ambient Shadows** and **Tonal Layers**. 

1.  **Level 0 (Base):** Soft blue gradients (`#F0F7FF`) create the floor of the application.
2.  **Level 1 (Cards/Surfaces):** Pure white surfaces with a very soft, diffused shadow (0px 4px 20px rgba(7, 16, 30, 0.04)).
3.  **Level 2 (Modals/Popovers):** Higher elevation with a more pronounced shadow (0px 12px 40px rgba(7, 16, 30, 0.08)) and a backdrop blur (20px) on the element below to simulate glass.

Outlines are rarely used; depth is primarily communicated through subtle shifts in surface color and soft-light shadows.

## Shapes

The design system uses a **Rounded** shape language to maintain its friendly and approachable persona. 

- **Standard Elements:** 0.5rem (8px) radius for buttons, inputs, and small widgets.
- **Large Elements:** 1rem (16px) radius for cards and containers.
- **Extra Large:** 1.5rem (24px) radius for featured hero sections or large modals.

This consistent rounding mirrors the hardware aesthetics of high-end consumer electronics and softens the "technical" nature of an AI bot.

## Components

### Buttons
- **Primary:** Solid Cyan (`#00D4D4`) with white text. High-contrast, bold weight.
- **Secondary:** White background with a subtle border and Cyan text.
- **Tertiary:** Ghost style, no background, Cyan text, becoming slightly tinted on hover.

### Inputs
- **Text Fields:** White background, 1px border (`#E1E8F0`), rounding of 8px. On focus, the border transitions to Cyan with a 3px soft outer glow.
- **Labels:** Positioned above the field in `label-md` style using the deep navy color.

### Cards
- **Standard Card:** Pure white, 16px rounded corners, ambient shadow. No border. Padding should be generous (24px or 32px).

### Chips & Badges
- **Status Chips:** Small, 100px rounded (pill), using a 10% opacity version of the primary or accent color for the background and 100% opacity for the text.

### Selection Controls
- **Checkboxes/Radios:** Cyan when active. Checkboxes should have a 4px corner radius even within the "Rounded" system for a modern touch.