import React, {useState, useEffect} from 'react';
import videoService from './services/videoService';
import history from './History';
import {Row, Container, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt, faEye} from '@fortawesome/free-solid-svg-icons';


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
      <div key={id} className="video-item">
        <iframe title="vimeo-player"
          src={'https://player.vimeo.com/video/' + id}
          frameBorder="0"
        >
        </iframe>
        <Row>
          <Col>
            <p><FontAwesomeIcon icon={faEye} /> {video.stats.plays} views</p>
          </Col>
          <Col>
            <p className="video-url">
              <a onClick={() => history.push(
                  '/video/' + id,
                  {video: video},
              )}> View project </a>
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </p>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Container className="video-gallery">
      <div className="videos">
        {(videos!= null && videos.length > 0) ? (
        videos.map((video) => renderVideo(video))
      ) : (
        <p>Loading...</p>
      )}
      </div>
    </Container>
  );
}
export default VideoGallery;
