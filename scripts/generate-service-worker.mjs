import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDirectory = fileURLToPath(new URL('..', import.meta.url));
const outputDirectory = path.join(projectDirectory, 'dist', 'public');
const precacheExtensions = new Set([
  '.css',
  '.html',
  '.ico',
  '.js',
  '.png',
  '.svg',
  '.webmanifest',
  '.webp',
  '.woff',
  '.woff2',
]);

async function listFiles(directory, parent = '') {
  const entries = await readdir(path.join(directory, parent), {
    withFileTypes: true,
  });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(parent, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(directory, relativePath)));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

const allFiles = await listFiles(outputDirectory);
const requiredFiles = [
  'index.html',
  'about.html',
  'ebook-buy.html',
  'payment.html',
  'remote-internship.html',
  'manifest.webmanifest',
  'favicon.svg',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-512-maskable.png',
];

for (const file of requiredFiles) {
  if (!allFiles.includes(file)) {
    throw new Error(`Required PWA file is missing from the static build: ${file}`);
  }
}

const precacheFiles = allFiles
  .filter((file) => {
    const extension = path.extname(file).toLowerCase();
    return (
      precacheExtensions.has(extension) ||
      file === 'asharatna-home-hero-edited.jpg'
    );
  })
  .sort();

const buildHash = createHash('sha256');
for (const file of precacheFiles) {
  buildHash.update(file);
  buildHash.update(await readFile(path.join(outputDirectory, file)));
}

const cacheName = `asharatna-tech-pwa-${buildHash.digest('hex').slice(0, 12)}`;
const precacheUrls = precacheFiles.map(
  (file) => `/${file.split(path.sep).join('/')}`,
);

const serviceWorker = `
const CACHE_NAME = ${JSON.stringify(cacheName)};
const PRECACHE_URLS = ${JSON.stringify(precacheUrls)};
const ROUTE_FALLBACKS = {
  '/': '/index.html',
  '/about': '/about.html',
  '/ebook-buy': '/ebook-buy.html',
  '/payment': '/payment.html',
  '/remote-internship': '/remote-internship.html',
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(PRECACHE_URLS);
      await self.skipWaiting();
    }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (cacheNames) => {
      await Promise.all(
        cacheNames
          .filter(
            (name) =>
              name.startsWith('asharatna-tech-pwa-') && name !== CACHE_NAME,
          )
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    }),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cachedPage = await cache.match(request);
          if (cachedPage) return cachedPage;

          const route =
            url.pathname.replace(/\\/+$/, '') || '/';
          const fallbackPath = ROUTE_FALLBACKS[route] || '/index.html';
          const fallbackPage = await cache.match(fallbackPath);
          return (
            fallbackPage ||
            new Response('This page is not available offline.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            })
          );
        }),
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;

      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    }),
  );
});
`.trimStart();

await writeFile(path.join(outputDirectory, 'sw.js'), serviceWorker, 'utf8');
console.log(
  `Generated PWA service worker with ${precacheUrls.length} precached files.`,
);
