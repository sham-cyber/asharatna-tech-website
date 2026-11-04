import './about.css';

const coreOffers = [
  {
    id: 'business-software',
    number: '01',
    className: 'business',
    eyebrow: 'BUSINESS SOFTWARE & CUSTOMER COMMUNICATION',
    title: 'Customer tools and software for business workflows.',
    copy: 'AI call and chat tools, CRM and lead services, attendance and payroll apps, websites, software testing, and SEO.',
    items: [
      'AI Call & Chat',
      'CRM & Lead Services',
      'Attendance & Payroll',
      'Websites',
      'Testing & SEO',
    ],
  },
  {
    id: 'industrial-operations',
    number: '02',
    className: 'industrial',
    eyebrow: 'INDUSTRIAL OPERATIONS',
    title: 'Manufacturing & machine systems.',
    copy: 'AI manufacturing, machine automation, motor rewinding services, and IoT.',
    items: ['AI Manufacturing', 'Machine Automation', 'Motor Rewinding', 'IoT'],
  },
];

const additionalOffers = [
  {
    category: 'PRACTICAL ASSISTANCE',
    title: 'Government form filling',
    description: 'Assistance with common central and Maharashtra government forms.',
    href: '/govt-form-filling',
    link: 'Form assistance',
    index: 'A',
  },
  {
    category: 'APP & WEBSITE DEVELOPMENT',
    title: 'Freelancer services',
    description: 'Explore app and website development services listed under Freelancer.',
    href: '/freelancer',
    link: 'Freelancer services',
    index: 'B',
  },
  {
    category: 'LEARNING RESOURCE',
    title: 'A static-site ebook',
    description: 'A guide to building a static site with Replit and Vercel.',
    href: '/ebook-buy',
    link: 'View ebook',
    index: 'C',
  },
  {
    category: 'REMOTE OPPORTUNITY',
    title: 'Remote internship',
    description: 'See the remote internship application details.',
    href: '/remote-internship',
    link: 'Internship details',
    index: 'D',
  },
];

const routeHref = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export default function AboutContent() {
  return (
    <div className="about-redesign">
      <nav className="ra-nav" aria-label="About page sections">
        <span className="ra-nav-label">About / 01</span>
        <div className="ra-nav-links">
          <a href="#what-we-do">What we do</a>
          <a href="#other-services">Other services</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="ra-hero" id="top" aria-labelledby="ra-title">
        <div className="ra-hero-copy-block">
          <p className="ra-kicker">AshaRatna Tech · About</p>
          <h1 id="ra-title">
            Business software. <span>Industrial technology.</span>
          </h1>
          <p className="ra-hero-copy">
            AshaRatna Tech offers business software and customer communication
            products alongside industrial operations technology. Its listed
            work includes AI calling and chat, CRM and lead services, attendance
            and payroll apps, websites, AI manufacturing, machine automation,
            motor rewinding, and IoT.
          </p>
          <div className="ra-hero-actions">
            <a className="ra-button" href="#what-we-do">
              Explore the offer{' '}
              <span className="ra-button-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
            <a
              className="ra-text-link"
              href="mailto:connect@asharatnatech.com"
            >
              Product &amp; service enquiries
            </a>
          </div>
        </div>

        <aside
          className="ra-schematic"
          aria-label="AshaRatna Tech's two technology capability tracks"
        >
          <div className="ra-schematic-head">
            <span>OFFER MAP / 01—02</span>
            <span>ASHA RATNA TECH</span>
          </div>
          <div className="ra-map-lanes">
            <div className="ra-map-lane">
              <span className="ra-map-label">
                BUSINESS SOFTWARE &amp; CUSTOMER COMMUNICATION
              </span>
              <div className="ra-map-items">
                <span>AI calling &amp; chat</span>
                <span>CRM &amp; lead services</span>
                <span>Attendance &amp; payroll apps</span>
                <span>Websites, testing &amp; SEO</span>
              </div>
            </div>
            <div className="ra-map-lane">
              <span className="ra-map-label">INDUSTRIAL OPERATIONS</span>
              <div className="ra-map-items">
                <span>AI manufacturing</span>
                <span>Machine automation</span>
                <span>Motor rewinding</span>
                <span>IoT</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <nav className="ra-index" aria-label="Core capability tracks">
        <a className="ra-index-item" href="#business-software">
          <span className="ra-index-number">01 /</span>
          <span className="ra-index-copy">
            <strong>Business software &amp; customer communication</strong>
            <span>AI calls, chat, CRM, apps, and web services</span>
          </span>
        </a>
        <a className="ra-index-item" href="#industrial-operations">
          <span className="ra-index-number">02 /</span>
          <span className="ra-index-copy">
            <strong>Industrial operations</strong>
            <span>Manufacturing, machines, motors, and IoT</span>
          </span>
        </a>
      </nav>

      <section
        className="ra-section"
        id="what-we-do"
        aria-labelledby="ra-offer-title"
      >
        <div className="ra-wrap">
          <div className="ra-section-heading">
            <div>
              <p className="ra-section-kicker">The core offer / 01—02</p>
              <h2 id="ra-offer-title">Two areas of work.</h2>
            </div>
            <p>
              Business software and customer communication sit alongside
              manufacturing, machine automation, and connected systems.
            </p>
          </div>
          <div className="ra-offer-list">
            {coreOffers.map((offer) => (
              <article
                className={`ra-offer-row ${offer.className}`}
                id={offer.id}
                key={offer.number}
              >
                <span className="ra-offer-num">{offer.number}</span>
                <div className="ra-offer-heading">
                  <span className="ra-offer-eyebrow">{offer.eyebrow}</span>
                  <h3 className="ra-offer-title">{offer.title}</h3>
                </div>
                <p className="ra-offer-copy">{offer.copy}</p>
                <div
                  className="ra-offer-tags"
                  aria-label={`${offer.eyebrow} capabilities`}
                >
                  {offer.items.map((item) => (
                    <span className="ra-tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="ra-secondary"
        id="other-services"
        aria-labelledby="ra-secondary-title"
      >
        <div className="ra-wrap">
          <div className="ra-secondary-heading">
            <p className="ra-section-kicker">Beyond the core</p>
            <h2 id="ra-secondary-title">More services and resources.</h2>
            <p>
              The site also lists government-form assistance, app and website
              development, an ebook, and a remote internship.
            </p>
          </div>
          <div className="ra-extras">
            {additionalOffers.map((offer) => (
              <a
                className="ra-extra"
                href={routeHref(offer.href)}
                key={offer.index}
              >
                <div className="ra-extra-top">
                  <span className="ra-extra-index">{offer.index} / 04</span>
                  <span className="ra-extra-category">{offer.category}</span>
                </div>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <span className="ra-extra-link">
                  {offer.link} <span aria-hidden="true">↗</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="ra-contact"
        id="contact"
        aria-labelledby="ra-contact-title"
      >
        <div className="ra-wrap ra-contact-grid">
          <div>
            <p className="ra-section-kicker">Company contact</p>
            <h2 id="ra-contact-title">Have a product or service enquiry?</h2>
            <p className="ra-contact-copy">
              Get in touch with AshaRatna Tech by email.
            </p>
            <p className="ra-contact-owner">
              <strong>Asha Mohite</strong> is listed as the owner of AshaRatna
              Tech.
            </p>
            <p className="ra-contact-registration">
              GST Registration No. (GSTIN): <strong>27FXUPP8652K1Z9</strong>
              <br />
              Udyam Registration No.: <strong>UDYAM-MH-26-1201729</strong>
              <br />
              Enterprise name on certificate: <strong>ASHARATNA TECH</strong>
            </p>
          </div>
          <a className="ra-email" href="mailto:connect@asharatnatech.com">
            connect@asharatnatech.com <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}
