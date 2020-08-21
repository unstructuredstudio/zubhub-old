import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './Header';
import Routes from './Routes';
import Footer from './Footer';


function App() {
  return (
    <div className="App">
      <Header/>
      <Routes/>
      <Footer/>
    </div>
  );
}
export default App;
