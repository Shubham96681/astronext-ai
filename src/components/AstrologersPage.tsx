import { useEffect, useRef, useState } from 'react';
import { Send, Star, X } from 'lucide-react';
import astrologersHeroHands from '../assets/generated/astrologers-hero-hands.png';
import { ASTROLOGERS, formatSessionPrice, type Astrologer } from '../content/astrologersData';
import { HeroStardust } from './HeroStardust';
import { HERO_TICKER_TEXT, TESTIMONIALS } from '../content/siteCopy';
import { useScrollReveal } from '../hooks/useScrollReveal';
import AstrologerDetail from './AstrologerDetail';
import JgProductImage from './JgProductImage';

type ChatMessage = { sender: 'user' | 'bot'; text: string };

function ExpertCard({
  astro,
  onView,
  onChat,
}: {
  astro: Astrologer;
  onView: () => void;
  onChat: () => void;
}) {
  return (
    <article className="astro-expert-card">
      <div className="astro-expert-card__body">
        <div className="astro-expert-card__avatar-wrap">
          <button type="button" className="astro-expert-card__media-btn" onClick={onView} aria-label={`View ${astro.name}`}>
            <JgProductImage src={astro.avatar} alt={astro.name} className="astro-expert-card__avatar" loading="lazy" />
          </button>
        </div>
        <h3 className="astro-expert-card__name">
          <button type="button" className="astro-expert-card__name-btn" onClick={onView}>
            {astro.name}
          </button>
        </h3>
        <p className="astro-expert-card__specialty">{astro.specialty}</p>
        <p className="astro-expert-card__bio">{astro.bio}</p>
        <div className="astro-expert-card__footer">
          <span className="astro-expert-card__price">{formatSessionPrice(astro.pricePerMinute)}</span>
          <button type="button" className="astro-expert-card__cta" onClick={onChat}>
            Get Expert Advice
          </button>
        </div>
      </div>
    </article>
  );
}

type AstrologersPageProps = {
  onNavigateHome?: () => void;
};

export default function AstrologersPage({ onNavigateHome }: AstrologersPageProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeChat, setActiveChat] = useState<Astrologer | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selected = selectedId ? ASTROLOGERS.find((a) => a.id === selectedId) : null;

  useScrollReveal([selectedId, activeChat?.id]);

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

  if (activeChat) {
    return (
      <div className="astrologers-page astrologers-page--chat">
        <section className="astrologers-main astrologers-main--chat-only">
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
        </section>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="astrologers-page astrologers-page--detail">
        <AstrologerDetail
          astrologer={selected}
          onBack={() => setSelectedId(null)}
          onHome={onNavigateHome}
          onSelect={setSelectedId}
          onChat={(astro) => {
            setSelectedId(null);
            startChat(astro);
          }}
        />
      </div>
    );
  }

  return (
    <div className="astrologers-page">
      <section className="astrologers-hero">
        <HeroStardust />
        <div className="astrologers-hero__grid">
          <div className="astrologers-hero__copy" data-reveal="fade-up" data-reveal-immediate>
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

      <section className="astrologers-intro" data-reveal="fade-up">
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
        <div className="astrologers-experts-grid" data-reveal="fade-up" data-reveal-stagger>
          {ASTROLOGERS.map((astro) => (
            <ExpertCard
              key={astro.id}
              astro={astro}
              onView={() => setSelectedId(astro.id)}
              onChat={() => startChat(astro)}
            />
          ))}
        </div>
      </section>

      <section className="astrologers-testimonials" data-reveal="fade-up">
        <h2 className="astrologers-testimonials__title">What Our Clients Say</h2>
        <p className="astrologers-testimonials__subtitle">
          Trusted by thousands seeking clarity through our verified astrologers
        </p>
        <div className="astrologers-testimonials__grid" data-reveal="fade-up" data-reveal-delay="80ms" data-reveal-stagger>
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
