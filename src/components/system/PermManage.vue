<!-- 权限管理的事情 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >Home</el-breadcrumb-item
            >
            <el-breadcrumb-item :to="{ path: '/perm' }"
                >Authority Management</el-breadcrumb-item
            >
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="4">
                    <div>
                        <el-tree
                            :data="permTreeData"
                            default-expand-all
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :props="defaultProps"
                        >
                            <span slot-scope="{ node, data }">
                                <span
                                    ><i :class="data.icon"></i
                                    >{{ node.label }}</span
                                >
                            </span>
                        </el-tree>
                    </div>
                </el-col>

                <el-col :span="18">
                    <el-row>
                        <el-col :span="10">
                            <el-input
                                placeholder="Please enter a name"
                                v-model="queryInfo.query"
                                clearable
                                @clear="getPermList"
                            >
                                <el-button
                                    slot="append"
                                    icon="el-icon-search"
                                    @click="getPermList"
                                ></el-button>
                            </el-input>
                        </el-col>

                        <el-col :span="3">
                            <el-button
                                type="primary"
                                @click="addDialogVisible = true"
                                >Add Permission</el-button
                            >
                        </el-col>
                    </el-row>

                    <!-- 用户列表 border边框 stripe就是随行变色-->
                    <el-table :data="permLists" border stripe>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column
                            label="Title"
                            prop="title"
                        ></el-table-column>
                        <el-table-column label="Icon">
                            <template slot-scope="scope">
                                <i :class="scope.row.icon"></i>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="Link"
                            prop="href"
                        ></el-table-column>
                        <el-table-column label="Spread" prop="spread">
                            <template slot-scope="scope">
                                <span v-if="scope.row.spread == 1">yes</span>
                                <span v-else>no</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Type">
                            <template slot-scope="scope">
                                <span v-if="scope.row.type == 1">menu</span>
                                <span v-else>button</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="Tag"
                            prop="tag"
                        ></el-table-column>
                        <el-table-column
                            label="Sort"
                            prop="sort"
                        ></el-table-column>
                        <el-table-column
                            label="Parent ID"
                            prop="parentId"
                        ></el-table-column>
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
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="deletePerm(scope.row.id)"
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
                </el-col>
            </el-row>
        </el-card>
        <!-- 修改用户信息的对话框 -->
        <el-dialog
            title="Change Information"
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
                <el-form-item label="Parent Permission" prop="parentId">
                    <el-cascader
                        v-model="editForm.parentId"
                        :options="permTreeData"
                        :props="{
                            checkStrictly: true,
                            value: 'id',
                            label: 'title',
                            children: 'children',
                        }"
                        @change="handlePermTreeClick"
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="Title" prop="title">
                    <el-input v-model="editForm.title"></el-input>
                </el-form-item>

                <el-form-item label="Icon" prop="icon">
                    <el-input v-model="editForm.icon"></el-input>
                </el-form-item>

                <el-form-item label="Href" prop="href">
                    <el-input v-model="editForm.href"></el-input>
                </el-form-item>
                <el-form-item label="Spread" prop="spread">
                    <el-select v-model="editForm.spread" placeholder="select">
                        <el-option
                            v-for="item in spreadList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Type" prop="type">
                    <el-select v-model="editForm.type" placeholder="select">
                        <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Tag" prop="tag">
                    <el-input v-model="editForm.tag"></el-input>
                </el-form-item>
                <el-form-item label="Sort" prop="sort">
                    <el-input v-model="editForm.sort"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">cancel</el-button>
                <el-button type="primary" @click="editPermInfo">ok</el-button>
            </span>
        </el-dialog>

        <!-- 新增角色的对话框 -->
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
                <el-form-item label="Parent ID" prop="parentId">
                    <el-cascader
                        v-model="addForm.parentId"
                        :options="permTreeData"
                        :props="{
                            checkStrictly: true,
                            value: 'id',
                            label: 'Title',
                            children: 'children',
                        }"
                        @change="handlePermTreeClick"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="Title" prop="title">
                    <el-input v-model="addForm.title"></el-input>
                </el-form-item>

                <el-form-item label="Icon" prop="icon">
                    <el-input v-model="addForm.icon"></el-input>
                </el-form-item>

                <el-form-item label="Href" prop="href">
                    <el-input v-model="addForm.href"></el-input>
                </el-form-item>
                <el-form-item label="Spread" prop="spread">
                    <el-select v-model="addForm.spread" placeholder="select">
                        <el-option
                            v-for="item in spreadList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Type" prop="type">
                    <el-select v-model="addForm.type" placeholder="select">
                        <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Tag" prop="tag">
                    <el-input v-model="addForm.tag"></el-input>
                </el-form-item>
                <el-form-item label="Sort" prop="sort">
                    <el-input v-model="addForm.sort"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">cancel</el-button>
                <el-button type="primary" @click="addPerm">ok</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Qs from "qs";
import { mapMutations } from "vuex";
import * as type from "../../store/mutation-types";
export default {
    name: "PermManage",
    data() {
        return {
            permTreeData: [],
            defaultProps: {
                children: "children",
                label: "title",
            },

            //查询信息的一个数
            queryInfo: {
                title: "", //查询信息
                pageNum: 1, //当前页
                pageSize: 5, //每页最大数
            },
            spreadList: [
                {
                    value: 1,
                    label: "unfold",
                },
                {
                    value: 0,
                    label: "fold",
                },
            ],
            typeList: [
                {
                    value: 1,
                    label: "menu",
                },
                {
                    value: 2,
                    label: "button",
                },
            ],
            permLists: [], //用户列表
            total: 0, //总的记录数
            addDialogVisible: false, //对话框显示的信息
            addForm: {
                parentId: 0,
            },
            editForm: {
                id: 0, //来机型修改的地方
            },
            editDialogVisible: false,
            addFormRules: {
                parentId: [
                    {
                        required: true,
                        message: "Father not empty",
                        trigger: "blur",
                    },
                ],
                title: [
                    {
                        required: true,
                        message: "Access name not empty",
                        trigger: "change",
                    },
                ],
                icon: [
                    {
                        max: 20,
                        message: "Length must be in 20 digits",
                        trigger: ["change"],
                    },
                ],
                href: [
                    {
                        max: 20,
                        message: "Length must be in 20 digits",
                        trigger: ["change"],
                    },
                ],
                spread: [
                    {
                        required: true,
                        message: "Please choose whether or not",
                        trigger: "blur",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "Please choose  permission types",
                        trigger: "blur",
                    },
                ],
                tag: [
                    {
                        required: true,
                        message: "Please choose tag",
                        trigger: "blur",
                    },
                    {
                        max: 20,
                        message: "Length must be in 20 digits",
                        trigger: ["change"],
                    },
                ],
            },
            editFormRules: {
                parentId: [
                    {
                        required: true,
                        message: "Father not empty",
                        trigger: "blur",
                    },
                ],
                title: [
                    {
                        required: true,
                        message: "Access name not empty",
                        trigger: "blur",
                    },
                ],
                icon: [
                    {
                        max: 20,
                        message: "Length must be in 20 digits",
                        trigger: ["change"],
                    },
                ],
                href: [
                    {
                        max: 20,
                        message: "Length must be in 20 digits",
                        trigger: ["change"],
                    },
                ],
                spread: [
                    {
                        required: true,
                        message: "Please choose whether or not",
                        trigger: "blur",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "Please select a permission types",
                        trigger: "blur",
                    },
                ],
                tag: [
                    {
                        required: true,
                        message: "Please select a tag",
                        trigger: "blur",
                    },
                    {
                        max: 20,
                        message: "Length must be in 20 digits",
                        trigger: ["change"],
                    },
                ],
            },
        };
    },
    created() {
        this.getPermList();
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
        async updatePerm() {
            let { data: res } = await this.$http.get("/permission/getCurPerm");
            let curUser = res.data.curUser;
            let leftMenu = res.data.leftMenu;
            this.saveCurUser(curUser);
            this.saveLeftMenu(leftMenu);
        },
        handlePermTreeClick(value) {},
        // 这个就是进行查询这个地址的信息的然后来进行修改相关的操作
        async showEditDialog(data) {
            let data1 = JSON.parse(JSON.stringify(data));
            if (data1.spread == true) {
                data1.spread = 1;
            } else {
                data1.spread = 0;
            }
            this.editForm = data1; //进行赋值的时候进行浅复制，就行了，之后的代码就可以写出来了
            this.editDialogVisible = true; //开启这个编辑的对话框
        },
        async getPermList() {
            let json1 = {
                page: this.queryInfo.pageNum,
                limit: this.queryInfo.pageSize,
                title: this.queryInfo.query,
            };
            const { data: res } = await this.$http.post(
                "/permission/page",
                Qs.stringify(json1)
            );
            this.permLists = res.data.list;
            this.total = res.data.total;
        },
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getPermList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage;
            this.getPermList();
        },
        //添加的一个对话框的操作
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
            this.addDialogVisible = false;
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
            this.editDialogVisible = false;
        },

        async editPermInfo() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return; //现在是验证成功了！！！
                if (this.editForm.parentId instanceof Array) {
                    //如果进行了改变进行下面的书写
                    this.editForm.parentId = this.editForm.parentId[
                        this.editForm.parentId.length - 1
                    ];
                }
                const { data: res } = await this.$http.post(
                    "/permission/update",
                    Qs.stringify(this.editForm)
                );
                if (res.code != 200) {
                    return this.$message.error("UPDATE FAILED");
                }
                this.updatePerm();
                this.$message.success("update successfully");
                this.editDialogVisible = false;
                this.getPermList();
                this.getPermData();
            });
        },
        //删除操作
        async deletePerm(id) {
            const confirm = await this.$confirm("Whether to delete！", "hit", {
                confirmButtonText: "ok",
                cancelButtonText: "cancel",
                type: "warning",
            }).catch((err) => err);

            if (confirm != "confirm") {
                return this.$message.info("undelete");
            }

            const { data: res } = await this.$http.post(
                "permission/delete",
                Qs.stringify({
                    id,
                })
            );
            if (res.code != 200) {
                return this.$message.error("fail to delete");
            }
            this.updatePerm();
            this.$message.success("successfully delete");
            this.getPermList();
            this.getPermData();
        },
        // 添加还有修改的一个User的一个方法z
        async addPerm() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return;
                if (this.addForm.parentId instanceof Array) {
                    //如果进行了改变进行下面的书写
                    this.addForm.parentId = this.addForm.parentId[
                        this.addForm.parentId.length - 1
                    ];
                }
                const { data: res } = await this.$http.post(
                    "/permission/add",
                    Qs.stringify(this.addForm)
                );
                if (res.code != 200) {
                    this.$message.error("operation failure");
                }
                this.updatePerm();
                this.$message.success("operate successfully");
                this.addDialogVisible = false;
                this.getPermList();
                this.getPermData();
            });
        },
    },
};
</script>

<style  lang="less" scoped>
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
