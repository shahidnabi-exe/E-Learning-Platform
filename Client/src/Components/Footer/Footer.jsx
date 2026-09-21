import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Github, Linkedin, Twitter, Mail } from "lucide-react";
import "./footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <GraduationCap size={18} />
              </div>
              <div className="footer-logo-text">
                Code<span>Campus</span>
              </div>
            </Link>
            <p className="footer-desc">
              Empowering developers and creators worldwide through structured, practical, and hands-on online education.
            </p>
          </div>

          {/* Column: Platform */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/courses">Explore Courses</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/dashboard">Student Dashboard</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          {/* Column: Teach */}
          <div className="footer-col">
            <h4>Instructors</h4>
            <ul>
              <li><Link to="/register">Become an Instructor</Link></li>
              <li><Link to="/instructor/dashboard">Instructor Console</Link></li>
              <li><Link to="/instructor/create-course">Publish a Course</Link></li>
              <li><Link to="/admin/login">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Column: Support & Community */}
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="mailto:support@codecampus.edu">Contact Support</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer">Documentation</a></li>
              <li><a href="https://discord.com" target="_blank" rel="noreferrer">Community Discord</a></li>
              <li><Link to="/about">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Code Campus LMS. All rights reserved.</p>

          <div className="footer-socials">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="GitHub">
              <Github size={17} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn">
              <Linkedin size={17} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Twitter">
              <Twitter size={17} />
            </a>
            <a href="mailto:contact@codecampus.edu" className="social-btn" aria-label="Email">
              <Mail size={17} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;