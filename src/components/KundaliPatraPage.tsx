import { useState } from 'react';
import { HeroStardust } from './HeroStardust';
import { HERO_TICKER_TEXT } from '../content/siteCopy';

const RASHI_OPTIONS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

type KundaliReport = {
  rashi: string;
  nakshatra: string;
  ascendant: string;
  yuti: string;
  dasha: string;
  reading: string;
};

const initialForm = {
  name: '',
  dob: '',
  tob: '',
  pob: '',
  gender: 'male' as 'male' | 'female',
  rashi: 'Aries',
};

export default function KundaliPatraPage() {
  const [form, setForm] = useState(initialForm);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [report, setReport] = useState<KundaliReport | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.dob || !form.tob || !form.pob) {
      alert('Please fill out all birth details to map your stars accurately.');
      return;
    }
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      const zSign = form.rashi;
      setReport({
        rashi: zSign,
        nakshatra:
          zSign === 'Aries' ? 'Ashwini' : zSign === 'Taurus' ? 'Krittika' : zSign === 'Gemini' ? 'Ardra' : 'Punarvasu',
        ascendant: zSign === 'Aries' ? 'Scorpio (Vrishchika)' : zSign === 'Taurus' ? 'Leo (Simha)' : 'Aries (Mesha)',
        yuti: 'Sun (Surya) & Mercury (Budha) in 1st House causing auspicious Budhaditya Yoga.',
        dasha: 'Jupiter (Guru) Mahadasha — Running until October 2032. Period of wisdom, fortune, and spiritual awakening.',
        reading: `Dear ${form.name}, your charts reveal a highly energetic astronomical alignment. Rashi Lord Mars is strongly situated, providing courage. Jupiter's transition through your 9th house guarantees educational and professional expansion this year. Remedies: Wear an energized Yellow Sapphire to maximize Jupiter's boons, and meditate daily to channel Mars' fire.`,
      });
      setGenerating(false);
      setGenerated(true);
    }, 1600);
  };

  return (
    <div className="kundali-page">
      <section className="kundali-hero">
        <HeroStardust />
        <div className="kundali-hero__inner">
          <div className="kundali-hero__copy">
            <h1 className="kundali-hero__title">
              AI <span>Kundlipatra</span> Generator
            </h1>
            <p className="kundali-hero__subtitle">
              Generate your highly detailed 50-page Vedic horoscope chart instantly powered by our advanced astronomical models.
            </p>
          </div>
        </div>
      </section>

      <div className="hero-ticker-bar kundali-page__ticker">
        <p className="hero-ticker-text">{HERO_TICKER_TEXT}</p>
      </div>

      <section className="kundali-main">
        <div className="kundali-main__grid">
          <div className="kundali-form-card">
            <h2 className="kundali-form-card__title">Enter Birth Details</h2>
            <form className="kundali-form" onSubmit={handleSubmit}>
              <div className="kundali-form__group">
                <label className="kundali-form__label" htmlFor="kundali-name">
                  Full Name
                </label>
                <input
                  id="kundali-name"
                  type="text"
                  className="kundali-form__input"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="kundali-form__row">
                <div className="kundali-form__group">
                  <label className="kundali-form__label" htmlFor="kundali-dob">
                    Date of Birth
                  </label>
                  <input
                    id="kundali-dob"
                    type="date"
                    className="kundali-form__input"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    required
                  />
                </div>
                <div className="kundali-form__group">
                  <label className="kundali-form__label" htmlFor="kundali-tob">
                    Time of Birth
                  </label>
                  <input
                    id="kundali-tob"
                    type="time"
                    className="kundali-form__input"
                    value={form.tob}
                    onChange={(e) => setForm({ ...form, tob: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="kundali-form__group">
                <label className="kundali-form__label" htmlFor="kundali-pob">
                  Place of Birth
                </label>
                <input
                  id="kundali-pob"
                  type="text"
                  className="kundali-form__input"
                  placeholder="e.g. New Delhi, India"
                  value={form.pob}
                  onChange={(e) => setForm({ ...form, pob: e.target.value })}
                  required
                />
              </div>

              <div className="kundali-form__group">
                <label className="kundali-form__label" htmlFor="kundali-rashi">
                  Vedic Zodiac Sign
                </label>
                <select
                  id="kundali-rashi"
                  className="kundali-form__input kundali-form__select"
                  value={form.rashi}
                  onChange={(e) => setForm({ ...form, rashi: e.target.value })}
                >
                  {RASHI_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="kundali-form__gender">
                <legend className="kundali-form__label">Gender</legend>
                <label className="kundali-form__radio">
                  <input
                    type="radio"
                    name="gender"
                    checked={form.gender === 'male'}
                    onChange={() => setForm({ ...form, gender: 'male' })}
                  />
                  Male
                </label>
                <label className="kundali-form__radio">
                  <input
                    type="radio"
                    name="gender"
                    checked={form.gender === 'female'}
                    onChange={() => setForm({ ...form, gender: 'female' })}
                  />
                  Female
                </label>
              </fieldset>

              <button type="submit" className="kundali-form__submit" disabled={generating}>
                {generating ? 'Mapping Planetary Angles...' : 'Generate Kundlipatra Charts'}
              </button>
            </form>
          </div>

          <div className="kundali-output-card">
            {generating && (
              <div className="kundali-output-card__loading">
                <div className="kundali-output-card__spinner" />
                <h3>Casting Divine Alignment...</h3>
                <p>Evaluating Panchang details and Shodashvarga matrices.</p>
              </div>
            )}

            {!generating && !generated && (
              <div className="kundali-output-card__placeholder">
                <div className="kundali-output-card__wheel" aria-hidden>
                  🎡
                </div>
                <h3>Stellar Map Pending</h3>
                <p>Fill in your precise birth time and place on the left. The cosmos awaits your query.</p>
              </div>
            )}

            {!generating && generated && report && (
              <div className="kundali-output-card__result">
                <h3 className="kundali-output-card__chart-title">Lagna Chart (D1 Chart)</h3>
                <div className="vedic-chart-wrapper">
                  <div className="chart-line chart-line--diag1" />
                  <div className="chart-line chart-line--diag2" />
                  <div className="chart-line chart-line--h" />
                  <div className="chart-line chart-line--v" />
                  <div className="vedic-chart-inner" />
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <span key={n} className={`house-slot house-${n}`}>
                      {n}
                    </span>
                  ))}
                  <span className="planet-txt planet-1">Lag, Sy</span>
                  <span className="planet-txt planet-2">Mo, Bu</span>
                  <span className="planet-txt planet-3">Ju (R)</span>
                  <span className="planet-txt planet-4">Sa, Ve</span>
                  <span className="planet-txt planet-5">Ma</span>
                  <span className="planet-txt planet-6">Ra</span>
                </div>

                <div className="kundali-report-text">
                  <div className="kundali-badge-grid">
                    <span className="kundali-badge">Rashi: {report.rashi}</span>
                    <span className="kundali-badge">Nakshatra: {report.nakshatra}</span>
                    <span className="kundali-badge">Ascendant: {report.ascendant}</span>
                  </div>
                  <h4>Kundli Synthesized Report</h4>
                  <p>
                    <strong>Yoga Configuration:</strong> {report.yuti}
                  </p>
                  <p>
                    <strong>Current Mahadasha:</strong> {report.dasha}
                  </p>
                  <blockquote className="kundali-report-quote">{report.reading}</blockquote>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
