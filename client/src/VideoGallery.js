import React, { useState, useEffect } from 'react';
import './App.css';
import Vimeo from '@u-wave/react-vimeo';
import videoService from './services/videoService';
import { Button } from 'react-bootstrap';

function VideoGallery() {
  const [videos, setVideos] = useState(null);
  const [videoObject, setVideoObject] = useState(null);

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
      <div key={id} className="video-item" onClick={() => setVideoObject(video)}>
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
    <div className="video-gallery">
        {!videoObject &&
        <div className="videos">
        {(videos!= null && videos.length > 0) ? (
          videos.map(video => renderVideo(video))
        ) : (
          <p>No videos found</p>
        )}
        </div>
        }
        {videoObject &&
        <div class="video-page">
            <Button bsPrefix="super-btn" className="back-button" onClick={() => setVideoObject(null)} variant="primary">Back to Video Gallery</Button>
            <div class="video-box">
                <Vimeo
                video={videoObject.uri.substring(8)}
                showTitle={false}
                showPortrait={false}
                color='fdeaed'
                showByline={false}
                controls={false}
                width={500}
                />
            </div>
            <div class="video-info-box">
                <h1 className="title">{videoObject.name}</h1>
                <p className="created">Uploaded on {videoObject.created_time}</p>
                <h3 className="username">{videoObject.user.name}</h3>
                <p className="description">{videoObject.description}</p>
                {(videoObject.tags!= null && videoObject.tags.tag) &&
                    <span className="tags">{videoObject.tags.tag}</span>
                }
            </div>
        </div>
        }
    </div>
  );
}
export default VideoGallery;