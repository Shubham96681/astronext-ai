from pathlib import Path
p = Path(r'd:\astronext3\src\App.tsx')
t = p.read_text(encoding='utf-8')

old_t = """                {[
                  { initial: 'R', color: '#3d5afe', name: 'Rahul Sharma', place: 'New Delhi, India' },
                  { initial: 'P', color: '#ff8a65', name: 'Priya Patel', place: 'Mumbai, India' },
                  { initial: 'A', color: '#8d6e63', name: 'Amit Vats', place: 'Bangalore, India' },
                ].map((t) => (
                  <div className="testimonial-card testimonial-card--dark" key={t.name}>
                    <span className="quote-icon">"</span>
                    <div className="testimonial-stars">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--secondary)" stroke="var(--secondary)" />)}
                    </motion>
                    <p className="testimonial-text testimonial-text--light">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin aliquet maurisa volutpat lobortis erat libero condimentum metuseu tincidunt.
                    </p>
                    <div className="testimonial-author-wrapper">
                      <div className="author-initial" style={{ background: t.color }}>{t.initial}</div>
                      <div className="author-info">
                        <h5>{t.name}</h5>
                        <p>{t.place}</p>
                      </div>
                    </div>
                  </div>
                ))}"""

new_t = """                {[
                  { avatar: avatar1 },
                  { avatar: avatar2 },
                  { avatar: avatar3 },
                ].map((t, idx) => (
                  <div className="testimonial-card testimonial-card--dark" key={idx}>
                    <span className="quote-icon">"</span>
                    <p className="testimonial-text testimonial-text--light">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin aliquet maurisa volutpat lobortis erat libero condimentum metuseu tincidunt.
                    </p>
                    <div className="testimonial-author-wrapper">
                      <img src={t.avatar} alt="" className="testimonial-avatar" />
                    </div>
                    <div className="testimonial-stars">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--secondary)" stroke="var(--secondary)" />)}
                    </div>
                  </div>
                ))}"""

old_t = old_t.replace('</motion>', '</motion>').replace('<motion', '<div').replace('</motion>', '</motion>')
# fix - copy exact from file
old_t = """                {[
                  { initial: 'R', color: '#3d5afe', name: 'Rahul Sharma', place: 'New Delhi, India' },
                  { initial: 'P', color: '#ff8a65', name: 'Priya Patel', place: 'Mumbai, India' },
                  { initial: 'A', color: '#8d6e63', name: 'Amit Vats', place: 'Bangalore, India' },
                ].map((t) => (
                  <div className="testimonial-card testimonial-card--dark" key={t.name}>
                    <span className="quote-icon">"</span>
                    <div className="testimonial-stars">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--secondary)" stroke="var(--secondary)" />)}
                    </div>
                    <p className="testimonial-text testimonial-text--light">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin aliquet maurisa volutpat lobortis erat libero condimentum metuseu tincidunt.
                    </p>
                    <div className="testimonial-author-wrapper">
                      <motion className="author-initial" style={{ background: t.color }}>{t.initial}</div>
                      <div className="author-info">
                        <h5>{t.name}</h5>
                        <p>{t.place}</p>
                      </div>
                    </div>
                  </div>
                ))}"""

# Still wrong - use exact
start = t.index("{ initial: 'R', color: '#3d5afe'")
end = t.index("))}\n              </motion>\n            </section>\n\n            {/* Section 7: Divine Products Section */}".replace('motion', 'div'))
end = t.index("))}\n              </div>\n            </section>\n\n            {/* Section 7: Divine Products Section */}")
new_block = """{[
                  { avatar: avatar1 },
                  { avatar: avatar2 },
                  { avatar: avatar3 },
                ].map((t, idx) => (
                  <div className="testimonial-card testimonial-card--dark" key={idx}>
                    <span className="quote-icon">"</span>
                    <p className="testimonial-text testimonial-text--light">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin aliquet maurisa volutpat lobortis erat libero condimentum metuseu tincidunt.
                    </p>
                    <div className="testimonial-author-wrapper">
                      <img src={t.avatar} alt="" className="testimonial-avatar" />
                    </div>
                    <div className="testimonial-stars">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--secondary)" stroke="var(--secondary)" />)}
                    </div>
                  </div>
                ))"""
t = t[:start] + new_block + t[end:]

# Remove contact section
c_start = t.index('            {/* Section 9: Lead Form Section */}')
c_end = t.index('            {/* Section 10: Frequently Asked Questions (FAQ) */}')
t = t[:c_start] + '            {/* Section 9: Frequently Asked Questions (FAQ) */}\n' + t[c_end + len('            {/* Section 10: Frequently Asked Questions (FAQ) */}'):]

# why contact scroll target
t = t.replace("getElementById('lead-contact')", "document.querySelector('.mega-footer')")

p.write_text(t, encoding='utf-8')
print('patched testimonials and removed contact section')
