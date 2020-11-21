import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    async getUsers() {
      let url = "http://www.filltext.com/?rows=1000&id=%7Bindex%7D&fullname=%7BfirstName%7D~%7BlastName%7D&company=%7Bbusiness%7D&email=%7Bemail%7D&uname=%7Busername%7D&address=%7BaddressObject%7D"

      try {
        let res = await axios.get(url)
        return res.data

      } catch (er) {
          console.error(er);
      }

    },

    async getComments() {
      let url = "https://jsonplaceholder.typicode.com/comments"

      try {
        let res = await axios.get(url)
        return res.data

      } catch (er) {
          console.error(er);
      }

    }
  },
  modules: {}
});
