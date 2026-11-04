import { useMemo, useState } from 'react';
import governmentForms from './government-form-services.json';
import './GovernmentFormsDirectory.css';

type GovernmentFormService = (typeof governmentForms.services)[number];

const WHATSAPP_NUMBER = '918788486350';
const CONTACT_EMAIL = 'connect@asharatnatech.com';

function makeMessage(serviceName: string) {
  return `Hello AshaRatna Tech, I would like to enquire about ${serviceName}. Please share the next steps and any assistance fee in writing.`;
}

function GovernmentFormCard({ service }: { service: GovernmentFormService }) {
  const message = makeMessage(service.name);
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const emailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Enquiry: ${service.name}`)}&body=${encodeURIComponent(message)}`;

  return (
    <article className="gfd-card" data-testid={`card-service-${service.id}`}>
      <div className="gfd-card-topline">
        <span className="gfd-category">{service.category}</span>
        <span className="gfd-card-index" aria-hidden="true">FORM / {service.id.toUpperCase()}</span>
      </div>
      <h2 className="gfd-service-name" data-testid={`text-service-name-${service.id}`}>{service.name}</h2>
      <p className="gfd-description">{service.description}</p>

      <div className="gfd-fee-grid">
        <section className="gfd-fee-block gfd-fee-official" data-testid={`text-government-fee-${service.id}`}>
          <h3><span className="gfd-fee-marker" aria-hidden="true">01</span> Official government fee</h3>
          <p>{service.governmentCost}</p>
        </section>
        <section className="gfd-fee-block gfd-fee-market" data-testid={`text-market-comparison-${service.id}`}>
          <h3><span className="gfd-fee-marker" aria-hidden="true">02</span> Market / provider comparison</h3>
          <p>{service.comparison}</p>
          {service.marketSource && (
            <a
              className="gfd-source-link gfd-market-source"
              href={service.marketSource.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-market-source-${service.id}`}
            >
              {service.marketSource.label}<span aria-hidden="true"> ↗</span>
            </a>
          )}
        </section>
      </div>

      <section className="gfd-assistance" data-testid={`text-asharatna-fee-${service.id}`}>
        <span className="gfd-assistance-label">AshaRatna assistance</span>
        <p>{service.ashaRatnaPrice ?? 'A written quote is confirmed before work begins. Government charges are separate.'}</p>
      </section>

      <div className="gfd-card-footer">
        <div className="gfd-sources">
          <h3>Official sources</h3>
          <ul>
            {service.officialSources.map((source, index) => (
              <li key={`${source.url}-${index}`}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-official-source-${service.id}-${index + 1}`}
                >
                  {source.label}<span aria-hidden="true"> ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="gfd-enquiries" role="group" aria-label={`Enquire about ${service.name}`}>
          <a
            className="gfd-contact gfd-contact-whatsapp"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask about ${service.name} on WhatsApp`}
            data-testid={`link-whatsapp-${service.id}`}
          >
            WhatsApp · +91 87884 86350 <span aria-hidden="true">↗</span>
          </a>
          <a
            className="gfd-contact gfd-contact-email"
            href={emailHref}
            aria-label={`Email about ${service.name}`}
            data-testid={`link-email-${service.id}`}
          >
            Email · connect@asharatnatech.com <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function GovernmentFormsDirectory({
  heading,
  summary,
}: {
  heading: string;
  summary: string;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const filteredServices = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return governmentForms.services.filter((service) => {
      const matchesCategory = category === 'all' || service.category === category;
      const searchableText = [
        service.name,
        service.category,
        service.description,
        service.governmentCost,
        service.comparison,
      ].join(' ').toLocaleLowerCase();
      return matchesCategory && (!term || searchableText.includes(term));
    });
  }, [category, search]);

  return (
    <section className="gfd-directory" aria-labelledby="gfd-page-title" data-testid="government-forms-directory">
      <div className="gfd-wrap">
        <header className="gfd-header">
          <p className="gfd-eyebrow"><span aria-hidden="true" /> GOVERNMENT FORM DIRECTORY</p>
          <div className="gfd-hero">
            <div>
              <h1 id="gfd-page-title">{heading}</h1>
              <p className="gfd-intro">
                {summary}
              </p>
            </div>
            <aside className="gfd-checkpoint">
              <span className="gfd-checkpoint-label">SOURCE CHECKED</span>
              <strong>{governmentForms.checkedOn}</strong>
              <span>Always confirm current requirements with the official source.</span>
            </aside>
          </div>
          <div className="gfd-disclaimer" role="note" data-testid="notice-not-government">
            <span className="gfd-notice-symbol" aria-hidden="true">!</span>
            <p><strong>Independent assistance, not a government office.</strong> AshaRatna Tech is a Pune-based technology and business-service provider and is not affiliated with any government department.</p>
          </div>
          <div className="gfd-security-note" role="note" data-testid="notice-sensitive-information">
            Do not send Aadhaar or PAN images, OTPs, or passwords through ordinary WhatsApp or email.
          </div>
        </header>

        <section className="gfd-directory-section" aria-labelledby="gfd-list-heading">
          <div className="gfd-section-heading">
            <div>
              <span className="gfd-section-kicker">FIND YOUR FORM</span>
              <h2 id="gfd-list-heading">Common services, clearly compared.</h2>
            </div>
            <span className="gfd-total" data-testid="text-total-services">{governmentForms.services.length} SERVICES</span>
          </div>
          <div className="gfd-controls">
            <label className="gfd-search-control">
              <span className="gfd-control-label">Search forms</span>
              <span className="gfd-search-input-wrap">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder="Name, category, fee or detail"
                  aria-label="Search by form name, category, description, cost or comparison"
                  data-testid="input-search-forms"
                />
                {search && (
                  <button
                    type="button"
                    className="gfd-clear-search"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    data-testid="button-clear-search"
                  >Clear</button>
                )}
              </span>
            </label>
            <label className="gfd-category-control">
              <span className="gfd-control-label">Filter by category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.currentTarget.value)}
                aria-label="Filter forms by category"
                data-testid="select-category-filter"
              >
                <option value="all">All categories</option>
                {governmentForms.categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <p className="gfd-result-count" aria-live="polite" data-testid="status-result-count">
            <strong>{filteredServices.length}</strong> {filteredServices.length === 1 ? 'service' : 'services'} shown
            {(search || category !== 'all') && <span> · filtered results</span>}
          </p>

          {filteredServices.length > 0 ? (
            <div className="gfd-card-list" data-testid="list-services">
              {filteredServices.map((service) => <GovernmentFormCard key={service.id} service={service} />)}
            </div>
          ) : (
            <div className="gfd-empty" role="status" data-testid="status-no-results">
              <span className="gfd-empty-index">NO MATCH / 00</span>
              <h3>No services match that search.</h3>
              <p>Try a different keyword or show every category again.</p>
              <button
                type="button"
                onClick={() => { setSearch(''); setCategory('all'); }}
                data-testid="button-reset-filters"
              >Reset search and filters</button>
            </div>
          )}
        </section>
        <footer className="gfd-footer" data-testid="text-directory-footer">
          <span>ASHARATNA TECH <b>·</b> PUNE</span>
          <span>Government fees are payable through the applicable official process.</span>
        </footer>
      </div>
    </section>
  );
}
