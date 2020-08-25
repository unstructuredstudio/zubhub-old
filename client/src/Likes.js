import React, {useState, useEffect} from 'react';
import {Row, Container, Col} from 'react-bootstrap';
import videoService from './services/videoService';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {AwesomeButton} from 'react-awesome-button';


function Likes(props) {
  const tempObj = props && props.likesObj && props.likesObj[0];

  const [likesObj, setLikesObj] = useState(tempObj);
  const [numLikes, setNumLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [videoId, setVideoId] = useState(0);

  useEffect(() => {
    if (tempObj) {
      setLikesObj(tempObj);
    }

    if (likesObj) {
      setNumLikes(likesObj.likes);
      setLiked(likesObj.liked);
      setVideoId(likesObj.videoId);
    }
  }, [tempObj, likesObj]);

  const updateLikesCount = async (id, liked) => {
    const res = await videoService.updateLikesCount(id, liked);
    let tempObj = likesObj;
    let videoExists = false;

    if (tempObj) {
      if (tempObj.videoId === id) {
        tempObj.liked = liked;
        tempObj.likes = res[0].likes;
        videoExists = true;
      }
      setLikesObj([tempObj]);
    }

    if (!videoExists) {
      tempObj = {
        videoId: id,
        liked: liked,
        _id: res[0]._id,
        likes: res[0].likes,
      };
      setLikesObj(tempObj);
    }
  };

  return (
    <Container>
      <Col>
        <Row style={{margin: '0px'}}>
          <p><AwesomeButton type="primary">{numLikes} likes
          </AwesomeButton> </p>
          <a onClick={() => {
            updateLikesCount(videoId, !liked);
          }}>
            <AwesomeButton type="secondary">
              <FontAwesomeIcon icon={faThumbsUp} />
            </AwesomeButton>
          </a>
        </Row>
      </Col>
    </Container>
  );
}

Likes.propTypes = {
  likesObj: PropTypes.array,
};

export default Likes;
