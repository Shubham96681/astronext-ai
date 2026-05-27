import { WHATSAPP_CHAT_URL } from '../content/siteCopy';

const LINKS = [
  { href: WHATSAPP_CHAT_URL, label: 'WhatsApp', className: 'footer-social-btn--wa', external: true },
  { href: 'https://www.youtube.com/', label: 'YouTube', className: 'footer-social-btn--yt', external: true },
  { href: 'https://www.facebook.com/', label: 'Facebook', className: 'footer-social-btn--fb', external: true },
  { href: 'https://www.instagram.com/', label: 'Instagram', className: 'footer-social-btn--ig', external: true },
] as const;

export default function FooterSocialLinks() {
  return (
    <div className="footer-social-row">
      {LINKS.map(({ href, label, className, external }) => (
        <a
          key={label}
          href={href}
          className={`footer-social-btn ${className}`}
          aria-label={label}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        />
      ))}
    </div>
  );
}
