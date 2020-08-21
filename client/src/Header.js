import React from 'react';
import logo from './logo.png';
import hamburger from './hamburger.png';


function Header() {
  return (
    <header className="App-header">
      <img src={hamburger} className="hamburger" alt="menu" />
      <img src={logo} className="App-logo" alt="logo" />
    </header>
  );
}

export default Header;
