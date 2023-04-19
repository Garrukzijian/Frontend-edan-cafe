<!-- 展示这个admin的一个list的一个属性,在这个地方 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >Home</el-breadcrumb-item
            >
            <el-breadcrumb-item :to="{ path: '/user' }"
                >User Management</el-breadcrumb-item
            >
        </el-breadcrumb>

        <el-card>
            <!-- 搜索区域 -->
            <el-row>
                <el-col :span="4">
                    <el-input
                        placeholder="Please enter a search name:"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getUserList"
                    >
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-input
                        placeholder="Please enter the search phone number:"
                        v-model="queryInfo.phone"
                        clearable
                        @clear="getUserList"
                    >
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-input
                        placeholder="Please enter a search address:"
                        v-model="queryInfo.address"
                        clearable
                        @clear="getUserList"
                    >
                    </el-input>
                </el-col>

                <el-col :span="2">
                    <el-button icon="el-icon-search" @click="getUserList"
                        >Search</el-button
                    >
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="addDialogVisible = true"
                        >Add User</el-button
                    >
                </el-col>
            </el-row>

            <!-- 用户列表 border边框 stripe就是随行变色-->
            <el-table :data="userLists" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="Name" prop="realname"></el-table-column>
                <el-table-column
                    label="UserName"
                    prop="loginName"
                ></el-table-column>
                <el-table-column label="Phone" prop="phone"></el-table-column>
                <el-table-column label="Id Card" prop="idCard"></el-table-column>
                <el-table-column label="Gender" prop="sex">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex == 1">man</span>
                        <span v-else>women</span>
                    </template>
                </el-table-column>
                <el-table-column label="Address" prop="address"></el-table-column>
                <el-table-column label="Image" prop="img">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="openViwerButton(scope.row.img)"
                            >View picture</el-button
                        >
                    </template>
                </el-table-column>

                <el-table-column label="Operation" width="250px">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showEditDialog(scope.row.id)"
                        ></el-button>
                        <el-button
                            v-show="scope.row.loginName != 'admin'"
                            type="success"
                            icon="el-icon-user"
                            size="mini"
                            @click="editUserAuthorDialog(scope.row.id)"
                        ></el-button>
                        <el-button
                            v-show="scope.row.loginName != 'admin'"
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteUser(scope.row.id)"
                        ></el-button>
                        <el-button
                            v-show="scope.row.loginName != 'admin'"
                            type="danger"
                            icon="el-icon-refresh-right"
                            size="mini"
                            @click="updateUserPassword(scope.row.id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 size-change每页最大变化数，current-change当前最大也变化数 -->
            <div class="block">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageNum"
                    :page-sizes="[5, 10, 20]"
                    :page-size="queryInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
        </el-card>

        <!-- 新增用户的对话框 -->
        <el-dialog
            title="Add User"
            :visible="addDialogVisible"
            width="35%"
            @close="addDialogClosed"
        >
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="110px"
            >
                <el-form-item label="Name" prop="realname">
                    <el-input v-model="addForm.realname"></el-input>
                </el-form-item>

                <el-form-item label="UserName" prop="loginName">
                    <el-input v-model="addForm.loginName"></el-input>
                    <!-- <el-input
                v-model="loginForm.password"
                prefix-icon="el-icon-search"
              ></el-input> -->
                </el-form-item>
                <el-form-item label="Phone" prop="phone">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="ID Card" prop="idCard">
                    <el-input v-model="addForm.idCard"></el-input>
                </el-form-item>

                <el-form-item label="Gender" prop="sex">
                    <el-select v-model="addForm.sex" placeholder="Please select gender">
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
                <el-form-item label="Address" prop="address">
                    <el-input v-model="addForm.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addUser">Sumbit</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="Modify the user's permissions"
            :visible="editUserAuthorDialogVisible"
            width="20%"
            @close="editUserAuthorDialogClose"
        >
            <el-select
                v-model="curAuthorData"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="Please select a permission attribute"
            >
                <el-option
                    v-for="item in authorData"
                    :key="item.tag"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
            </el-select>

            <div style="margin-top: 20px">
                <el-button type="primary" @click="editUserAuthor"
                    >ok</el-button
                >
                <el-button @click="editUserAuthorDialogVisible == false"
                    >cancel</el-button
                >
            </div>
        </el-dialog>

        <!-- 修改用户信息的对话框 -->
        <el-dialog
            title="Modify information"
            :visible="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <el-form
                :model="editForm"
                :rules="editFormRules"
                ref="editFormRef"
                label-width="110px"
            >
                <el-form-item label="UserName" prop="loginName">
                    <el-input
                        v-model="editForm.loginName"
                        :disabled="true"
                    ></el-input>
                    <!-- <el-input
                v-model="loginForm.password"
                prefix-icon="el-icon-search"
              ></el-input> -->
                </el-form-item>
                <el-form-item label="Name" prop="realname">
                    <el-input v-model="editForm.realname"></el-input>
                </el-form-item>

                <el-form-item label="Phone" prop="phone">
                    <el-input
                        v-model="editForm.phone"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="ID Card" prop="idCard">
                    <el-input
                        v-model="editForm.idCard"
                        :disabled="true"
                    ></el-input>
                </el-form-item>

                <el-form-item label="Gender" prop="sex">
                    <el-select v-model="editForm.sex" placeholder="Please select gender">
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
                <el-form-item label="Address" prop="address">
                    <el-input v-model="editForm.address"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">cancel</el-button>
                <el-button type="primary" @click="editUserInfo">ok</el-button>
            </span>
        </el-dialog>

        <el-image-viewer
            v-if="showViewer"
            :on-close="closeViewer"
            :url-list="imgUrlList"
        />
    </div>
</template>

<script>
import Qs from "qs";
import { mapMutations } from "vuex";
import * as type from "../../store/mutation-types";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
    name: "UserList",
    components: {
        ElImageViewer,
    },
    data() {
        return {
            showViewer: false,
            imgUrlList: [],

            authorid: "",
            editUserAuthorDialogVisible: false,
            authorData: [],
            curAuthorData: [],
            // 下拉选择框
            sexOptions: [
                { value: 1, label: "man" },
                { value: 0, label: "woman" },
            ],
            //查询信息的一个数
            queryInfo: {
                query: "", //查询信息
                pageNum: 1, //当前页
                pageSize: 5, //每页最大数
            },
            userLists: [], //用户列表
            total: 0, //总的记录数
            addDialogVisible: false, //对话框显示的信息
            addForm: {
                realname: "",
                loginName: "",
                phone: "",
                idCard: "",
                sex: "",
                address: "",
            },
            editForm: {
                id: 0, //来机型修改的地方
                realname: "",
                loginName: "",
                phone: "",
                idCard: "",
                sex: "",
                address: "",
            },
            editDialogVisible: false,
            addFormRules: {
                realname: [
                    {
                        required: true,
                        message: "Please enter a name",
                        trigger: "blur",
                    },
                ],
                loginName: [
                    {
                        required: true,
                        message: "Please enter a login name",
                        trigger: "blur",
                    },
                    {
                        min: 5,
                        max: 11,
                        message: "Between 5 and 11 characters in length",
                        trigger: "blur",
                    },
                ],
                idCard: [
                    {
                        required: true,
                        message: "Please enter ID number number",
                        trigger: "blur",
                    },
                    {
                        min: 18,
                        max: 18,
                        message: "Length must be within 18 digits",
                        trigger: ["blur", "change"],
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: "Please enter a phone number",
                        trigger: "blur",
                    },
                    {
                        min: 11,
                        max: 11,
                        message: "Length must be 11 digits",
                        trigger: "blur",
                    },
                ],
                address: [
                    {
                        required: true,
                        message: "Please enter an address",
                        trigger: "blur",
                    },
                ],
                sex: [
                    { required: true, message: "Please enter gender", trigger: "blur" },
                ],
            },
            editFormRules: {
                realname: [
                    {
                        required: true,
                        message: "Please enter a name",
                        trigger: "blur",
                    },
                ],
                loginName: [
                    {
                        required: true,
                        message: "Please enter a login name",
                        trigger: "blur",
                    },
                    {
                        min: 5,
                        max: 11,
                        message: "Between 5 and 11 characters in length",
                        trigger: "blur",
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: "Please enter a phone number",
                        trigger: "blur",
                    },
                    {
                        min: 11,
                        max: 11,
                        message: "Length must be 11 digits",
                        trigger: "blur",
                    },
                ],
                idCard: [
                    {
                        required: true,
                        message: "Please enter ID number number",
                        trigger: "blur",
                    },
                    {
                        min: 18,
                        max: 18,
                        message: "Length must be within 18 digits",
                        trigger: ["blur", "change"],
                    },
                ],
                address: [
                    {
                        required: true,
                        message: "Please enter an address",
                        trigger: "blur",
                    },
                ],
                sex: [
                    { required: true, message: "Please enter gender", trigger: "blur" },
                ],
            },
        };
    },
    created() {
        //刚开始的地方进行使用的，然后就可以得到这个数据
        this.getUserList();
        //获取到权限的一个函数
        this.getPermData();
    },
    methods: {
        ...mapMutations({
            saveCurUser: type.SET_CUR_USER,
            saveLeftMenu: type.SET_LEFT_MENU,
        }),

        closeViewer() {
            this.showViewer = false;
        },

        openViwerButton(url) {
            this.imgUrlList = [url];
            this.showViewer = true;
        },
        async getPermData() {
            let { data: res } = await this.$http.get("/role/all");
            //将权限数据设置到authorData里面
            this.authorData = res.data;
        },
        //获取所有的数据然后开始之后的操作
        async getUserList() {
            let json1 = {
                page: this.queryInfo.pageNum,
                limit: this.queryInfo.pageSize,
                realname: this.queryInfo.query,
                phone: this.queryInfo.phone,
                address: this.queryInfo.address,
            };
            const { data: res } = await this.$http.post(
                "/sysuser/page",
                Qs.stringify(json1)
            );

            this.userLists = res.data.list;
            this.total = res.data.total;
        },
        async editUserAuthorDialog(id) {
            this.authorid = id;
            let { data: res } = await this.$http.post(
                "/role/userRoles",
                Qs.stringify({ userId: id })
            );
            this.curAuthorData = res.data.map((item, index) => {
                return item.id;
            });
            this.editUserAuthorDialogVisible = true; //开启这个编辑的对话框
        },
        editUserAuthorDialogClose() {
            //重复这个操作，也就是讲这个
            this.editUserAuthorDialogVisible = false;
        },

        async updateUserPassword(id) {
            let { data: res } = await this.$http.post(
                "/sysuser/reset",
                Qs.stringify({ id })
            );
            if (res.code == 200) {
                this.$message.success("Password reset succeeded");
            } else {
                this.$message.success("Failed to reset password");
            }
        },
        async editUserAuthor() {
            let json1 = {
                userId: this.authorid,
                roleId: this.curAuthorData,
            };
            const { data: res } = await this.$http.post(
                `role/setRole`,
                Qs.stringify(json1, { arrayFormat: "repeat" })
            );
            if (res.code != 200) {
                return this.$message.error("operation failed");
            }
            this.updatePerm();
            this.getUserList();
            this.editUserAuthorDialogVisible = false;
            this.$message.success("Operation succeeded!");
        },
        async updatePerm() {
            let { data: res } = await this.$http.get("/permission/getCurPerm");
            let curUser = res.data.curUser;
            let leftMenu = res.data.leftMenu;
            this.saveCurUser(curUser);
            this.saveLeftMenu(leftMenu);
        },
        // 更新这个下面的分页条的作用，然后可以在这个地方进行使用。
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getUserList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage;
            this.getUserList();
        },

        //添加的一个对话框的操作
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
            this.addDialogVisible = false;
        },

        // 这个就是进行查询这个地址的信息的然后来进行修改相关的操作
        async showEditDialog(id) {
            const { data: res } = await this.$http.post(
                "sysuser/getUserById",
                Qs.stringify({
                    id,
                })
            );
            if (res.code == 200) {
                this.editForm = res.data; //查询出来的用户信息，反填到这个编辑的表单
                this.editDialogVisible = true; //开启这个编辑的对话框
            } else {
                this.$message.error("Failed to obtain user information!!!");
            }
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
            this.editDialogVisible = false;
        },

        async editUserInfo() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return; //现在是验证成功了！！！
                const { data: res } = await this.$http.post(
                    "sysuser/updateUserInfo",
                    Qs.stringify(this.editForm)
                );
                if (res.code != 200) {
                    return this.$message.error("Update failed!");
                }
                this.$message.success("Update succeeded!");
                this.editDialogVisible = false;
                this.getUserList();
            });
        },

        // 添加还有修改的一个User的一个方法
        async addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.post(
                    "sysuser/add",
                    Qs.stringify(this.addForm)
                );
                if (res.code != 200) {
                    this.$message.error("Update succeeded!");
                }
                this.$message.success("Operation succeeded!");
                this.addDialogVisible = false;
                this.getUserList();
            });
        },

        //删除操作
        async deleteUser(id) {
            const confirm = await this.$confirm("Delete Continue!!!", "point out", {
                confirmButtonText: "ok",
                cancelButtonText: "cancel",
                type: "warning",
            }).catch((err) => err);

            if (confirm != "confirm") {
                return this.$message.info("Cancel Delete");
            }

            const { data: res } = await this.$http.post(
                "sysuser/deleteUserById",
                Qs.stringify({
                    id,
                })
            );
            if (res.code != 200) {
                return this.$message.error("Delete failed!");
            }
            this.$message.success("Delete succeeded!");
            this.getUserList();
        },
    },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}

el-dialog {
    width: 200px;
}

.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.el-col {
    border-radius: 4px;
    margin-right: 15px;
}

.block {
    margin-top: 10px;
}
</style>
