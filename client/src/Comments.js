import React from 'react';
import {Row, Container, Col, Button} from 'react-bootstrap';
import history from './History';

function Comments(props) {
  return (
    <Container className="comments-container">
      <Row>
      <h4>0 comments</h4>
      </Row>
      <Row className="post-as-row">
        <Col lg="2" xs="6" className="username-label">
          <p>Post as:</p>
        </Col>
        <Col className="username-input" lg="4" xs="6">
          <input
            type="text"
            placeholder="enter your username"
            maxLength="500"
          />
        </Col>
      </Row>
      <Row className="comment-input">
        <textarea
          type="text"
          placeholder="Add a comment..."
          maxLength="500"
        />
      </Row>
      <Row className="publish-btn-chars-row">
        <Col xs="3" className="btn-box">
          <Button bsPrefix="super-btn" className="publish-button" variant="primary"
            onClick={() => history.push('/')}>Publish</Button>
        </Col>
        <Col xs="9" className="chars-box">
          <p>450 chars left</p>
        </Col>
      </Row>

      {props.commentsObj.map((item, index) => {
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
      </Row>
      })}
    </Container>
  );
}

export default Comments;
