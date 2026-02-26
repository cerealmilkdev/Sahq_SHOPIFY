# Sahq — Project Rules

## Language
- All code, schema labels, comments, and UI strings are written in **English only**.
- No French, no mixed language.

## i18n / Translations
- **No i18n**. Do not use `t:` translation keys anywhere — not in `{% schema %}`, not in Liquid templates.
- Write all labels, headers, info, and UI strings as plain English strings directly in the schema or template.
- The `locales/` files are considered legacy. Do not add new entries to them.

## Schema conventions
- `"label"`: short, title-case English string (e.g. `"Background Color"`, `"Show Timer"`)
- `"content"` on `type: header`: short section title (e.g. `"Style"`, `"Timer"`, `"Layout"`)
- `"info"`: plain English description when needed
- `"name"` on presets/blocks: plain English (e.g. `"Banner"`, `"Item"`)
