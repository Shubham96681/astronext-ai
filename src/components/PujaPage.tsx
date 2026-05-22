'use client';

import { Calendar, Clock, User } from 'lucide-react';
import { pujasList } from '@/content/pujasData';
import { usePujaBooking } from '@/context/PujaBookingContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function PujaPage() {
  const { openPujaModal } = usePujaBooking();
  useScrollReveal(['/puja']);

  return (
    <div className="page-section">
      <div className="section-header" data-reveal="fade-up">
        <h2 className="section-title">
          Book <span>Vedic Pujas</span> Live
        </h2>
        <p className="section-desc">
          Participate in customized, live broadcast Vedic Pujas performed specifically for your gotra and family details
          by licensed high-scholastic pundits.
        </p>
      </div>

      <div className="puja-grid" data-reveal="fade-up" data-reveal-stagger>
        {pujasList.map((puja) => (
          <div className="puja-card" key={puja.id}>
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
