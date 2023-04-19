import * as types from './mutation-types'
//在这个地方就可以做到这个见名知道意思了

const mutaions = {
    [types.SET_CUR_USER](state,user){
        state.curUser = user
    },
    [types.UPDATE_CURUSER_IMG](state,img){
        state.curUser.img = img
    },
    [types.SET_LEFT_MENU](state,menu){
        state.leftMenu = menu
    },
    [types.SET_TOKEN](state,token){
        state.token = token
    },
}

export default mutaions