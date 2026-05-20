import stardustPattern from '../assets/hero-stardust-pattern.svg';

/** Pink dust / sparkle atmosphere — reference hero background */
export function HeroStardust() {
  return (
    <div className="hero-stardust" aria-hidden="true">
      <div className="hero-stardust__wash" />
      <div className="hero-stardust__mist" />
      <div className="hero-stardust__glow" />
      <div
        className="hero-stardust__dust"
        style={{ backgroundImage: `url(${stardustPattern})` }}
      />
      <div
        className="hero-stardust__dust hero-stardust__dust--alt"
        style={{ backgroundImage: `url(${stardustPattern})` }}
      />
      <div
        className="hero-stardust__dust hero-stardust__dust--fine"
        style={{ backgroundImage: `url(${stardustPattern})` }}
      />
      <div className="hero-stardust__haze" />
      <div className="hero-stardust__grain" />
    </div>
  );
}
