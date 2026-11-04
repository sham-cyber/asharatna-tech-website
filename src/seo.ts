import { useEffect } from 'react';
import { useLocation } from 'wouter';
import seoConfig from './seo-pages.json';

type SeoPage = (typeof seoConfig.pages)[number];

function normalizePath(path: string) {
  const pathname = path.split(/[?#]/, 1)[0] || '/';
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

function findPage(path: string): SeoPage {
  const normalized = normalizePath(path);
  return (
    seoConfig.pages.find((page) => normalizePath(page.path) === normalized) ??
    seoConfig.pages[0]
  );
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

export function RouteSeo() {
  const [location] = useLocation();

  useEffect(() => {
    const page = findPage(location);
    const siteUrl = (import.meta.env.VITE_SITE_URL || seoConfig.siteUrl).replace(/\/+$/, '');
    const canonicalUrl = new URL(page.path, siteUrl).toString();
    const imageUrl = new URL(seoConfig.ogImage, siteUrl).toString();

    document.title = page.title;
    setMeta('name', 'description', page.description);
    setMeta('name', 'robots', page.robots);
    setMeta('property', 'og:title', page.title);
    setMeta('property', 'og:description', page.description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', seoConfig.siteName);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:image:type', 'image/jpeg');
    setMeta('property', 'og:image:alt', seoConfig.ogImageAlt);
    setMeta('property', 'og:image:width', String(seoConfig.ogImageWidth));
    setMeta('property', 'og:image:height', String(seoConfig.ogImageHeight));
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', page.title);
    setMeta('name', 'twitter:description', page.description);
    setMeta('name', 'twitter:image', imageUrl);
    setMeta('name', 'twitter:image:alt', seoConfig.ogImageAlt);
    setMeta('name', 'twitter:url', canonicalUrl);

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
    let pageSchemaScript = document.head.querySelector<HTMLScriptElement>(
      '#route-schema[type="application/ld+json"]',
    );
    if (!pageSchemaScript) {
      pageSchemaScript = document.createElement('script');
      pageSchemaScript.type = 'application/ld+json';
      pageSchemaScript.id = 'route-schema';
      document.head.appendChild(pageSchemaScript);
    }
    pageSchemaScript.textContent = JSON.stringify(pageSchema).replace(/</g, '\\u003c');

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [location]);

  return null;
}
