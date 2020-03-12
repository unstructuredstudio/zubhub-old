import React, {useState, useEffect} from 'react';
import Vimeo from '@u-wave/react-vimeo';
import videoService from './services/videoService';
import history from './History';


function VideoGallery() {
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    if (!videos) {
      getVideos();
    }
  });

  const getVideos = async () => {
    const res = await videoService.getAll();
    setVideos(res);
  };

  const renderVideo = (video) => {
    const id = video.uri.substring(8);
    return (
      <div key={id} className="video-item" onClick={() => history.push(
          '/video/' + id,
          {video: video},
      )}>
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
      <div className="videos">
        {(videos!= null && videos.length > 0) ? (
        videos.map((video) => renderVideo(video))
      ) : (
        <p>No videos found</p>
      )}
      </div>
    </div>
  );
}
export default VideoGallery;
