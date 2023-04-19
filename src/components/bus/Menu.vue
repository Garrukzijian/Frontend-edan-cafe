<!-- 展示这个admin的一个list的一个属性,在这个地方 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >Home</el-breadcrumb-item
            >
            <el-breadcrumb-item :to="{ path: '/menu' }"
                >Food Information</el-breadcrumb-item
            >
        </el-breadcrumb>

        <el-card>
            <!-- 搜索区域 -->
            <el-row>
                <el-col :span="6">
                    <el-input
                        placeholder="输入中文名称"
                        v-model="queryInfo.menuChiname"
                        clearable
                        @clear="getDataList"
                    >
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-input
                        placeholder="Enter English Name"
                        v-model="queryInfo.menuEngname"
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
                        >Add Menu</el-button
                    >
                </el-col>
            </el-row>

            <!-- 用户列表 border边框 stripe就是随行变色-->
            <el-table :data="dataLists" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="Menu ID" prop="menuId"></el-table-column>
                <el-table-column
                    label="Chinese Name"
                    prop="menuChiname"
                ></el-table-column>
                <el-table-column
                    label="English Name"
                    prop="menuEngname"
                ></el-table-column>
                <el-table-column label="Description" prop="description">
                </el-table-column>
                <el-table-column label="Price" prop="price"></el-table-column>
                <el-table-column label="Picture" prop="picture">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="openViwerButton(scope.row.picture)"
                            >view the image</el-button
                        >
                    </template>
                </el-table-column>
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
                            @click="deleteData(scope.row.menuId)"
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
                label-width="200px"
            >
                <el-form-item label="Chinese Name" prop="menuChiname">
                    <el-input v-model="editForm.menuChiname"></el-input>
                </el-form-item>
                <el-form-item label="English Name" prop="menuEngname">
                    <el-input v-model="editForm.menuEngname"></el-input>
                </el-form-item>
                <el-form-item label="Description" prop="description">
                    <el-input v-model="editForm.description"></el-input>
                </el-form-item>
                <el-form-item label="Price(฿)" prop="price">
                    <el-input v-model="editForm.price"></el-input>
                </el-form-item>
                <el-form-item label="Picture" prop="picture">
                    <el-upload
                        class="avatar-uploader"
                        action="/api/file/uploadImage"
                        :show-file-list="false"
                        :on-success="
                            (p1, p2) => handleAvatarSuccess(p1, p2, false)
                        "
                        :before-upload="beforeAvatarUpload"
                        :headers="{ Authorization: getToken }"
                    >
                        <img
                            v-if="editForm.picture"
                            :src="editForm.picture"
                            class="avatar"
                        />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="editDataInfo">Sumbit</el-button>
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
                label-width="200px"
            >
                <el-form-item label="Chinese Name" prop="menuChiname">
                    <el-input v-model="addForm.menuChiname"></el-input>
                </el-form-item>
                <el-form-item label="English Name" prop="menuEngname">
                    <el-input v-model="addForm.menuEngname"></el-input>
                </el-form-item>
                <el-form-item label="Description" prop="description">
                    <el-input v-model="addForm.description"></el-input>
                </el-form-item>
                <el-form-item label="Price(฿)" prop="price">
                    <el-input v-model="addForm.price"></el-input>
                </el-form-item>
                <el-form-item label="Picture" prop="picture">
                    <el-upload
                        class="avatar-uploader"
                        action="/api/file/uploadImage"
                        :show-file-list="false"
                        :on-success="
                            (p1, p2) => handleAvatarSuccess(p1, p2, true)
                        "
                        :before-upload="beforeAvatarUpload"
                        :headers="{ Authorization: getToken }"
                    >
                        <img
                            v-if="addForm.picture"
                            :src="addForm.picture"
                            class="avatar"
                        />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addmenu">Sumbit</el-button>
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
                menuChiname: "", //查询信息
                menuEngname: "", //查询信息
                pageNum: 1, //当前页
                pageSize: 5, //每页最大数
            },

            dataLists: [], //用户列表
            total: 0, //总的记录数
            pages: 0,

            editForm: {
                menuId: 0,
                menuChiname: "",
                menuEngname: "",
                description: "",
                price: "",
                picture: "",
            },
            addForm: {
                menuChiname: "",
                menuEngname: "",
                description: "",
                price: "",
                picture: "",
            },
            editDialogVisible: false,
            addDialogVisible: false,
            showViewer: false,
            imgUrlList: [],
            editFormRules: {
                menuChiname: [
                    {
                        required: true,
                        message: "Please enter the name in Chinese",
                        trigger: "blur",
                    },
                ],
                menuEngname: [
                    {
                        required: true,
                        message: "Please enter the English name",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        message: "Please enter a description",
                        trigger: "blur",
                    },
                ],
                price: [
                    {
                        required: true,
                        message: "Please input the price",
                        trigger: "blur",
                    },
                ],
                picture: [
                    {
                        required: true,
                        message: "Please enter the picture",
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
                this.$message.success("To upload pictures!"); //信息的提示
                if (tag) {
                    this.addForm.picture = res.data;
                } else {
                    this.editForm.picture = res.data;
                }
            } else {
                this.$message.success("Upload pictures failed!"); //信息的提示
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error("Upload avatar images can only be jpg format!");
            }
            if (!isLt2M) {
                this.$message.error("Upload avatar picture size no more than 2mb");
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
                menuChiname: this.queryInfo.menuChiname,
                menuEngname: this.queryInfo.menuEngname,
            };
            const { data: res } = await this.$http.post(
                "/data/menu/page",
                Qs.stringify(json1)
            );
            this.dataLists = res.data.records;
            this.total = res.data.total;
            this.dataLists.forEach((item) => {
                item.price = item.price.toFixed(2);

            });
            if (
                this.queryInfo.pageNum > res.data.pages &&
                this.queryInfo.pageNum > 1
            ) {
                this.queryInfo.pageNum--;
                this.getDataList();
            }
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
                    "/data/menu/update",
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
                    "/data/menu/add",
                    Qs.stringify(this.addForm)
                );
                if (res.code != 200) {
                    this.$message.error("operation failure");
                }
                this.$message.success("operate successfully！");
                this.addDialogVisible = false;
                this.$refs.addFormRef.resetFields();
                this.getDataList();
            });
        },

        //删除操作
        async deleteData(id) {
            const confirm = await this.$confirm(
                "The current operation to remove food data directly, whether delete！",
                "hint",
                {
                    confirmButtonText: "Sumbit",
                    cancelButtonText: "Cancel",
                    type: "warning",
                }
            ).catch((err) => err);

            if (confirm != "confirm") {
                return this.$message.info("undelete");
            }

            const { data: res } = await this.$http.post(
                "data/menu/delete",
                Qs.stringify({
                    id,
                })
            );
            if (res.code != 200) {
                return this.$message.error("fail to delete!");
            }
            this.$message.success("successfully delete!");
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
