import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import plugins from './plugins'


// 安装插件
Vue.use(Vuex)

//创建对象
const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters ,
    // getters:{           //这个主要是为了进行更改的操作这个getter的操作的，然后进行之后的操作操作操作判断
    //     getUserName(state){             //直接是使用这个state参数来进行之后的操作
    //         return state.curUser.realname;
    //     },
    //     getUserName(state,getters){     //直接使用state和getters
    //         return state.curUser.realname + "*" + getters.getUserName;          //这个就是一个结果可以进行返回了
    //     },
    //     getUserName(state){             //使用带有参数的这个函数
    //         return (name)=>{        
    //             return state.curUser.realname + name;
    //         }
    //     },

    // },
    plugins

})

//导出对象
export default store;

