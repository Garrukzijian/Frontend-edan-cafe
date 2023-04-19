<!-- 展示这个admin的一个list的一个属性,在这个地方 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >Home</el-breadcrumb-item
            >
            <el-breadcrumb-item :to="{ path: '/cus' }"
                >Customer Information Subsystem</el-breadcrumb-item
            >
        </el-breadcrumb>

        <el-card>
            <!-- 搜索区域 -->
            <el-row>
                <el-col :span="6">
                    <el-input
                        placeholder="Enter Name"
                        v-model="queryInfo.custName"
                        clearable
                        @clear="getDataList"
                    >
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-input
                        placeholder="Enter Surname"
                        v-model="queryInfo.custSurName"
                        clearable
                        @clear="getDataList"
                    >
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button
                        icon="el-icon-search"
                        @click="getDataList"
                    ></el-button>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="addDialogVisible = true"
                        >Add Customer</el-button
                    >
                </el-col>
            </el-row>

            <!-- 用户列表 border边框 stripe就是随行变色-->
            <el-table :data="dataLists" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    label="Customer ID"
                    prop="custId"
                ></el-table-column>
                <el-table-column label="Name" prop="custName"></el-table-column>
                <el-table-column
                    label="Surname"
                    prop="custSurname"
                ></el-table-column>
                <el-table-column label="Phone" prop="custPhone">
                </el-table-column>
                <el-table-column
                    label="Email"
                    prop="custEmail"
                ></el-table-column>

                <el-table-column
                    label="Country"
                    prop="custCountry"
                ></el-table-column>
                <el-table-column label="City" prop="custCity"></el-table-column>
                <el-table-column
                    label="Distirct"
                    prop="custDistirct"
                ></el-table-column>
                <el-table-column
                    label="Address"
                    prop="custAddress"
                ></el-table-column>
                <el-table-column
                    label="Zipcode"
                    prop="custZipcode"
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
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteData(scope.row.custId)"
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

        <!-- 修改用户信息的对话框 -->
        <el-dialog
            title="change information"
            :visible="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <el-form
                :model="editForm"
                :rules="editFormRules"
                ref="editFormRef"
                label-width="100px"
            >
                <el-form-item label="Name" prop="custName">
                    <el-input v-model="editForm.custName"></el-input>
                </el-form-item>
                <el-form-item label="Surname" prop="custSurname">
                    <el-input v-model="editForm.custSurname"></el-input>
                </el-form-item>
                <el-form-item label="Phone" prop="custPhone">
                    <el-input v-model="editForm.custPhone"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="custEmail">
                    <el-input v-model="editForm.custEmail"></el-input>
                </el-form-item>
                <el-form-item label="Country" prop="custCountry">
                    <el-input v-model="editForm.custCountry"></el-input>
                </el-form-item>
                <el-form-item label="City" prop="custCity">
                    <el-input v-model="editForm.custCity"></el-input>
                </el-form-item>
                <el-form-item label="Distirct" prop="custDistirct">
                    <el-input v-model="editForm.custDistirct"></el-input>
                </el-form-item>
                <el-form-item label="Address" prop="custAddress">
                    <el-input v-model="editForm.custAddress"></el-input>
                </el-form-item>
                <el-form-item label="Zipcode" prop="custZipcode">
                    <el-input v-model="editForm.custZipcode"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">cancel</el-button>
                <el-button type="primary" @click="editDataInfo">ok</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户信息的对话框 -->
        <el-dialog
            title="Add"
            :visible="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
            <el-form
                :model="addForm"
                :rules="editFormRules"
                ref="addFormRef"
                label-width="100px"
            >
                <el-form-item label="Name" prop="custName">
                    <el-input v-model="addForm.custName"></el-input>
                </el-form-item>
                <el-form-item label="Surname" prop="custSurname">
                    <el-input v-model="addForm.custSurname"></el-input>
                </el-form-item>
                <el-form-item label="Phone" prop="custPhone">
                    <el-input v-model="addForm.custPhone"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="custEmail">
                    <el-input v-model="addForm.custEmail"></el-input>
                </el-form-item>
                <el-form-item label="Country" prop="custCountry">
                    <el-input v-model="addForm.custCountry"></el-input>
                </el-form-item>
                <el-form-item label="Country" prop="custCity">
                    <el-input v-model="addForm.custCity"></el-input>
                </el-form-item>
                <el-form-item label="Distirct" prop="custDistirct">
                    <el-input v-model="addForm.custDistirct"></el-input>
                </el-form-item>
                <el-form-item label="Address" prop="custAddress">
                    <el-input v-model="addForm.custAddress"></el-input>
                </el-form-item>
                <el-form-item label="Zipcode" prop="custZipcode">
                    <el-input v-model="addForm.custZipcode"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">cancel</el-button>
                <el-button type="primary" @click="addmenu">ok</el-button>
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
import { mapMutations, mapGetters } from "vuex";
import * as type from "../../store/mutation-types";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
    name: "UserList",
    components: {
        ElImageViewer,
    },
    data() {
        return {
            //查询信息的一个数
            queryInfo: {
                custName: "", //查询信息
                custSurName: "", //查询信息
                pageNum: 1, //当前页
                pageSize: 5, //每页最大数
            },

            dataLists: [], //用户列表
            total: 0, //总的记录数

            editForm: {
                menuId: 0,
                custName: "",
                custSurname: "",
                custPhone: "",
                custEmail: "",
                custCountry: "",
                custCity: "",
                custDistirct: "",
                custAddress: "",
                custZipcode: "",
            },
            addForm: {
                custName: "",
                custSurname: "",
                custPhone: "",
                custEmail: "",
                custCountry: "",
                custCity: "",
                custDistirct: "",
                custAddress: "",
                custZipcode: "",
            },
            editDialogVisible: false,
            addDialogVisible: false,
            showViewer: false,
            imgUrlList: [],
            editFormRules: {
                custName: [
                    {
                        required: true,
                        message: "Please enter a custName",
                        trigger: "blur",
                    },
                ],
                custSurname: [
                    {
                        required: true,
                        message: "Please enter a custSurname",
                        trigger: "blur",
                    },
                ],
                custPhone: [
                    {
                        required: true,
                        message: "Please enter a custPhone",
                        trigger: "blur",
                    },
                ],
                custEmail: [
                    {
                        required: true,
                        message: "Please enter a custEmail",
                        trigger: "blur",
                    },
                ],
                custCountry: [
                    {
                        required: true,
                        message: "Please enter a custCountry",
                        trigger: "blur",
                    },
                ],
                custCity: [
                    {
                        required: true,
                        message: "Please enter a custCity",
                        trigger: "blur",
                    },
                ],
                custDistirct: [
                    {
                        required: true,
                        message: "Please enter a custDistirct",
                        trigger: "blur",
                    },
                ],
                custAddress: [
                    {
                        required: true,
                        message: "Please enter a custAddress",
                        trigger: "blur",
                    },
                ],
                custZipcode: [
                    {
                        required: true,
                        message: "Please enter a custZipcode",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        //刚开始的地方进行使用的，然后就可以得到这个数据
        this.getDataList();
    },
    computed: {
        ...mapGetters(["getToken"]),
    },
    methods: {
        handleAvatarSuccess(res, file, tag) {
            this.imageUrl = URL.createObjectURL(file.raw);
            if (res.code == 200) {
                this.$message.success("Modified face success!"); //信息的提示
                if (tag) {
                    this.addForm.picture = res.data;
                } else {
                    this.editForm.picture = res.data;
                }
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

        closeViewer() {
            this.showViewer = false;
        },

        openViwerButton(url) {
            this.imgUrlList = [url];
            this.showViewer = true;
        },

        //获取所有的数据然后开始之后的操作
        async getDataList() {
            let json1 = {
                page: this.queryInfo.pageNum,
                limit: this.queryInfo.pageSize,
                custName: this.queryInfo.custName,
                custSurName: this.queryInfo.custSurName,
            };
            const { data: res } = await this.$http.post(
                "/data/cus/page",
                Qs.stringify(json1)
            );
            this.dataLists = res.data.records;
            this.total = res.data.total;
        },

        // 更新这个下面的分页条的作用，然后可以在这个地方进行使用。
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getDataList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage;
            this.getDataList();
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

        addDialogClosed() {
            this.addDialogVisible = false;
        },
        async editDataInfo() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return; //现在是验证成功了！！！
                const { data: res } = await this.$http.post(
                    "/data/cus/update",
                    Qs.stringify(this.editForm)
                );
                if (res.code != 200) {
                    return this.$message.error("UPDATE FAILED");
                }
                this.$message.success("update successfully");
                this.editDialogVisible = false;
                this.getDataList();
            });
        },

        async addmenu() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.post(
                    "/data/cus/add",
                    Qs.stringify(this.addForm)
                );
                if (res.code != 200) {
                    this.$message.error("operation failure");
                }
                this.$message.success("operate successfully");
                this.addDialogVisible = false;
                this.$refs.addFormRef.resetFields();
                this.getDataList();
            });
        },

        //删除操作
        async deleteData(id) {
            const confirm = await this.$confirm(
                "The current operation to remove food data directly, whether delete to continue",
                "hit",
                {
                    confirmButtonText: "ok",
                    cancelButtonText: "cancel",
                    type: "warning",
                }
            ).catch((err) => err);

            if (confirm != "confirm") {
                return this.$message.info("undelete");
            }

            const { data: res } = await this.$http.post(
                "data/cus/delete",
                Qs.stringify({
                    id,
                })
            );
            if (res.code != 200) {
                return this.$message.error("fail to delete");
            }
            this.$message.success("successfully delete");
            this.getDataList();
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
</style>
