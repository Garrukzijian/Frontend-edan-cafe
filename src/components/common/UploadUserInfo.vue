<!-- 上传图片的操作 -->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/uploadImg' }">
                profile
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-form
                :model="editForm"
                :rules="editFormRules"
                ref="editFormRef"
                label-width="70px"
            >
                <el-form-item label="loginName" prop="loginName">
                    <el-input
                        v-model="editForm.loginName"
                        :disabled="true"
                    ></el-input>
                    <!-- <el-input
                v-model="loginForm.password"
                prefix-icon="el-icon-search"
              ></el-input> -->
                </el-form-item>
                <el-form-item label="realname" prop="realname">
                    <el-input v-model="editForm.realname"></el-input>
                </el-form-item>

                <el-form-item label="phone" prop="phone">
                    <el-input
                        v-model="editForm.phone"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="idCard" prop="idCard">
                    <el-input
                        v-model="editForm.idCard"
    
                    ></el-input>
                </el-form-item>

                <el-form-item label="sex" prop="sex">
                    <el-select v-model="editForm.sex" placeholder="Please select a gender">
                        <el-option
                            v-for="item in sexOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled"
                        >
                        </el-option>
                    </el-select>
                    <!-- <el-input
                v-model="loginForm.password"
                prefix-icon="el-icon-search"
              ></el-input> -->
                </el-form-item>
                <el-form-item label="address" prop="address">
                    <el-input v-model="editForm.address"></el-input>
                </el-form-item>
                <el-form-item label="address" prop="address">
                    <el-upload
                        class="avatar-uploader"
                        action="/api/file/uploadImage"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :headers="{Authorization:getToken}"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div class="footerButton">
                <el-button type="primary" @click="editUserInfo"
                    >change information</el-button
                >
            </div>
        </el-card>
    </div>
</template>

<script>
import Qs from "qs";
import { mapMutations, mapGetters } from "vuex";
import * as type from "../../store/mutation-types";
export default {
    name: "UploadUserInfo",
    data() {
        return {
            imageUrl: "",
            editForm: {
                id: 0, //用来进行修改的地方
                name: "",
                param: "",
                type: "",
                reserve1: "",
            },
            sexOptions: [
                { value: 1, label: "man" },
                { value: 0, label: "woman" },
            ],
            editFormRules: {
                realname: [
                    {
                        required: true,
                        message: "Please enter your name",
                        trigger: "blur",
                    },
                ],
                loginName: [
                    {
                        required: true,
                        message: "please type your login name",
                        trigger: "blur",
                    },
                    {
                        min: 5,
                        max: 11,
                        message: "The length from 5 to 11 characters",
                        trigger: "blur",
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: "Please input the telephone",
                        trigger: "blur",
                    },
                    {
                        min: 10,
                        max: 10,
                        message: "Length must be 10 digits",
                        trigger: "blur",
                    },
                ],
                idCard: [
                    {
                        required: true,
                        message: "Please enter the id number",
                        trigger: "blur",
                    },
                    {
                        min: 18,
                        max: 18,
                        message: "Length must be in 18 of the digits",
                        trigger: ["blur", "change"],
                    },
                ],
                address: [
                    {
                        required: true,
                        message: "Please enter the address",
                        trigger: "blur",
                    },
                ],
                sex: [
                    { required: true, message: "Please enter the gender", trigger: "blur" },
                ],
            },
        };
    },
    computed: {
        ...mapGetters([
            //把 `this.getEditProduct` 映射为 `this.$store.getters.getEditProduct`
            "getCurUser",
            "getToken"
        ]),
    },
    mounted() {
        this.editForm = this.getCurUser.sysUser; //设置值
        this.imageUrl = this.getCurUser.img;
    },
    methods: {
        ...mapMutations({
            setCurUserImg: type.UPDATE_CURUSER_IMG, //辅助函数进行了映射
            setCurUser: type.SET_CUR_USER,
        }),
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            console.log(res);
            if (res.code == 200) {
                this.$message.success("Modified face success!"); //信息的提示
                this.setCurUserImg(res.data); //这个是使用到了辅助函数，
                this.editForm.img = res.data;      
            } else {
                this.$message.success("Modify the face failure!"); //信息的提示
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("Upload avatar images can only be jpg format!");
            }
            if (!isLt2M) {
                this.$message.error("Upload avatar picture size no more than 2mb!");
            }
            return isJPG && isLt2M;
        },
        async editUserInfo() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return; //现在是验证成功了！！！
                const { data: res } = await this.$http.post(
                    "sysuser/updateCurUserInfo",
                    Qs.stringify(this.editForm)
                );
                if (res.code != 200) {
                    return this.$message.error("UPDATE FAILED");
                }
                this.$message.success("update successfully");            //需要在在这个位置进行设置
                this.setCurUser(res.data);          //更新当前的用户信息
            });
        },
    },
};
</script>

<style lang="less"  scoped>
.el-upload {
    border: 1px dashed #222020;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.el-upload:hover {
    border-color: #111111;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #1e1f20;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

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

.footerButton {
    text-align: right;
}
</style>
