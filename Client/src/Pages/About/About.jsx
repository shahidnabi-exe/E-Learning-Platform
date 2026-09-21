import React from "react";
import { GraduationCap, ShieldCheck, Zap, Code, Users } from "lucide-react";
import "./about.css";

function About() {
  return (
    <div className="about-page-wrap animate-fade-in">
      <div className="about-header-centered">
        <span
          style={{
            color: "var(--gold-primary)",
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.5rem",
            display: "inline-block",
          }}
        >
          Our Core Mission
        </span>
        <h1>
          Where Learning Meets <span>Production Reality</span>.
        </h1>
        <p>
          Code Campus is engineered for developers, educators, and creators who value clarity, modular depth, and hands-on skill development over passive lectures.
        </p>
      </div>

      <div className="about-cards-grid">
        <div className="about-mission-box">
          <div className="about-icon-emblem">
            <Code size={26} />
          </div>
          <h3 style={{ fontSize: "1.3rem" }}>Hands-On Engineering</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Every curriculum track is crafted around real architectural patterns, industry tools, and functional projects—not toy examples.
          </p>
        </div>

        <div className="about-mission-box">
          <div className="about-icon-emblem">
            <Zap size={26} />
          </div>
          <h3 style={{ fontSize: "1.3rem" }}>Structured Progression</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Step-by-step modular lessons guide you logically from fundamentals to production scale, keeping cognitive load low and retention high.
          </p>
        </div>

        <div className="about-mission-box">
          <div className="about-icon-emblem">
            <Users size={26} />
          </div>
          <h3 style={{ fontSize: "1.3rem" }}>Educator First</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Practicing software engineers and researchers share their expertise directly with learners through our modern instructor studio.
          </p>
        </div>
      </div>

      <div className="about-values-banner">
        <h3>Built for Builders. Supported by Experts.</h3>
        <p>
          Whether you are an aspiring engineer mastering your first framework, an experienced lead adopting modern AI architectures, or an educator inspiring the next generation, Code Campus gives you the tools to succeed.
        </p>
      </div>
    </div>
  );
}

export default About;
