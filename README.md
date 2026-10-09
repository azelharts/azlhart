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

The browser suite runs against a production server on port 3100. It covers all eleven public pages, mobile navigation, project-to-inquiry transitions, brief preparation, FAQs, reduced motion, missing projects, runtime errors and horizontal overflow.

## Pages and content

- `/`: positioning, capabilities, selected work, process and FAQs.
- `/about`: studio, location and collaboration approach.
- `/services`: service fit, typical deliverables and process.
- `/works` and `/works/[slug]`: four public-source projects and their individual presentations.
- `/archive`: project index ordered by year.
- `/contact`: locally prepared email brief with email-app and copy fallbacks.
- `/privacy`: explanation of the inquiry flow.

Project facts and service content live in `src/lib/content.ts`. The portfolio now uses public repository evidence and real public-site captures instead of the original unverified FeetStudio/C&A entries. Dates are repository creation years, not asserted launch dates.

| Project                                                        | Evidence reviewed                                                     | Presentation                                                                               |
| -------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [SIncan-KotaKu](https://github.com/azelharts/bpbd-kota-kupang) | Public homepage, incident management page and route structure         | Public-information application; no claim of an official commission or operational adoption |
| [Hirestack](https://github.com/azelharts/hirestack)            | README, recruiter/job-seeker pages and application routes             | Recruitment application; screenshot is the public sign-in page                             |
| [Aetheria](https://github.com/azelharts/aetheria)              | Repository description, journal creation, tutorial and public preview | Mobile-focused thesis prototype, under development                                         |
| [Onlytheflames](https://github.com/azelharts/onlytheflames)    | README, landing implementation, work index and public preview         | Personal motion-focused portfolio                                                          |

Screenshots in `public/images/projects` capture publicly accessible pages only. No authenticated user data or private repository content is published. Learning/tutorial projects were not promoted to client work. No commercial results or client relationships are inferred from repository ownership.

## Launch configuration

Set these variables before building:

```sh
NEXT_PUBLIC_SITE_URL=https://azlhart.vercel.app
NEXT_PUBLIC_CONTACT_EMAIL=your-verified-inbox@example.com
```

The owner confirmed that `azlhart.com` is a mock/planned domain to be purchased later. Until `NEXT_PUBLIC_CONTACT_EMAIL` is configured, the contact page says inquiries are not open and offers local brief preparation/copy only. It does not link to the mock inbox. Setting an active address enables the email links after rebuilding.

The site URL defaults to the repository's existing Vercel address. Change it when the new domain is connected. Public environment values are compiled into the client bundle.

The contact form has no submission backend and never reports mail as sent. When enabled, visitors review and send the prepared brief in their own email app. If server delivery is added later, implement validation, abuse prevention, success/failure states and an updated privacy notice.

## Buyer-perspective review

The original site had a strong visual identity, but buyers could not complete the basic evaluation and inquiry journey:

| Finding                                                           | Resolution                                                                                   |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Studio, work and archive navigation led to missing routes         | Complete pages plus services, contact, privacy and project details                           |
| Inquiry CTAs were buttons without actions                         | Real links to a usable inquiry flow                                                          |
| Mobile menu was decorative                                        | Keyboard-accessible disclosure menu with Escape handling                                     |
| Portfolio showed three images but claimed nine projects           | Shared four-project catalog, linked presentations and honest count                           |
| Long hero intro withheld content; process consumed five viewports | Immediate server-rendered hero and readable four-step process                                |
| Reduced motion omitted later process steps                        | All steps available without animation                                                        |
| Blank final viewport and no shared footer                         | Contact invitation, studio details and footer navigation                                     |
| Every testimonial used the same profile image; provenance absent  | Testimonials withheld from the homepage pending owner verification; original source retained |
| Global smooth-scroll and navbar depended on homepage animation    | Native scrolling and persistent route-independent navigation                                 |
| Public assets cached as immutable despite stable filenames        | One-day revalidation policy                                                                  |
| Framework and transitive dependency audit findings                | Next.js 15 patch update and patched PostCSS override                                         |

### Content the owner still needs to supply

1. An active inquiry inbox when ready to launch; purchase/connect the planned domain later.
2. Approved project roles, client/commission status and measured outcomes where available. Public features and screenshots are now included; repositories alone do not establish commercial results.
3. Permission and accurate attribution for testimonials, including appropriate portraits or removal of portraits.
4. Commercial terms: actual minimum budget, typical timelines, revision policy, ownership, hosting and support. The site discusses agreeing these in a proposal rather than inventing commitments.

### Dependency maintenance

The PostCSS override keeps Next.js 15 on the patched 8.5 line. Recheck it when upgrading Next.js. The production dependency audit is clean after this change; the full audit still reports development-tool findings in the ESLint glob dependency chain. Avoid an automatic forced framework/config downgrade just to satisfy that audit.
