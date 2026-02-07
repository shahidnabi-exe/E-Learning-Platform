import React from 'react'
import './footer.css'
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";



function Footer() {
  return (
    <footer>
        <div className="footer-content">
            <p>
                &copy; 2025 Your E-Learning Platform. All rights reserved. <br /> Made with ❤ <a href=''> Shahid Nabi</a>
            </p>

            <div className="social-links">
                <a href='https://www.facebook.com/shahid.nabi.944023'> <FaFacebook/></a>
                <a href='https://www.instagram.com/shahid._.07._'><FaInstagram/></a>
                <a href='https://www.github.com/shahidnabi-exe'><FaGithub/></a>
                <a href='https://www.linkedin.com/in/shahid-nabi-57b341258/'><FaLinkedin/></a>
            </div>
        </div>
    </footer>
  )
}

export default Footer