import React, {useState, useEffect} from 'react';
import Vimeo from '@u-wave/react-vimeo';
import {useParams, useLocation} from 'react-router-dom';
import videoService from './services/videoService';
import {Button} from 'react-bootstrap';
import history from './History';


function VideoPage() {
  const location = useLocation();
  const {id} = useParams();
  const tempObj = location && location.state && location.state.video;
  const [videoObject, setVideoObject] = useState(tempObj ? tempObj : null);

  useEffect(() => {
    if (!videoObject) {
      getVideoObject();
    }
  });

  const getVideoObject = async () => {
    const res = await videoService.getVideo(id);
    setVideoObject(res[0]);
  };

  return (
    <div className="video-page">
      <Button bsPrefix="super-btn" className="back-button" variant="primary"
        onClick={() => history.push('/')}>Back to Video Gallery</Button>

      {(videoObject == null) &&
      <p>No video found :-(</p>
      }

      {(videoObject && videoObject !== null) &&
      <div className="video-box">
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
      }

      {(videoObject && videoObject !== null) &&
      <div className="video-info-box">
        <h1 className="title">{videoObject.name}</h1>
        <p className="created">{videoObject.stats.plays} views | Uploaded on
          {videoObject.created_time}</p>
        <h3 className="username">{videoObject.user.name}</h3>
        <p className="description">{videoObject.description}</p>
        {videoObject.tags.map((item, index) => {
          return <span key={'tag-' + index} className="tags">{item.tag}</span>;
        })}
      </div>
      }
    </div>
  );
}

export default VideoPage;
