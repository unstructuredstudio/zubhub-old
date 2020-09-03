const mongoose = require("mongoose");
const Comment = mongoose.model("comments");
const Likes = mongoose.model("likes");

const Vimeo = require("vimeo").Vimeo;
require("dotenv").config();

const vimeoClient = new Vimeo(process.env.VIMEO_CLIENT_ID,
  process.env.VIMEO_CLIENT_SECRET,
  process.env.VIMEO_ACCESS_TOKEN);

module.exports = (app) => {
  if (process.env.NODE_ENV === "production") {
    app.get("/", (req, res) => {
      res.render("index.html");
    });
  } else {
      app.get("/", (req, res) => {
        return res.redirect("/api/projects");
      });
  }


  app.get("/api/project/:id", async(req, res) => {
    let videoId = req.params.id,
      videoObj = "",
      videos = req.session.videos;

    if(!videos) {
      videos = await fetchVideos();
      req.session.videos = videos;
    }

    if(videos) {
      for (v in videos) {
        if(videos[v].uri.substring(8) === videoId) {
          videoObj = videos[v];
          break;
        }
      }
    }

    let commentsObj = await Comment.find({"videoId": videoId});
    videoObj["comments"] = commentsObj;
    let likesObj = await Likes.find({"videoId": videoId});

    return res.status(200).send({video: videoObj, likes: likesObj});
  });

  app.post("/api/project/:id", async(req, res) => {
    let videoId = req.params.id,
      postedby = req.body.postedby,
      description = req.body.description;

    let results = await Comment.find({"videoId": videoId});
    let prevComments = results && results[0] && results[0].comments 
      ? results[0].comments : [];
    let newComments = [...prevComments];

    newComments.push({
      postedby: postedby,
      description: description,
      postedago: new Date()
    });

    let newCommentsData = {
      videoId: videoId,
      comments: newComments
    };

    if(prevComments.length == 0) {
      await Comment.create(newCommentsData);
    } else {
      await Comment.updateOne(newCommentsData);
    }

    res.status(200).send(newCommentsData);
  });

  app.get("/api/category/:name", async(req, res) => {
    let categoryName = req.params.name.toLowerCase(),
      tempVideos = [],
      tempIds = [],
      videos = req.session.videos;

    if(!videos) {
      videos = await fetchVideos();
      req.session.videos = videos;
    }

    if(videos) {
      videos.forEach(video => {
        if (video && video.tags) {
          video.tags.forEach(tags => {
            if (tags.tag) {
              let tagName = tags.tag.toLowerCase();
              if(tagName.includes(categoryName)) {
                tempVideos.push(video);
                tempIds.push(video.uri.substring(8));
              }
            }
          });
        }
      });
    }

    let likes = await Likes.find().where("videoId").in(tempIds).exec();
    if (videos) {
      return res.status(200).send({videos: tempVideos, likes: likes});
    } else {
      return res.status(401).send("Something is weird");
    }
  });

  app.get("/api/projects", async(req, res) => {
    let likes = await Likes.find();
    let videos = req.session.videos;

    if(!videos) {
      videos = await fetchVideos();
      req.session.videos = videos;
    }

    if(videos) {
      return res.status(200).send({videos: videos, likes: likes});
    } else {
      return res.status(401).send("Something is weird");
    }
  });

  app.post("/api/projects", async(req, res) => {
    let videoID = req.body.videoId;
    let count = req.body.liked ? 1 : -1;

    //await Likes.deleteMany();
    await Likes.findOneAndUpdate(
      { "videoId": videoID },
      { $inc: { "likes": count } },
      { upsert: true }
    );

    let results = await Likes.find({"videoId": videoID});
    res.status(200).send(results);
  });
};

async function fetchVideos() {
  //Use the code below for testing
  // let videos = [
  //   {"uri":"/videos/114920912","name":"Making Serendipity Stick.","description":"Video of Crit Day Presentation for my Masters thesis in Media Arts and Sciences at MIT Media Lab. Topic of my thesis is \"Making Serendipity Stick\" and for which I will be exploring how we can help people translate short-live, online interactions into meaningful relationships?","type":"video","link":"https://vimeo.com/114920912","duration":589,"width":1280,"language":"none","height":720,"embed":{"buttons":{"like":true,"watchlater":true,"share":true,"embed":true,"hd":false,"fullscreen":true,"scaling":true},"logos":{"vimeo":true,"custom":{"active":false,"link":null,"sticky":false}},"title":{"name":"user","owner":"user","portrait":"user"},"playbar":true,"volume":true,"speed":false,"color":"00adef","uri":null,"html":"<iframe src=\"https://player.vimeo.com/video/114920912?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=166727\" width=\"1280\" height=\"720\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen title=\"Making Serendipity Stick.\"></iframe>","badges":{"hdr":false,"live":{"streaming":false,"archived":false},"staff_pick":{"normal":false,"best_of_the_month":false,"best_of_the_year":false,"premiere":false},"vod":false,"weekend_challenge":false}},"created_time":"2014-12-18T21:48:24+00:00","modified_time":"2020-03-08T04:27:22+00:00","release_time":"2014-12-18T21:48:24+00:00","content_rating":["unrated"],"license":null,"privacy":{"view":"anybody","embed":"public","download":true,"add":true,"comments":"anybody"},"pictures":{"uri":"/videos/114920912/pictures/500771565","active":true,"type":"custom","sizes":[{"width":100,"height":75,"link":"https://i.vimeocdn.com/video/500771565_100x75.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_100x75.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":200,"height":150,"link":"https://i.vimeocdn.com/video/500771565_200x150.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_200x150.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":295,"height":166,"link":"https://i.vimeocdn.com/video/500771565_295x166.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_295x166.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":640,"height":360,"link":"https://i.vimeocdn.com/video/500771565_640x360.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_640x360.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1280,"height":720,"link":"https://i.vimeocdn.com/video/500771565_1280x720.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1280x720.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1920,"height":1080,"link":"https://i.vimeocdn.com/video/500771565_1920x1080.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1920x1080.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":640,"height":360,"link":"https://i.vimeocdn.com/video/500771565_640x360.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_640x360.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":960,"height":540,"link":"https://i.vimeocdn.com/video/500771565_960x540.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_960x540.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1280,"height":720,"link":"https://i.vimeocdn.com/video/500771565_1280x720.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1280x720.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1920,"height":1080,"link":"https://i.vimeocdn.com/video/500771565_1920x1080.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1920x1080.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1280,"height":720,"link":"https://i.vimeocdn.com/video/500771565_1280x720.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1280x720.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"}],"resource_key":"148f2769422579cc2232f3cc80deb056f4776319"},"tags":[{"uri":"/tags/mitmedialab","name":"MIT Media Lab","tag":"GCompris","canonical":"mitmedialab","metadata":{"connections":{"videos":{"uri":"/tags/mitmedialab/videos","options":["GET"],"total":311}}},"resource_key":"4a0c964907f64d3983647c4f8d042232da410993"},{"uri":"/tags/unhangout","name":"Unhangout","tag":"Unhangout","canonical":"unhangout","metadata":{"connections":{"videos":{"uri":"/tags/unhangout/videos","options":["GET"],"total":2}}},"resource_key":"938978655d68a2b465e13e7eebde26d0fd2736aa"}],"stats":{"plays":12},"categories":[],"metadata":{"connections":{"comments":{"uri":"/videos/114920912/comments","options":["GET","POST"],"total":0},"credits":{"uri":"/videos/114920912/credits","options":["GET","POST"],"total":1},"likes":{"uri":"/videos/114920912/likes","options":["GET"],"total":1},"pictures":{"uri":"/videos/114920912/pictures","options":["GET","POST"],"total":1},"texttracks":{"uri":"/videos/114920912/texttracks","options":["GET","POST"],"total":0},"related":{"uri":"/me/videos?offset=1","options":["GET"]},"recommendations":{"uri":"/videos/114920912/recommendations","options":["GET"]},"albums":{"uri":"/videos/114920912/albums","options":["GET","PATCH"],"total":0},"available_albums":{"uri":"/videos/114920912/available_albums","options":["GET"],"total":0},"available_channels":{"uri":"/videos/114920912/available_channels","options":["GET"],"total":0}},"interactions":{"watchlater":{"uri":"/users/8162536/watchlater/114920912","options":["GET","PUT","DELETE"],"added":false,"added_time":null},"report":{"uri":"/videos/114920912/report","options":["POST"],"reason":["pornographic","harassment","advertisement","ripoff","incorrect rating","spam","causes harm"]}}},"user":{"uri":"/users/8162536","name":"SrishAkaTux","link":"https://vimeo.com/srishakatux","location":"","bio":"Open Source Enthusiast, MOOC Lover, Peer 2 Peer Learner, Interested in Open Education Space & Technology for Kids","short_bio":null,"created_time":"2011-08-17T17:39:08+00:00","pictures":{"uri":"/users/8162536/pictures/5748843","active":true,"type":"custom","sizes":[{"width":30,"height":30,"link":"https://i.vimeocdn.com/portrait/5748843_30x30"},{"width":75,"height":75,"link":"https://i.vimeocdn.com/portrait/5748843_75x75"},{"width":100,"height":100,"link":"https://i.vimeocdn.com/portrait/5748843_100x100"},{"width":300,"height":300,"link":"https://i.vimeocdn.com/portrait/5748843_300x300"},{"width":72,"height":72,"link":"https://i.vimeocdn.com/portrait/5748843_72x72"},{"width":144,"height":144,"link":"https://i.vimeocdn.com/portrait/5748843_144x144"},{"width":216,"height":216,"link":"https://i.vimeocdn.com/portrait/5748843_216x216"},{"width":288,"height":288,"link":"https://i.vimeocdn.com/portrait/5748843_288x288"},{"width":360,"height":360,"link":"https://i.vimeocdn.com/portrait/5748843_360x360"}],"resource_key":"edcfeda5799c6fe69ea3d608a94aba4035e2416d"},"websites":[{"name":"Portfolio","link":"http://srishtisethi.com","description":null}],"metadata":{"connections":{"albums":{"uri":"/users/8162536/albums","options":["GET"],"total":0},"appearances":{"uri":"/users/8162536/appearances","options":["GET"],"total":0},"categories":{"uri":"/users/8162536/categories","options":["GET"],"total":0},"channels":{"uri":"/users/8162536/channels","options":["GET"],"total":0},"feed":{"uri":"/users/8162536/feed","options":["GET"]},"followers":{"uri":"/users/8162536/followers","options":["GET"],"total":4},"following":{"uri":"/users/8162536/following","options":["GET"],"total":1},"groups":{"uri":"/users/8162536/groups","options":["GET"],"total":0},"likes":{"uri":"/users/8162536/likes","options":["GET"],"total":1},"membership":{"uri":"/users/8162536/membership/","options":["PATCH"]},"moderated_channels":{"uri":"/users/8162536/channels?filter=moderated","options":["GET"],"total":0},"portfolios":{"uri":"/users/8162536/portfolios","options":["GET"],"total":0},"videos":{"uri":"/users/8162536/videos","options":["GET"],"total":18},"watchlater":{"uri":"/users/8162536/watchlater","options":["GET"],"total":3},"shared":{"uri":"/users/8162536/shared/videos","options":["GET"],"total":0},"pictures":{"uri":"/users/8162536/pictures","options":["GET","POST"],"total":4},"watched_videos":{"uri":"/me/watched/videos","options":["GET"],"total":0},"folders":{"uri":"/me/folders","options":["GET","POST"],"total":0},"block":{"uri":"/me/block","options":["GET"],"total":0}}},"preferences":{"videos":{"privacy":{"view":"anybody","comments":"anybody","embed":"public","download":true,"add":true}}},"content_filter":["language","drugs","violence","nudity","safe","unrated"],"resource_key":"aaba5ecdb1beb5f5c4404ef6682f6fa6670b8305","account":"basic"},"review_page":{"active":true,"link":"https://vimeo.com/srishakatux/review/114920912/b7890edb91"},"parent_folder":null,"last_user_action_event_date":"2014-12-18T21:48:24+00:00","app":null,"status":"available","resource_key":"33b19d114a43ce1378125089597d81a70ca328d9","upload":{"status":"complete","link":null,"upload_link":null,"complete_uri":null,"form":null,"approach":null,"size":null,"redirect_url":null},"transcode":{"status":"complete"}}
  //   ,{"uri":"/videos/108658131","name":"Media Lab Virtual Visit.","description":"Video of Crit Day Presentation for my Masters thesis in Media Arts and Sciences at MIT Media Lab. Topic of my thesis is \"Making Serendipity Stick\" and for which I will be exploring how we can help people translate short-live, online interactions into meaningful relationships?","type":"video","link":"https://vimeo.com/114920912","duration":589,"width":1280,"language":"none","height":720,"embed":{"buttons":{"like":true,"watchlater":true,"share":true,"embed":true,"hd":false,"fullscreen":true,"scaling":true},"logos":{"vimeo":true,"custom":{"active":false,"link":null,"sticky":false}},"title":{"name":"user","owner":"user","portrait":"user"},"playbar":true,"volume":true,"speed":false,"color":"00adef","uri":null,"html":"<iframe src=\"https://player.vimeo.com/video/114920912?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=166727\" width=\"1280\" height=\"720\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen title=\"Making Serendipity Stick.\"></iframe>","badges":{"hdr":false,"live":{"streaming":false,"archived":false},"staff_pick":{"normal":false,"best_of_the_month":false,"best_of_the_year":false,"premiere":false},"vod":false,"weekend_challenge":false}},"created_time":"2014-12-18T21:48:24+00:00","modified_time":"2020-03-08T04:27:22+00:00","release_time":"2014-12-18T21:48:24+00:00","content_rating":["unrated"],"license":null,"privacy":{"view":"anybody","embed":"public","download":true,"add":true,"comments":"anybody"},"pictures":{"uri":"/videos/114920912/pictures/500771565","active":true,"type":"custom","sizes":[{"width":100,"height":75,"link":"https://i.vimeocdn.com/video/500771565_100x75.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_100x75.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":200,"height":150,"link":"https://i.vimeocdn.com/video/500771565_200x150.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_200x150.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":295,"height":166,"link":"https://i.vimeocdn.com/video/500771565_295x166.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_295x166.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":640,"height":360,"link":"https://i.vimeocdn.com/video/500771565_640x360.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_640x360.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1280,"height":720,"link":"https://i.vimeocdn.com/video/500771565_1280x720.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1280x720.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1920,"height":1080,"link":"https://i.vimeocdn.com/video/500771565_1920x1080.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1920x1080.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":640,"height":360,"link":"https://i.vimeocdn.com/video/500771565_640x360.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_640x360.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":960,"height":540,"link":"https://i.vimeocdn.com/video/500771565_960x540.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_960x540.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1280,"height":720,"link":"https://i.vimeocdn.com/video/500771565_1280x720.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1280x720.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1920,"height":1080,"link":"https://i.vimeocdn.com/video/500771565_1920x1080.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1920x1080.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1280,"height":720,"link":"https://i.vimeocdn.com/video/500771565_1280x720.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1280x720.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"}],"resource_key":"148f2769422579cc2232f3cc80deb056f4776319"},"tags":[{"uri":"/tags/mitmedialab","name":"MIT Media Lab","tag":"gsoc","canonical":"mitmedialab","metadata":{"connections":{"videos":{"uri":"/tags/mitmedialab/videos","options":["GET"],"total":311}}},"resource_key":"4a0c964907f64d3983647c4f8d042232da410993"},{"uri":"/tags/unhangout","name":"Unhangout","tag":"Unhangout","canonical":"unhangout","metadata":{"connections":{"videos":{"uri":"/tags/unhangout/videos","options":["GET"],"total":2}}},"resource_key":"938978655d68a2b465e13e7eebde26d0fd2736aa"}],"stats":{"plays":12},"categories":[],"metadata":{"connections":{"comments":{"uri":"/videos/114920912/comments","options":["GET","POST"],"total":0},"credits":{"uri":"/videos/114920912/credits","options":["GET","POST"],"total":1},"likes":{"uri":"/videos/114920912/likes","options":["GET"],"total":1},"pictures":{"uri":"/videos/114920912/pictures","options":["GET","POST"],"total":1},"texttracks":{"uri":"/videos/114920912/texttracks","options":["GET","POST"],"total":0},"related":{"uri":"/me/videos?offset=1","options":["GET"]},"recommendations":{"uri":"/videos/114920912/recommendations","options":["GET"]},"albums":{"uri":"/videos/114920912/albums","options":["GET","PATCH"],"total":0},"available_albums":{"uri":"/videos/114920912/available_albums","options":["GET"],"total":0},"available_channels":{"uri":"/videos/114920912/available_channels","options":["GET"],"total":0}},"interactions":{"watchlater":{"uri":"/users/8162536/watchlater/114920912","options":["GET","PUT","DELETE"],"added":false,"added_time":null},"report":{"uri":"/videos/114920912/report","options":["POST"],"reason":["pornographic","harassment","advertisement","ripoff","incorrect rating","spam","causes harm"]}}},"user":{"uri":"/users/8162536","name":"SrishAkaTux","link":"https://vimeo.com/srishakatux","location":"","bio":"Open Source Enthusiast, MOOC Lover, Peer 2 Peer Learner, Interested in Open Education Space & Technology for Kids","short_bio":null,"created_time":"2011-08-17T17:39:08+00:00","pictures":{"uri":"/users/8162536/pictures/5748843","active":true,"type":"custom","sizes":[{"width":30,"height":30,"link":"https://i.vimeocdn.com/portrait/5748843_30x30"},{"width":75,"height":75,"link":"https://i.vimeocdn.com/portrait/5748843_75x75"},{"width":100,"height":100,"link":"https://i.vimeocdn.com/portrait/5748843_100x100"},{"width":300,"height":300,"link":"https://i.vimeocdn.com/portrait/5748843_300x300"},{"width":72,"height":72,"link":"https://i.vimeocdn.com/portrait/5748843_72x72"},{"width":144,"height":144,"link":"https://i.vimeocdn.com/portrait/5748843_144x144"},{"width":216,"height":216,"link":"https://i.vimeocdn.com/portrait/5748843_216x216"},{"width":288,"height":288,"link":"https://i.vimeocdn.com/portrait/5748843_288x288"},{"width":360,"height":360,"link":"https://i.vimeocdn.com/portrait/5748843_360x360"}],"resource_key":"edcfeda5799c6fe69ea3d608a94aba4035e2416d"},"websites":[{"name":"Portfolio","link":"http://srishtisethi.com","description":null}],"metadata":{"connections":{"albums":{"uri":"/users/8162536/albums","options":["GET"],"total":0},"appearances":{"uri":"/users/8162536/appearances","options":["GET"],"total":0},"categories":{"uri":"/users/8162536/categories","options":["GET"],"total":0},"channels":{"uri":"/users/8162536/channels","options":["GET"],"total":0},"feed":{"uri":"/users/8162536/feed","options":["GET"]},"followers":{"uri":"/users/8162536/followers","options":["GET"],"total":4},"following":{"uri":"/users/8162536/following","options":["GET"],"total":1},"groups":{"uri":"/users/8162536/groups","options":["GET"],"total":0},"likes":{"uri":"/users/8162536/likes","options":["GET"],"total":1},"membership":{"uri":"/users/8162536/membership/","options":["PATCH"]},"moderated_channels":{"uri":"/users/8162536/channels?filter=moderated","options":["GET"],"total":0},"portfolios":{"uri":"/users/8162536/portfolios","options":["GET"],"total":0},"videos":{"uri":"/users/8162536/videos","options":["GET"],"total":18},"watchlater":{"uri":"/users/8162536/watchlater","options":["GET"],"total":3},"shared":{"uri":"/users/8162536/shared/videos","options":["GET"],"total":0},"pictures":{"uri":"/users/8162536/pictures","options":["GET","POST"],"total":4},"watched_videos":{"uri":"/me/watched/videos","options":["GET"],"total":0},"folders":{"uri":"/me/folders","options":["GET","POST"],"total":0},"block":{"uri":"/me/block","options":["GET"],"total":0}}},"preferences":{"videos":{"privacy":{"view":"anybody","comments":"anybody","embed":"public","download":true,"add":true}}},"content_filter":["language","drugs","violence","nudity","safe","unrated"],"resource_key":"aaba5ecdb1beb5f5c4404ef6682f6fa6670b8305","account":"basic"},"review_page":{"active":true,"link":"https://vimeo.com/srishakatux/review/114920912/b7890edb91"},"parent_folder":null,"last_user_action_event_date":"2014-12-18T21:48:24+00:00","app":null,"status":"available","resource_key":"33b19d114a43ce1378125089597d81a70ca328d9","upload":{"status":"complete","link":null,"upload_link":null,"complete_uri":null,"form":null,"approach":null,"size":null,"redirect_url":null},"transcode":{"status":"complete"}}
  //   ,{"uri":"/videos/99500164","name":"Conversation with Geeta Devi.","description":"Video of Crit Day Presentation for my Masters thesis in Media Arts and Sciences at MIT Media Lab. Topic of my thesis is \"Making Serendipity Stick\" and for which I will be exploring how we can help people translate short-live, online interactions into meaningful relationships?","type":"video","link":"https://vimeo.com/114920912","duration":589,"width":1280,"language":"none","height":720,"embed":{"buttons":{"like":true,"watchlater":true,"share":true,"embed":true,"hd":false,"fullscreen":true,"scaling":true},"logos":{"vimeo":true,"custom":{"active":false,"link":null,"sticky":false}},"title":{"name":"user","owner":"user","portrait":"user"},"playbar":true,"volume":true,"speed":false,"color":"00adef","uri":null,"html":"<iframe src=\"https://player.vimeo.com/video/114920912?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=166727\" width=\"1280\" height=\"720\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen title=\"Making Serendipity Stick.\"></iframe>","badges":{"hdr":false,"live":{"streaming":false,"archived":false},"staff_pick":{"normal":false,"best_of_the_month":false,"best_of_the_year":false,"premiere":false},"vod":false,"weekend_challenge":false}},"created_time":"2014-12-18T21:48:24+00:00","modified_time":"2020-03-08T04:27:22+00:00","release_time":"2014-12-18T21:48:24+00:00","content_rating":["unrated"],"license":null,"privacy":{"view":"anybody","embed":"public","download":true,"add":true,"comments":"anybody"},"pictures":{"uri":"/videos/114920912/pictures/500771565","active":true,"type":"custom","sizes":[{"width":100,"height":75,"link":"https://i.vimeocdn.com/video/500771565_100x75.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_100x75.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":200,"height":150,"link":"https://i.vimeocdn.com/video/500771565_200x150.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_200x150.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":295,"height":166,"link":"https://i.vimeocdn.com/video/500771565_295x166.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_295x166.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":640,"height":360,"link":"https://i.vimeocdn.com/video/500771565_640x360.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_640x360.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1280,"height":720,"link":"https://i.vimeocdn.com/video/500771565_1280x720.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1280x720.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1920,"height":1080,"link":"https://i.vimeocdn.com/video/500771565_1920x1080.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1920x1080.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":640,"height":360,"link":"https://i.vimeocdn.com/video/500771565_640x360.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_640x360.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":960,"height":540,"link":"https://i.vimeocdn.com/video/500771565_960x540.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_960x540.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1280,"height":720,"link":"https://i.vimeocdn.com/video/500771565_1280x720.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1280x720.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1920,"height":1080,"link":"https://i.vimeocdn.com/video/500771565_1920x1080.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1920x1080.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"},{"width":1280,"height":720,"link":"https://i.vimeocdn.com/video/500771565_1280x720.jpg?r=pad","link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F500771565_1280x720.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"}],"resource_key":"148f2769422579cc2232f3cc80deb056f4776319"},"tags":[{"uri":"/tags/mitmedialab","name":"MIT Media Lab","tag":"medialab","canonical":"mitmedialab","metadata":{"connections":{"videos":{"uri":"/tags/mitmedialab/videos","options":["GET"],"total":311}}},"resource_key":"4a0c964907f64d3983647c4f8d042232da410993"},{"uri":"/tags/unhangout","name":"Unhangout","tag":"Unhangout","canonical":"unhangout","metadata":{"connections":{"videos":{"uri":"/tags/unhangout/videos","options":["GET"],"total":2}}},"resource_key":"938978655d68a2b465e13e7eebde26d0fd2736aa"}],"stats":{"plays":12},"categories":[],"metadata":{"connections":{"comments":{"uri":"/videos/114920912/comments","options":["GET","POST"],"total":0},"credits":{"uri":"/videos/114920912/credits","options":["GET","POST"],"total":1},"likes":{"uri":"/videos/114920912/likes","options":["GET"],"total":1},"pictures":{"uri":"/videos/114920912/pictures","options":["GET","POST"],"total":1},"texttracks":{"uri":"/videos/114920912/texttracks","options":["GET","POST"],"total":0},"related":{"uri":"/me/videos?offset=1","options":["GET"]},"recommendations":{"uri":"/videos/114920912/recommendations","options":["GET"]},"albums":{"uri":"/videos/114920912/albums","options":["GET","PATCH"],"total":0},"available_albums":{"uri":"/videos/114920912/available_albums","options":["GET"],"total":0},"available_channels":{"uri":"/videos/114920912/available_channels","options":["GET"],"total":0}},"interactions":{"watchlater":{"uri":"/users/8162536/watchlater/114920912","options":["GET","PUT","DELETE"],"added":false,"added_time":null},"report":{"uri":"/videos/114920912/report","options":["POST"],"reason":["pornographic","harassment","advertisement","ripoff","incorrect rating","spam","causes harm"]}}},"user":{"uri":"/users/8162536","name":"SrishAkaTux","link":"https://vimeo.com/srishakatux","location":"","bio":"Open Source Enthusiast, MOOC Lover, Peer 2 Peer Learner, Interested in Open Education Space & Technology for Kids","short_bio":null,"created_time":"2011-08-17T17:39:08+00:00","pictures":{"uri":"/users/8162536/pictures/5748843","active":true,"type":"custom","sizes":[{"width":30,"height":30,"link":"https://i.vimeocdn.com/portrait/5748843_30x30"},{"width":75,"height":75,"link":"https://i.vimeocdn.com/portrait/5748843_75x75"},{"width":100,"height":100,"link":"https://i.vimeocdn.com/portrait/5748843_100x100"},{"width":300,"height":300,"link":"https://i.vimeocdn.com/portrait/5748843_300x300"},{"width":72,"height":72,"link":"https://i.vimeocdn.com/portrait/5748843_72x72"},{"width":144,"height":144,"link":"https://i.vimeocdn.com/portrait/5748843_144x144"},{"width":216,"height":216,"link":"https://i.vimeocdn.com/portrait/5748843_216x216"},{"width":288,"height":288,"link":"https://i.vimeocdn.com/portrait/5748843_288x288"},{"width":360,"height":360,"link":"https://i.vimeocdn.com/portrait/5748843_360x360"}],"resource_key":"edcfeda5799c6fe69ea3d608a94aba4035e2416d"},"websites":[{"name":"Portfolio","link":"http://srishtisethi.com","description":null}],"metadata":{"connections":{"albums":{"uri":"/users/8162536/albums","options":["GET"],"total":0},"appearances":{"uri":"/users/8162536/appearances","options":["GET"],"total":0},"categories":{"uri":"/users/8162536/categories","options":["GET"],"total":0},"channels":{"uri":"/users/8162536/channels","options":["GET"],"total":0},"feed":{"uri":"/users/8162536/feed","options":["GET"]},"followers":{"uri":"/users/8162536/followers","options":["GET"],"total":4},"following":{"uri":"/users/8162536/following","options":["GET"],"total":1},"groups":{"uri":"/users/8162536/groups","options":["GET"],"total":0},"likes":{"uri":"/users/8162536/likes","options":["GET"],"total":1},"membership":{"uri":"/users/8162536/membership/","options":["PATCH"]},"moderated_channels":{"uri":"/users/8162536/channels?filter=moderated","options":["GET"],"total":0},"portfolios":{"uri":"/users/8162536/portfolios","options":["GET"],"total":0},"videos":{"uri":"/users/8162536/videos","options":["GET"],"total":18},"watchlater":{"uri":"/users/8162536/watchlater","options":["GET"],"total":3},"shared":{"uri":"/users/8162536/shared/videos","options":["GET"],"total":0},"pictures":{"uri":"/users/8162536/pictures","options":["GET","POST"],"total":4},"watched_videos":{"uri":"/me/watched/videos","options":["GET"],"total":0},"folders":{"uri":"/me/folders","options":["GET","POST"],"total":0},"block":{"uri":"/me/block","options":["GET"],"total":0}}},"preferences":{"videos":{"privacy":{"view":"anybody","comments":"anybody","embed":"public","download":true,"add":true}}},"content_filter":["language","drugs","violence","nudity","safe","unrated"],"resource_key":"aaba5ecdb1beb5f5c4404ef6682f6fa6670b8305","account":"basic"},"review_page":{"active":true,"link":"https://vimeo.com/srishakatux/review/114920912/b7890edb91"},"parent_folder":null,"last_user_action_event_date":"2014-12-18T21:48:24+00:00","app":null,"status":"available","resource_key":"33b19d114a43ce1378125089597d81a70ca328d9","upload":{"status":"complete","link":null,"upload_link":null,"complete_uri":null,"form":null,"approach":null,"size":null,"redirect_url":null},"transcode":{"status":"complete"}}  
  // ];

  // return videos;

  // Comment the code above and uncomment the one below to pull results from the Vimeo API
  const videos = await new Promise((resolve, reject) => {
  	vimeoClient.request({
  		method: "GET",
  		path: "/me/videos"
  	}, 
  	function (error, body) {
  		if(error) {
  			reject(error);
  			console.log(error);
  			return;
  		}
  		resolve(body["data"]);
  	});
  });
  return videos;
}
