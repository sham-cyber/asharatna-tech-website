import {
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import AboutContent from '@/pages/about';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { RouteSeo } from './seo';
import GovernmentFormsDirectory from './GovernmentFormsDirectory';
import seoConfig from './seo-pages.json';

const queryClient = new QueryClient();
// Manual snapshot from Replit Growth; update after confirming a new count and republish.
const PUBLIC_VISITOR_TOTAL = 1760;

const products = [
  { id: 'ai-call-chat', name: 'AI Call & Chat', note: 'Patent Pending' },
  { id: 'ai-call-crm-lead', name: 'AI Call CRM & Lead' },
  { id: 'ai-manufacturing', name: 'AI Manufacturing' },
  { id: 'machine-automation', name: 'Machine Automation' },
  { id: 'motor-rewinding', name: 'Motor Rewinding' },
  { id: 'attendance-app', name: 'Attendance App' },
  { id: 'iot', name: 'IoT' },
  { id: 'payroll-app', name: 'Payroll App' },
  { id: 'remote-app-website-testing', name: 'Remote App and Website Testing' },
  { id: 'seo-websites-apps', name: 'SEO of Websites & Apps' },
] as const;

const suanPowerIndustriesUrl = 'https://suanpowerindustries.com/';
const replitUrl = 'https://replit.com/';
const channelPartners = [
  {
    name: 'Replit',
    href: replitUrl,
    logo: `${import.meta.env.BASE_URL}partner-replit.png`,
  },
  {
    name: 'Suan Power Industries',
    href: suanPowerIndustriesUrl,
    logo: `${import.meta.env.BASE_URL}partner-suan-power.jpeg`,
  },
] as const;
const partnerMarqueeCopies = 6;
const paymentLink = 'https://bit.ly/44xwcBo';
const uploadedGalleryPhoto = `${import.meta.env.BASE_URL}ashara-gallery-upload.webp`;
const aiCallGalleryImage = `${import.meta.env.BASE_URL}asharatna-ai-call-chat-promo.webp`;
const aiManufacturingGalleryImage = `${import.meta.env.BASE_URL}asharatna-ai-manufacturing-promo.webp`;
const patentApplicationGalleryImage = `${import.meta.env.BASE_URL}ai-money-maker-patent-application.jpg`;
const aiAppTesterGalleryImage = `${import.meta.env.BASE_URL}asha-ai-app-tester.webp`;
const anupMohiteGalleryImage = `${import.meta.env.BASE_URL}anup-mohite-upcoming-director.jpg`;
const ashaMohiteOwnerImage = `${import.meta.env.BASE_URL}asha-mohite-owner.webp`;
const polarisePatentDiscussionImage = `${import.meta.env.BASE_URL}polarise-patent-pending-discussion.webp`;
const ourCreationGalleryImage = `${import.meta.env.BASE_URL}ashara-our-creation.webp`;
const ebookTitle = 'How to Make a Static Site in Replit for Vercel and Add a Domain';
const ebookSubtitle =
  'Build your site in Replit, send it to GitHub, publish it on Vercel, and connect a domain you own.';
const ebookDescription =
  'A practical, beginner-friendly guide to building a static website in Replit, deploying it to Vercel, and connecting a custom domain.';
const ebookAmazonSearchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(ebookTitle)}`;
const ebookAmazonBookUrl = 'https://www.amazon.in/dp/B0HLWXRSC5';

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/' },
  { name: 'Instagram', href: 'https://www.instagram.com/' },
  { name: 'WhatsApp', href: 'https://www.whatsapp.com/' },
  { name: 'YouTube', href: 'https://www.youtube.com/' },
  { name: 'Slack', href: 'https://slack.com/' },
  { name: 'Notion', href: 'https://www.notion.so/' },
  { name: 'Supabase', href: 'https://supabase.com/' },
  { name: 'GitHub', href: 'https://github.com/' },
];

type ProductId = (typeof products)[number]['id'];

function productPaymentHref(productId: ProductId) {
  return `${import.meta.env.BASE_URL}payment?product=${encodeURIComponent(productId)}`;
}

const headerTabIds = new Set<string>([
  'about',
  ...products.map((product) => product.id),
  'freelancer',
  'govt-form-filling',
  'ebook-buy',
  'payment',
  'remote-internship',
]);

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isStandaloneDisplayMode() {
  if (typeof window === 'undefined') return false;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isAppleStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return isStandalone || isAppleStandalone;
}

function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isStandaloneDisplayMode);
  const [showInstructions, setShowInstructions] = useState(false);
  const helpDialogRef = useRef<HTMLDialogElement>(null);
  const isAppleMobile =
    typeof navigator !== 'undefined' &&
    (/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const dialog = helpDialogRef.current;
    if (!dialog) return;

    if (showInstructions && !dialog.open) dialog.showModal();
    if (!showInstructions && dialog.open) dialog.close();
  }, [showInstructions]);

  async function handleInstall() {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch {
      setDeferredPrompt(null);
      setShowInstructions(true);
    }
  }

  if (isInstalled) return null;

  return (
    <>
      <button
        className="install-app-button"
        type="button"
        aria-label="Install AshaRatna Tech"
        onClick={handleInstall}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v11m0 0 4-4m-4 4-4-4" />
          <path d="M5 17v3h14v-3" />
        </svg>
        <span>Install</span>
      </button>
      <dialog
        ref={helpDialogRef}
        className="install-help-dialog"
        aria-labelledby="install-help-title"
        onClose={() => setShowInstructions(false)}
      >
        <div className="install-help-content">
          <p className="install-help-kicker">Add to your home screen</p>
          <h2 id="install-help-title">Install AshaRatna Tech</h2>
          <p>
            {isAppleMobile
              ? 'In Safari, tap Share, then choose “Add to Home Screen.”'
              : 'Open your browser menu and choose “Install app” or “Add to Home screen.”'}
          </p>
          <button
            className="install-help-done"
            type="button"
            onClick={() => setShowInstructions(false)}
          >
            Got it
          </button>
        </div>
      </dialog>
    </>
  );
}

function SiteHeader({
  aboutActive = false,
  selectedProductId,
  paymentActive = false,
  internshipActive = false,
  ebookActive = false,
}: {
  aboutActive?: boolean;
  selectedProductId?: string;
  paymentActive?: boolean;
  internshipActive?: boolean;
  ebookActive?: boolean;
}) {
  const routeActiveTabId = aboutActive
    ? 'about'
    : selectedProductId && headerTabIds.has(selectedProductId)
      ? selectedProductId
      : ebookActive
        ? 'ebook-buy'
        : paymentActive
          ? 'payment'
          : internshipActive
            ? 'remote-internship'
            : null;
  const [clickedTabId, setClickedTabId] = useState<string | null>(null);
  const activeTabId = clickedTabId ?? routeActiveTabId;
  const productTabCount = products.length + 6;
  const tabMarqueeStyle = {
    '--product-tabs-duration': `${Math.max(48, productTabCount * 6)}s`,
  } as CSSProperties;
  const handleHeaderTabClick = (
    event: MouseEvent<HTMLAnchorElement>,
    tabId: string,
  ) => {
    if (!headerTabIds.has(tabId) || event.currentTarget.dataset.product !== tabId) return;
    setClickedTabId(tabId);
  };

  const renderProductTabs = (decorativeCopy: boolean) => (
    <>
      <a
        className={`product-tab about-tab${activeTabId === 'about' ? ' is-selected' : ''}`}
        href={`${import.meta.env.BASE_URL}about`}
        data-product="about"
        aria-current={aboutActive ? 'page' : undefined}
        tabIndex={decorativeCopy ? -1 : undefined}
        onClick={(event) => handleHeaderTabClick(event, 'about')}
      >
        About
      </a>
      <a
        className={`product-tab govt-form-tab${activeTabId === 'govt-form-filling' ? ' is-selected' : ''}`}
        href={`${import.meta.env.BASE_URL}govt-form-filling`}
        data-product="govt-form-filling"
        data-testid="link-govt-form-filling"
        aria-current={selectedProductId === 'govt-form-filling' ? 'page' : undefined}
        tabIndex={decorativeCopy ? -1 : undefined}
        onClick={(event) => handleHeaderTabClick(event, 'govt-form-filling')}
      >
        Govt Form Filling
      </a>
      {products.map((product) => {
        const isSelected = activeTabId === product.id;
        const isAiCallChat = product.id === 'ai-call-chat';
        const servicePagePath =
          product.id === 'remote-app-website-testing'
            ? 'website-app-testing'
            : product.id === 'seo-websites-apps'
              ? 'seo-services'
              : null;
        const opensExternalPage = isAiCallChat;
        return (
          <a
            key={product.id}
            className={`product-tab${isSelected ? ' is-selected' : ''}`}
            href={
              isAiCallChat
                ? suanPowerIndustriesUrl
                : servicePagePath
                  ? `${import.meta.env.BASE_URL}${servicePagePath}`
                  : productPaymentHref(product.id)
            }
            target={opensExternalPage ? '_blank' : undefined}
            rel={opensExternalPage ? 'noopener noreferrer' : undefined}
            data-product={product.id}
            aria-current={selectedProductId === product.id ? 'page' : undefined}
            tabIndex={decorativeCopy ? -1 : undefined}
            onClick={(event) => handleHeaderTabClick(event, product.id)}
          >
            <span>{product.name}</span>
            {'note' in product && <small>{product.note}</small>}
          </a>
        );
      })}
      <a
        className={`product-tab freelancer-tab${activeTabId === 'freelancer' ? ' is-selected' : ''}`}
        href={`${import.meta.env.BASE_URL}freelancer`}
        data-product="freelancer"
        aria-current={selectedProductId === 'freelancer' ? 'page' : undefined}
        tabIndex={decorativeCopy ? -1 : undefined}
        onClick={(event) => handleHeaderTabClick(event, 'freelancer')}
      >
        Freelancer
      </a>
      <a
        href={ebookAmazonBookUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-product="ebook-buy"
        tabIndex={decorativeCopy ? -1 : undefined}
        className={`product-tab ebook-tab${activeTabId === 'ebook-buy' ? ' is-selected' : ''}`}
        onClick={(event) => handleHeaderTabClick(event, 'ebook-buy')}
      >
        Ebook Buy
      </a>
      <a
        className={`product-tab payment-tab${activeTabId === 'payment' ? ' is-selected' : ''}`}
        href={`${import.meta.env.BASE_URL}payment`}
        data-product="payment"
        aria-current={paymentActive ? 'page' : undefined}
        tabIndex={decorativeCopy ? -1 : undefined}
        onClick={(event) => handleHeaderTabClick(event, 'payment')}
      >
        Payment
      </a>
      <a
        className={`product-tab internship-tab${activeTabId === 'remote-internship' ? ' is-selected' : ''}`}
        href={`${import.meta.env.BASE_URL}remote-internship`}
        data-product="remote-internship"
        aria-current={internshipActive ? 'page' : undefined}
        tabIndex={decorativeCopy ? -1 : undefined}
        onClick={(event) => handleHeaderTabClick(event, 'remote-internship')}
      >
        Remote Internship
      </a>
    </>
  );

  return (
    <>
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">AR</div>
        <div className="topbar-copy">
          <div className="topbar-note">AshaRatna Tech</div>
          <div className="topbar-location">Pune 44</div>
          <div className="topbar-visitor-count" title="Manually copied from Replit Growth">
            <span>Replit Growth</span>
            <strong>{PUBLIC_VISITOR_TOTAL.toLocaleString('en-IN')} visitors</strong>
          </div>
        </div>
        <InstallAppButton />
      </header>
      <nav className="product-navigation" aria-label="About, products, freelancer services, government form filling, ebook, payment and internship">
        <div className="product-tabs-window">
          <div className="product-tabs-track" style={tabMarqueeStyle}>
            {Array.from({ length: 2 }, (_, groupIndex) => {
              const decorativeCopy = groupIndex > 0;

              return (
                <div
                  key={groupIndex}
                  className="product-tabs"
                  aria-hidden={decorativeCopy || undefined}
                >
                  {renderProductTabs(decorativeCopy)}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="details">
      <div>
        <div className="owner-details">
          <div className="owner" data-testid="text-owner">Asha Mohite</div>
          <a
            className="owner-link"
            href="https://www.linkedin.com/in/asha-mohite-49749b3a2?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Asha Mohite's LinkedIn profile"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
        <small className="legal" data-testid="text-gst">
          GST NO. 27FXUPP8652K1Z9
        </small>
        <address className="business-address">
          <span>Business address</span>
          Sector 21, Scheme 11, Building 20/4, Sketting Ground, SPM School Road,
          Nigdi, Pune 411044, Maharashtra, India
        </address>
      </div>
      <div className="contact-block">
        <a
          className="contact-link"
          href="mailto:connect@asharatnatech.com"
          data-testid="link-contact-email"
          aria-label="Email connect@asharatnatech.com"
        >
          <span>connect@asharatnatech.com</span>
          <span className="contact-arrow" aria-hidden="true">↗</span>
        </a>
        <div className="support-contact" aria-label="Support contact options">
          <span className="support-label">Support</span>
          <span className="support-number">+91 87884 86350</span>
          <div className="support-actions">
            <a
              className="support-action"
              href="tel:+918788486350"
              aria-label="Call AshaRatna Tech support"
            >
              Call
            </a>
            <a
              className="support-action"
              href="https://wa.me/918788486350"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message AshaRatna Tech support on WhatsApp"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <nav className="social-links" aria-label="Social and technology platforms">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noreferrer"
          >
            {social.name}
          </a>
        ))}
      </nav>
      <nav className="policy-links" aria-label="Legal policies">
        <a href={`${import.meta.env.BASE_URL}terms`}>Terms of Service</a>
        <a href={`${import.meta.env.BASE_URL}privacy`}>Privacy Policy</a>
        <a href={`${import.meta.env.BASE_URL}refund-cancellation`}>
          Refund &amp; Cancellation
        </a>
      </nav>
      <ChannelPartners />
      <small className="copyright-notice">
        © 2026 AshaRatna Tech. All rights reserved.
      </small>
    </footer>
  );
}

function SiteLayout({
  children,
  aboutActive = false,
  selectedProductId,
  paymentActive = false,
  internshipActive = false,
  ebookActive = false,
  homeHero = false,
}: {
  children: ReactNode;
  aboutActive?: boolean;
  selectedProductId?: string;
  paymentActive?: boolean;
  internshipActive?: boolean;
  ebookActive?: boolean;
  homeHero?: boolean;
}) {
  return (
    <main className="site-shell">
      <div className={`site-frame${homeHero ? ' home-frame' : ''}`}>
        <SiteHeader
          aboutActive={aboutActive}
          selectedProductId={selectedProductId}
          paymentActive={paymentActive}
          internshipActive={internshipActive}
          ebookActive={ebookActive}
        />
        {children}
        <SiteFooter />
      </div>
    </main>
  );
}

function ChannelPartners() {
  const marqueeStyle = {
    '--partner-marquee-duration': `${Math.max(30, channelPartners.length * 12)}s`,
  } as CSSProperties;

  return (
    <section className="channel-partners" aria-labelledby="channel-partners-title">
      <header className="channel-partners-heading">
        <p className="channel-partners-eyebrow">AshaRatna Tech / Partners</p>
        <h2 id="channel-partners-title">Channel partners</h2>
      </header>
      <div className="partner-marquee" role="region" aria-label="Channel partner logos">
        <div className="partner-marquee-track" style={marqueeStyle}>
          {Array.from({ length: partnerMarqueeCopies }, (_, groupIndex) => {
            const decorativeCopy = groupIndex > 0;

            return (
              <ul
                key={groupIndex}
                className="partner-marquee-group"
                aria-hidden={decorativeCopy || undefined}
              >
                {channelPartners.map((partner) => (
                  <li key={partner.name}>
                    <a
                      className="partner-marquee-item"
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={decorativeCopy ? -1 : undefined}
                    >
                      <span className="partner-logo-frame">
                        <img
                          src={partner.logo}
                          alt=""
                          width={52}
                          height={52}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="partner-name">{partner.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <SiteLayout homeHero>
      <>
        <section className="hero hero-photo" aria-labelledby="company-name">
          <img
            className="hero-photo-image"
            src={`${import.meta.env.BASE_URL}asharatna-home-hero-edited.jpg`}
            alt="Portrait photo featured in the AshaRatna Tech homepage"
            width={1024}
            height={1024}
            fetchPriority="high"
          />
          <div className="hero-copy">
            <h1 className="hero-title" id="company-name">
              <span className="sweep-text">AI and Automation Solutions</span>
            </h1>
            <p className="hero-service">
              AI calling, manufacturing automation, IoT, <span>and software</span> solutions
            </p>
            <div className="hero-rule" aria-hidden="true" />
          </div>
        </section>
        <section className="photo-gallery" aria-labelledby="gallery-title">
          <div className="gallery-intro">
            <p className="gallery-eyebrow">AshaRatna Tech / Gallery</p>
            <h2 id="gallery-title">Photo Gallery</h2>
            <div className="gallery-rule" aria-hidden="true" />
          </div>
          <div className="gallery-grid">
            <figure className="gallery-card">
              <a
                className="gallery-image-link"
                href={uploadedGalleryPhoto}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the uploaded screenshot at full size"
              >
                <img
                  className="gallery-image"
                  src={uploadedGalleryPhoto}
                  alt="Uploaded AshaRatna Tech screenshot"
                  width={720}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>Uploaded screenshot</figcaption>
            </figure>
            <figure className="gallery-card">
              <a
                className="gallery-image-link"
                href={aiCallGalleryImage}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the AI Call and Chat promotional screenshot at full size"
              >
                <img
                  className="gallery-image"
                  src={aiCallGalleryImage}
                  alt="AshaRatna Tech AI Call and Chat platform promotion in neon green on a blue background"
                  width={720}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>AI Call &amp; Chat Platform</figcaption>
            </figure>
            <figure className="gallery-card">
              <a
                className="gallery-image-link"
                href={aiManufacturingGalleryImage}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the AI Manufacturing System promotional screenshot at full size"
              >
                <img
                  className="gallery-image"
                  src={aiManufacturingGalleryImage}
                  alt="AshaRatna Tech AI Manufacturing System order-to-delivery automation platform"
                  width={720}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>AI Manufacturing System</figcaption>
            </figure>
            <figure className="gallery-card">
              <a
                className="gallery-image-link"
                href={patentApplicationGalleryImage}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the AI Money Maker patent application page at full size"
              >
                <img
                  className="gallery-image"
                  src={patentApplicationGalleryImage}
                  alt="Indian patent application page for the AI Money Maker system, application number 202521074434"
                  width={576}
                  height={606}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>AI Money Maker · Patent Application No. 202521074434</figcaption>
            </figure>
            <figure className="gallery-card">
              <a
                className="gallery-image-link"
                href={aiAppTesterGalleryImage}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the Asha AI App Tester screenshot at full size"
              >
                <img
                  className="gallery-image"
                  src={aiAppTesterGalleryImage}
                  alt="Asha AI App Tester automated security testing platform sign-in screen"
                  width={720}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>Asha AI App Tester</figcaption>
            </figure>
            <figure className="gallery-card director-gallery-card">
              <a
                className="gallery-image-link director-gallery-image-link"
                href={anupMohiteGalleryImage}
                target="_blank"
                rel="noreferrer"
                aria-label="Open Anup Mohite's portrait at full size"
              >
                <img
                  className="gallery-image"
                  src={anupMohiteGalleryImage}
                  alt="Portrait of Anup Mohite, director at AshaRatna Tech"
                  width={66}
                  height={69}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>Director · Anup Mohite</figcaption>
            </figure>
            <figure className="gallery-card">
              <a
                className="gallery-image-link"
                href={ashaMohiteOwnerImage}
                target="_blank"
                rel="noreferrer"
                aria-label="Open Asha Mohite's portrait at full size"
              >
                <img
                  className="gallery-image"
                  src={ashaMohiteOwnerImage}
                  alt="Portrait of Asha Mohite, owner of AshaRatna Tech"
                  width={757}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>Asha Mohite · Owner</figcaption>
            </figure>
            <figure className="gallery-card">
              <a
                className="gallery-image-link"
                href={polarisePatentDiscussionImage}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the Polarise patent-pending discussion photo at full size"
              >
                <img
                  className="gallery-image"
                  src={polarisePatentDiscussionImage}
                  alt="Two people at Polarise for a patent-pending discussion"
                  width={720}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>At Polarise for Patent Pending Discussion.</figcaption>
            </figure>
            <figure className="gallery-card">
              <a
                className="gallery-image-link"
                href={ourCreationGalleryImage}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the office portrait at full size"
              >
                <img
                  className="gallery-image"
                  src={ourCreationGalleryImage}
                  alt="Professional portrait in an office setting"
                  width={1086}
                  height={1448}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>Our creation</figcaption>
            </figure>
          </div>
        </section>
      </>
    </SiteLayout>
  );
}

function AboutPage() {
  return (
    <SiteLayout aboutActive>
      <AboutContent />
    </SiteLayout>
  );
}

type ServiceContentSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

type ServiceFaq = {
  question: string;
  answer: string;
};

type ServiceRelatedLink = {
  href: string;
  label: string;
};

type SeoServicePageData = {
  path: string;
  heading: string;
  eyebrow: string;
  summary: string;
  contentSections: ServiceContentSection[];
  faqs?: ServiceFaq[];
  cta?: {
    href: string;
    label: string;
    heading?: string;
    description?: string;
    whatsappHref?: string;
    whatsappLabel?: string;
  };
  relatedLinks?: ServiceRelatedLink[];
};

function SeoServicePage({ path }: { path: string }) {
  const configuredPage = seoConfig.pages.find((page) => page.path === path);
  if (!configuredPage || !('contentSections' in configuredPage)) {
    return <NotFound />;
  }

  const page = configuredPage as unknown as SeoServicePageData;
  const pageId = page.path.replace(/^\//, '');
  const isGovernmentFormsPage = page.path === '/govt-form-filling';
  const selectedProductId =
    page.path === '/website-app-testing'
      ? 'remote-app-website-testing'
      : page.path === '/seo-services'
        ? 'seo-websites-apps'
        : page.path === '/freelancer'
          ? 'freelancer'
          : page.path === '/govt-form-filling'
            ? 'govt-form-filling'
          : undefined;

  return (
    <SiteLayout selectedProductId={selectedProductId}>
      <article
        className="seo-service-page"
        aria-labelledby={isGovernmentFormsPage ? 'gfd-page-title' : `${pageId}-title`}
      >
        {page.cta && !isGovernmentFormsPage ? (
          <aside
            className="seo-service-contact seo-service-contact-banner"
            aria-labelledby={`${pageId}-contact-title`}
          >
            <h2 id={`${pageId}-contact-title`}>
              {page.cta.heading ?? 'Discuss your project'}
            </h2>
            <p>
              {page.cta.description ??
                'Share your website or web app and the goals you want to work on. AshaRatna Tech can discuss a suitable scope.'}
            </p>
            <div className="seo-service-actions">
              {page.cta.whatsappHref ? (
                <a
                  className="payment-action seo-service-action seo-service-whatsapp"
                  href={page.cta.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`${pageId}-whatsapp`}
                >
                  {page.cta.whatsappLabel ?? 'Share URL on WhatsApp'}
                </a>
              ) : null}
              <a
                className="payment-action seo-service-action"
                href={page.cta.href}
                data-testid={`${pageId}-contact`}
              >
                {page.cta.label}
              </a>
            </div>
          </aside>
        ) : null}

        {isGovernmentFormsPage ? (
          <GovernmentFormsDirectory heading={page.heading} summary={page.summary} />
        ) : (
          <header className="seo-service-header">
            <p className="payment-eyebrow">{page.eyebrow}</p>
            <h1 id={`${pageId}-title`}>{page.heading}</h1>
            <p className="seo-service-intro">{page.summary}</p>
          </header>
        )}

        <div className="seo-service-content">
          {page.contentSections.map((section, index) => (
            <section
              className="seo-service-section"
              key={section.heading}
              aria-labelledby={`${pageId}-section-${index}`}
            >
              <h2 id={`${pageId}-section-${index}`}>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {page.faqs?.length ? (
            <section className="seo-service-faqs" aria-labelledby={`${pageId}-faqs`}>
              <h2 id={`${pageId}-faqs`}>Frequently asked questions</h2>
              {page.faqs.map((faq) => (
                <article className="seo-service-faq" key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </section>
          ) : null}

          {page.relatedLinks?.length ? (
            <nav className="seo-service-related" aria-label="Related services">
              <h2>Explore related pages</h2>
              <ul>
                {page.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </article>
    </SiteLayout>
  );
}

function WebsiteAppTestingPage() {
  return <SeoServicePage path="/website-app-testing" />;
}

function SeoServicesPage() {
  return <SeoServicePage path="/seo-services" />;
}

function FreelancerPage() {
  return <SeoServicePage path="/freelancer" />;
}

function GovtFormFillingPage() {
  return <SeoServicePage path="/govt-form-filling" />;
}

function PaymentPage() {
  const selectedId = new URLSearchParams(window.location.search).get('product');
  const selectedProduct = products.find((product) => product.id === selectedId);
  const emailSubject = selectedProduct
    ? encodeURIComponent(`Payment enquiry: ${selectedProduct.name}`)
    : '';

  return (
    <SiteLayout
      selectedProductId={selectedProduct?.id}
      paymentActive={!selectedProduct}
    >
      <section className="payment-page" aria-labelledby="payment-title">
        <div className="payment-card">
          <p className="payment-eyebrow">ASHA RATNA TECH · PAYMENT</p>
          <h1 id="payment-title">Payment details</h1>
          {selectedProduct ? (
            <>
              <p className="payment-label">Selected service</p>
              <h2>{selectedProduct.name}</h2>
              {'note' in selectedProduct && (
                <span className="patent-note">{selectedProduct.note}</span>
              )}
              <p className="payment-description">
                Email us to confirm the price and arrange payment for this service.
              </p>
              <a
                className="payment-action"
                href={`mailto:connect@asharatnatech.com?subject=${emailSubject}`}
              >
                Email for payment details
              </a>
              {selectedProduct.id === 'payroll-app' && (
                <>
                  <a
                    className="payment-action"
                    href="https://mobileattendance-asharatna.replit.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Payroll App
                  </a>
                  <a
                    className="payment-action payroll-domain-action"
                    href="https://payroll.asharatnatech.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    payroll.asharatnatech.com
                  </a>
                </>
              )}
            </>
          ) : (
            <>
              <p className="payment-description">
                Pay online through Razorpay using the link below. Select a product tab for service-specific payment details.
              </p>
              <a
                className="payment-action"
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pay with Razorpay
              </a>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function EbookBuyPage() {
  return (
    <SiteLayout ebookActive>
      <section className="payment-page ebook-page" aria-labelledby="ebook-title">
        <div className="payment-card ebook-card">
          <p className="payment-eyebrow">ASHA RATNA TECH · EBOOK</p>
          <h1 id="ebook-title">Build a Static Website with Replit and Vercel</h1>
          <p className="payment-label">Book title</p>
          <h2>{ebookTitle}</h2>
          <p className="ebook-subtitle">{ebookSubtitle}</p>
          <p className="ebook-price">
            ₹5,001 <span>including GST</span>
          </p>
          <p className="payment-description">
            {ebookDescription} Available on Amazon India using the link below.
          </p>
          <a
            className="payment-action ebook-action"
            href={ebookAmazonSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Find the ebook on Amazon India
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}

type InputSanitizer = (value: string) => string;

function sanitizeSingleLine(value: string, maxLength: number) {
  return Array.from(
    value
      .replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, ' ')
      .replace(/\s+/g, ' ')
      .trimStart(),
  )
    .slice(0, maxLength)
    .join('');
}

function sanitizeEmail(value: string) {
  return value.replace(/[\s\u0000-\u001f\u007f-\u009f]/g, '').slice(0, 254);
}

function sanitizePhone(value: string) {
  const allowed = value
    .replace(/[^\d+().\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trimStart();
  const normalized = allowed.startsWith('+')
    ? `+${allowed.slice(1).replace(/\+/g, '')}`
    : allowed.replace(/\+/g, '');

  return Array.from(normalized).slice(0, 25).join('');
}

function applyInputSanitizer(
  event: FormEvent<HTMLInputElement>,
  sanitizer: InputSanitizer,
) {
  const input = event.currentTarget;
  const original = input.value;
  const selectionStart = input.type === 'email' ? null : input.selectionStart;
  const selectionEnd = input.type === 'email' ? null : input.selectionEnd;
  const sanitized = sanitizer(original);

  input.setCustomValidity('');
  if (sanitized === original) return;

  input.value = sanitized;
  if (selectionStart !== null && selectionEnd !== null) {
    const nextStart = sanitizer(original.slice(0, selectionStart)).length;
    const nextEnd = sanitizer(original.slice(0, selectionEnd)).length;
    input.setSelectionRange(
      Math.min(nextStart, sanitized.length),
      Math.min(nextEnd, sanitized.length),
    );
  }
}

function RemoteInternshipPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const application = {
      name: sanitizeSingleLine(String(formData.get('name') ?? ''), 100).trim(),
      qualification: sanitizeSingleLine(String(formData.get('qualification') ?? ''), 150).trim(),
      phone: sanitizePhone(String(formData.get('phone') ?? '')).trim(),
      email: sanitizeEmail(String(formData.get('email') ?? '')).trim(),
      city: sanitizeSingleLine(String(formData.get('city') ?? ''), 100).trim(),
    };
    const fields = {
      name: form.elements.namedItem('name') as HTMLInputElement,
      qualification: form.elements.namedItem('qualification') as HTMLInputElement,
      phone: form.elements.namedItem('phone') as HTMLInputElement,
      email: form.elements.namedItem('email') as HTMLInputElement,
      city: form.elements.namedItem('city') as HTMLInputElement,
    };

    for (const field of Object.values(fields)) {
      field.setCustomValidity('');
    }
    fields.name.value = application.name;
    fields.qualification.value = application.qualification;
    fields.phone.value = application.phone;
    fields.email.value = application.email;
    fields.city.value = application.city;

    const requiredValues = [
      ['name', application.name, 'Enter your name.'],
      ['qualification', application.qualification, 'Enter your qualification.'],
      ['email', application.email, 'Enter your email address.'],
      ['city', application.city, 'Enter your city.'],
    ] as const;
    for (const [fieldName, value, message] of requiredValues) {
      if (!value) {
        fields[fieldName].setCustomValidity(message);
        fields[fieldName].reportValidity();
        return;
      }
    }

    const phoneDigitCount = (application.phone.match(/\d/g) ?? []).length;
    if (phoneDigitCount < 7 || phoneDigitCount > 15) {
      fields.phone.setCustomValidity('Enter a phone number with 7 to 15 digits.');
      fields.phone.reportValidity();
      return;
    }

    const subject = encodeURIComponent(`Remote Internship Application - ${application.name}`);
    const body = encodeURIComponent([
      `Name: ${application.name}`,
      `Qualification: ${application.qualification}`,
      `Phone number: ${application.phone}`,
      `Email: ${application.email}`,
      `City: ${application.city}`,
    ].join('\n'));

    window.location.href = `mailto:connect@asharatnatech.com?subject=${subject}&body=${body}`;
  }

  return (
    <SiteLayout internshipActive>
      <section className="internship-page" aria-labelledby="internship-title">
        <div className="internship-card">
          <p className="internship-eyebrow">AshaRatna Tech · Careers</p>
          <h1 id="internship-title">Remote Internship</h1>
          <p className="internship-description">
            Share your details to apply for a remote internship.
          </p>
          <form className="internship-form" onSubmit={handleSubmit}>
            <div className="internship-form-grid">
              <label className="internship-field">
                Name
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  maxLength={100}
                  onInput={(event) => applyInputSanitizer(event, (value) => sanitizeSingleLine(value, 100))}
                  required
                />
              </label>
              <label className="internship-field">
                Qualification
                <input
                  name="qualification"
                  type="text"
                  autoComplete="off"
                  placeholder="Your qualification"
                  maxLength={150}
                  onInput={(event) => applyInputSanitizer(event, (value) => sanitizeSingleLine(value, 150))}
                  required
                />
              </label>
              <label className="internship-field">
                Phone number
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Your phone number"
                  maxLength={25}
                  onInput={(event) => applyInputSanitizer(event, sanitizePhone)}
                  required
                />
              </label>
              <label className="internship-field">
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  maxLength={254}
                  onInput={(event) => applyInputSanitizer(event, sanitizeEmail)}
                  required
                />
              </label>
              <label className="internship-field internship-city">
                City
                <input
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Your city"
                  maxLength={100}
                  onInput={(event) => applyInputSanitizer(event, (value) => sanitizeSingleLine(value, 100))}
                  required
                />
              </label>
            </div>
            <button className="internship-submit" type="submit">Send</button>
            <p className="internship-note" id="internship-note">
              Send opens a pre-filled email to connect@asharatnatech.com.
            </p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={AboutPage} />
        <Route path="/about/" component={AboutPage} />
        <Route path="/website-app-testing" component={WebsiteAppTestingPage} />
        <Route path="/website-app-testing/" component={WebsiteAppTestingPage} />
        <Route path="/seo-services" component={SeoServicesPage} />
        <Route path="/seo-services/" component={SeoServicesPage} />
        <Route path="/freelancer" component={FreelancerPage} />
        <Route path="/freelancer/" component={FreelancerPage} />
        <Route path="/govt-form-filling" component={GovtFormFillingPage} />
        <Route path="/govt-form-filling/" component={GovtFormFillingPage} />
        <Route path="/payment" component={PaymentPage} />
        <Route path="/payment/" component={PaymentPage} />
        <Route path="/ebook-buy" component={EbookBuyPage} />
        <Route path="/ebook-buy/" component={EbookBuyPage} />
        <Route path="/remote-internship" component={RemoteInternshipPage} />
        <Route path="/remote-internship/" component={RemoteInternshipPage} />
        <Route path="/terms" component={() => <SeoServicePage path="/terms" />} />
        <Route path="/terms/" component={() => <SeoServicePage path="/terms" />} />
        <Route path="/privacy" component={() => <SeoServicePage path="/privacy" />} />
        <Route path="/privacy/" component={() => <SeoServicePage path="/privacy" />} />
        <Route
          path="/refund-cancellation"
          component={() => <SeoServicePage path="/refund-cancellation" />}
        />
        <Route
          path="/refund-cancellation/"
          component={() => <SeoServicePage path="/refund-cancellation" />}
        />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

const MOBILE_MOTION_TIMEOUT_MS = 120_000;
const MOBILE_MOTION_PAUSED_CLASS = 'mobile-motion-paused';

function useMobileMotionTimeout() {
  useEffect(() => {
    const mobileViewport = window.matchMedia('(max-width: 650px)');
    let remainingMs = MOBILE_MOTION_TIMEOUT_MS;
    let timeoutId: number | undefined;
    let startedAt: number | undefined;

    document.documentElement.classList.remove(MOBILE_MOTION_PAUSED_CLASS);

    const pauseMotion = () => {
      timeoutId = undefined;
      startedAt = undefined;
      remainingMs = 0;
      document.documentElement.classList.add(MOBILE_MOTION_PAUSED_CLASS);
    };

    const pauseTimer = () => {
      if (timeoutId === undefined) return;
      window.clearTimeout(timeoutId);
      timeoutId = undefined;
      if (startedAt !== undefined) {
        remainingMs = Math.max(0, remainingMs - (Date.now() - startedAt));
        startedAt = undefined;
      }
    };

    const startTimer = () => {
      if (!mobileViewport.matches || document.visibilityState !== 'visible') return;
      if (remainingMs <= 0) {
        document.documentElement.classList.add(MOBILE_MOTION_PAUSED_CLASS);
        return;
      }
      if (timeoutId !== undefined) return;

      startedAt = Date.now();
      timeoutId = window.setTimeout(pauseMotion, remainingMs);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') pauseTimer();
      else startTimer();
    };
    const handleViewportChange = () => {
      if (mobileViewport.matches) startTimer();
      else pauseTimer();
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    mobileViewport.addEventListener('change', handleViewportChange);

    return () => {
      pauseTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mobileViewport.removeEventListener('change', handleViewportChange);
    };
  }, []);
}

function App() {
  useMobileMotionTimeout();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <RouteSeo />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
