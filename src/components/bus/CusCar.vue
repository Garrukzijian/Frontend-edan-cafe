<!-- 展示这个admin的一个list的一个属性,在这个地方 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/car' }">Pre Order</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 搜索区域 -->
            <el-row>
                <el-col :span="6">
                    <el-input placeholder="Enter English Name" v-model="queryInfo.menuEngname" clearable
                        @clear="getDataList">
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button icon="el-icon-search" @click="getDataList"></el-button>
                </el-col>
                <el-col :span="6">
                    <el-tag type="danger">Total Price：{{ totalPrice }}</el-tag>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="handlePay">Apply</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表 border边框 stripe就是随行变色-->
            <el-table :data="dataLists" border stripe @selection-change="handleSelectionChange">
                <el-table-column label="Edan café" align="center">
                    <el-table-column label="Order Cart" align="center">
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column type="index" label="Index"></el-table-column>
                        <el-table-column label="Customer ID" prop="custId"></el-table-column>
                        <el-table-column label="Menu ID" prop="menuId"></el-table-column>

                        <el-table-column label="Name" prop="custName"></el-table-column>
                        <el-table-column label="Surname" prop="custSurname"></el-table-column>
                        <el-table-column label="Chinese Name" prop="menuChiname"></el-table-column>
                        <el-table-column label="English Name" prop="menuEngname"></el-table-column>
                        <el-table-column label="Description" prop="description">
                        </el-table-column>

                        <el-table-column label="Picture" prop="picture">
                            <template slot-scope="scope">
                                <el-button type="text" @click="openViwerButton(scope.row.picture)">view the
                                    image</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="Price(฿)" prop="price"></el-table-column>
                        <el-table-column label="Quantity" prop="num"></el-table-column>
                        <el-table-column label="Total(฿)" prop="total"></el-table-column>
                        <el-table-column label="CreateTime" prop="createTime"></el-table-column>

                        <el-table-column label="Operation" width="200px">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="deleteData(scope.row.id)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="Payment" :visible="addDialogVisible" width="30%" @close="addDialogClosed">
            <el-row style="text-align: center">
                <el-col :span="6">
                    <el-radio v-model="radio" :label="false"> Cash</el-radio>
                </el-col>
                <el-col :span="6">
                    <el-radio v-model="radio" :label="true">QR code</el-radio>
                </el-col>
            </el-row>
            <el-row v-if="radio" style="text-align: center">
                <img style="width: 150px; height: 150px; display: inline-block" src="../../assets/img/code.png" />
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button @click="noPay">Cancel</el-button>
                <el-button type="primary" @click="pay">Ok</el-button>
            </span>
        </el-dialog>

        <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="imgUrlList" />
        <JsonExcel v-show="false" :data="multipleSelection" :fields="json_fields" name="data.xls" id="excel"
            :header="['Edan café', 'customer pre order report']">
        </JsonExcel>
    </div>
</template>

<script>
import Qs from "qs";
import { mapMutations, mapGetters } from "vuex";
import JsonExcel from "vue-json-excel"; // 引入vue-json-excel
import * as type from "../../store/mutation-types";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
    name: "UserList",
    components: {
        ElImageViewer,
        JsonExcel,
    },
    data() {
        return {
            //查询信息的一个数
            queryInfo: {
                menuEngname: "", //查询信息
                pageNum: 1, //当前页
                pageSize: 1000, //每页最大数
            },

            dataLists: [], //用户列表
            total: 0, //总的记录数

            showViewer: false,
            imgUrlList: [],
            multipleSelection: [],
            totalPrice: "0.00",
            discount: 0,
            addDialogVisible: false,
            radio: false,
            json_fields: {
                CustomerID: "custId",
                MenuID: "menuId",
                Name: "custName",
                Surname: "custSurname",
                ChineseName: "menuChiname",
                EnglishName: "menuEngname",
                Description: "description",
                'Quantity': "num",
                'Price(฿)': "price",
                'Total(฿)': "total",
                'Discount%': "discount",
                'GrandTotal':"grandTotal",
                CreateTime: "createTime",
            },
        };
    },
    created() {
        //刚开始的地方进行使用的，然后就可以得到这个数据
        this.getDataList();
    },
    computed: {
        ...mapGetters([
            //把 `this.getEditProduct` 映射为 `this.$store.getters.getEditProduct`
            "getCurUser",
        ]),
    },
    methods: {
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
                menuName: this.queryInfo.menuEngname,
                name: this.getCurUser.sysUser.loginName,
            };
            const { data: res } = await this.$http.post(
                "/data/car/page",
                Qs.stringify(json1)
            );
            this.dataLists = res.data.list;
            this.dataLists.forEach((item) => {
                item.price = item.price.toFixed(2);
                item.total = item.total.toFixed(2);
            });

            this.total = res.data.total;
        },

        handlePay() {
            if (this.multipleSelection.length == 0) {
                this.$message.success("Please select need to settlement of the project");
                return;
            }
            this.$message.success("Add the purchase order to the kitchen");
            this.$prompt("Please  enter the discount percentage", "Discount", {
                confirmButtonText: "Ok",
                cancelButtonText: "Cancel",
                inputPattern: /^^([1-9][0-9]?|100|0)$/,
                inputErrorMessage: "Input format error",
            })
                .then(({ value }) => {
                    this.discount = value;
                    this.addDialogVisible = true;
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "Cancel the payment, and will the kitchen of the purchase order cancelled",
                    });
                });
        },

        addDialogClosed() {
            this.addDialogVisible = false;
        },

        noPay() {
            this.$message({
                type: "info",
                message: "Cancel the payment, and will the kitchen of the purchase order cancelled",
            });
            this.addDialogVisible = false;
        },

        async pay() {
            //获取到custId
            let custId = this.multipleSelection[0].custId;
            let menuList = this.multipleSelection.map((item) => item.menuId);
            let num = this.multipleSelection.map((item) => item.num);

            let json1 = {
                custId,
                menuList,
                num,
                discount: this.discount,
                totalPrice: this.totalPrice,
            };
            const { data: res } = await this.$http.post(
                "/data/car/pay",
                Qs.stringify(json1, { arrayFormat: "repeat" })
            );

            console.log(res);
            if (res.code != 200) {
                return this.$message.error("payment failure");
            }
            this.multipleSelection.forEach(item=>{
                item.grandTotal = item.total*(100-this.discount)/100
                item.discount = this.discount
            })
            this.$message.success("payment success");
            document.getElementById("excel").click();

            this.multipleSelection = [];
            this.addDialogVisible = false;
            this.discount = 0;
            this.totalPrice = 0;
            this.getDataList();
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
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val);
            this.totalPrice = this.multipleSelection.reduce(
                (accumulator, currentValue) => {
                    return accumulator + Number(currentValue.total);
                }
                ,
                0
            ).toFixed(2);
        },

        //删除操作
        async deleteData(id) {
            const confirm = await this.$confirm(
                "The current operation will delete the current order directly, whether delete！",
                "Discount",
                {
                    confirmButtonText: "Ok",
                    cancelButtonText: "Cancel",
                    type: "warning",
                }
            ).catch((err) => err);

            if (confirm != "confirm") {
                return this.$message.info("undelete");
            }

            const { data: res } = await this.$http.post(
                "data/car/delete",
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
