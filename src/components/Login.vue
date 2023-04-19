<!-- 这个是登录的页面 -->
<template>
    <div class="login_container">
        <!-- 登录的表单 -->
        <div class="login_box">
            <div class="avatar_box">
                <!-- 头像 -->
                <img src="../assets/logo.png" alt="图标的样式" />
            </div>
            <!-- 表单位置 -->
            <el-form
                ref="loginFormRef"
                :rules="loginRules"
                :model="loginForm"
                class="login_form"
                label-width="80px"
            >
                <el-form-item label="Username" prop="username">
                    <!-- 直接使用这个框架里面的icon -->
                    <!-- <el-input
                v-model="loginForm.username"
                prefix-icon="el-icon-user-solid"
              ></el-input> -->

                    <el-input
                        v-model="loginForm.username"
                        prefix-icon="iconfont icondenglu"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input
                        v-model="loginForm.password"
                        prefix-icon="iconfont iconmima"
                        type="password"
                    ></el-input>
                </el-form-item>
                <!-- <el-form-item label="验证码" prop="code">
                    <el-input
                        style="
                            width: 230px;
                            margin-right: 10px;
                            vertical-align: top;
                        "
                        v-model="loginForm.code"
                        prefix-icon="el-icon-s-check"
                    >
                    </el-input>
                    <el-image
                        style="width: 100px; height: 40px"
                        :src="img"
                        @click="getImgAndKey"
                    ></el-image>
                </el-form-item> -->
                <el-form-item class="btns">
                    <el-button
                        class="btns-left"
                        type="primary"
                        @click="handleRegister"
                        >Register</el-button
                    >
                    <div class="btns-right">
                        <el-button
                            class="item"
                            type="primary"
                            @click="handleLogin"
                            >Login</el-button
                        >
                        <el-button
                            class="item"
                            type="success"
                            @click="handleReset"
                            >Reset</el-button
                        >
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import Qs from "qs";
import { mapMutations } from "vuex";
import * as type from "../store/mutation-types";
export default {
    data() {
        return {
            //表单数据
            loginForm: {
                username: "",
                password: "",
                code: "",
            },
            key: "",
            img: "",
            //验证对象
            loginRules: {
                username: [
                    {
                        required: true,
                        message: "enter username",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "Please enter a password",
                        trigger: "blur",
                    },
                    {
                        min: 5,
                        max: 11,
                        message: "Between 5 and 11 characters in length",
                        trigger: "blur",
                    },
                ],
                code: [
                    {
                        required: true,
                        message: "请输入验证码名称",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        // this.getImgAndKey();
    },
    methods: {
        ...mapMutations({
            saveCurUser: type.SET_CUR_USER,
            saveLeftMenu: type.SET_LEFT_MENU,
            saveToken: type.SET_TOKEN,
        }),

        handleRegister() {
            this.$router.push("register");
        },

        // async getImgAndKey() {
        //     let { data: res } = await this.$http.get("/sysuser/captcha");
        //     this.key = res.key;
        //     this.img = res.img;
        // },
        async getLeftMenu() {
            let { data: res } = await this.$http.get("/permission/leftMenu");
            this.saveLeftMenu(res.data);
        },
        handleReset() {
            //通过重置表单可以做到这个表单的信息进行重置
            this.$refs.loginFormRef.resetFields();
        },
        handleLogin() {
            //在这个地方可以帮我们验证是否成功，成功了就是成功了，然后就可以编写其他的代码了
            this.$refs.loginFormRef.validate(async (valid) => {
                if (valid) {
                    //如果验证成功
                    //首相在这个地方，返回的是一个对象，而且这个地想里面含有很多数据，
                    //在这个地方主要使用的就是这个解析的语法，在这个地方就可以很好的使用这个语法了，然后就可以很好的之后的访问了
                    let json1 = {
                        username: this.loginForm.username,
                        password: this.loginForm.password,
                        // code: this.loginForm.code,
                        // key: this.key,
                    };
                    let { data: res } = await this.$http.post(
                        "/sysuser/login",
                        Qs.stringify(json1)
                    );

                    //然后在这个地方是进行处理这个登录的，然后就可以很好的进行这个之后的操作。
                    if (res.code == 200) {
                        this.$message.success("Login succeeded!"); //信息提示
                        window.sessionStorage.setItem(
                            "user",
                            JSON.stringify(res.data.user)
                        ); //存储这个user对象，然后就是一个ui来进行这个操作。保存在这个session里面
                        window.sessionStorage.setItem("token", res.data.token); //存储token
                        window.sessionStorage.setItem("exp", res.data.exp); //存储超时时间
                        this.saveCurUser(res.data.user); //使用辅助函数函数进行映射，来进行操作的
                        this.saveToken(res.data.token);
                        // this.$store.commit("saveCurUser", res.data); //这个是没有使用辅助函数来存放这个CurUser的
                        await this.getLeftMenu(); //保存这个左边菜单
                        this.$router.push("home");
                    } else {
                        this.$message.warning(res.msg); //信息的提示
                    }
                } else {
                    //如果失败
                    return;
                }
            });
        },
    },
};
</script>


<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #eee;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.btns {
    position: relative;
    .btns-right{
        display: inline-block;
        position: absolute;
        top:0;
        right:0;
    }
}

.login_form {
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    .code {
        width: 30%;
        height: 100%;
        display: inline-block;
    }
}
</style>
