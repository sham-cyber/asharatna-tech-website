import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDirectory = fileURLToPath(new URL('..', import.meta.url));
const outputDirectory = path.join(projectDirectory, 'dist', 'public');
const pageConfigPath = path.join(projectDirectory, 'src', 'seo-pages.json');
const seoConfig = JSON.parse(await readFile(pageConfigPath, 'utf8'));
const governmentFormData = JSON.parse(
  await readFile(path.join(projectDirectory, 'src', 'government-form-services.json'), 'utf8'),
);
const siteUrl = (process.env.VITE_SITE_URL || seoConfig.siteUrl).replace(/\/+$/, '');
const shell = await readFile(path.join(outputDirectory, 'index.html'), 'utf8');
const robotsPath = path.join(outputDirectory, 'robots.txt');
const robotsTemplate = await readFile(robotsPath, 'utf8');

function validateSeoConfig() {
  const paths = new Set();
  const outputFiles = new Set();
  const titles = new Set();
  const siteUrlObject = new URL(siteUrl);
  if (siteUrlObject.protocol !== 'https:') {
    throw new Error(`SEO site URL must use HTTPS: ${siteUrl}`);
  }

  for (const page of seoConfig.pages) {
    if (paths.has(page.path) || outputFiles.has(page.outputFile)) {
      throw new Error(`Duplicate SEO route or output file: ${page.path} / ${page.outputFile}`);
    }
    paths.add(page.path);
    outputFiles.add(page.outputFile);

    if (titles.has(page.title)) {
      throw new Error(`Duplicate SEO title: ${page.title}`);
    }
    titles.add(page.title);

    if (page.includeInSitemap && page.robots.toLowerCase().includes('noindex')) {
      throw new Error(`Noindex page must not be included in the sitemap: ${page.path}`);
    }
    if (page.includeInSitemap && (page.title.length < 50 || page.title.length > 60)) {
      throw new Error(`Indexable title must be 50–60 characters: ${page.path}`);
    }
    if (page.includeInSitemap && (page.description.length < 150 || page.description.length > 160)) {
      throw new Error(`Indexable description must be 150–160 characters: ${page.path}`);
    }
    if (!page.heading?.trim() || !page.summary?.trim()) {
      throw new Error(`SEO fallback needs a heading and summary: ${page.path}`);
    }
  }

  if (
    seoConfig.pages.some((page) => page.path === '/govt-form-filling') &&
    (!Array.isArray(governmentFormData.services) || governmentFormData.services.length < 30)
  ) {
    throw new Error('The government form directory must include at least 30 services.');
  }

  if (!/^Sitemap:\s+https:\/\//m.test(robotsTemplate)) {
    throw new Error('robots.txt must contain an HTTPS Sitemap directive');
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function setMeta(html, attribute, key, content) {
  const selector = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  if (!selector.test(html)) {
    throw new Error(`Missing metadata tag: ${attribute}="${key}"`);
  }
  return html.replace(selector, replacement);
}

function renderGovernmentFormsDirectory() {
  const cards = governmentFormData.services
    .map((service) => {
      const officialLinks = (service.officialSources ?? [])
        .map(
          (source) =>
            `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a>`,
        )
        .join('');
      const marketLink = service.marketSource
        ? `<a href="${escapeHtml(service.marketSource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(service.marketSource.label)}</a>`
        : '';
      const message = encodeURIComponent(
        `Hi AshaRatna Tech, I need help with ${service.name}. Please share the document checklist and your written service fee. I will not send identity documents, OTPs, or passwords.`,
      );
      const emailSubject = encodeURIComponent(`Government form assistance: ${service.name}`);
      const emailBody = encodeURIComponent(
        `Hi AshaRatna Tech,\n\nI need help with ${service.name}. Please share the document checklist and your written service fee. I will not include identity documents, OTPs, or passwords.`,
      );
      const whatsappHref = `https://wa.me/918788486350?text=${message}`;
      const emailHref = `mailto:connect@asharatnatech.com?subject=${emailSubject}&body=${emailBody}`;

      return `<article class="government-form-card" data-service="${escapeHtml(service.id)}"><p class="government-form-category">${escapeHtml(service.category)}</p><h3>${escapeHtml(service.name)}</h3><p>${escapeHtml(service.description)}</p><dl><div><dt>Official government charge</dt><dd>${escapeHtml(service.governmentCost)}</dd></div><div><dt>Published assistance comparison</dt><dd>${escapeHtml(service.comparison ?? 'No reliable common public price was found. Request a written quote before paid work.')}${marketLink ? `<br>${marketLink}` : ''}</dd></div><div><dt>AshaRatna assistance fee</dt><dd>${escapeHtml(service.ashaRatnaPrice ?? 'Request a written quote before work begins. Government charges are separate unless confirmed otherwise in writing.')}</dd></div></dl><nav class="government-form-sources" aria-label="Sources for ${escapeHtml(service.name)}">${officialLinks}</nav><div class="government-form-contact"><a href="${escapeHtml(whatsappHref)}" target="_blank" rel="noopener noreferrer">WhatsApp · +91 87884 86350</a><a href="${escapeHtml(emailHref)}">Email · connect@asharatnatech.com</a></div></article>`;
    })
    .join('');

  return `<section class="government-form-directory" aria-labelledby="government-form-directory-title"><header><h2 id="government-form-directory-title">Search 35 common government form services</h2><p>Official fees and independent provider examples are kept separate. AshaRatna's assistance fee is confirmed by quote before paid work.</p><p>Fees checked ${escapeHtml(governmentFormData.checkedOn)}. Always confirm current charges on the linked government portal.</p><aside><strong>Independent assistance, not a government office.</strong> AshaRatna Tech is not affiliated with any government department.</aside><aside>Do not send Aadhaar or PAN images, OTPs, or passwords through ordinary WhatsApp or email.</aside></header><div class="government-form-grid">${cards}</div></section>`;
}

function makeFallback(page) {
  const summarySections = page.sections?.length
    ? `<section><h2>What this page covers</h2><ul>${page.sections
        .map((section) => `<li>${escapeHtml(section)}</li>`)
        .join('')}</ul></section>`
    : '';
  const contentSections = page.contentSections?.length
    ? page.contentSections
        .map((section) => {
          const paragraphs = (section.paragraphs ?? [])
            .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
            .join('');
          const bullets = section.bullets?.length
            ? `<ul>${section.bullets
                .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
                .join('')}</ul>`
            : '';
          return `<section><h2>${escapeHtml(section.heading)}</h2>${paragraphs}${bullets}</section>`;
        })
        .join('')
    : '';
  const faqSection = page.faqs?.length
    ? `<section aria-labelledby="seo-faq-title"><h2 id="seo-faq-title">Frequently asked questions</h2>${page.faqs
        .map(
          (faq) =>
            `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`,
        )
        .join('')}</section>`
    : '';
  const ctaActions = page.cta
    ? [
        page.cta.whatsappHref
          ? `<a class="payment-action seo-service-action seo-service-whatsapp" href="${escapeHtml(page.cta.whatsappHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(page.cta.whatsappLabel ?? 'Share URL on WhatsApp')}</a>`
          : '',
        page.cta.href
          ? `<a class="payment-action seo-service-action" href="${escapeHtml(page.cta.href)}">${escapeHtml(page.cta.label)}</a>`
          : '',
      ].join('')
    : '';
  const cta = page.cta?.heading
    ? `<aside class="seo-service-contact seo-service-contact-banner"><h2>${escapeHtml(page.cta.heading)}</h2><p>${escapeHtml(page.cta.description ?? '')}</p><div class="seo-service-actions">${ctaActions}</div></aside>`
    : page.cta?.href
      ? `<p><a href="${escapeHtml(page.cta.href)}" rel="noopener noreferrer">${escapeHtml(page.cta.label)}</a></p>`
      : '';
  const relatedLinks = page.relatedLinks?.length
    ? `<nav aria-label="Related services">${page.relatedLinks
        .map(
          (link) =>
            `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`,
        )
        .join(' · ')}</nav>`
    : '';
  const mainNavigation =
    page.path === '/'
      ? '<nav aria-label="More information"><a href="/about">About AshaRatna Tech</a> · <a href="/ebook-buy">Website guide</a> · <a href="/remote-internship">Remote internship</a> · <a href="/govt-form-filling">Government form filling</a> · <a href="/terms">Terms of Service</a> · <a href="/privacy">Privacy Policy</a> · <a href="/refund-cancellation">Refund and Cancellation Policy</a></nav>'
      : '<nav aria-label="Main navigation"><a href="/">AshaRatna Tech home</a> · <a href="/govt-form-filling">Government form filling</a> · <a href="/terms">Terms of Service</a> · <a href="/privacy">Privacy Policy</a> · <a href="/refund-cancellation">Refund and Cancellation Policy</a></nav>';
  const formDirectory =
    page.path === '/govt-form-filling' ? renderGovernmentFormsDirectory() : '';

  return `<div id="root"><main class="seo-fallback"><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.summary)}</p>${cta}${summarySections}${formDirectory}${contentSections}${faqSection}${relatedLinks}${mainNavigation}</main></div>`;
}

function renderPage(page) {
  const canonicalUrl = new URL(page.path, siteUrl).toString();
  const imageUrl = new URL(seoConfig.ogImage, siteUrl).toString();
  let html = shell.replaceAll(seoConfig.siteUrl, siteUrl);

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = setMeta(html, 'name', 'description', page.description);
  html = setMeta(html, 'name', 'robots', page.robots);
  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
  );

  const metadata = [
    ['property', 'og:title', page.title],
    ['property', 'og:description', page.description],
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', seoConfig.siteName],
    ['property', 'og:url', canonicalUrl],
    ['property', 'og:image', imageUrl],
    ['property', 'og:image:type', 'image/jpeg'],
    ['property', 'og:image:alt', seoConfig.ogImageAlt],
    ['property', 'og:image:width', String(seoConfig.ogImageWidth)],
    ['property', 'og:image:height', String(seoConfig.ogImageHeight)],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', page.title],
    ['name', 'twitter:description', page.description],
    ['name', 'twitter:image', imageUrl],
    ['name', 'twitter:image:alt', seoConfig.ogImageAlt],
    ['name', 'twitter:url', canonicalUrl],
  ];
  for (const [attribute, key, value] of metadata) {
    html = setMeta(html, attribute, key, value);
  }

  const organizationUrl = new URL('/#organization', siteUrl).toString();
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': page.path === '/about' ? 'AboutPage' : 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: page.title,
    description: page.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': new URL('/#website', siteUrl).toString() },
    about: { '@id': organizationUrl },
    ...(page.path === '/about' ? { mainEntity: { '@id': organizationUrl } } : {}),
  };
  const routeSchema = `<script id="route-schema" type="application/ld+json">${JSON.stringify(pageSchema).replace(/</g, '\\u003c')}</script>`;
  const routeSchemaPlaceholder = /<script\s+id="route-schema"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i;
  if (!routeSchemaPlaceholder.test(html)) {
    throw new Error(`Could not find page schema placeholder for ${page.path}`);
  }
  html = html.replace(routeSchemaPlaceholder, routeSchema);

  const rootElement = /<div id="root">[\s\S]*?<\/div>/i;
  if (!rootElement.test(html)) {
    throw new Error(`Could not find the React root placeholder for ${page.path}`);
  }
  html = html.replace(rootElement, makeFallback(page));
  return html;
}

validateSeoConfig();

for (const page of seoConfig.pages) {
  await writeFile(
    path.join(outputDirectory, page.outputFile),
    renderPage(page),
    'utf8',
  );
}

const sitemapEntries = seoConfig.pages
  .filter((page) => page.includeInSitemap)
  .map((page) => {
    const url = new URL(page.path, siteUrl).toString();
    return `  <url><loc>${escapeXml(url)}</loc></url>`;
  });
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries,
  '</urlset>',
  '',
].join('\n');

await writeFile(path.join(outputDirectory, 'sitemap.xml'), sitemap, 'utf8');
const sitemapUrl = new URL('/sitemap.xml', siteUrl).toString();
const robots = robotsTemplate.replace(/^Sitemap:\s+.*$/m, `Sitemap: ${sitemapUrl}`);
await writeFile(robotsPath, robots, 'utf8');
console.log(`Generated SEO HTML for ${seoConfig.pages.length} routes, sitemap.xml, and robots.txt`);
