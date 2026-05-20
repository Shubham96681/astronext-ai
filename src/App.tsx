import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  User, 
  ShoppingCart, 
  MessageCircle, 
  Send, 
  X, 
  Star, 
  Calendar, 
  Clock, 
  Check
} from 'lucide-react';
import { HeroStardust } from './components/HeroStardust';
import heroWoman from './assets/generated/hero-woman.png';
import meditationWoman from './assets/generated/meditation-woman.png';
import pujaItems from './assets/generated/puja-items.png';
import productImg1 from './assets/generated/product-chakra-bracelet.png';
import productImg2 from './assets/generated/product-vedic-remedy.png';
import productImg3 from './assets/generated/product-gold-bracelet-women.png';
import productImg4 from './assets/generated/product-gold-bracelet-men.png';
import devotionWaveBg from './assets/devotion-wave-bg.svg';
import WhatsAppPhoneMockup from './components/WhatsAppPhoneMockup';
import ZodiacWheel from './components/ZodiacWheel';
import AppQrMockup from './components/AppQrMockup';
import SiteLogo from './components/SiteLogo';
import AstrologersPage from './components/AstrologersPage';
import KundaliPatraPage from './components/KundaliPatraPage';
import JagannathStorePage from './components/JagannathStorePage';
import {
  HERO_TICKER_TEXT,
  TESTIMONIALS,
  WHY_ASTRONEXT_FEATURES,
  FAQ_ITEMS,
  FOOTER_ABOUT,
  FOOTER_CONTACT_INTRO,
  SUPPORT_EMAIL,
} from './content/siteCopy';
import './App.css';
import { useScrollReveal } from './hooks/useScrollReveal';

// Types Definitions
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  desc: string;
  rating: number;
  iconBg: string;
  iconText: string;
  image?: string;
}

interface Puja {
  id: number;
  title: string;
  price: string;
  duration: string;
  priests: number;
  benefits: string[];
}

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'kundali' | 'estore' | 'jgstore' | 'puja' | 'astrologers'>('home');
  const [cartCount, setCartCount] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [addedItems, setAddedItems] = useState<{ [key: number]: boolean }>({});
  
  // Newsletter Footer Form state
  const [footerEmail, setFooterEmail] = useState('');
  const [footerQuery, setFooterQuery] = useState('');
  const [footerSubmitted, setFooterSubmitted] = useState(false);

  // FAQ Accordion Toggle State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Floating AI Pandit Jee Chat State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'Namaste! I am Pandit Jee, your AI Vedic Guide. Share your birth details or ask any question about your life, career, marriage, or remedies.' }
  ]);

  // Puja Booking Modal State
  const [selectedPuja, setSelectedPuja] = useState<Puja | null>(null);
  const [bookingForm, setBookingForm] = useState({ name: '', dob: '', gotra: '' });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll Event Listener for Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Start at top when switching pages (home, kundali, store, etc.)
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setIsScrolled(false);
  }, [activeTab]);

  useScrollReveal([activeTab]);

  // Auto-scroll chat windows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // E-Store Products (Updated with exact names/prices/discounts from PDF)
  const estoreProducts: Product[] = [
    {
      id: 1,
      name: '7 Chakra x Rudraksha Bands - Free Size Bracelet',
      category: 'gemstone',
      price: 399,
      originalPrice: 799,
      discount: '60% Off',
      desc: 'Authentic 7 Chakra gemstones combined with pure five-faced Rudraksha beads. Aids energy centering, mental clarity, and spiritual grounding.',
      rating: 4.9,
      iconBg: 'radial-gradient(circle, #3d5afe 0%, #1a237e 100%)',
      iconText: '📿',
      image: productImg1
    },
    {
      id: 2,
      name: 'Dr. V Brahmachari',
      category: 'remedy',
      price: 24999,
      desc: 'Exclusive personalized Vedic remedy protocol designed by Dr. V Brahmachari. Includes planetary shanti homams and certified energized gemstones.',
      rating: 5.0,
      iconBg: 'radial-gradient(circle, #ffee58 0%, #fbc02d 100%)',
      iconText: '🕉️',
      image: productImg2
    },
    {
      id: 3,
      name: 'Gold Plated Cubio Rudraksha Bracelet For Women',
      category: 'sacred',
      price: 699,
      originalPrice: 899,
      discount: '20% Off',
      desc: 'A gorgeous designer gold-plated bracelet accented with premium Nepalese Rudraksha beads. Elegant accessory carrying protective cosmic energy.',
      rating: 4.8,
      iconBg: 'radial-gradient(circle, #ff8a65 0%, #d84315 100%)',
      iconText: '✨',
      image: productImg3
    },
    {
      id: 4,
      name: 'Gold Plated Essential Rudraksha Bracelet',
      category: 'gemstone',
      price: 899,
      originalPrice: 1499,
      discount: '40% Off',
      desc: 'Traditional high-polish gold plated bracelet inlaid with premium original Rudraksha. Stabilizes active blood pressure and calms thoughts.',
      rating: 4.9,
      iconBg: 'radial-gradient(circle, #a1887f 0%, #5d4037 100%)',
      iconText: '🔱',
      image: productImg4
    }
  ];

  // Vedic Pujas
  const pujasList: Puja[] = [
    {
      id: 201,
      title: 'Maha Mrityunjaya Puja',
      price: '₹8,500',
      duration: '4 Hours',
      priests: 3,
      benefits: ['Promotes longevity & sound health', 'Eliminates terminal fears', 'Purges severe negative planetary configurations']
    },
    {
      id: 202,
      title: 'Lakshmi Kuber Maha Yajna',
      price: '₹11,000',
      duration: '5 Hours',
      priests: 5,
      benefits: ['Invokes infinite wealth & business expansion', 'Clears persistent financial debts', 'Brings prosperity & harmony home']
    },
    {
      id: 203,
      title: 'Navgrah Shanti Puja',
      price: '₹6,200',
      duration: '3 Hours',
      priests: 2,
      benefits: ['Balances all nine astronomical bodies', 'Resolves career roadblocks', 'Mitigates Sade Sati & Kaal Sarp Dosha effects']
    }
  ];

  // Add items to cart with local state feedback
  const handleAddToCart = (productId: number) => {
    setCartCount(prev => prev + 1);
    setAddedItems(prev => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [productId]: false }));
    }, 1500);
  };

  // Floating Chat Assistant Message Handler
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    // AI Responses logic
    setTimeout(() => {
      let botResponse = '';
      const inputLower = userText.toLowerCase();

      if (inputLower.includes('career') || inputLower.includes('job') || inputLower.includes('work')) {
        botResponse = 'The planetary transit of Saturn (Shani) indicates a crucial transition phase. Dedication will yield results. Consider chanting "Om Sham Shanaischaraya Namah" on Saturdays to clear obstacles.';
      } else if (inputLower.includes('love') || inputLower.includes('marriage') || inputLower.includes('compatibility')) {
        botResponse = 'Venus (Shukra) represents relationship harmony. If Venus is aspected by Mars in your charts, minor conflicts might arise. Chanting the Lakshmi Mantra daily creates positive marital vibrations.';
      } else if (inputLower.includes('gemstone') || inputLower.includes('stone') || inputLower.includes('remedy')) {
        botResponse = 'To choose the correct gemstone, we evaluate your Lagna (ascendant) Lord. For Aries, Coral (Moonga) is auspicious. For Taurus/Libra, Diamond or White Sapphire brings immense fortune. Do you know your Ascendant?';
      } else if (inputLower.includes('puja') || inputLower.includes('yajna') || inputLower.includes('worship')) {
        botResponse = 'Performing target Vedic Pujas can clear planetary malefic effects. Currently, a Grah Shanti Yajna or Ganesha Puja is highly recommended to stabilize household energy.';
      } else {
        botResponse = 'Excellent question. According to Vedic principles, our Karma interacts dynamically with planetary nodes (Rahu & Ketu). Share your Date of Birth, and I will analyze this alignment deeply for you.';
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  // Puja Booking Handlers
  const handleOpenPujaModal = (puja: Puja) => {
    setSelectedPuja(puja);
    setBookingForm({ name: '', dob: '', gotra: '' });
    setBookingSuccess(false);
  };

  const handleBookPujaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.dob) {
      alert('Please provide devotee name and birth date for the holy rituals.');
      return;
    }
    setBookingSuccess(true);
  };

  // Newsletter form submit
  const handleFooterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail || !footerQuery) return;
    setFooterSubmitted(true);
    setTimeout(() => {
      setFooterSubmitted(false);
      setFooterEmail('');
      setFooterQuery('');
    }, 3000);
  };

  return (
    <div className="app-container">
      {/* Background Starry Particles */}
      <div className="space-sparkles"></div>

      {/* Premium Navigation Header */}
      <header className={`nav-header ${activeTab === 'home' ? 'nav-header--home' : ''} ${isScrolled ? 'scrolled' : ''}`}>
        <a href="#home" className="logo-container" onClick={() => setActiveTab('home')}>
          <SiteLogo compact={isScrolled} />
        </a>

        <div className="nav-right-container">
          <div className="nav-actions">
            <button className="action-btn" title="Search stars...">
              <Search size={22} strokeWidth={1.75} />
            </button>
            <button className="action-btn" title="AI Pandit Profile">
              <User size={22} strokeWidth={1.75} />
            </button>
            <button className="action-btn" title="Remedies Cart">
              <ShoppingCart size={22} strokeWidth={1.75} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>

          <nav>
            <ul className="nav-menu">
              <li>
                <span className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                  Home
                </span>
              </li>
              <li>
                <span className={`nav-link ${activeTab === 'kundali' ? 'active' : ''}`} onClick={() => setActiveTab('kundali')}>
                  Kundali Patra
                </span>
              </li>
              <li>
                <span className={`nav-link ${activeTab === 'estore' ? 'active' : ''}`} onClick={() => setActiveTab('estore')}>
                  E-Store
                </span>
              </li>
              <li>
                <span className={`nav-link ${activeTab === 'jgstore' ? 'active' : ''}`} onClick={() => setActiveTab('jgstore')}>
                  Jagannath Store
                </span>
              </li>
              <li>
                <span className={`nav-link ${activeTab === 'puja' ? 'active' : ''}`} onClick={() => setActiveTab('puja')}>
                  Book My Puja
                </span>
              </li>
              <li>
                <span className={`nav-link ${activeTab === 'astrologers' ? 'active' : ''}`} onClick={() => setActiveTab('astrologers')}>
                  Astrologers
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Workspace */}
      <main className={`main-content ${activeTab !== 'home' ? 'main-content--with-nav-gap' : ''}`}>
        
        {/* ==================== HOME / HERO VIEW (DETAILED PDF SCROLLING LAYOUT) ==================== */}
        {activeTab === 'home' && (
          <div className="page-section">
            
            {/* Section 1: Hero Section */}
            <section className="hero-section">
              <HeroStardust />
              <div className="hero-left" data-reveal="fade-up" data-reveal-immediate>
                <h2 className="hero-title">
                  Ask anything,
                  <br />
                  <span className="hero-title-second">let Pandit Jee answer...</span>
                </h2>
                <p className="hero-subtitle">
                  At AstroNext, We specialise in empowering Vedic Astrology through generation of Kundlipatra
                </p>
                <a 
                  href="https://wa.me/919999999999?text=Namaste%20Pandit%20Jee,%20please%20generate%20my%20Kundli!" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-badge-wrapper"
                >
                  <div className="whatsapp-badge">
                    <div className="whatsapp-icon-circle">
                      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <span className="whatsapp-badge-text">Get Personal Astro - Chat</span>
                  </div>
                </a>
              </div>
              <div className="hero-right" data-reveal="fade-up" data-reveal-immediate data-reveal-delay="120ms">
                <div className="hero-visual-stack">
                  <div className="hero-wheel-layer" aria-hidden="true">
                    <div className="hero-zodiac-spin">
                      <ZodiacWheel className="zodiac-wheel-bg zodiac-wheel-svg" />
                    </div>
                  </div>
                  <div className="hero-woman-layer">
                    <div className="hero-woman-cutout">
                      <img
                        src={heroWoman}
                        className="hero-woman-fg hero-woman-fg--generated"
                        alt="Spiritual Indian Woman in Namaste Pose"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Hero bottom bar */}
            <div className="hero-ticker-bar">
              <p className="hero-ticker-text">{HERO_TICKER_TEXT}</p>
            </div>

            {/* Section 3: Ask with devotion — centered, phone mockup */}
            <section className="devotion-section" data-reveal="fade-up">
              <h2 className="devotion-title">Ask with devotion</h2>
              <p className="devotion-subtitle">let Pandit Jee offer spiritual light</p>
              <div className="devotion-divider" aria-hidden="true" />
              <p className="devotion-body">
                Got a question? What&apos;s next in life, career, relationship, health. Just ask PanditJee on WhatsApp!
              </p>
              <div className="devotion-phone-stage">
                <div className="devotion-phone-wrap">
                  <div className="devotion-phone-backdrop" aria-hidden="true">
                    <img className="devotion-wave-mesh" src={devotionWaveBg} alt="" />
                    <div className="devotion-wave-glow" aria-hidden="true" />
                  </div>
                  <WhatsAppPhoneMockup />
                  <a
                    href="https://wa.me/919999999999?text=Pranam%20Pandit%20Jee,%20I%20seek%20your%20spiritual%20guidance!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="devotion-cta"
                  >
                    <span className="devotion-cta-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </span>
                    <span className="devotion-cta-text">Get Personal Astro - Chat</span>
                  </a>
                </div>
              </div>
            </section>

            {/* Section 4: Align with the Universe — dark starry band */}
            <section className="cosmic-section" data-reveal="fade">
              <div className="cosmic-section__stars" aria-hidden="true" />
              <div className="cosmic-section__smoke" aria-hidden="true" />
              <div className="cosmic-inner">
                <div className="cosmic-visual" data-reveal="fade-right" data-reveal-delay="80ms">
                  <div className="cosmic-visual__backdrop" aria-hidden="true">
                    <div className="cosmic-visual__sky" />
                    <div className="cosmic-visual__smoke" />
                    <div className="cosmic-zodiac-spin">
                      <ZodiacWheel className="zodiac-wheel-bg zodiac-wheel-svg zodiac-wheel--cosmic" />
                    </div>
                  </div>
                  <div className="cosmic-figure-layer">
                    <img
                      src={meditationWoman}
                      alt="Meditation and cosmic alignment"
                      className="cosmic-woman section-photo"
                    />
                  </div>
                </div>
                <div className="cosmic-content" data-reveal="fade-left" data-reveal-delay="160ms">
                  <h2 className="cosmic-headline">Align with the Universe</h2>
                  <h3 className="cosmic-subhead">Discover Your Cosmic Connections</h3>
                  <div className="cosmic-divider" aria-hidden="true" />
                  <p className="cosmic-lead">
                    Discover the blueprint of your destiny with Kundli Patra, your personalized astrology report.
                  </p>
                  <ul className="cosmic-features">
                    <li><span className="cosmic-check" aria-hidden="true">✓</span> Detailed and personalized insights</li>
                    <li><span className="cosmic-check" aria-hidden="true">✓</span> Based on authentic Vedic astrology</li>
                    <li><span className="cosmic-check" aria-hidden="true">✓</span> Instant digital delivery</li>
                    <li><span className="cosmic-check" aria-hidden="true">✓</span> Different reports as per your need</li>
                  </ul>
                  <button type="button" className="cosmic-cta-btn" onClick={() => setActiveTab('kundali')}>
                    Create Kundli Patra
                  </button>
                </div>
              </div>
            </section>

            {/* Section 5: Embrace Divine Grace — centered */}
            <section className="puja-promo-section" data-reveal="fade-up">
              <h2 className="puja-promo-title">Embrace Divine Grace</h2>
              <p className="puja-promo-subtitle">Book Your Home Puja Today</p>
              <div className="puja-promo-divider" aria-hidden="true" />
              <p className="puja-promo-body">
                Bring sacred rituals to your doorstep with our customized puja services. Led by experienced priests, each ceremony is rooted in ancient traditions and thoughtfully tailored to your spiritual needs.
              </p>
              <button type="button" className="puja-promo-btn" onClick={() => setActiveTab('puja')}>
                Book Your Puja
              </button>
              <div className="puja-promo-visual">
                <img
                  src={pujaItems}
                  alt="Traditional puja kalash with offerings"
                  className="puja-promo-image"
                />
              </div>
            </section>

            {/* Section 6: What Our Clients Say — dark band (before products per PDF) */}
            <section className="testimonials-section testimonials-section--dark" data-reveal="fade-up">
              <span className="section-eyebrow section-eyebrow--gold section-eyebrow--center">What Our Clients Say</span>
              <h2 className="section-heading section-heading--dark section-heading--center">Trusted by thousands seeking clarity</h2>
              <div className="testimonial-grid" data-reveal="fade-up" data-reveal-stagger>
                {TESTIMONIALS.map((t) => (
                  <div className="testimonial-card testimonial-card--dark" key={t.name}>
                    <span className="quote-icon">"</span>
                    <p className="testimonial-text testimonial-text--light">
                      {t.text}
                    </p>
                    <div className="testimonial-author-wrapper">
                      <div className="author-initial testimonial-avatar-fallback">{t.initial}</div>
                      <span className="testimonial-author-name">{t.name}</span>
                    </div>
                    <div className="testimonial-stars">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--secondary)" stroke="var(--secondary)" />)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 7: Divine Products Section */}
            <section className="products-section" data-reveal="fade-up">
              <div className="product-section-header">
                <h2 className="section-heading section-heading--center">Our Divine Products</h2>
                <p className="section-subline section-subline--center">Explore our exclusive range of Divine Products</p>
                <p className="section-body section-body--center" style={{ maxWidth: '750px', margin: '0 auto' }}>
                  Discover our curated Divine Products — sacred items and meaningful gifts designed to inspire peace, positivity, and spiritual connection. Elevate your space and soul with tradition.
                </p>
              </div>

              <div className="products-slider-grid products-slider-grid--pdf" data-reveal="fade-up" data-reveal-stagger>
                {estoreProducts.map((prod) => (
                  <div className="product-card product-card--pdf" key={prod.id}>
                    <div className="product-img-wrapper">
                      {prod.image ? (
                        <img src={prod.image} alt={prod.name} className="product-photo" />
                      ) : (
                        <div className="product-photo-fallback" style={{ background: prod.iconBg }}>{prod.iconText}</div>
                      )}
                      <span className="hot-tag">New</span>
                      {prod.discount && <span className="discount-tag discount-tag--pdf">{prod.discount}</span>}
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{prod.name}</h3>
                      <div className="product-footer product-footer--pdf">
                        <div className="product-price-wrapper">
                          {prod.originalPrice && <span className="original-price">Rs. {prod.originalPrice}</span>}
                          <span className="product-price">Rs. {prod.price}</span>
                        </div>
                        <button
                          type="button"
                          className="add-cart-text-btn"
                          onClick={() => handleAddToCart(prod.id)}
                          disabled={addedItems[prod.id]}
                        >
                          {addedItems[prod.id] ? 'Added' : 'Add to cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8: Why Astronext.ai — app mockup + features */}
            <section className="why-app-section" data-reveal="fade">
              <h2 className="why-app-title" data-reveal="fade-up">Why Astronext.ai</h2>
              <div className="why-app-inner">
                <div className="why-app-visual">
                  <AppQrMockup />
                </div>
                <div className="why-app-content" data-reveal="fade-left" data-reveal-delay="120ms">
                  <ul className="why-feature-list">
                    {WHY_ASTRONEXT_FEATURES.map((item, i) => (
                      <li key={i} className="why-feature-item">
                        <span className="why-feature-text">{item}</span>
                        <span className="why-feature-chevron" aria-hidden="true">&gt;</span>
                      </li>
                    ))}
                  </ul>
                  <div className="why-contact-strip">
                    <p className="why-contact-label">Contact us for any service</p>
                    <div className="why-contact-row">
                      <input
                        type="email"
                        className="why-contact-input"
                        placeholder="Your Email"
                        aria-label="Your email"
                      />
                      <button
                        type="button"
                        className="why-contact-btn"
                        onClick={() => document.querySelector('.mega-footer')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Contact Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9: Frequently Asked Questions (FAQ) */}

            <section className="faq-section faq-section--pdf" data-reveal="fade-up">
              <h2 className="section-heading faq-main-title">Frequently asked questions</h2>
              <div className="faq-list-wrapper">
                {FAQ_ITEMS.map((item, idx) => (
                  <div className="faq-item-card" key={idx}>
                    <div className="faq-item-header" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                      <span>{item.q}</span>
                      <span className={`faq-toggle-icon ${activeFaq === idx ? 'active' : ''}`}>▶</span>
                    </div>
                    {activeFaq === idx && (
                      <div className="faq-item-content">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {activeTab === 'kundali' && <KundaliPatraPage />}

        {/* ==================== E-STORE VIEW ==================== */}
        {activeTab === 'estore' && (
          <div className="page-section">
            <div className="section-header" data-reveal="fade-up">
              <h2 className="section-title">Vedic <span>E-Remedies</span> Store</h2>
              <p className="section-desc">100% natural, certified, and chemically verified gemstones, spiritual malas, and energized Yantras designed to correct astrological imbalances.</p>
            </div>

            <div className="store-grid" data-reveal="fade-up" data-reveal-stagger>
              {estoreProducts.map((prod) => (
                <div className="product-card" key={prod.id}>
                  <div className="product-img-wrapper">
                    <div style={{ width: '90px', height: '90px', borderRadius: '24px', background: prod.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                      {prod.iconText}
                    </div>
                    <span className="product-badge">{prod.category}</span>
                  </div>
                  <div className="product-info">
                    <span className="product-category">{prod.category}</span>
                    <h3 className="product-name">{prod.name}</h3>
                    <p className="product-desc">{prod.desc}</p>
                    <div className="product-footer">
                      <span className="product-price">Rs. {prod.price}</span>
                      <button 
                        className="add-cart-btn" 
                        onClick={() => handleAddToCart(prod.id)}
                        disabled={addedItems[prod.id]}
                        title="Add to sacred cart"
                      >
                        {addedItems[prod.id] ? <Check size={18} /> : <ShoppingCart size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jgstore' && (
          <JagannathStorePage onAddToCart={handleAddToCart} addedItems={addedItems} />
        )}

        {/* ==================== BOOK MY PUJA VIEW ==================== */}
        {activeTab === 'puja' && (
          <div className="page-section">
            <div className="section-header" data-reveal="fade-up">
              <h2 className="section-title">Book <span>Vedic Pujas</span> Live</h2>
              <p className="section-desc">Participate in customized, live broadcast Vedic Pujas performed specifically for your gotra and family details by licensed high-scholastic pundits.</p>
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
                      <li className="puja-benefit-item" key={idx}>{benefit}</li>
                    ))}
                  </ul>
                  <div className="puja-meta">
                    <span><Clock size={12} style={{ marginRight: '4px' }} /> {puja.duration}</span>
                    <span><User size={12} style={{ marginRight: '4px' }} /> {puja.priests} Pandits</span>
                  </div>
                  <button className="book-puja-btn" onClick={() => handleOpenPujaModal(puja)}>
                    Schedule Holy Yajna
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'astrologers' && <AstrologersPage />}

      </main>

      <footer className="mega-footer">
        <div className="footer-top-row">
          <ul className="footer-legal-inline">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#refund">Refund Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Menu Item</a></li>
            <li><a href="#kundali" onClick={(e) => { e.preventDefault(); setActiveTab('kundali'); }}>Menu Item</a></li>
            <li><a href="#estore" onClick={(e) => { e.preventDefault(); setActiveTab('estore'); }}>Menu Item</a></li>
            <li><a href="#puja" onClick={(e) => { e.preventDefault(); setActiveTab('puja'); }}>Menu Item</a></li>
          </ul>
        </div>

        <div className="footer-grid footer-grid--design">
          <div className="footer-col footer-col--brand">
            <a
              href="#home"
              className="footer-brand-link"
              onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}
            >
              <SiteLogo variant="footer" />
            </a>
            <h4>About Astro AI</h4>
            <p>{FOOTER_ABOUT}</p>
          </div>

          <div className="footer-col footer-col--form">
            <h4>We&apos;d be glad to connect with you.</h4>
            {footerSubmitted ? (
              <p className="footer-success-msg">Thank you! We will reach out soon.</p>
            ) : (
              <form onSubmit={handleFooterSubmit} className="footer-input-group">
                <input type="email" className="footer-input" placeholder="Type Email ID" value={footerEmail} onChange={(e) => setFooterEmail(e.target.value)} required />
                <input type="text" className="footer-input" placeholder="Type your query" value={footerQuery} onChange={(e) => setFooterQuery(e.target.value)} required />
                <button type="submit" className="footer-submit-btn">Submit</button>
              </form>
            )}
          </div>

          <div className="footer-col footer-col--contact">
            <h4>Contact Us</h4>
            <p className="footer-contact-line">{FOOTER_CONTACT_INTRO}</p>
            <p className="footer-email-line">
              <span className="footer-email-label">Email ID:</span>{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="footer-email-value">{SUPPORT_EMAIL}</a>
            </p>
            <div className="footer-social-row">
              <a href="https://wa.me/919999999999" className="footer-social-btn footer-social-btn--wa" aria-label="WhatsApp">W</a>
              <a href="#youtube" className="footer-social-btn footer-social-btn--yt" aria-label="YouTube">▶</a>
              <a href="#facebook" className="footer-social-btn footer-social-btn--fb" aria-label="Facebook">f</a>
              <a href="#instagram" className="footer-social-btn footer-social-btn--ig" aria-label="Instagram">◎</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright 2025 AstroAI . All Rights Reserved</p>
        </div>
      </footer>

      {/* Floating AI Pandit Jee Toggle Button */}
      <button 
        className="pandit-chat-toggle" 
        onClick={() => setIsChatOpen(!isChatOpen)}
        title="Consult AI Pandit Jee"
      >
        {isChatOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>

      {/* Floating AI Pandit Jee Chat Window */}
      {isChatOpen && (
        <div className="pandit-chat-window">
          <div className="chat-window-header">
            <div className="chat-header-user">
              <div className="chat-header-avatar">🕉️</div>
              <div className="chat-header-info">
                <h5>Pandit Jee AI</h5>
                <p>Divine Vedic Intelligence • Online</p>
              </div>
            </div>
            <button className="close-chat-btn" onClick={() => setIsChatOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages-container">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.sender === 'bot' ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg bot" style={{ display: 'flex', gap: '4px', padding: '0.6rem 0.8rem' }}>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendChatMessage} className="chat-input-form">
            <input 
              type="text" 
              className="chat-input-field" 
              placeholder="Ask Pandit Jee anything..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Puja Booking Glass Modal */}
      {selectedPuja && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-x" onClick={() => setSelectedPuja(null)}>
              <X size={20} />
            </button>

            {!bookingSuccess ? (
              <div>
                <h3 className="modal-title">Schedule {selectedPuja.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(37, 21, 69, 0.7)', marginBottom: '1.8rem' }}>
                  Provide devotee credentials so the Pandits can chant custom gotra sankalp mantras during live Yajna.
                </p>
                <form onSubmit={handleBookPujaSubmit}>
                  <div className="form-group">
                    <label className="form-label">Devotee Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Rahul Sharma" 
                      value={bookingForm.name} 
                      onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Birth Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={bookingForm.dob} 
                      onChange={(e) => setBookingForm({...bookingForm, dob: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vedic Gotra (Optional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Kashyap, Bhardwaj" 
                      value={bookingForm.gotra} 
                      onChange={(e) => setBookingForm({...bookingForm, gotra: e.target.value})}
                    />
                  </div>

                  <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>
                    Confirm & Proceed ({selectedPuja.price})
                  </button>
                </form>
              </div>
            ) : (
              <div className="success-message">
                <div className="success-icon-box">
                  <Check size={36} />
                </div>
                <h3 className="modal-title" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>Sankalp Confirmed!</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(37, 21, 69, 0.8)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  Pranam, <strong>{bookingForm.name}</strong>. Your custom live broadcast details for <strong>{selectedPuja.title}</strong> have been scheduled successfully.
                </p>
                <div style={{ background: '#f5fbf6', border: '1px dashed #25D366', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#1a7a3b', fontWeight: 600, marginBottom: '2rem' }}>
                  Ritual coordinates and private webstream link sent to your registered WhatsApp channel.
                </div>
                <button className="submit-btn" onClick={() => setSelectedPuja(null)}>
                  Blessed Be
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
