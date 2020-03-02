// const mongoose = require('mongoose');
// const Product = mongoose.model('products');
const Vimeo = require('vimeo').Vimeo;
require('dotenv').config();

const vimeoClient = new Vimeo(process.env.VIMEO_CLIENT_ID,
  process.env.VIMEO_CLIENT_SECRET, 
  process.env.VIMEO_ACCESS_TOKEN);

module.exports = (app) => {
  app.get(`/`, (req, res) => {
    return res.redirect('/api/videos');
  });

  app.get(`/api/videos`, async(req, res) => {
    await vimeoClient.request({
        method: 'GET',
        path: '/me/videos'
      }, function (error, body) {
        if (error) {
          return res.status(500).send('Something broke!')
        }
        return res.status(200).send(body['data']);
    })
  });
}