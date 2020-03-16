import React, {useState, useEffect} from 'react';
import Vimeo from '@u-wave/react-vimeo';
import {useParams, useLocation} from 'react-router-dom';
import videoService from './services/videoService';
import {Button} from 'react-bootstrap';
import {Row, Container, Col} from 'react-bootstrap';
import history from './History';
import Comments from './Comments';


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
    <Container className="video-page">
      {(videoObject == null) &&
      <p>No video found :-(</p>
      }
      <Row>
        <Col className="button-box" lg={3} xs={12}>
          <Button bsPrefix="super-btn" className="back-button" variant="primary"
            onClick={() => history.push('/')}>Back to Video Gallery</Button>
        </Col>
      </Row>

      {(videoObject && videoObject !== null) &&
      <Row>
        <Col className="video-box" xs={9}>
          <Vimeo
            video={videoObject.uri.substring(8)}
            showTitle={false}
            showPortrait={false}
            color='fdeaed'
            showByline={false}
            controls={false}
            width={835}
          />
        </Col>
      </Row>
      }

      {(videoObject && videoObject !== null) &&
      <Row>
        <Col className="video-info-box" xs={9}>
          <h1 className="title">{videoObject.name}</h1>
          <p className="created">{videoObject.stats.plays} views | Uploaded on
            {videoObject.created_time}</p>
          <h3 className="username">{videoObject.user.name}</h3>
          <p className="description">{videoObject.description}</p>
          {videoObject.tags.map((item, index) => {
            return <span key={'tag-' + index} className="tags">{item.tag}
            </span>;
          })}
          <Comments></Comments>
        </Col>
      </Row>
      }
    </Container>
  );
}

export default VideoPage;
