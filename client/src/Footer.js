import React from 'react';
import unstructuredLogo from './unstructured-logo.png';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-distributed">
      <div className="footer-right">

      </div>

      <div className="footer-left">

      </div>
      <img src={unstructuredLogo} className="footer-logo" alt="unstructured-studio-logo" />
    </footer>
  );
}

export default Footer;
