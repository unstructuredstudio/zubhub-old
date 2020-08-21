import React from 'react';
import unstructuredLogo from './unstructured-logo.png';
import './Footer.css';

function Footer() {
  return (
    <footer class="footer-distributed">
      <div class="footer-right">

      </div>

      <div class="footer-left">

      </div>
      <img src={unstructuredLogo} className="footer-logo" alt="unstructured-studio-logo" />
    </footer>
  );
}

export default Footer;
