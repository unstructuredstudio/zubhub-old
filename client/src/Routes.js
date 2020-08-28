import React from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import History from './History';
import VideoGallery from './VideoGallery';
import VideoPage from './VideoPage';

function Routes() {
  return (
    <Router history={History}>
      <Switch>
        <Route path="/" exact component={VideoGallery} />
        <Route path="/video/:id" component={VideoPage} />
        <Route path="/category/:name" component={VideoGallery} />
      </Switch>
    </Router>
  );
}
export default Routes;
