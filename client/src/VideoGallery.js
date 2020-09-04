import React, {useState, useEffect} from 'react';
import videoService from './services/videoService';
import history from './History';
import Likes from './Likes';
import {useParams} from 'react-router-dom';
import {Row, Container, Col, Dropdown, DropdownButton} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons';
import {AwesomeButton} from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import './VideoGallery.css';


function VideoGallery() {
  const {name} = useParams();
  const [categoryName, setCategoryName] = useState(name?name:null);
  const [videos, setVideos] = useState(null);
  const [likes, setLikes] = useState(null);

  const categoryList = ['Toys', 'Science', 'Structures', 'Mechanical'];
  // const categoryList = ['Toys', 'Art', 'Stories', 'Science', 'Structures',
  //   'Music', 'Games', 'Electronics', 'Robotics', 'Coding', 'Animations',
  //   'Mechanical'];

  useEffect(() => {
    if (!videos) {
      getVideos();
    }
    if (categoryName) {
      getCategoryVideos(categoryName);
    }
  }, [categoryName]);

  const getVideos = async () => {
    const res = await videoService.getAll();
    resetLikes(res.likes);
    setVideos(res.videos);
  };

  const getCategoryVideos = async (category) => {
    const res = await videoService.getCategoryVideos(category);
    resetLikes(res.likes);
    setVideos(res.videos);
  };

  const resetLikes = (prevLikes) => {
    const newLikes = prevLikes;
    newLikes.forEach((item) => {
      item.liked = false;
    });
    setLikes([...newLikes]);
  };

  const videoBg = {
    backgroundColor: 'black',
    height: '70%',
    width: '100%',
    marginBottom: 10,
  };

  const renderVideo = (video) => {
    const id = video.uri.substring(8);
    const likesData = likes && likes.find((o) => o.videoId === id );

    return (
      <div key={id} className="video-item">
        <div style={videoBg}>
          <iframe title="vimeo-player" className="vimeo-player"
            src={'https://player.vimeo.com/video/' + id + '?byline=0&portrait=0&title=0'}
            frameBorder="0">
          </iframe>
        </div>
        <div className="video-title">{video.name}</div>
        <Row>
          <Col>
            <Likes videoId={id} likesObj={[likesData]}></Likes>
          </Col>
          <Col>
            <p className="video-url">
              <AwesomeButton type="secondary" onPress={() => history.push(
                  '/project/' + id,
                  {video: video},
                  {likes: likesData},
              )}>
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                View Project
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
            Projects
          </div>
          <div className="sub-title">
            <DropdownButton id="category-list" className="shadow-none"
              title="Category">
              <Dropdown.Item href="/">All Categories</Dropdown.Item>
              {categoryList.map((category) => (
                <Dropdown.Item key={'dropdownitem-' + category}
                  onClick={() => {
                    history.push('/category/' + category.toLowerCase());
                    setCategoryName(category.toLowerCase());
                  }}>
                  {category}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
        </div>
      </div>
      <div className="video-spread">
        {(videos && videos.length > 0) ? (
        videos.map((video) => renderVideo(video))
      ) : (
        <p>Loading...</p>
      )}
        {videos && videos.length === 0 && <p> No videos found!</p>}
      </div>
    </Container>
  );
}

export default VideoGallery;
