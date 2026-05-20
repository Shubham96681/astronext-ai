import { useEffect, useRef, useState } from 'react';
import { Send, Star, X } from 'lucide-react';
import astrologersHeroHands from '../assets/generated/astrologers-hero-hands.png';
import { HeroStardust } from './HeroStardust';
import { HERO_TICKER_TEXT, TESTIMONIALS } from '../content/siteCopy';

export interface Astrologer {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviews: number;
  exp: number;
  price: number;
  online: boolean;
  avatar: string;
}

const ASTROLOGERS: Astrologer[] = [
  {
    id: 301,
    name: 'Acharya Vidyabhushan',
    specialty: 'Vedic Astrology & Kundali Expert',
    bio: 'Guiding seekers with precise chart readings, dasha analysis, and practical remedies rooted in classical Vedic tradition.',
    rating: 4.95,
    reviews: 1420,
    exp: 18,
    price: 45,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 302,
    name: 'Priya Chawla',
    specialty: 'Tarot Reading & Relationship Guide',
    bio: 'Specializing in relationship clarity, emotional healing, and intuitive Tarot spreads for life-changing decisions.',
    rating: 4.88,
    reviews: 890,
    exp: 8,
    price: 25,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 303,
    name: 'Shastri Govind Dev',
    specialty: 'KP System & Gemology Guru',
    bio: 'Expert in KP astrology, gemstone recommendations, and sub-lord techniques for accurate timing of events.',
    rating: 4.91,
    reviews: 1105,
    exp: 15,
    price: 35,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 304,
    name: 'Kabir Vats',
    specialty: 'Vedic Numerology & Astro-Vastu',
    bio: 'Blending numerology with Vastu principles to harmonize your home, career path, and personal name vibrations.',
    rating: 4.85,
    reviews: 640,
    exp: 10,
    price: 30,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 305,
    name: 'Dr. Meera Iyer',
    specialty: 'Palmistry & Prashna Shastra',
    bio: 'Offering palmistry insights and Prashna readings for immediate answers to pressing life questions.',
    rating: 4.92,
    reviews: 756,
    exp: 12,
    price: 32,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 306,
    name: 'Pandit Ramesh Joshi',
    specialty: 'Muhurat & Ritual Astrology',
    bio: 'Calculating auspicious Muhurats and prescribing sacred rituals for weddings, ventures, and spiritual milestones.',
    rating: 4.89,
    reviews: 980,
    exp: 22,
    price: 50,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400',
  },
];

type ChatMessage = { sender: 'user' | 'bot'; text: string };

function formatSessionPrice(perMin: number): string {
  return `Rs. ${(perMin * 11).toFixed(2)}`;
}

export default function AstrologersPage() {
  const [activeChat, setActiveChat] = useState<Astrologer | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const startChat = (astro: Astrologer) => {
    setActiveChat(astro);
    setMessages([
      {
        sender: 'bot',
        text: `Pranam! I am ${astro.name}. Share your name, date of birth, time of birth, and your question.`,
      },
    ]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChat) return;

    const userText = chatInput;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const name = activeChat.name;

      if (name.includes('Vidyabhushan')) {
        reply =
          'Your Ascendant lord is strong today. Financial clarity is likely within 14 days. Navgrah Shanti Puja is recommended.';
      } else if (name.includes('Priya')) {
        reply =
          'The Wheel of Fortune appears upright. A positive shift in relationships is approaching—trust your intuition.';
      } else if (name.includes('Govind')) {
        reply =
          'Jupiter aligns with your career house. A Yellow Sapphire remedy and an auspicious Muhurat will help.';
      } else {
        reply =
          'Your chart shows harmony with this year’s vibration. Align daily routine with Vastu for best results.';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <div className="astrologers-page">
      <section className="astrologers-hero">
        <HeroStardust />
        <div className="astrologers-hero__grid">
          <div className="astrologers-hero__copy">
            <h1 className="astrologers-hero__title">
              When the Stars Speak,
              <br />
              We Help You Listen
            </h1>
            <p className="astrologers-hero__desc">
              Discover guidance from some of the most trusted and highly experienced astrologers
            </p>
          </div>
          <div className="astrologers-hero__visual">
            <img
              src={astrologersHeroHands}
              alt="Astrologer reviewing birth charts and writing notes"
              className="astrologers-hero__img"
            />
          </div>
        </div>
      </section>

      <div className="hero-ticker-bar astrologers-ticker">
        <p className="hero-ticker-text">{HERO_TICKER_TEXT}</p>
      </div>

      <section className="astrologers-intro">
        <h2 className="astrologers-intro__title">Connect with India&apos;s Best Astrologers</h2>
        <p className="astrologers-intro__tagline">Experts You Can Trust. Insights You Can Act On</p>
        <div className="astrologers-intro__divider" aria-hidden="true" />
        <p className="astrologers-intro__text">
          Discover guidance from some of the most trusted and highly experienced astrologers, each
          specializing in powerful systems like{' '}
          <strong>
            Vedic Astrology, KP Astrology, Numerology, Tarot, Vastu,
          </strong>{' '}
          and more.
        </p>
        <p className="astrologers-intro__text">
          Our experts combine deep spiritual insight with scientific accuracy to help you find
          clarity, make informed decisions, and align with your true path. Whether you&apos;re
          seeking predictions, remedies, or life guidance—you&apos;re in the right hands.
        </p>
      </section>

      <section className="astrologers-main">
        {!activeChat ? (
          <div className="astrologers-experts-grid">
            {ASTROLOGERS.map((astro) => (
              <article className="astro-expert-card" key={astro.id}>
                <div className="astro-expert-card__body">
                  <div className="astro-expert-card__avatar-wrap">
                    <img src={astro.avatar} alt={astro.name} className="astro-expert-card__avatar" />
                  </div>
                  <h3 className="astro-expert-card__name">{astro.name}</h3>
                  <p className="astro-expert-card__specialty">{astro.specialty}</p>
                  <p className="astro-expert-card__bio">{astro.bio}</p>
                  <div className="astro-expert-card__footer">
                    <span className="astro-expert-card__price">{formatSessionPrice(astro.price)}</span>
                    <button
                      type="button"
                      className="astro-expert-card__cta"
                      onClick={() => startChat(astro)}
                    >
                      Get Expert Advice
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="astrologers-chat-panel">
            <div className="astrologers-chat-panel__header">
              <div className="astrologers-chat-panel__profile">
                <img src={activeChat.avatar} alt="" />
                <div>
                  <h4>{activeChat.name}</h4>
                  <p>{activeChat.specialty}</p>
                </div>
              </div>
              <button
                type="button"
                className="astrologers-chat-panel__close"
                onClick={() => setActiveChat(null)}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
            <div className="astrologers-chat-panel__messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`astrologers-chat-bubble astrologers-chat-bubble--${msg.sender}`}
                >
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="astrologers-chat-bubble astrologers-chat-bubble--bot astrologers-chat-bubble--typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="astrologers-chat-panel__form" onSubmit={sendMessage}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your DOB, birth time, and question..."
                className="astrologers-chat-panel__input"
              />
              <button type="submit" className="astrologers-chat-panel__send" aria-label="Send">
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </section>

      <section className="astrologers-testimonials">
        <h2 className="astrologers-testimonials__title">What Our Clients Say</h2>
        <p className="astrologers-testimonials__subtitle">
          Trusted by thousands seeking clarity through our verified astrologers
        </p>
        <div className="astrologers-testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <blockquote className="astrologers-testimonial-card" key={t.name}>
              <span className="astrologers-testimonial-card__quote-icon" aria-hidden="true">
                <svg width="56" height="40" viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 0C6.268 0 0 6.268 0 14c0 9.5 6.5 18 14 26V14H0V0h14zm28 0c-7.732 0-14 6.268-14 14 0 9.5 6.5 18 14 26V14H28V0h14z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
              <p className="astrologers-testimonial-card__text">{t.text}</p>
              <footer className="astrologers-testimonial-card__footer">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="astrologers-testimonial-card__avatar-img"
                />
                <div className="astrologers-testimonial-card__stars" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#e8b84a" stroke="#e8b84a" strokeWidth={1} />
                  ))}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}
