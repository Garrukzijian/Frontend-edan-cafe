<!--  -->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/updatePassword' }">
                change password
            </el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>Change Password</span>

                <el-form
                    ref="loginFormRef"
                    :rules="loginRules"
                    :model="loginForm"
                    class="login_form"
                    label-width="80px"
                >
                    <el-form-item label="username" prop="username">
                        <el-input
                            :placeholder="username"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="oldpassword" prop="oldpassword">
                        <el-input
                            v-model="loginForm.oldpassword"
                            type="password"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="repassword" prop="repassword">
                        <el-input
                            v-model="loginForm.repassword"
                            type="password"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="newpassword" prop="newpassword">
                        <el-input
                            v-model="loginForm.newpassword"
                            type="password"
                        ></el-input>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button type="primary" @click="handleLogin"
                            >submit</el-button
                        >
                        <el-button type="success" @click="handleReset"
                            >reset</el-button
                        >
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import Qs from "qs";
export default {
    name: "UpdatePassword",
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("enter your passwd"));
            } else {
                if (this.loginForm.oldpassword !== "") {
                    this.$refs.loginFormRef.validateField("repassword");
                }
                callback();
            }
        };

        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("Please enter the password again！"));
            } else if (value !== this.loginForm.oldpassword) {
                callback(new Error("Enter the password twice！"));
            } else {
                callback();
            }
        };

        return {
            username: "",
            loginForm: {
                username: "",
                oldpassword: "",
                repassword: "",
                newpassword: "",
            },
            loginRules: {
                oldpassword: [
                    { validator: validatePass, trigger: "blur" },
                    { required: true, message: "Please enter the original password" },
                ],
                repassword: [
                    { validator: validatePass2, trigger: "blur" },
                    { required: true, message: "Please enter the original password" },
                ],
                newpassword: [
                    {
                        required: true,
                        message: "Please enter the name of the new password",
                        trigger: "blur",
                    },
                    {
                        min: 5,
                        max: 11,
                        message: "The length from 5 to 11 characters",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.username = JSON.parse(
            window.sessionStorage.getItem("user")
        ).sysUser.loginName;
    },
    methods: {
        handleLogin() {
            this.$refs.loginFormRef.validate(async (valid) => {
                if (valid) {
                    //如果验证成功
                    //首相在这个地方，返回的是一个对象，而且这个地想里面含有很多数据，
                    //在这个地方主要使用的就是这个解析的语法，在这个地方就可以很好的使用这个语法了，然后就可以很好的之后的访问了
                    let json1 = {
                        password: this.loginForm.oldpassword,
                        newPassword: this.loginForm.newpassword,
                    };
                    const { data: res } = await this.$http.post(
                        //请求更改密码
                        "sysuser/updatePassword",
                        Qs.stringify(json1)
                    );
                    //然后在这个地方是进行处理这个登录的，然后就可以很好的进行这个之后的操作。
                    if (res.code == 200 ) {
                        this.$message.success("Change the password success!"); //信息提示
                        window.sessionStorage.clear();
                        this.$router.push("login");
                    } else {
                        this.$message.success("fail to modify change failed"); //信息的提示
                    }
                } else {
                    //如果失败
                    return;
                }
            });
        },
        handleReset() {
            this.$refs.loginFormRef.resetFields();
        },
    },
};
</script>

<style lang="less"  scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}

.box-card {
    width: 480px;
}
</style>
