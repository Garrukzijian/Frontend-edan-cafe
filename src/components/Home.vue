<!-- 主页的页面 -->
<template>
    <!-- 引入这个containner布局 -->
    <el-container class="home_container">
        <!-- 头部 -->
        <el-header class="el-header">
            <div>
                <span>Mall</span>
            </div>
            <div>
                <img
                    style="margin-right: 10px"
                    :src="getUserImg"
                    alt="show a logo"
                />
                <el-dropdown
                    @command="handleCommand"
                    split-button
                    type="primary"
                >
                    {{ getUserName }}
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="d"
                            >Home</el-dropdown-item
                        >
                        <el-dropdown-item command="a"
                            >Profile</el-dropdown-item
                        >
                        <el-dropdown-item command="b"
                            >Update Password</el-dropdown-item
                        >
                        <el-dropdown-item command="c">Quit</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <!-- 中间和这个侧边栏 -->
        <el-container>
            <el-aside :width="collapse ? '64px' : '300px'" class="el-aside">
                <div class="toggle-button" @click="toggleNav">|||</div>
                <!-- 在这个地方动态绑定的时候,才可以使用这个js里面的数据的类型 -->
                <el-menu
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#409eff"
                    :collapse="collapse"
                    :collapse-transition="true"
                    unique-opened
                    :router="true"
                    :default-active="activePath"
                >
                    <el-submenu
                        v-for="(item, index) in getLeftMenu"
                        :index="(index + 1) + ''"
                        :key="index + 1"
                        v-show="getCurUser.permissions.indexOf(item.tag) >= 0"
                    >
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <el-menu-item
                            v-for="(item1, index1) in item.children"
                            :index="item1.href"
                            :key="index + 1 + '-' + (index1 + 1)"
                            @click="saveActivePath(item1.href)"
                            v-show="
                                getCurUser.permissions.indexOf(item.tag) >= 0
                            "
                        >
                            <template slot="title">
                                <i :class="item1.icon"></i>
                                <span>{{ item1.title }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                    <!-- 这个id的绑定主要就是为了设置这个点击的时候,这个颜色的不变化,然后在这个设置的一个东西 -->
                </el-menu>
            </el-aside>
            <el-main class="el-main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
    <!-- <div>
      <el-button type="info"  @click="logout">安全退出</el-button>
  </div> -->
</template>

<script>
import { mapGetters } from "vuex"; //这里我们使用辅助函数来获取getters里的值
export default {
    name: "Home",
    data() {
        return {
            //菜单列表
            // menuList: [],
            collapse: false,
            activePath: "/home", //这个就是默认的一个操作，然后执行相应的函数就行了
        };
    },
    created() {
        this.activePath = window.sessionStorage.getItem("activePath"); //得到之前以一个访问的一个路径 
    },
    computed: {
        ...mapGetters([
            //把 `this.getEditProduct` 映射为 `this.$store.getters.getEditProduct`
            "getCurUser",
            "getUserImg",
            "getUserName",
            "getLeftMenu",
        ]),
    },
    // 因为在这个地方我们是一进来就需要访问的一个方法,那么就需要放到这个create方法里面,就是类似于这个onload事件,那么就是需查询这个meanulist
    methods: {
        async logout() {
            let { data: res } = await this.$http.get("/sysuser/logout");
            if (res.code == 200) {
                window.sessionStorage.clear(); //清楚这个用户的信息，然后就可以完全安装这个流程。
                this.$message.info("log out"); //信息的提示
                this.$router.push("login"); //这个就是转到这个登录的页面
            } else {
                this.$message.error("log out failed"); //提示信息
            }
        },

        handleCommand(command) {
            switch (command) {
                case "c":
                    this.logout();
                    break;
                case "b":
                    this.$router.push("updatePassword"); //首页跳转到修改密码这个地方来进行之后的操作
                    break;
                case "a":
                    this.$router.push("uploadUserInfo"); //首页跳转到这个welcom组件上面
                    break;
                case "d":
                    this.$router.push("home"); //首页跳转到这个welcom组件上面
                    break;
                default:
                    break;
            }
        },

        toggleNav() {
            this.collapse = !this.collapse; //控制伸缩
        },
        saveActivePath(path) {
            //保存这个访问的路径
            this.activePath = path;
            window.sessionStorage.setItem("activePath", path); //放到这个session里面,
        },
    },
};
</script>

<style lang="less"  scoped>
.home_container {
    height: 100%;
    // overflow: hidden;
}

/* 头部的样式 */
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0%;
    align-items: center;
    color: #ffffff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}

/* 侧边栏的样式 */
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}

/* 主题的样式 */
.el-main {
    background-color: #eaedf1;
    height: 100%;
}
img {
    width: 55px;
    height: 55px;
}
/* 伸缩按钮 */

.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
