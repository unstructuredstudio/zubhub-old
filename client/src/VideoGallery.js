import React, {useState, useEffect} from 'react';
import videoService from './services/videoService';
import history from './History';
import {Row, Container, Col, Dropdown, DropdownButton} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt, faEye, faThumbsUp}
  from '@fortawesome/free-solid-svg-icons';
import {AwesomeButton} from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import './VideoGallery.css';


function VideoGallery() {
  const [videos, setVideos] = useState(null);
  const [likes, setLikes] = useState(null);

  useEffect(() => {
    if (!videos) {
      getVideos();
    }
  });

  const updateLikesCount = async (videoID, liked) => {
    const res = await videoService.updateLikesCount(videoID, liked);

    if (likes) {
      let videoExists = false;
      likes.forEach((item) => {
        if (item.videoId === videoID) {
          item.liked = liked;
          item.likes = res[0].likes;
          videoExists = true;
        }
      });

      if (!videoExists) {
        likes.push({
          videoId: videoID,
          liked: liked,
          _id: res[0]._id,
          likes: res[0].likes,
        });
      }

      setLikes([...likes]);
    }
  };

  const getVideos = async () => {
    const res = await videoService.getAll();
    const likesData = res.likes;

    likesData.forEach((item) => {
      item.liked = false;
    });

    setLikes([...likesData]);
    setVideos(res.videos);
  };

  const videoBg = {
    backgroundColor: 'black',
    height: '85%',
    width: '100%',
    marginBottom: 10,
  };

  const renderVideo = (video) => {
    const id = video.uri.substring(8);

    const statsData = likes && likes.find((o) => o.videoId === id );
    const liked = statsData && statsData['liked'] ? statsData['liked'] : false;
    const numLikes = statsData && statsData['likes'] ? statsData['likes'] : 0;


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
          {/* <Col>
            <p><AwesomeButton type="primary"><FontAwesomeIcon icon={faEye} />
            {video.stats.plays} Views</AwesomeButton> </p>
          </Col> */}
          <Col>
            <Row style={{margin: '0px'}}>
              <p><AwesomeButton type="primary">{numLikes} likes
              </AwesomeButton> </p>
              <a onClick={() => {
                updateLikesCount(id, !liked);
              }}>
                <AwesomeButton type="secondary">
                  <FontAwesomeIcon icon={faThumbsUp} />
                </AwesomeButton>
              </a>
            </Row>
          </Col>
          <Col>
            <p className="video-url">
              <AwesomeButton type="secondary">
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                <a onClick={() => history.push(
                    '/video/' + id,
                    {video: video},
                    {likes: statsData},
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
      </div>
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
