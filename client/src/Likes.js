import React, {useState, useEffect} from 'react';
import {Row, Container, Col} from 'react-bootstrap';
import videoService from './services/videoService';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {AwesomeButton} from 'react-awesome-button';


function Likes(props) {
  const tempObj = props && props.likesObj;
  const videoId = props && props.videoId;
  const [likesObj, setLikesObj] = useState(null);
  const [numLikes, setNumLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (tempObj) {
      setLikesObj(tempObj);
    }

    if (likesObj !== null) {
      const obj = likesObj && likesObj[0];
      if (obj) {
        setNumLikes(obj.likes);
        setLiked(obj.liked);
      }
    }
  }, [tempObj, likesObj]);

  const updateLikesCount = async (id, liked) => {
    const res = await videoService.updateLikesCount(id, liked);
    let tempObj = likesObj;
    const obj = tempObj && tempObj[0];

    if (obj && obj !== null) {
      if (obj.videoId === id) {
        obj.liked = liked;
        obj.likes = res[0].likes;
      }
      setLikesObj([...tempObj]);
    } else {
      tempObj = {
        videoId: id,
        liked: liked,
        _id: res[0]._id,
        likes: res[0].likes,
      };
      setLikesObj([tempObj]);
    }
  };

  return (
    <Container>
      <Col>
        <Row style={{margin: '0px'}}>
          <p><AwesomeButton type="primary">{numLikes} likes
          </AwesomeButton> </p>
          <AwesomeButton type="secondary" onPress={() => {
            updateLikesCount(videoId, !liked);
          }}>
            <FontAwesomeIcon icon={faThumbsUp} />
          </AwesomeButton>
        </Row>
      </Col>
    </Container>
  );
}

Likes.propTypes = {
  likesObj: PropTypes.array,
  videoId: PropTypes.string,
};

export default Likes;
