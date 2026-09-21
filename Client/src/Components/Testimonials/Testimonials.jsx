import React from "react";
import { Star, Quote } from "lucide-react";
import "./testimonials.css";

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Alex Rivera",
      role: "Full Stack Engineer @ FinTech",
      message:
        "Code Campus transformed how I learn. The structured curriculum and hands-on modules made complex backend topics completely approachable.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Sophia Chen",
      role: "AI Research Assistant",
      message:
        "The Google AI and Machine Learning courses provided direct real-world intuition. I went from reading research papers to building functional AI pipelines in weeks.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Marcus Vance",
      role: "Lead Software Architect",
      message:
        "Teaching on Code Campus has been an exceptional experience. The instructor studio makes lecture uploads, student feedback, and progress tracking completely seamless.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <span className="testimonials-tag">Success Stories</span>
          <h2>Loved by Developers & Instructors</h2>
          <p>
            Discover how Code Campus empowers engineers and educators around the globe.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card-modern" key={t.id}>
              <div>
                <Quote size={28} className="testimonial-quote-icon" />
                <p className="testimonial-text">{t.message}</p>
                <div className="testimonial-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill="currentColor" />
                  ))}
                </div>
              </div>

              <div className="testimonial-author">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="testimonial-author-avatar"
                />
                <div>
                  <div className="testimonial-author-name">{t.name}</div>
                  <div className="testimonial-author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
