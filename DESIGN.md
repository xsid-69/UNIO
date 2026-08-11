---
name: UNIO
description: A fresh academic reading room for university students.
colors:
  canvas: "#07101F"
  surface: "#0D1A2D"
  surface-raised: "#162942"
  ink: "#F6F8FC"
  ink-muted: "#AAB8CB"
  primary: "#62DFCF"
  primary-ink: "#041714"
  accent: "#91B8FF"
  warm: "#F2C779"
  danger: "#FF9B9B"
typography:
  display: { fontFamily: "Newsreader, Georgia, serif", fontSize: "4rem", fontWeight: 600, lineHeight: 0.96, letterSpacing: "-0.04em" }
  headline: { fontFamily: "Manrope, sans-serif", fontSize: "2rem", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.025em" }
  body: { fontFamily: "Manrope, sans-serif", fontSize: "0.9375rem", fontWeight: 400, lineHeight: 1.65 }
rounded: { sm: "9px", md: "13px", lg: "20px" }
---
# Design System: UNIO

## Creative North Star: The Modern Academic Reading Room
UNIO should feel like a contemporary university reading room after hours: deep academic ink, warm editorial headings, clear document surfaces, and fresh cyan guidance. It is a study product—not a marketing dashboard.

## Hierarchy and Alignment
The desktop shell uses a stable 246px navigation rail and a centered 1240px content column. Page headers share one baseline, section spacing follows a consistent vertical rhythm, and mobile surfaces align to 15px gutters. Course context stays visible near subjects and documents.

## Color
Navy surfaces reduce glare while preserving blue-toned separation. Cyan is the reading signal for current location, focus, and primary action. Reference blue supports academic metadata; warm amber is reserved for study principles. No lime, purple gradients, or decorative neon.

## Typography
Manrope handles product UI and long-form clarity. Newsreader is used selectively for editorial study moments, major home messaging, and library titles. Dense document controls remain compact and tabular.

## Components and Readers
Controls are at least 44px, use 9–13px radii, and expose keyboard focus. Cards are task-oriented rather than decorative. PDFs open inline by default; readers prioritize document selection, pagination, zoom, and fullscreen. Every active reader also provides download and open-in-new-tab actions, with a native browser fallback when the enhanced renderer is unavailable.

## Motion and Accessibility
Lenis and GSAP preserve context without delaying access. Reduced motion restores native scrolling and removes choreography. Contrast, labels, focus states, keyboard operation, and honest loading/error states remain mandatory.

## Avoid
- Oversized SaaS marketing heroes and repetitive bento cards.
- Fake settings, unsupported actions, and hidden PDF failures.
- Excessive glass blur, giant radii, gradient text, emoji icons, or motion without purpose.
