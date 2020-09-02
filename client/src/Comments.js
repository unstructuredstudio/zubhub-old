import React, {useState} from 'react';
import {Row, Container, Col} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import videoService from './services/videoService';
import {AwesomeButton} from 'react-awesome-button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCommentAlt, faComments} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import {format} from 'date-fns';


function Comments(props) {
  const tempObj = props;
  const preComments = tempObj && tempObj.commentsObj &&
    tempObj.commentsObj[0] && tempObj.commentsObj[0].comments;
  const videoId = tempObj && tempObj.videoId;
  const [newComments, setNewComments] = React.useState(preComments?
    preComments:null);
  const [charsLeft, setCharsLeft] = useState(500);
  const {register, handleSubmit, errors} = useForm();

  const onSubmit = async (data) => {
    const res = await videoService.postComment(videoId, data);
    setNewComments(res.comments);
    document.getElementById('commentsForm').reset();
  };

  return (
    <Container className="comments-container">
      <form id="commentsForm" onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <h2> <FontAwesomeIcon icon={faComments} /> {newComments!= null ?
          newComments.length : 0} comments</h2>
        </Row>
        <div className="submit-section">
          <Row className="username-label">
            <p>Leave a comment </p>
          </Row>
          <Row className="post-as-row">
            <Col className="username-input" lg="4" xs="6">
              <input
                type="text"
                name="postedby"
                placeholder="Enter your username"
                maxLength="500"
                ref={register({required: true, maxLength: 20})}
              />
            </Col>
          </Row>
          <Row className="comment-input">
            <textarea
              type="text"
              name="description"
              id="comment"
              placeholder="Add a comment..."
              onChange={(e) => {
                setCharsLeft(500 - e.target.value.length);
              }}
              ref={register({required: true, maxLength: 500})}
            />
          </Row>
          <Row className="publish-btn-chars-row">
            <Col xs="6" className="btn-box">
              <AwesomeButton type="secondary" className="btn-publish">
            Publish &nbsp; <FontAwesomeIcon icon={faCommentAlt} />
              </AwesomeButton>
            </Col>
            <Col xs="6" className="chars-box">
              <p>{charsLeft} chars left</p>
              {errors.comment && errors.comment.type === 'required' &&
            <span>This is required</span>}
              {errors.comment && errors.comment.type === 'maxLength' &&
            <span>Max length exceeded</span> }
            </Col>
          </Row>
        </div>
        {(newComments!= null && newComments.length > 0) ? (
        newComments.map((item, index) => {
          const formattedDate = format(new Date(item.postedago),
              'dd MMM yyyy HH:mm a');
          return <Row key={'comment-row-' + index}>
            <Col xs={12} className="posted-by"><p>{item.postedby}</p></Col>
            <Col xs={12} className="comment">
              <div className="comment-box">
                {item.description}
              </div>
            </Col>
            <Col xs={12} className="posted-ago">
              <p>{formattedDate}</p>
            </Col>
          </Row>;
        })
      ) : (
        <p>No comments found</p>
      )}
      </form>
    </Container>
  );
}

Comment.propTypes = {
  tempObj: PropTypes.array,
  videoId: PropTypes.number,
};

export default Comments;
