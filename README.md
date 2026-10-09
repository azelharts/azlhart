# Azlhart

Independent studio website built with Next.js 15, React 19 and Tailwind CSS 4.

## Development

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
npm audit --omit=dev
```

The browser suite runs against a production server on port 3100. It covers all ten public pages, mobile navigation, project-to-inquiry transitions, brief preparation, FAQs, reduced motion, missing projects, runtime errors and horizontal overflow.

## Pages and content

- `/`: positioning, capabilities, selected work, process and FAQs.
- `/about`: studio, location and collaboration approach.
- `/services`: service fit, typical deliverables and process.
- `/works` and `/works/[slug]`: three existing projects and their individual presentations.
- `/archive`: project index ordered by year.
- `/contact`: locally prepared email brief with email-app and copy fallbacks.
- `/privacy`: explanation of the inquiry flow.

Project facts and service content live in `src/lib/content.ts`. The project records intentionally contain only names, platforms, dates and assets present in the original repository. No conversion metrics, client URLs, expanded delivery claims or new testimonials have been invented.

## Launch configuration

Set these variables before building:

```sh
NEXT_PUBLIC_SITE_URL=https://azlhart.vercel.app
NEXT_PUBLIC_CONTACT_EMAIL=your-verified-inbox@example.com
```

The site URL defaults to the repository's existing Vercel address. The contact address falls back to the original `hello@azlhart.com`, but **that domain did not resolve during this review**. Verify the receiving inbox and replace the address before launch. Public environment values are compiled into the client bundle and require a rebuild after changes.

The contact form has no submission backend. It validates and prepares a brief, then the visitor sends it with their email provider. It never reports an email as sent. If server delivery is added later, implement validation, abuse prevention, success/failure states and an updated privacy notice.

## Buyer-perspective review

The original site had a strong visual identity, but buyers could not complete the basic evaluation and inquiry journey:

| Finding                                                           | Resolution                                                                                   |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Studio, work and archive navigation led to missing routes         | Complete pages plus services, contact, privacy and project details                           |
| Inquiry CTAs were buttons without actions                         | Real links to a usable inquiry flow                                                          |
| Mobile menu was decorative                                        | Keyboard-accessible disclosure menu with Escape handling                                     |
| Portfolio showed three images but claimed nine projects           | Shared three-project catalog, linked presentations and honest count                          |
| Long hero intro withheld content; process consumed five viewports | Immediate server-rendered hero and readable four-step process                                |
| Reduced motion omitted later process steps                        | All steps available without animation                                                        |
| Blank final viewport and no shared footer                         | Contact invitation, studio details and footer navigation                                     |
| Every testimonial used the same profile image; provenance absent  | Testimonials withheld from the homepage pending owner verification; original source retained |
| Global smooth-scroll and navbar depended on homepage animation    | Native scrolling and persistent route-independent navigation                                 |
| Public assets cached as immutable despite stable filenames        | One-day revalidation policy                                                                  |
| Framework and transitive dependency audit findings                | Next.js 15 patch update and patched PostCSS override                                         |

### Content the owner still needs to supply

1. A verified inquiry inbox; confirm the final production domain.
2. Approved project scope/role, business challenge, delivered work, actual website screenshots, live URLs and outcomes. Existing project assets are cover imagery rather than screenshots of the delivered websites. The new pages are project presentations, not evidence-rich case studies yet.
3. Permission and accurate attribution for testimonials, including appropriate portraits or removal of portraits.
4. Commercial terms: actual minimum budget, typical timelines, revision policy, ownership, hosting and support. The site discusses agreeing these in a proposal rather than inventing commitments.

### Dependency maintenance

The PostCSS override keeps Next.js 15 on the patched 8.5 line. Recheck it when upgrading Next.js. The production dependency audit is clean after this change; the full audit still reports development-tool findings in the ESLint glob dependency chain. Avoid an automatic forced framework/config downgrade just to satisfy that audit.
