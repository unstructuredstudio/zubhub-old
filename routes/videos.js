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

  app.get(`/api/uploadToken/:id`, async (req, res) => {
    const {id} = req.params;

    // TODO: This is security by obscurity (bad!). Need to replace later on by pinned device certificates/user identity.
    // For production, replace 'ZUB' with unique/hidden env identifier in Zub as well as ZubHub.
    let APP_ID = id.split(":")[0];
    if (APP_ID === 'ZUB') {
      return res.status(200).send({
        'clientId': process.env.VIMEO_CLIENT_ID,
        'clientSecret': process.env.VIMEO_CLIENT_SECRET,
        'accessToken': process.env.VIMEO_ACCESS_TOKEN
      })      
    } else {
      return res.status(401).send('Unauthorized')
    }
  });
  
}