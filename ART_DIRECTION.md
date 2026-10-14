# Art direction

## Thesis

**Signal over noise.** The site is a quiet black page where things only move when
they mean something. Everything visual is made of two materials, and nothing else:

1. **Dots**: a duotone halftone, white on black. Dots are the site's imagery and
   its surfaces. The hero footage is rendered as dots, page transitions are dots
   growing until they cover the screen, a hovered row fills with dots, the
   contact panel opens as dots, the footer wordmark is built from dots.
2. **Decoding text**: the scramble. Every piece of text that moves does it by
   decoding: links and pills on hover, labels in transitions, headings as they
   scroll into view, diagram labels as they draw.

If an effect is neither dots nor decoding text, it doesn't belong.

## Colour

Monochrome only. `#0a0a0a` and white, plus white at reduced opacity for hierarchy
(`/60` secondary, `/40` tertiary, `/25` rules). Emphasis comes from **inversion**
(white surface, black text), never from a hue.

## Type

- Display: Druk Wide, uppercase, tight leading. Titles, the wordmark, labels in
  transitions. Never for running text.
- Text: Inter. Light for long reading, bold for links and actions.
- Labels: Inter, `text-xs`, wide tracking, in `[BRACKETS]` or `"QUOTES"`.

## Motion

| Thing         | Motion                                                                  |
| ------------- | ----------------------------------------------------------------------- |
| Text on hover | Scramble, ~0.45 s, chars drawn from the text itself                     |
| Text entering | Scramble from nothing, or masked line rise for large display type       |
| Surfaces      | Dots growing from an origin (the pointer, or an edge), per-cell stagger |
| Movement      | The `azl` ease (`M0,0 C0.82,0.08 0.29,1 1,1`)                           |

Rules: one origin per gesture (dots grow from where the pointer is); exits mirror
entrances; nothing moves for `prefers-reduced-motion`, everything is still legible.

## Content

Works are written up as articles, Codrops style. Each one opens with an
"In short" summary and a diagram, so a skimming reader gets the point in ten
seconds; the body is for the reader who stays. Client and employer names never
appear.
