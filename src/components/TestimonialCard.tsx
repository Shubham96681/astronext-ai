export type TestimonialCardProps = {
  name: string;
  text: string;
  avatar: string;
  initial?: string;
};

export default function TestimonialCard({ name, text, avatar, initial }: TestimonialCardProps) {
  const fallback = initial ?? name.charAt(0);

  return (
    <blockquote className="testimonial-quote-card">
      <span className="testimonial-quote-card__mark testimonial-quote-card__mark--open" aria-hidden>
        “
      </span>

      <div className="testimonial-quote-card__image">
        <div className="testimonial-quote-card__clip" aria-hidden />
        {avatar ? (
          <img src={avatar} alt={name} loading="lazy" decoding="async" width={72} height={72} />
        ) : (
          <div className="testimonial-quote-card__avatar-fallback" aria-hidden>
            {fallback}
          </div>
        )}
      </div>

      <div className="testimonial-quote-card__bottom">
        <p className="testimonial-quote-card__text">{text}</p>
        <footer className="testimonial-quote-card__source">
          <span>{name}</span>
        </footer>
      </div>

      <span className="testimonial-quote-card__mark testimonial-quote-card__mark--close" aria-hidden>
        ”
      </span>
    </blockquote>
  );
}
