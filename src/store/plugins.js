import VueXAlong   from 'vuex-along'

const plugins = [
    VueXAlong ({           //这个插件主要是为了设置这个vue的状态不进行更新的操作
        name: 'along',     //存放在localStroage或者sessionStroage 中的名字
        local: false,      //是否存放在local中  false 不存放 如果存放按照下面session的配置配
        //session: { list: [], isFilter: true } //如果值不为false 那么可以传递对象 其中 当isFilter设置为true时， list 数组中的值就会被过滤调,这些值不会存放在seesion或者local中

    }),
]
export default plugins