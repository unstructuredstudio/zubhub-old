import React from 'react';
import {Row, Container, Col, Button} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import videoService from './services/videoService';
import PropTypes from 'prop-types';


function Comments(props) {
  const tempObj = props;
  const preComments = tempObj && tempObj.commentsObj &&
    tempObj.commentsObj[0] && tempObj.commentsObj[0].comments;

  const videoId = tempObj && tempObj.videoId;
  const [newComments, setNewComments] = React.useState(preComments?
    preComments:null);

  const {register, handleSubmit, errors} = useForm();

  const onSubmit = async (data) => {
    const res = await videoService.postComment(videoId, data);
    setNewComments(res.comments);
  };

  return (
    <Container className="comments-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <h4>{newComments!= null ? newComments.length : 0} comments</h4>
        </Row>
        <Row className="post-as-row">
          <Col lg="2" xs="6" className="username-label">
            <p>Post as:</p>
          </Col>
          <Col className="username-input" lg="4" xs="6">
            <input
              type="text"
              name="postedby"
              placeholder="enter your username"
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
            ref={register({required: true, maxLength: 500})}
          />
        </Row>
        <Row className="publish-btn-chars-row">
          <Col xs="3" className="btn-box">
            <Button bsPrefix="super-btn" type="submit"
              className="publish-button" variant="primary">Publish</Button>
          </Col>
          <Col xs="9" className="chars-box">
            <p>500 chars left</p>
            {errors.comment && errors.comment.type === 'required' &&
            <span>This is required</span>}
            {errors.comment && errors.comment.type === 'maxLength' &&
            <span>Max length exceeded</span> }
          </Col>
        </Row>
        {(newComments!= null && newComments.length > 0) ? (
        newComments.map((item, index) => {
          return <Row key={'comment-row-' + index}>
            <Col xs={12} className="posted-by"><p>{item.postedby}</p></Col>
            <Col xs={12} className="comment">
              <div className="comment-box">
                {item.description}
              </div>
            </Col>
            <Col xs={12} className="posted-ago">
              <p>{item.postedago}</p>
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
