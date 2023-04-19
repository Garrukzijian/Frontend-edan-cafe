<!-- 这个是登录的页面 -->
<template>
    <div class="register_container">
        <!-- 登录的表单 -->
        <div class="register_box">
            <h1>Register</h1>
            <!-- 表单位置 -->
            <el-form
                ref="registerFormRef"
                :rules="registerRules"
                :model="registerForm"
                class="register_form"
                label-width="80px"
            >
                <el-form-item label="Username" prop="custName">
                    <el-input
                        v-model="registerForm.custName"
                        :rows="8"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="custPasswd">
                    <el-input
                        v-model="registerForm.custPasswd"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Surname" prop="custSurname">
                    <el-input v-model="registerForm.custSurname"></el-input>
                </el-form-item>
                <el-form-item label="Phone" prop="custPhone">
                    <el-input v-model="registerForm.custPhone"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="custEmail">
                    <el-input v-model="registerForm.custEmail"></el-input>
                </el-form-item>
                <el-form-item label="Country" prop="custCountry">
                    <el-input v-model="registerForm.custCountry"></el-input>
                </el-form-item>
                <el-form-item label="City" prop="custCity">
                    <el-input v-model="registerForm.custCity"></el-input>
                </el-form-item>
                <el-form-item label="District" prop="custDistirct">
                    <el-input v-model="registerForm.custDistirct"></el-input>
                </el-form-item>
                <el-form-item label="Address" prop="custAddress">
                    <el-input v-model="registerForm.custAddress"></el-input>
                </el-form-item>
                <el-form-item label="Zipcode" prop="custZipcode">
                    <el-input v-model="registerForm.custZipcode"></el-input>
                </el-form-item>

                <el-form-item class="btns">
                    <el-button type="primary" @click="handleRegister"
                        >Login</el-button
                    >
                    <div class="btns-right">
                        <el-button type="primary" @click="handleregister"
                            >Sumbit</el-button
                        >
                        <el-button type="success" @click="handleReset"
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
            registerForm: {
                custName: "",
                custPasswd: "",
                custSurname: "",
                custPhone: "",
                custEmail: "",
                custCountry: "",
                custCity: "",
                custDistirct: "",
                custAddress: "",
                custZipcode: "",
            },
            //验证对象
            registerRules: {
                custName: [
                    {
                        required: true,
                        message: "Enter Name",
                        trigger: "blur",
                    },
                ],
                custPasswd: [
                    {
                        required: true,
                        message: "Enter Password",
                        trigger: "blur",
                    },
                ],
                custSurname: [
                    {
                        required: true,
                        message: "Enter Surname",
                        trigger: "blur",
                    },
                ],
                custPhone: [
                    {
                        required: true,
                        message: "Enter Phone Number",
                        trigger: "blur",
                    },
                    {
                        min: 10,
                        max: 10,
                        message: "Length must be 10 digits",
                        trigger: "blur",
                    },
                ],
                custEmail: [
                    {
                        required: true,
                        message: "Enter Email",
                        trigger: "blur",
                    },
                ],
                custCountry: [
                    {
                        required: true,
                        message: "Enter Country Name",
                        trigger: "blur",
                    },
                ],
                custCity: [
                    {
                        required: true,
                        message: "Enter City Name",
                        trigger: "blur",
                    },
                ],
                custDistirct: [
                    {
                        required: true,
                        message: "Enter Distirct",
                        trigger: "blur",
                    },
                ],
                custAddress: [
                    {
                        required: true,
                        message: "Enter Address",
                        trigger: "blur",
                    },
                ],
                custZipcode: [
                    {
                        required: true,
                        message: "Enter Zipcode",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {},
    methods: {
        handleRegister() {
            this.$router.push("login");
        },

        handleReset() {
            //通过重置表单可以做到这个表单的信息进行重置
            this.$refs.registerFormRef.resetFields();
        },

        handleregister() {
            //在这个地方可以帮我们验证是否成功，成功了就是成功了，然后就可以编写其他的代码了
            this.$refs.registerFormRef.validate(async (valid) => {
                if (valid) {
                    //如果验证成功
                    //首相在这个地方，返回的是一个对象，而且这个地想里面含有很多数据，
                    //在这个地方主要使用的就是这个解析的语法，在这个地方就可以很好的使用这个语法了，然后就可以很好的之后的访问了

                    let { data: res } = await this.$http.post(
                        "/data/cus/register",
                        Qs.stringify(this.registerForm)
                    );
                    //然后在这个地方是进行处理这个登录的，然后就可以很好的进行这个之后的操作。
                    if (res.code == 200) {
                        this.$message.success("注册成功！"); //信息提示
                        this.$router.push("/login");
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
.register_container {
    background-color: #2b4b6b;
    height: 100%;
}

.register_box {
    width: 450px;
    height: 550px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    h1 {
        text-align: center;
    }
}

.btns {
    position: relative;
    .btns-left {
        display: inline-block;
    }
    .btns-right {
        display: inline-block;
        position: absolute;
        top: 0;
        right: 0;
    }
}

.register_form {
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

/deep/ .el-input__inner {
    height: 23px;
}

/deep/ .el-form-item {
    margin-bottom: 4px;
}

/deep/ .el-form-item__error {
    top: 75%;
}
</style>
