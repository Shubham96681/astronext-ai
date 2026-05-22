'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { astrologerDetailPath, parseAstrologerParam, ROUTES } from '@/routes/paths';
import { Send, X } from 'lucide-react';
import astrologersHeroHands from '@/assets/generated/astrologers-hero-hands.png';
import { imageSrc } from '@/lib/imageSrc';
import { ASTROLOGERS, type Astrologer } from '../content/astrologersData';
import { HeroStardust } from './HeroStardust';
import { ASTROLOGERS_HERO_DESC, HERO_TICKER_TEXT, TESTIMONIALS } from '../content/siteCopy';
import AstrologerBlockCard from './AstrologerBlockCard';
import AstrologerDetail from './AstrologerDetail';
import TextReveal from '@/components/TextReveal';
import TestimonialCard from '@/components/TestimonialCard';

type ChatMessage = { sender: 'user' | 'bot'; text: string };

export default function AstrologersPage() {
  const router = useRouter();
  const { astrologerId: astrologerIdParam } = useParams<{ astrologerId?: string }>();
  const selected = parseAstrologerParam(astrologerIdParam);
  const [activeChat, setActiveChat] = useState<Astrologer | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!astrologerIdParam) return;
    if (!selected) {
      router.replace(ROUTES.astrologers);
      return;
    }
    if (/^\d+$/.test(astrologerIdParam) && selected.slug !== astrologerIdParam) {
      router.replace(astrologerDetailPath(selected));
    }
  }, [astrologerIdParam, selected, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const goToAstrologer = (astro: Astrologer) => router.push(astrologerDetailPath(astro));
  const goToListing = () => router.push(ROUTES.astrologers);

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
          onBack={goToListing}
          onHome={() => router.push(ROUTES.home)}
          onSelect={goToAstrologer}
          onChat={(astro) => {
            router.push(ROUTES.astrologers);
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
            <TextReveal as="p" className="astrologers-hero__desc" immediate>
              {ASTROLOGERS_HERO_DESC}
            </TextReveal>
          </div>
          <div className="astrologers-hero__visual" data-reveal="fade-left" data-reveal-immediate data-reveal-delay="100ms">
            <img
              src={imageSrc(astrologersHeroHands)}
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
        <TextReveal as="p" className="astrologers-intro__text">
          Discover guidance from some of the most trusted and highly experienced astrologers, each specializing in
          powerful systems like Vedic Astrology, KP Astrology, Numerology, Tarot, Vastu, and more.
        </TextReveal>
        <TextReveal as="p" className="astrologers-intro__text">
          Our experts combine deep spiritual insight with scientific accuracy to help you find clarity, make informed
          decisions, and align with your true path. Whether you&apos;re seeking predictions, remedies, or life
          guidance—you&apos;re in the right hands.
        </TextReveal>
      </section>

      <section className="astrologers-main">
        <h2 className="astrologers-blocks-heading" data-reveal="fade-up">
          Choose your guide
        </h2>
        <div className="astrologer-blocks-grid" data-reveal="fade-up" data-reveal-stagger>
          {ASTROLOGERS.map((astro, index) => (
            <AstrologerBlockCard
              key={astro.id}
              astro={astro}
              themeIndex={index}
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
        <div className="testimonial-quote-grid astrologers-testimonials__grid" data-reveal="fade-up" data-reveal-delay="80ms" data-reveal-stagger>
          {TESTIMONIALS.map((t) => (
            <TestimonialCard
              key={t.name}
              name={t.name}
              text={t.text}
              avatar={t.avatar}
              initial={t.initial}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
