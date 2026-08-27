# Project Spec — Guided Cybercrime Complaint Assistant

## 1. What this is

A guided, plain-language front-end that sits in front of the National Cyber Crime Reporting Portal's (cybercrime.gov.in) Financial Fraud complaint flow. It does not touch the live government system. It replaces a long bureaucratic form with a one-question-at-a-time conversation, then produces the same information the real portal asks for, so a non-tech-savvy, non-English-fluent victim can get through it without help.

**Primary user:** someone who has just lost money to a UPI/banking scam, is not fluent in English, and does not know terms like "UTR number" or "transaction ID."

**Scope for this build:** Financial Fraud category only. Languages: English, Hindi, Malayalam. Submission at the end is mocked and clearly labeled as a prototype — it does not file anything with the real government system.

**Hackathon constraint:** this must be built using Copilot with a meaningful, real dependency on an OpenAI model (not just autocomplete). The AI model should be doing real work in the product — narrative drafting from voice, screenshot data extraction, classification — not decoration.

---

## 2. Design principles

1. **One question per screen.** Never show two decisions at once. Every screen has a single clear task.
2. **No jargon without explanation.** If a government-required term (UTR, transaction ID) must appear, explain it in one plain sentence right there, don't assume prior knowledge.
3. **Standard, boring, trustworthy — not decorative.** This is a safety tool for someone in distress. No glassmorphism, no frosted panels, no gradient mesh backgrounds, no novelty transitions. Flat surfaces, clear borders, solid colors, generous whitespace.
4. **Big, forgiving touch targets.** Assume the user may be older, stressed, and using a low-end phone. Buttons and inputs should be large and hard to mis-tap.
5. **Font follows language, automatically.** Never a single global font. Switching language switches the typeface to whatever correctly renders that script — see Section 3 and Section 7. A language with no matching serif font chosen shouldn't be added to the registry.
6. **Always show where they are and let them go back.** A visible step indicator and a persistent back button on every screen except the first.
7. **Urgency before paperwork.** The very first screen for a financial fraud flow surfaces the 1930 helpline prominently, before anything else — the complaint form is not the highest-leverage action in the first hour, calling is.
8. **Never dead-end.** Every screen has a way forward: answer, skip (if optional), or get help understanding the question (a plain-language "what does this mean?" affordance).

**One honest caution on the typography choice below:** DM Serif Display is a display face — designed for short headlines, not dense body text. At small sizes it can hurt legibility for exactly the kind of user this product is for (older, possibly straining to read a phone screen, possibly not comfortable reading English). If you use it throughout as instructed, compensate hard: larger base font sizes than you'd normally use, generous line-height, and no thin/light weight anywhere. Reserve it at its most decorative for headings; keep body copy at bigger sizes than a typical app.

---

## 3. Visual design system

### Typography
```css
--font-primary: 'DM Serif Display', Georgia, serif;
```
**This value is not fixed — it switches with the active language.** `--font-primary` is set at runtime by `LanguageService` from the active entry's `fontStack` in the language registry (Section 7), not hardcoded in CSS. English uses DM Serif Display/Georgia; Hindi uses Noto Serif Devanagari; Malayalam uses Noto Serif Malayalam. Every future language added to the registry must specify a script-appropriate serif font in the same way — never let a new language fall through to a font that can't render its script.

| Language | `fontStack` |
|---|---|
| English (en) | `'DM Serif Display', Georgia, serif` |
| Hindi (hi) | `'Noto Serif Devanagari', serif` |
| Malayalam (ml) | `'Noto Serif Malayalam', serif` |

- Whichever font is active, use it throughout that language's UI — headings, body, buttons, form labels. No secondary sans-serif mixed in, regardless of language.
- Minimum body text size: 18px (larger than typical web default — compensates for serif-at-small-sizes legibility loss).
- Headings: 28–36px.
- Line-height: 1.5 minimum for body text, 1.3 for headings.
- Avoid font-weight below 400 anywhere; DM Serif Display only ships as regular/italic, so lean on size and color for hierarchy, not weight.

### Color system — light theme (primary), dark theme scaffolded

Build every color as a CSS variable from day one, even though only light theme ships for the demo. This costs nothing now and means dark mode is a variable swap later, not a rebuild.

```css
:root {
  /* Light theme (active) */
  --color-bg: #FDFCF9;
  --color-surface: #FFFFFF;
  --color-border: #E4E0D8;
  --color-text-primary: #1F1B16;
  --color-text-secondary: #5B564C;
  --color-accent: #B34700;        /* warm, trustworthy, not alarming red */
  --color-accent-contrast: #FFFFFF;
  --color-urgent: #C1121F;        /* reserved ONLY for the 1930 call-now element */
  --color-success: #2F6B3A;
  --color-focus-ring: #1F1B16;
}

[data-theme="dark"] {
  /* Placeholder — not built for the demo, wired up for later */
  --color-bg: #1A1815;
  --color-surface: #242220;
  --color-border: #3A362F;
  --color-text-primary: #F4F1EA;
  --color-text-secondary: #B9B3A6;
  --color-accent: #E08A4F;
  --color-accent-contrast: #1A1815;
  --color-urgent: #E5484D;
  --color-success: #5FA86A;
  --color-focus-ring: #F4F1EA;
}
```

Rules:
- `--color-urgent` is reserved exclusively for the 1930 call-to-action. Never reuse it for error states or anything else — it must stay meaningfully distinct.
- No gradients. No blur/backdrop-filter. No translucent surfaces. Every surface is a flat, opaque `--color-surface` on `--color-bg`.
- Shadows, if used at all: one subtle flat drop shadow for the active card, nothing else.

### Layout & components
- Single-column, centered content, max-width ~600px even on desktop — this is a mobile-first, one-task-at-a-time product, not a dashboard.
- One card per screen containing: step indicator, the question, the input control, and a single primary action button.
- Buttons: full-width or near full-width, minimum 52px height.
- Select/multiple-choice questions render as a vertical list of large tappable option cards, not a dropdown — dropdowns hide options from someone unsure what they're choosing between.
- Voice input control: one big mic button, clear recording state (visual + text, not just a color change — don't rely on color alone), transcript shown back to the user before they confirm.
- Photo input: camera-first (not "choose file"), immediate preview, always show what the AI extracted and let the user confirm/edit it before moving on. Never silently trust an extraction.

---

## 4. UX flow — screen by screen

1. **Language select.** Three large options: English / हिन्दी / മലയാളം. No nested menus.
2. **Urgency screen.** "If money was just taken, call 1930 now." Large tap-to-call button. Secondary option: "Continue to file a complaint" (not gated behind the call — both are always available).
3. **What happened? (open capture).** One prompt: "Tell us what happened — type, speak, or send a photo of the message." This is the single richest input; an OpenAI model turns it into a first-pass classification + draft narrative.
4. **Confirm classification.** Show the model's guess ("This sounds like a UPI payment fraud — is that right?") as a select-style confirm/correct screen, not a free menu of 20 subcategories.
5. **Incident date & time.** One question, one input (date/time picker, large touch targets).
6. **Transaction details.** Ask for a screenshot of the payment/SMS first ("send a photo of the message or app screen"); extract bank name, transaction ID/UTR, amount, date via the model; show extracted values back for confirmation, with manual entry as fallback for anyone who can't produce a screenshot.
7. **Narrative confirmation.** Show the expanded, ≥200-character narrative the model drafted from step 3; let the user edit in plain language, not by counting characters themselves.
8. **ID upload.** One screen, camera-first, explain in one sentence why it's required.
9. **Suspect details (optional, skippable).** Whatever they know: phone, email, account number — one field group, clearly marked optional.
10. **Review.** Plain-language summary of everything captured, in their chosen language, before anything is "submitted."
11. **Mock submission + next steps.** Clearly labeled as a prototype. Show a fake acknowledgment number, and — importantly — remind them again to call 1930 if they haven't, and to notify their bank within 3 working days.

Each numbered step above is one screen. Don't merge any two of these onto one screen even if they feel small.

---

## 5. Technical architecture

### Stack
- **Framework: Angular.** Standalone components, one component per screen (Section 4's 11 screens map to 11 route/components). Keep it lightweight — this needs to run smoothly on low-end Android devices on patchy connections.
- **No backend/database for the demo.** All state persists to `localStorage`. Wrap it in a single `ComplaintStateService` rather than calling `localStorage` directly from components — that's what makes swapping in a real backend later a one-file change instead of a rewrite.
- **Styling: hand-built, plain CSS/SCSS using the variables in Section 3.** Don't reach for Angular Material's default theming — its component shapes (raised buttons, ripple effects, elevation) will fight the flat, standard, non-glassmorphism look you want. Build the option-cards, buttons, and inputs as simple custom components instead.
- **Forms: Angular Reactive Forms**, one small `FormGroup` per screen rather than one giant form for the whole flow — this matches the one-question-per-screen model and makes per-screen validation (e.g. the 200-character/no-special-character rule) straightforward.
- **Routing:** one route per screen, in the fixed order from Section 4. A route guard can enforce that a screen can't be reached until the previous required screen has valid data — this is what makes "always show where they are, let them go back" (Section 2) actually safe to implement, since back/forward navigation won't corrupt the flow.

### Suggested structure
```
src/app/
  core/
    services/
      complaint-state.service.ts   // reads/writes localStorage, single source of truth
      ai.service.ts                // wraps OpenAI calls: STT, vision extraction, classification
      language.service.ts          // active language + translation lookup
  screens/
    language-select/
    urgency/
    what-happened/
    confirm-classification/
    incident-datetime/
    transaction-details/
    narrative-confirm/
    id-upload/
    suspect-details/
    review/
    submission/
  shared/
    components/
      option-card/
      step-indicator/
      primary-button/
      mic-input/
      photo-input/
  assets/
    i18n/
      en.json
      hi.json
      ml.json
```

### localStorage shape
Keep it as one namespaced object rather than scattering keys, so it's trivial to inspect, reset, or later swap for a real API payload:
```ts
// key: 'complaint-draft'
{
  language: 'en' | 'hi' | 'ml',
  category: string,          // set after step 4 confirmation
  narrative: string,
  incidentDateTime: string,
  transaction: { bankName, transactionId, amount, date },
  idProof: { fileName, dataUrl },
  suspect: { mobile?, email?, accountNumber?, address? },
  evidenceFiles: Array<{ fileName, dataUrl }>,
  acknowledgmentNumber?: string   // set on mock submission
}
```
Clear this on submission or provide an explicit "start over" action — don't let a half-filled draft silently persist forever and confuse a returning user.

### AI usage (this is the part that must be real, not decorative)
- **Speech-to-text:** OpenAI's Whisper-class model, called for each voice input, targeting the three demo languages.
- **Vision/OCR extraction:** a GPT-4o-class multimodal model call on the uploaded photo, prompted specifically to extract bank name, transaction ID/UTR, amount, and date from a bank SMS or UPI app screenshot — return structured JSON, not prose.
- **Classification + narrative drafting:** a single model call on the open "what happened" input (plus any voice transcript) that returns (a) a proposed fraud subcategory and (b) a drafted, ≥200-character, special-character-free incident narrative in the user's chosen language.
- **Translation/localization:** all static UI copy should be pre-translated and stored as language files (not live-translated at runtime) for the three demo languages — this is more reliable than a live translation call for fixed UI strings. Use the model live only for content that's actually dynamic (the user's own account of what happened).

### Data model (mirrors the real portal's required fields)

**Mandatory (from the actual cybercrime.gov.in checklist):**
- Incident date & time
- Incident description — ≥200 characters, must exclude: `# $ @ ^ * \` ' ~ | !`
- Complainant ID proof (image, ≤5MB)
- Financial details: bank/wallet/merchant name, 12-digit transaction ID/UTR, transaction date, fraud amount
- Evidence file(s) (≤10MB each)

**Optional:**
- Suspect mobile number, email, bank account number, address, photo
- Suspected website URL / social media handle

Build your internal data model with these exact fields so the mapping from your conversational flow to "what the government form actually needs" is traceable and easy to demo/explain to judges.

### Honesty / disclosure requirements (this is a judged criterion, not a nice-to-have)
- The submission at the end must be visibly labeled as a prototype/mock, not a real filing.
- If a language, voice recognition, or OCR path is untested or unreliable for the demo, say so in the product rather than pretending it's solid — e.g., a visible "best effort — please confirm" label on any AI-extracted field.
- Be ready to state plainly which of the three languages are fully working end-to-end vs. partially supported.

---

---

## 7. Global language system (i18n architecture)

Built to scale past the 3 demo languages, not hardcoded to them — adding a language later should mean adding a config entry and a translation file, never touching a component.

### Language registry (single source of truth)
```ts
// core/config/languages.config.ts
export interface LanguageConfig {
  code: string;            // 'en' | 'hi' | 'ml' | ...
  label: string;           // shown on the language-select screen, in its own script
  fontStack: string;       // script-appropriate font, see below
  direction: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', label: 'English',  fontStack: "'DM Serif Display', Georgia, serif", direction: 'ltr' },
  { code: 'hi', label: 'हिन्दी',     fontStack: "'Noto Serif Devanagari', serif",     direction: 'ltr' },
  { code: 'ml', label: 'മലയാളം',   fontStack: "'Noto Serif Malayalam', serif",       direction: 'ltr' },
];
```
The language-select screen renders this array — it doesn't know or care how many entries are in it. `LanguageService` reads the active language's `fontStack` and sets it as a CSS custom property (`--font-primary`) on the root element, so the whole design system from Section 3 stays script-correct automatically instead of hardcoding DM Serif Display everywhere.

### Translation files, not compile-time i18n
Use runtime-loaded JSON per language (`assets/i18n/<code>.json`, one flat key-value map per screen), fetched by a small `TranslationService` — not Angular's built-in `$localize`/compile-time i18n, which requires a separate build per locale and makes adding a language a build-pipeline change instead of a content change. Missing keys fall back to English rather than showing a blank string or a raw key.

### What must never be hardcoded to "3 languages"
- Any `if (lang === 'en')`-style branching in components — always go through the registry.
- The AI service calls: pass the active language code into the Whisper/classification/vision prompts so voice and narrative generation follow whichever language is active, rather than three separate code paths.
- Date/number formatting — register each language's Angular locale data (`registerLocaleData`) rather than manually formatting strings per language.

### Honest limitation to disclose in the demo
Only English, Hindi, and Malayalam will actually be translated and tested for the hackathon. The registry/service pattern above means the *system* supports more, but don't claim more languages work than you've verified end-to-end — this is the same disclosure principle from Section 5.

---

## 8. Keeping this document in sync

This file is meant to track the real, current state of the project's decisions — not a one-time brief. As design or architecture choices change during the build, this document gets updated to match in the same conversation, so it never drifts out of sync with what's actually being built. If you're reading this and a decision here doesn't match what's actually implemented, that's a bug in the document — flag it so it gets corrected.

---

## 9. Milestones

**M1 — Skeleton & design system**
Angular routes for all 11 screens, `ComplaintStateService` backed by `localStorage`, shared components (option-card, step-indicator, primary-button) styled per Section 3. No AI calls yet — dummy data flowing through the state service.

**M2 — Language layer**
Static UI strings externalized and translated for English/Hindi/Malayalam. Language-select screen wired to swap the whole UI.

**M3 — Open capture + classification**
"What happened" screen wired to a real OpenAI model call: text input working end-to-end (classification + narrative draft + confirm screen).

**M4 — Voice input**
Whisper-class integration for the same open capture screen, in all three languages. Transcript shown before submission.

**M5 — Photo/OCR extraction**
Screenshot upload wired to vision model extraction for the four transaction fields, with confirm/edit screen.

**M6 — Full flow assembly**
All screens from Section 4 connected in order, including ID upload, suspect details, review screen, and mock submission with acknowledgment number.

**M7 — Polish & demo readiness**
Accessibility pass on the typography/contrast decisions above, error states, a rehearsed demo script built around one concrete UPI fraud scenario, and the disclosure language for what's fully working vs. partial.