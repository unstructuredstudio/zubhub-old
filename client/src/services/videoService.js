import axios from 'axios';

export default {
  getAll: async () => {
    const res = await axios.get(`/api/projects`);
    return res.data || [];
  },

  getCategoryVideos: async (name) => {
    const res = await axios.get(`/api/category/` + name);
    return res.data || [];
  },

  getVideo: async (id) => {
    const res = await axios.get(`/api/project/` + id);
    return res.data || [];
  },

  postComment: async (id, commmentsData) => {
    const res = await axios.post(`/api/project/` + id, commmentsData);
    return res.data || [];
  },

  updateLikesCount: async (id, liked) => {
    const likeObj = {videoId: id, liked: liked};
    const res = await axios.post(`/api/projects`, likeObj);
    return res.data || [];
  },
};
