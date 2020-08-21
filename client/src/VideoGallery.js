import React, {useState, useEffect} from 'react';
import videoService from './services/videoService';
import history from './History';
import {Row, Container, Col, Dropdown, DropdownButton} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt, faEye} from '@fortawesome/free-solid-svg-icons';
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import './VideoGallery.css'

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

  const videoBg = {
    backgroundColor: "black",
    height: "85%",
    width: "100%",
    marginBottom: 10
  };

  const renderVideo = (video) => {
    const id = video.uri.substring(8);
    return (
      <div key={id} className="video-item">
        <div style={videoBg}>
        <iframe title="vimeo-player" className="vimeo-player"
          src={'https://player.vimeo.com/video/' + id}
          frameBorder="0"
        >
        </iframe>
        </div>
        <Row>
          <Col>
            <p><AwesomeButton type="primary"><FontAwesomeIcon icon={faEye} /> {video.stats.plays} Views</AwesomeButton> </p>
          </Col>
          <Col>
            <p className="video-url">
              <AwesomeButton type="secondary">
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                <a onClick={() => history.push(
                    '/video/' + id,
                    {video: video},
                )}> View Project </a>
              </AwesomeButton>
            </p>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Container className="video-gallery">
      <div className="videos">
        <div className="gallery-sub-nav">
          <div className="sub-title">
            Videos
          </div>
          <div className="sub-title">
          <DropdownButton id="category-list" title="Category">
            <Dropdown.Item href="#/action-1">Toys</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Art</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Stories</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Science Project</Dropdown.Item>
          </DropdownButton>
          </div>
        </div>
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
