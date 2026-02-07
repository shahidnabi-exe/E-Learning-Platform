import React from "react";
import "./about.css";

function About() {
  return (
    <section className="about">
      <div className="about-content">
        <span className="about-tag">WHO WE ARE</span>

        <h2>
          Where Learning <span>Meets</span> Real-World Code
        </h2>

        <p className="about-intro">
          <strong>Code Campus</strong> is not just another learning platform —
          it’s a structured environment built for developers who want clarity,
          depth, and practical growth.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h4>🎓 Learn with Structure</h4>
            <p>
              Courses are designed with progression in mind — from fundamentals
              to advanced concepts — ensuring learners build skills logically,
              not randomly.
            </p>
          </div>

          <div className="about-card">
            <h4>⚙️ Built for Scale</h4>
            <p>
              Code Campus is engineered using modern backend architecture and
              role-based access control, supporting students, instructors, and
              administrators seamlessly.
            </p>
          </div>

          <div className="about-card">
            <h4>🚀 Practice-Driven</h4>
            <p>
              We focus on real development workflows, clean code practices, and
              industry-relevant technologies — not just theory.
            </p>
          </div>
        </div>
        <br /><br />
        <p className="about-footer">
          Code Campus emphasis on hands-on development, real workflows, and industry-relevant
          skills instead of memorization.
        </p>
      </div>
    </section>
  );
}

export default About;
