import React from 'react';
import logo from './logo.png';
import './App.css';
import VideoGallery from './VideoGallery';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <VideoGallery>
      </VideoGallery>
    </div>
  );
}
export default App;
