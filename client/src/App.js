import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import './App.css';
import Vimeo from '@u-wave/react-vimeo';
import videoService from './services/videoService';

function App() {
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    if(!videos) {
      getVideos();
    }
  })

  const getVideos = async () => {
    let res = await videoService.getAll();
    setVideos(res);
  }

  const renderVideo = video => {
    let id = video.uri.substring(8);
    return (
      <div key={id} className="video-item">
        <Vimeo 
          video={id}
          showTitle={false}
          showPortrait={false}
          color='fdeaed'
          showByline={false}
          controls={false}
          width={330}
          height={190}
        />
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="video-gallery">
        {(videos && videos.length > 0) ? (
          videos.map(video => renderVideo(video))
        ) : (
          <p>No videos found</p>
        )}
      </div>
    </div>
  );
}
export default App;
