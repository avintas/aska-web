# Semiotic Content Extraction Guide

## Overview
This document lists all extractable content pieces from a single cell in the `source_content_semiotics` table.

## Database Row Level Fields

### Direct Row Fields
1. **`id`** - Unique record identifier (number)
2. **`idx`** - Index number (number)
3. **`source_content_id`** - Reference to source content (number)
4. **`app_id`** - Application identifier (number)
5. **`created_at`** - Timestamp when record was created (ISO datetime string)
6. **`updated_at`** - Timestamp when record was last updated (ISO datetime string)
7. **`semiotic_analysis`** - JSONB field containing the main content (JSON string/object)

---

## Content Inside `semiotic_analysis` JSONB Field

### Top-Level Fields

#### 1. **`motto`** (string)
- **Path**: `semiotic_analysis.motto`
- **Example**: `"Grit Creates The Game"`
- **Description**: Main motto or tagline
- **Use Case**: Short, memorable brand message

---

### T-Shirt Product Section

#### 2. **`t_shirt_product.vibe`** (string)
- **Path**: `semiotic_analysis.t_shirt_product.vibe`
- **Example**: `"Bold, Resourceful, Underdog"`
- **Description**: Emotional/character descriptors for the product
- **Use Case**: Product categorization, filtering, mood-based displays

#### 3. **`t_shirt_product.slogan`** (string)
- **Path**: `semiotic_analysis.t_shirt_product.slogan`
- **Example**: `"NO ICE? NO PROBLEM."`
- **Description**: Short, punchy slogan for t-shirt product
- **Use Case**: Product display, marketing copy, landing page messages

#### 4. **`t_shirt_product.context`** (string)
- **Path**: `semiotic_analysis.t_shirt_product.context`
- **Example**: `"Celebrates the determination to overcome environmental or resource limitations..."`
- **Description**: Detailed explanation of the slogan's meaning and cultural context
- **Use Case**: Product descriptions, educational content, detailed explanations

---

### Semiotic Analysis Section

#### 5. **`semiotic_analysis.key_symbol`** (string)
- **Path**: `semiotic_analysis.semiotic_analysis.key_symbol`
- **Example**: `"The manufactured 'Mystery, Alaska' environment (trucked-in snow, built town)"`
- **Description**: The primary symbolic element being analyzed
- **Use Case**: Academic/analytical content, deep-dive articles, educational materials

#### 6. **`semiotic_analysis.hidden_meaning`** (string)
- **Path**: `semiotic_analysis.semiotic_analysis.hidden_meaning`
- **Example**: `"The Underdog Myth: The triumph of ingenuity, grit, and collective will..."`
- **Description**: The deeper philosophical or cultural meaning extracted
- **Use Case**: Inspirational content, philosophical discussions, motivational messaging

---

### Greeting Card Product Section

#### 7. **`greeting_card_product.card_front`** (string)
- **Path**: `semiotic_analysis.greeting_card_product.card_front`
- **Example**: `"When the forecast calls for impossible odds..."`
- **Description**: Text for the front of a greeting card
- **Use Case**: Greeting card product display, inspirational messages

#### 8. **`greeting_card_product.card_inside`** (string)
- **Path**: `semiotic_analysis.greeting_card_product.card_inside`
- **Example**: `"...remember that even a small town can make a miracle on ice happen..."`
- **Description**: Text for the inside of a greeting card
- **Use Case**: Greeting card product display, longer-form inspirational content

#### 9. **`greeting_card_product.primary_emotion`** (string)
- **Path**: `semiotic_analysis.greeting_card_product.primary_emotion`
- **Example**: `"Resilience"`
- **Description**: The main emotional theme of the greeting card
- **Use Case**: Emotional categorization, filtering, mood-based organization

---

## Summary Table

| # | Field Path | Type | Example Value | Use Case |
|---|------------|------|---------------|----------|
| 1 | `id` | number | `26` | Record identification |
| 2 | `idx` | number | `6` | Index/ordering |
| 3 | `source_content_id` | number | `1043` | Source reference |
| 4 | `app_id` | number | `1` | Application context |
| 5 | `created_at` | string | `"2026-01-22 15:57:50..."` | Timestamp |
| 6 | `updated_at` | string | `"2026-01-22 15:57:50..."` | Last modified |
| 7 | `motto` | string | `"Grit Creates The Game"` | Brand tagline |
| 8 | `t_shirt_product.vibe` | string | `"Bold, Resourceful, Underdog"` | Product mood |
| 9 | `t_shirt_product.slogan` | string | `"NO ICE? NO PROBLEM."` | Product slogan |
| 10 | `t_shirt_product.context` | string | `"Celebrates the determination..."` | Product description |
| 11 | `semiotic_analysis.key_symbol` | string | `"The manufactured 'Mystery...'"` | Symbolic element |
| 12 | `semiotic_analysis.hidden_meaning` | string | `"The Underdog Myth..."` | Deep meaning |
| 13 | `greeting_card_product.card_front` | string | `"When the forecast calls..."` | Card front text |
| 14 | `greeting_card_product.card_inside` | string | `"...remember that even..."` | Card inside text |
| 15 | `greeting_card_product.primary_emotion` | string | `"Resilience"` | Emotional theme |

---

## Content Categories

### Short-Form Content (for displays, headers, CTAs)
- `motto`
- `t_shirt_product.slogan`
- `greeting_card_product.card_front`

### Medium-Form Content (for descriptions, explanations)
- `t_shirt_product.context`
- `greeting_card_product.card_inside`
- `semiotic_analysis.key_symbol`

### Long-Form Content (for articles, deep dives)
- `semiotic_analysis.hidden_meaning`

### Metadata (for organization, filtering)
- `t_shirt_product.vibe`
- `greeting_card_product.primary_emotion`
- `id`, `source_content_id`, `created_at`, `updated_at`

---

## Current Implementation Status

### Currently Extracted
- ✅ `t_shirt_product.slogan` (used on landing page)
- ✅ `motto` (fallback option)

### Available but Not Yet Extracted
- ⚪ `t_shirt_product.vibe`
- ⚪ `t_shirt_product.context`
- ⚪ `semiotic_analysis.key_symbol`
- ⚪ `semiotic_analysis.hidden_meaning`
- ⚪ `greeting_card_product.card_front`
- ⚪ `greeting_card_product.card_inside`
- ⚪ `greeting_card_product.primary_emotion`

---

## Potential Use Cases

1. **Landing Page Rotation**: Rotate between `motto`, `t_shirt_product.slogan`, and `greeting_card_product.card_front`
2. **Product Pages**: Use `t_shirt_product.*` fields for t-shirt product displays
3. **Greeting Card Pages**: Use `greeting_card_product.*` fields for card displays
4. **Educational Content**: Use `semiotic_analysis.*` fields for deeper analysis pages
5. **Filtering/Organization**: Use `vibe` and `primary_emotion` for categorization
6. **Inspirational Content**: Use `hidden_meaning` for motivational sections
