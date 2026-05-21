import { useCallback, useEffect, useId, useState } from 'react';
import { X } from 'lucide-react';
import {
  WHATSAPP_CHAT_URL,
  WHATSAPP_INTRO_MESSAGE,
  WHATSAPP_PANDIT_NAME,
  WHATSAPP_PANDIT_STATUS,
} from '../content/siteCopy';

type WhatsAppChatButtonProps = {
  className?: string;
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}

/** Floating WhatsApp CTA — opens preview popup, then "Start chat" goes to WhatsApp */
export default function WhatsAppChatButton({ className = '' }: WhatsAppChatButtonProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <div className={['wa-chat-widget', className].filter(Boolean).join(' ')}>
      {open && (
        <div
          className="wa-chat-popup"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
        >
          <header className="wa-chat-popup__header">
            <div className="wa-chat-popup__profile">
              <img
                src="/whatsapp-chat/pandit-avatar.png"
                alt=""
                className="wa-chat-popup__avatar"
                width={49}
                height={49}
                decoding="async"
              />
              <div className="wa-chat-popup__meta">
                <h2 id={titleId} className="wa-chat-popup__name">
                  {WHATSAPP_PANDIT_NAME}
                </h2>
                <p className="wa-chat-popup__status">{WHATSAPP_PANDIT_STATUS}</p>
              </div>
            </div>
            <button
              type="button"
              className="wa-chat-popup__close"
              onClick={close}
              aria-label="Close chat preview"
            >
              <X size={22} strokeWidth={2} aria-hidden />
            </button>
          </header>

          <div className="wa-chat-popup__body">
            <div className="wa-chat-popup__bubble-wrap">
              <div className="wa-chat-popup__bubble">
                <span className="wa-chat-popup__bubble-sender">{WHATSAPP_PANDIT_NAME}</span>
                <p className="wa-chat-popup__bubble-text">{WHATSAPP_INTRO_MESSAGE}</p>
              </div>
            </div>
          </div>

          <footer className="wa-chat-popup__footer">
            <a
              href={WHATSAPP_CHAT_URL}
              className="wa-chat-popup__start"
              target="_blank"
              rel="noopener noreferrer"
            >
              Start chat
            </a>
            <p className="wa-chat-popup__brand">
              <span className="wa-chat-popup__brand-bolt" aria-hidden>
                ⚡
              </span>{' '}
              by <em>AiSensy</em>
            </p>
          </footer>
        </div>
      )}

      <button
        type="button"
        className="whatsapp-chat-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? 'Close chat preview' : 'Chat with us on WhatsApp'}
      >
        <span className="whatsapp-chat-btn__icon">
          <WhatsAppIcon />
        </span>
        <span className="whatsapp-chat-btn__label">Chat with us</span>
      </button>
    </div>
  );
}
