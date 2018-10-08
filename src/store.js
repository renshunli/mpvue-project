// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userInfo: null
    },
    mutations: {
        setUserInfo(state,userInfo){
            console.log(userInfo);
            state.userInfo = userInfo;
        }
    }
});

export default store;
