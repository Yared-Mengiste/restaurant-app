# Design System: The Culinary Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Maître d'"**

This design system is built to evoke the hushed, intentional atmosphere of a Michelin-starred dining room. We are moving away from the "grid-heavy" look of template-based restaurant sites. Instead, we embrace **Organic Asymmetry** and **Editorial Layering**. 

The "Digital Maître d'" approach means the UI should feel like it is guiding the guest through an experience rather than just presenting a menu. We achieve this by breaking the rigid 12-column grid with overlapping high-quality imagery, generous breathing room (using our `20` and `24` spacing tokens), and a "depth-first" philosophy where elements float in a dark, atmospheric space rather than being boxed in.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, nocturnal foundation (`#111316`) accented by the warmth of candlelight (`primary: #f8c927`).

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. They feel clinical and cheap. Boundaries must be defined through:
*   **Background Shifts:** Use `surface-container-low` for a hero section and transition into `surface` for the menu.
*   **Tonal Transitions:** A 100px vertical gradient transition between `surface` and `surface_container_highest` creates a natural, soft horizon line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, premium materials.
*   **Base Level:** `surface` (#111316) - The vast, dark restaurant floor.
*   **Secondary Level:** `surface_container_low` (#1a1c1f) - Inset sections like footers or secondary sidebars.
*   **Highest Level:** `surface_container_highest` (#333538) - Floating cards or interactive elements that need to "catch the light."

### The "Glass & Gradient" Rule
To mimic the reflection of fine glassware, floating elements should utilize **Glassmorphism**. Apply `surface_variant` at 40% opacity with a `backdrop-blur` of 20px. For primary CTAs, do not use flat colors; use a subtle linear gradient from `primary` (#f8c927) to `primary_container` (#d9ae00) to give the button a "glowing" amber soul.

---

## 3. Typography: The Editorial Voice
We pair the authoritative weight of **Noto Serif** with the functional precision of **Manrope**.

*   **Display & Headline (Noto Serif):** Use these for "The Hook." Titles like "The Tasting Menu" or "Our Heritage" should use `display-lg`. This font represents the history and prestige of the establishment.
*   **Body & Labels (Manrope):** Use these for information. Descriptions of ingredients or operational hours use `body-md`. It provides a clean, legible contrast to the high-drama serif.
*   **The Hierarchy Rule:** Never use two different Serif scales next to each other. Pair a `headline-lg` (Serif) with a `title-sm` (Sans-Serif) to create a clear, professional distinction between "Atmosphere" and "Data."

---

## 4. Elevation & Depth
In this design system, shadows are light, not darkness.

*   **The Layering Principle:** Place a `surface_container_lowest` (#0c0e11) element inside a `surface_container_high` (#282a2d) area to create an "etched" or "carved" look.
*   **Ambient Shadows:** For floating reservation modals, use a shadow with a 40px blur, 0px offset, and 6% opacity of `on_surface`. This creates a soft, natural glow rather than a harsh drop shadow.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility on form inputs, use `outline_variant` (#4d4635) at **20% opacity**. It should be felt, not seen.
*   **Large-Scale Rounding:** Use `rounded-xl` (3rem) for image containers and main cards. The large radius suggests softness and organic hospitality.

---

## 5. Components

### Buttons
*   **Primary:** Gradient (`primary` to `primary_container`), `rounded-full`, `label-md` uppercase with 0.05em letter spacing.
*   **Secondary:** Ghost style. `outline` color for text, no background, 10% `outline-variant` for a very subtle border.
*   **Hover State:** Increase the `backdrop-blur` on glass buttons or increase the brightness of the primary gradient by 10%.

### Cards & Menu Items
*   **Rule:** Forbid divider lines between menu items.
*   **Implementation:** Use the Spacing Scale `6` (2rem) between items. To separate a dish name from its price, use a simple `body-md` (Sans) for the price and `title-lg` (Sans) for the dish name. Use a subtle background shift to `surface_container_low` on hover to define the interactive area.

### Input Fields (Reservations)
*   **Style:** Minimalist. No background box. Just a `surface_variant` bottom-border (2px). On focus, the border animates to `primary`. 
*   **Error State:** Use `error` (#ffb4ab) for the text and a 1px `error_container` border.

### Interactive Chips
*   **Selection:** Used for dietary filters (Vegan, Gluten-Free). Use `secondary_container` for the background and `on_secondary_container` for the text. Use `rounded-md` (1.5rem).

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins. A hero image can be offset to the right by `12` while the text is offset to the left by `24`.
*   **Do** use "Editorial Breathing Room." If a section feels crowded, double the white space. High-end equals luxury of space.
*   **Do** use `primary` (Gold) sparingly. It is a garnish, not the main course. Only use it for the absolute most important Action on the page.

### Don't:
*   **Don't** use pure black (#000000). It kills the depth. Always use the `background` (#111316) or `surface` tokens.
*   **Don't** use 1px solid dividers. Use a `3.5` (1.2rem) gap or a tonal shift instead.
*   **Don't** use high-contrast shadows. If the shadow looks like a shadow, it’s too dark. It should look like "ambient occlusion."
*   **Don't** use standard "Small" corners. We are using `lg` (2rem) and `xl` (3rem) to maintain a soft, welcoming, and bespoke feel.