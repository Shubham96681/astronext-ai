/** WhatsApp chat UI mockup — reference devotion section (April chat). */
export default function WhatsAppPhoneMockup() {
  return (
    <div className="wa-phone" aria-hidden="true">
      <div className="wa-phone-bezel">
        <div className="wa-phone-screen">
          <div className="wa-header">
            <span className="wa-back" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="wa-avatar" aria-hidden="true">
              <svg className="wa-avatar-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#DFE5E7" />
                <path
                  fill="#FFFFFF"
                  d="M24 25.5c3.45 0 6.25-2.8 6.25-6.25S27.45 13 24 13s-6.25 2.8-6.25 6.25S20.55 25.5 24 25.5zm0 3.75c-4.15 0-12.5 2.1-12.5 7.5v1.25h25V36.75c0-5.4-8.35-7.5-12.5-7.5z"
                />
              </svg>
            </div>
            <div className="wa-header-text">
              <span className="wa-name">April</span>
              <span className="wa-status">online</span>
            </div>
            <div className="wa-header-actions" aria-hidden="true">
              <svg className="wa-header-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3.5l4 4v-11l-4 4z" />
              </svg>
              <svg className="wa-header-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z" />
              </svg>
              <svg className="wa-header-icon wa-header-icon--menu" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="12" cy="19" r="1.6" />
              </svg>
            </div>
          </div>
          <div className="wa-chat-bg">
            <div className="wa-bubble wa-bubble--out">are you ok?</div>
            <div className="wa-bubble wa-bubble--in">Yes I&apos;m on the train now</div>
            <div className="wa-bubble wa-bubble--out">You were probably late</div>
            <div className="wa-bubble wa-bubble--in">I&apos;m here</div>
            <div className="wa-bubble wa-bubble--out">Just outside the office</div>
            <div className="wa-bubble wa-bubble--in">Can you come and get me</div>
            <div className="wa-bubble wa-bubble--out">On the platform I&apos;m standing across from the bus</div>
          </div>
          <div className="wa-input-bar">
            <span className="wa-input-placeholder">Type a message</span>
            <span className="wa-mic" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-1 4H8v2h8v-2z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
