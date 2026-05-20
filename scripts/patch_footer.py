from pathlib import Path
p = Path(r'd:\astronext3\src\App.tsx')
t = p.read_text(encoding='utf-8')
start = t.index('      {/* AstroNext Mega Footer')
end = t.index('      {/* Floating AI Pandit Jee Toggle Button */}')
footer = '''      <footer className="mega-footer">
        <motion className="footer-top-row">
          <img src={logoImg} alt="Astronext.ai" />
          <ul className="footer-legal-inline">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#refund">Refund Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#menu1">Menu Item</a></li>
            <li><a href="#menu2">Menu Item</a></li>
            <li><a href="#menu3">Menu Item</a></li>
            <li><a href="#menu4">Menu Item</a></li>
          </ul>
        </div>

        <div className="footer-grid footer-grid--design">
          <div className="footer-col">
            <h4>About Astro AI</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel urna neque. Mauris facilisis ligula nulla, eu suscipit elit luctus pellentesque.
            </p>
          </div>

          <div className="footer-col">
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

          <div className="footer-col">
            <h4>Contact Us</h4>
            <p className="footer-contact-line">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className="footer-contact-line"><strong>Email ID:</strong> email@gmail.com</p>
            <div className="footer-social-row">
              <a href="https://wa.me/919999999999" className="footer-social-btn footer-social-btn--wa" aria-label="WhatsApp">W</a>
              <a href="#youtube" className="footer-social-btn footer-social-btn--yt" aria-label="YouTube">▶</a>
              <a href="#facebook" className="footer-social-btn footer-social-btn--fb" aria-label="Facebook">f</a>
              <a href="#instagram" className="footer-social-btn footer-social-btn--ig" aria-label="Instagram">◎</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright 2025 AstroAI. All Rights Reserved</p>
        </div>
      </footer>

'''
footer = footer.replace('<motion className="footer-top-row">', '<div className="footer-top-row">')
t = t[:start] + footer + t[end:]
p.write_text(t, encoding='utf-8')
print('footer updated')
