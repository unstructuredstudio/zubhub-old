import React, {useState, useEffect} from 'react';
import Vimeo from '@u-wave/react-vimeo';
import {useParams} from 'react-router-dom';
import videoService from './services/videoService';
import {Button} from 'react-bootstrap';
import {Row, Container, Col} from 'react-bootstrap';
import history from './History';
import Comments from './Comments';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {AwesomeButton} from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import './VideoGallery.css';


function VideoPage() {
  const {id} = useParams();
  const [videoObject, setVideoObject] = useState(null);
  const [likesObject, setLikesObject] = useState(null);

  const liked = likesObject && likesObject[0] && likesObject[0].liked ?
    likesObject[0].liked : false;
  const numLikes = likesObject && likesObject[0] && likesObject[0].likes ?
    likesObject[0].likes : 0;

  useEffect(() => {
    if (!videoObject) {
      getVideoObject();
    }
  });

  const getVideoObject = async () => {
    const res = await videoService.getVideo(id);
    setVideoObject(res.video);
    console.log('Likes' + JSON.stringify(res.likes));
    setLikesObject(res.likes);
  };

  const updateLikesCount = async (videoID, liked) => {
    const res = await videoService.updateLikesCount(videoID, liked);
    const likesObj = likesObject[0];

    if (likesObj) {
      let videoExists = false;

      if (likesObj.videoId === videoID) {
        likesObj.liked = liked;
        likesObj.likes = res[0].likes;
        videoExists = true;
      }

      if (!videoExists) {
        likesObj.push({
          videoId: videoID,
          liked: liked,
          _id: res[0]._id,
          likesObj: res[0].likes,
        });
      }

      setLikesObject([likesObj]);
    }
  };

  return (
    <Container className="video-page">
      <div className="video-sub-nav">
        <div className="sub-title">
          <Button bsPrefix="super-btn" id="back-button" variant="primary"
            onClick={() => history.push('/')}> ◄ Back</Button>
        </div>
      </div>
      <div className="video-page-view">
        {(videoObject == null) &&
      <p>No video found :-(</p>
        }
        {(videoObject && videoObject !== null) &&
        <div className="video-box">
          <div className="vimeo-container">
            <Vimeo
              video={videoObject.uri.substring(8)}
              showTitle={false}
              showPortrait={false}
              color='FFCC00'
              showByline={false}
              controls={false}
              height={500}
            />
          </div>
          <div className="video-controls">
            <Row>
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
            </Row>
          </div>
        </div>
        }


        {(videoObject && videoObject !== null) &&
        <div className="video-info-box" lg={7} sm={11} md={12} xs={9}>
          <h1 className="title">{videoObject.name}</h1>
          {videoObject.tags.map((item, index) => {
            return <span key={'tag-' + index} className="tags">{item.tag}
            </span>;
          })}
          {/* <h3 className="username">{videoObject.user.name}</h3> */}
          <p className="description">{videoObject.description}</p>
          {/* <Comments videoId={id} commentsObj={videoObject.comments}>
          </Comments> */}
        </div>
        }
      </div>
    </Container>
  );
}

export default VideoPage;
