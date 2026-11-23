# Raghupur Fort Camps

Website for **Raghupur Fort Camps**: high-altitude camping and guided treks around Jalori Pass, Raghupur Fort, Serolsar Lake, Jibhi and Tirthan Valley, Himachal Pradesh.

Plain HTML, CSS and a little JavaScript. No build step, no dependencies.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: overview of all experiences |
| `raghupur-fort-camping.html` | Camp, tent options, prices |
| `raghupur-fort-trek.html` | Fort trek route and tips |
| `serolsar-lake-trek.html` | Serolsar Lake trek, legend, packages |
| `jibhi-tirthan-valley.html` | Jibhi, Chehni Kothi, Tirthan Valley |
| `plan-your-trip.html` | How to reach, seasons, packing list, FAQ |
| `guides.html` | Hub for the travel guides |
| `serolsar-lake-trek-guide.html`, `raghupur-fort-trek-guide.html`, `camping-jalori-pass-vs-jibhi-riverside.html`, `things-to-do-in-jibhi.html`, `jalori-pass-road-status-winter-closure.html` | Long-form SEO guides |
| `404.html` | Not-found page |

Shared files: `styles.css`, `app.js`, `favicon.svg`, `apple-touch-icon.png`, `og-image.jpg` (social share preview), `sitemap.xml`, `robots.txt`.

Each page has its own title, description, canonical URL, social preview tags and structured data (JSON-LD), so Google can index and rank them separately. Old single-page links such as `index.html#camping` still redirect to the right page.

## Before you publish: things to check

1. **Domain.** All canonical URLs, `og:url`, the sitemap and `robots.txt` use `https://www.raghupurcamps.com`. If you connect a custom domain, find and replace that address in every `.html` file, `sitemap.xml` and `robots.txt`.
2. **Prices and package contents.** Prices (Rs 1,200 to 5,500) and inclusions come from the original site. Confirm them, and the tent and meal details, against what you actually offer.
3. **Photos.** The site now uses your real camp photos (in `images/`). For the sharpest result, send originals as a WhatsApp "Document" (not "Photo"), because WhatsApp compresses photos. To add or swap a photo, put it in `images/` and update the `src` in the page.
4. **Contact number.** `+91 70182 36861` is used for calls and WhatsApp everywhere (search for `7018236861` to change it).
5. **Google Business Profile / Maps.** Add a pin for the camp and link it from the footer once it exists. Adding exact coordinates to the structured data on the home page will also help.

## Run locally

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Repository **Settings** > **Pages**.
2. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site goes live at `https://www.raghupurcamps.com/`.
4. Submit `sitemap.xml` in Google Search Console after launch.

&copy; 2026 Raghupur Fort Camps. Jalori Pass, Himachal Pradesh, India.
