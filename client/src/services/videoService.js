import axios from 'axios';

export default {
  getAll: async () => {
    const res = await axios.get(`/api/videos`);
    return res.data || [];
  },

  getVideo: async (id) => {
    const res = await axios.get(`/api/video/` + id);
    return res.data || [];
  },

  postComment: async (id, commmentsData) => {
    const res = await axios.post(`/api/video/` + id, commmentsData);
    return res.data || [];
  },
};
