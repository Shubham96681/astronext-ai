import SiteLogo from './SiteLogo';
import qrCodeImg from '../assets/app-qr-code.svg';

/** Phone frame with logo + QR — bottom cropped like reference mockup. */
export default function AppQrMockup() {
  return (
    <div className="why-app-phone-crop" aria-hidden="true">
      <div className="app-qr-phone-glow" aria-hidden="true" />
      <div className="app-qr-phone">
        <span className="app-qr-side-btn app-qr-side-btn--vol" aria-hidden="true" />
        <span className="app-qr-side-btn app-qr-side-btn--power" aria-hidden="true" />
        <div className="app-qr-bezel">
          <div className="app-qr-screen">
            <div className="app-qr-brand">
              <SiteLogo variant="phone" priority />
            </div>
            <div className="app-qr-code">
              <img
                src={qrCodeImg}
                alt=""
                className="app-qr-image"
                width={148}
                height={148}
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
