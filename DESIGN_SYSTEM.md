# Elvira App Design System

## Overview

This document outlines the design system for the Elvira App, inspired by Airbnb's modern and user-friendly approach. The system ensures consistency across all UI components and screens.

## 🎨 Colors

### Brand Colors

- **Primary**: `#FF5A5F` (Coral Red) - Main brand color, used for CTAs and highlights
- **Secondary**: `#00A699` (Teal) - Supporting brand color, used for accents

### Background Colors

- **Background**: `#FFFFFF` - Main app background
- **Background Secondary**: `#F8F9FA` - Card backgrounds, secondary surfaces
- **Surface**: `#FFFFFF` - Component backgrounds

### Text Colors

- **Text Primary**: `#1A1A1A` - Primary text color
- **Text Secondary**: `#717171` - Secondary text, descriptions
- **Text Tertiary**: `#B0B0B0` - Placeholder text, disabled states
- **Text Inverse**: `#FFFFFF` - Text on dark backgrounds

### Semantic Colors

- **Success**: `#00D4AA` - Success states, confirmations
- **Warning**: `#FFB400` - Warnings, caution states
- **Error**: `#FF385C` - Errors, destructive actions
- **Info**: `#0070F3` - Information, links

### Gray Scale

- **Gray 50**: `#FAFAFA` - Lightest gray
- **Gray 100**: `#F5F5F5`
- **Gray 200**: `#EEEEEE`
- **Gray 300**: `#E0E0E0`
- **Gray 400**: `#BDBDBD`
- **Gray 500**: `#9E9E9E`
- **Gray 600**: `#757575`
- **Gray 700**: `#616161`
- **Gray 800**: `#424242` - Darkest gray

## 📝 Typography

### Font Families

- **Primary**: System font stack optimized per platform
  - iOS: `-apple-system, BlinkMacSystemFont`
  - Android: `Roboto`
- **Secondary**: Readable body text font stack

### Font Sizes

- **Display 1**: 57px - Hero headlines
- **Display 2**: 45px - Large display text
- **Display 3**: 36px - Medium display text
- **H1**: 32px - Main headings
- **H2**: 28px - Section headings
- **H3**: 24px - Subsection headings
- **H4**: 20px - Minor headings
- **Body Large**: 18px - Large body text
- **Body**: 16px - Standard body text
- **Body Small**: 14px - Small body text
- **Button**: 16px - Button labels
- **Caption**: 12px - Captions, helper text
- **Overline**: 10px - Tags, labels

### Font Weights

- **Regular**: 400 - Standard text
- **Medium**: 500 - Slightly emphasized text
- **Semi Bold**: 600 - Subheadings, button text
- **Bold**: 700 - Headings, strong emphasis

### Pre-built Text Styles

Use `TEXT_STYLES` from `@constants/typography` for consistency:

- `TEXT_STYLES.h1`, `TEXT_STYLES.h2`, `TEXT_STYLES.h3`
- `TEXT_STYLES.body`, `TEXT_STYLES.bodyLarge`, `TEXT_STYLES.bodySmall`
- `TEXT_STYLES.button`, `TEXT_STYLES.buttonLarge`, `TEXT_STYLES.buttonSmall`
- `TEXT_STYLES.caption`, `TEXT_STYLES.label`

## 📏 Spacing

### Spacing Scale (8px grid system)

- **xs**: 4px - Minimal spacing
- **sm**: 8px - Small spacing
- **md**: 16px - Medium spacing (base unit)
- **lg**: 24px - Large spacing
- **xl**: 32px - Extra large spacing
- **xxl**: 40px - Double extra large
- **xxxl**: 48px - Triple extra large

### Usage Guidelines

- Use consistent spacing units from the scale
- Maintain vertical rhythm with 8px grid
- Apply proper spacing between related elements

## 🔲 Layout & Components

### Border Radius

- **xs**: 2px - Small elements
- **sm**: 4px - Buttons, small cards
- **md**: 8px - Cards, inputs
- **lg**: 12px - Large cards, modals
- **xl**: 16px - Hero elements
- **full**: 9999px - Circular elements

### Shadows

- **Subtle**: Very light shadow for minimal elevation
- **Small**: Standard card shadow
- **Medium**: Modal and floating element shadow
- **Large**: High-elevation shadow for important elements

### Button Variants

#### Primary Button

- Background: `COLORS.primary`
- Text: `COLORS.textInverse`
- Used for main actions

#### Secondary Button

- Background: `COLORS.surface`
- Border: `COLORS.border`
- Text: `COLORS.textPrimary`
- Used for secondary actions

#### Outline Button

- Background: Transparent
- Border: `COLORS.primary`
- Text: `COLORS.primary`
- Used for less prominent actions

#### Ghost Button

- Background: Transparent
- Text: `COLORS.textPrimary`
- Used for subtle actions

#### Danger Button

- Background: `COLORS.error`
- Text: `COLORS.textInverse`
- Used for destructive actions

### Input Variants

#### Default Input

- Background: `COLORS.surface`
- Border: `COLORS.border`
- Focused border: `COLORS.primary`

#### Filled Input

- Background: `COLORS.backgroundSecondary`
- No border
- Minimal style for dense layouts

#### Outlined Input

- Transparent background
- Border: `COLORS.border`
- Clean, outlined appearance

## 🎯 Usage Examples

### Importing the Design System

```javascript
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";
import { componentThemes } from "@constants/theme";
```

### Using Text Styles

```javascript
<Text style={TEXT_STYLES.h1}>Heading Text</Text>
<Text style={TEXT_STYLES.body}>Body text content</Text>
<Text style={TEXT_STYLES.caption}>Caption or helper text</Text>
```

### Using Colors

```javascript
<View style={{ backgroundColor: COLORS.primary }}>
  <Text style={{ color: COLORS.textInverse }}>
    White text on primary background
  </Text>
</View>
```

### Using Components

```javascript
<Button
  title="Primary Action"
  variant="primary"
  size="medium"
  onPress={handlePress}
/>

<Input
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>
```

## 🎨 Theme Configuration

The app supports theme configuration through `@constants/theme`:

- Light theme (default)
- Dark theme support (ready for implementation)
- Component-specific theme variants
- Consistent styling across the app

## 📱 Responsive Design

### Breakpoints

- **xs**: 0px - Mobile (default)
- **sm**: 576px - Large mobile
- **md**: 768px - Tablet
- **lg**: 992px - Desktop
- **xl**: 1200px - Large desktop

## ⚡ Animation Guidelines

### Timing

- **Fast**: 200ms - Micro-interactions
- **Normal**: 300ms - Standard transitions
- **Slow**: 500ms - Complex animations

### Easing

- Use `ease-out` for entering elements
- Use `ease-in` for exiting elements
- Use `ease-in-out` for bi-directional animations

## 🛠️ Maintenance

### Adding New Colors

1. Add color to `@constants/colors`
2. Update theme configuration if needed
3. Document the color usage

### Adding New Typography

1. Add font size to `FONT_SIZES`
2. Create text style in `TEXT_STYLES`
3. Update this documentation

### Component Updates

1. Use existing design tokens
2. Follow established patterns
3. Test across different screen sizes
4. Ensure accessibility compliance

## 📋 Checklist for New Components

- [ ] Uses design system colors
- [ ] Uses typography scale
- [ ] Follows spacing guidelines
- [ ] Implements proper shadows/borders
- [ ] Supports different variants/sizes
- [ ] Accessible (proper contrast, touch targets)
- [ ] Responsive design considerations
- [ ] Consistent with existing patterns

---

_This design system is inspired by Airbnb's approach to creating modern, user-friendly interfaces while maintaining consistency and scalability._
