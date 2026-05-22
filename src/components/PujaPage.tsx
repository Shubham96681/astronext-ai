'use client';

import { Calendar, Clock, User } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { pujasList } from '@/content/pujasData';
import { usePujaBooking } from '@/context/PujaBookingContext';
import TextReveal from '@/components/TextReveal';

const PUJA_STRIP = [
  { icon: '🪔', label: 'Live broadcast' },
  { icon: '📜', label: 'Gotra-specific' },
  { icon: '🙏', label: 'Licensed pandits' },
  { icon: '✨', label: 'Prasad delivery' },
] as const;

export default function PujaPage() {
  const { openPujaModal } = usePujaBooking();

  return (
    <div className="page-section page-section--puja">
      <PageHero
        variant="puja"
        subtitle="Holy yajna"
        title={
          <>
            Book <span>Vedic Pujas</span> Live
          </>
        }
        description="Participate in customized, live broadcast Vedic Pujas performed for your gotra and family details by licensed high-scholastic pundits."
      />

      <div className="inner-feature-strip" data-reveal="fade-up" data-reveal-stagger>
        {PUJA_STRIP.map((item) => (
          <div className="inner-feature-strip__item" key={item.label}>
            <span className="inner-feature-strip__icon" aria-hidden>
              {item.icon}
            </span>
            <span className="inner-feature-strip__label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="section-header" data-reveal="flip-in">
        <h2 className="section-title">Choose your sacred ritual</h2>
        <TextReveal as="p" className="section-desc">
          Each puja includes live darshan and personalized sankalp.
        </TextReveal>
      </div>

      <div className="puja-grid" data-reveal="fade-up" data-reveal-stagger>
        {pujasList.map((puja) => (
          <div className="puja-card interactive-card" key={puja.id}>
            <div className="puja-header">
              <div className="puja-icon-box">
                <Calendar size={26} />
              </div>
              <span className="puja-price-badge">{puja.price}</span>
            </div>
            <h3 className="puja-title">{puja.title}</h3>
            <ul className="puja-benefits">
              {puja.benefits.map((benefit, idx) => (
                <li className="puja-benefit-item" key={idx}>
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="puja-meta">
              <span>
                <Clock size={12} style={{ marginRight: '4px' }} /> {puja.duration}
              </span>
              <span>
                <User size={12} style={{ marginRight: '4px' }} /> {puja.priests} Pandits
              </span>
            </div>
            <button type="button" className="book-puja-btn" onClick={() => openPujaModal(puja)}>
              Schedule Holy Yajna
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
