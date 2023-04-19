<!-- 展示这个admin的一个list的一个属性,在这个地方 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >Home</el-breadcrumb-item
            >
            <el-breadcrumb-item :to="{ path: '/roles' }"
                >Role Management</el-breadcrumb-item
            >
        </el-breadcrumb>

        <el-card>
            <!-- 搜索区域 -->
            <el-row>
                <el-col :span="6">
                    <el-input
                        placeholder="Please enter the role"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getRoleList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getRoleList"
                        ></el-button>
                    </el-input>
                </el-col>

                <el-col :span="3">
                    <el-button type="primary" @click="addDialogVisible = true"
                        >Add Roles</el-button
                    >
                </el-col>
            </el-row>
            <!-- 用户列表 border边框 stripe就是随行变色-->
            <el-table :data="roleLists" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="Name" prop="name"></el-table-column>
                <el-table-column label="Tag" prop="tag"></el-table-column>
                <el-table-column label="Description" prop="descp"></el-table-column>
                <el-table-column label="Operation" width="200px">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showEditDialog(scope.row)"
                        ></el-button>
                        <el-button
                            v-show="scope.row.tag != 'admin'"
                            type="success"
                            icon="el-icon-user"
                            size="mini"
                            @click="editUserAuthorDialog(scope.row.id)"
                        ></el-button>
                        <el-button
                            v-show="scope.row.tag != 'admin'"
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteRole(scope.row.id)"
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
        <!-- <el-tree
            v-show="false"
            :data="permTreeData"
            show-checkbox
            default-expand-all
            node-key="id"
            :check-strictly="true"
            ref="tree"
            highlight-current
            :default-checked-keys="curAuthorData"
            :props="defaultProps"
        >
        </el-tree> -->

        <!-- 新增用户的对话框 -->
        <el-dialog
            title="Add Roles"
            :visible="addDialogVisible"
            width="35%"
            @close="addDialogClosed"
        >
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="100px"
            >
                <el-form-item label="Name" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>

                <el-form-item label="Tag" prop="tag">
                    <el-input v-model="addForm.tag"></el-input>
                </el-form-item>

                <el-form-item label="Description" prop="descp">
                    <el-input v-model="addForm.descp"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addRole">Sumbit</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="Set Permission"
            :visible="editUserAuthorDialogVisible"
            width="30%"
            @close="editUserAuthorDialogClose"
        >
            <el-tree
                :data="permTreeData"
                show-checkbox
                default-expand-all
                node-key="id"
                :check-strictly="true"
                ref="tree"
                highlight-current
                :default-checked-keys="curAuthorData"
                :props="defaultProps"
            >
            </el-tree>

            <div style="margin-top: 20px; text-align: center">
                <el-button type="primary" @click="editRolePerm">ok</el-button>
                <el-button @click="editUserAuthorDialogVisible == false"
                    >cancel</el-button
                >
            </div>
        </el-dialog>

        <!-- 修改用户信息的对话框 -->
        <el-dialog
            title="change information"
            :visible="editDialogVisible"
            width="35%"
            @close="editDialogClosed"
        >
            <el-form
                :model="editForm"
                :rules="editFormRules"
                ref="editFormRef"
                label-width="100px"
            >
                <el-form-item label="Name" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>

                <el-form-item label="Tag" prop="tag">
                    <el-input
                        v-model="editForm.tag"
                        :disabled="true"
                    ></el-input>
                </el-form-item>

                <el-form-item label="Description" prop="descp">
                    <el-input v-model="editForm.descp"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">cancel</el-button>
                <el-button type="primary" @click="editRoleInfo">ok</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Qs from "qs";
import { mapMutations } from "vuex";
import * as type from "../../store/mutation-types";
export default {
    name: "UserList",
    data() {
        return {
            authorid: "",
            editUserAuthorDialogVisible: false,
            permTreeData: [],
            curAuthorData: [],

            //查询信息的一个数
            queryInfo: {
                query: "", //查询信息
                pageNum: 1, //当前页
                pageSize: 5, //每页最大数
            },

            defaultProps: {
                children: "children",
                label: "title",
            },

            roleLists: [], //用户列表
            total: 0, //总的记录数
            addDialogVisible: false, //对话框显示的信息
            addForm: {
                name: "",
                tag: "",
                descp: "",
            },
            editForm: {
                id: 0, //来机型修改的地方
                name: "",
                tag: "",
                descp: "",
            },
            editDialogVisible: false,
            addFormRules: {
                name: [
                    {
                        required: true,
                        message: "Please enter the  name",
                        trigger: "blur",
                    },
                ],
                tag: [
                    {
                        required: true,
                        message: "Please enter the tag",
                        trigger: "blur",
                    },
                ],
                descp: [
                    {
                        required: true,
                        message: "Please enter the id number",
                        trigger: "blur",
                    },
                ],
            },
            editFormRules: {
                name: [
                    {
                        required: true,
                        message: "Please enter the character name",
                        trigger: "blur",
                    },
                ],
                tag: [
                    {
                        required: true,
                        message: "Please enter the tag",
                        trigger: "blur",
                    },
                ],
                descp: [
                    {
                        required: true,
                        message: "Please enter the id number",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        //刚开始的地方进行使用的，然后就可以得到这个数据
        this.getRoleList();
        //获取到权限的一个函数
        this.getPermData();
    },
    methods: {
        ...mapMutations({
            saveCurUser: type.SET_CUR_USER,
            saveLeftMenu: type.SET_LEFT_MENU,
        }),
        async getPermData() {
            let { data: res } = await this.$http.get(
                "/permission/allWithChild"
            );
            //将权限数据设置到authorData里面
            this.permTreeData = res.data;
        },
        //获取所有的数据然后开始之后的操作

        async getRoleList() {
            let json1 = {
                page: this.queryInfo.pageNum,
                limit: this.queryInfo.pageSize,
                name: this.queryInfo.query,
            };
            const { data: res } = await this.$http.post(
                "/role/page",
                Qs.stringify(json1)
            );

            this.roleLists = res.data.list;
            this.total = res.data.total;
        },
        async updatePerm() {
            let { data: res } = await this.$http.get("/permission/getCurPerm");
            let curUser = res.data.curUser;
            let leftMenu = res.data.leftMenu;
            this.saveCurUser(curUser);
            this.saveLeftMenu(leftMenu);
        },

        async editUserAuthorDialog(id) {
            this.roleId = id;
            let { data: res } = await this.$http.post(
                "/role/permissionIds",
                Qs.stringify({ id })
            );
            this.editUserAuthorDialogVisible = true; //开启这个编辑的对话框
            //完美解决在对框框当中获取不到的问题了
            this.$nextTick(() => {
                //此时能够调到ref，而且table也正常刷新了
                this.$refs.tree.setCheckedKeys(res.data);
            });
        },
        editUserAuthorDialogClose() {
            //重复这个操作，也就是讲这个
            this.editUserAuthorDialogVisible = false;
        },
        async editRolePerm() {
            let selectKeys = this.$refs.tree.getCheckedKeys();
            let json1 = {
                roleId: this.roleId,
                permissionId: selectKeys,
            };
            const { data: res } = await this.$http.post(
                `role/setRolePermission`,
                Qs.stringify(json1, { arrayFormat: "repeat" })
            );
            if (res.code != 200) {
                return this.$message.error("operation failure");
            }

            this.updatePerm();
            this.getRoleList();
            this.editUserAuthorDialogVisible = false;
            this.$message.success("Operation success!");
        },

        // 更新这个下面的分页条的作用，然后可以在这个地方进行使用。
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getRoleList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage;
            this.getRoleList();
        },
        //添加的一个对话框的操作
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
            this.addDialogVisible = false;
        },

        // 这个就是进行查询这个地址的信息的然后来进行修改相关的操作
        async showEditDialog(data) {
            let data1 = JSON.parse(JSON.stringify(data));
            this.editForm = data1; //进行赋值的时候进行浅复制，就行了，之后的代码就可以写出来了
            this.editDialogVisible = true; //开启这个编辑的对话框
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
            this.editDialogVisible = false;
        },

        async editRoleInfo() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return; //现在是验证成功了！！！
                const { data: res } = await this.$http.post(
                    "/role/update",
                    Qs.stringify(this.editForm)
                );
                if (res.code != 200) {
                    return this.$message.error("UPDATE FAILED");
                }
                this.$message.success("update successfully");
                this.editDialogVisible = false;
                this.getRoleList();
            });
        },

        // 添加还有修改的一个User的一个方法z
        async addRole() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.post(
                    "/role/add",
                    Qs.stringify(this.addForm)
                );
                if (res.code != 200) {
                    this.$message.error("operation failure");
                }
                this.updatePerm();
                this.$message.success("operate successfully");
                this.addDialogVisible = false;
                this.getRoleList();
            });
        },

        //删除操作
        async deleteRole(id) {
            const confirm = await this.$confirm("Whether to delete！", "hit", {
                confirmButtonText: "ok",
                cancelButtonText: "cancel",
                type: "warning",
            }).catch((err) => err);

            if (confirm != "confirm") {
                return this.$message.info("undelete");
            }

            const { data: res } = await this.$http.post(
                "role/deleteById",
                Qs.stringify({
                    id,
                })
            );
            if (res.code != 200) {
                return this.$message.error("fail to delete");
            }
            this.updatePerm();
            this.$message.success("successfully delete");
            this.getRoleList();
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
