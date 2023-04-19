<!-- 展示这个admin的一个list的一个属性,在这个地方 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/custorder' }">Customer Order Report</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 搜索区域 -->
            <el-row>
                <el-col :span="5">
                    <el-date-picker v-model="queryInfo.value1" @change="getDataList" type="daterange" range-separator="to"
                        start-placeholder="Start Date" end-placeholder="End Date" clearable>
                    </el-date-picker>
                </el-col>
                <el-col :span="3">
                    <el-input placeholder="Enter Chinese Name" v-model="queryInfo.menuChiname" clearable
                        @clear="getDataList">
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-input placeholder="Enter English Name" v-model="queryInfo.menuEngname" clearable
                        @clear="getDataList">
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-input placeholder="Enter Customer Name" v-model="queryInfo.name" clearable @clear="getDataList">
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button icon="el-icon-search" @click="getDataList"></el-button>
                </el-col>
                <el-col :span="4">
                    <JsonExcel class="el-button el-button--primary" :data="dataLists" :fields="json_fields" name="data.xls">
                        Export File
                    </JsonExcel>
                </el-col>
            </el-row>

            <!-- 用户列表 border边框 stripe就是随行变色-->
            <el-table :data="dataLists" border stripe show-summary :summary-method="getSummaries"
                :span-method="objectSpanMethod" :header-cell-style="{ fontWeight: 'bolder', fontSize: '6px' }">
                <el-table-column label="Edan café" align="center">
                    <el-table-column label="customer order report" align="center">
                        <el-table-column label="Order ID" prop="orderId"></el-table-column>
                        <el-table-column label="Customer ID" prop="custId"></el-table-column>
                        <el-table-column label="Name" prop="custName"></el-table-column>
                        <el-table-column label="Total Price" prop="totalPrice"></el-table-column>
                        <el-table-column label="Discount %" prop="discount"></el-table-column>
                        <el-table-column label="Grand Total" prop="grandTotal"></el-table-column>
                        <el-table-column label="Payment Date" prop="parmentDate"></el-table-column>
                        <el-table-column label="Menu ID" prop="menuId"></el-table-column>
                        <el-table-column label="Chinese Name" prop="menuChiname"></el-table-column>
                        <el-table-column label="English Name" prop="menuEngname"></el-table-column>
                        <el-table-column label="Description" prop="description">
                            <template slot-scope="scope">
                                <div style="white-space: normal">{{ scope.column.label }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="Quantity" prop="num"></el-table-column>
                        <el-table-column label="Price(฿)" prop="price"></el-table-column>
                        <el-table-column label="Export" width="200px" prop="orderId">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-right" size="mini"
                                    @click="onClickExportTxt(scope.row.orderId)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
            </el-table>

        </el-card>
    </div>
</template>

<script>
import Qs from "qs";
import { mapGetters } from "vuex";
import axios from "axios";
import JsonExcel from "vue-json-excel"; // 引入vue-json-excel
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
                menuEngname: "",
                menuChiname: "",
                value1: [],
                name: "",
                pageNum: 1, //当前页
                pageSize: 1000, //每页最大数
            },

            dataLists: [], //用户列表
            total: 0, //总的记录数
            needMergeArr: [
                "orderId",
                "custId",
                "custName",
                "totalPrice",
                "discount",
                "grandTotal",
                "parmentDate",
            ],
            rowMergeArrs: [],
            json_fields: {
                OrderID: "orderId",
                CustomerID: "custId",
                Name: "custName",
                TotalPrice: "totalPrice",
                Discount: "discount",
                GrandTotal: "grandTotal",
                MenuID: "menuId",
                ChineseName: "menuChiname",
                EnglishName: "menuEngname",
                Description: "description",
                Quantity: "num",
                Price: "price",
            },
        };
    },
    computed: {
        ...mapGetters([
            //把 `this.getEditProduct` 映射为 `this.$store.getters.getEditProduct`
            "getCurUser",
            "getToken",
        ]),
    },
    created() {
        //刚开始的地方进行使用的，然后就可以得到这个数据
        this.getDataList();
    },

    methods: {
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];

            return sums;
        },
        // txt文件导出
        async onClickExportTxt(orderId) {
            axios({
                method: "GET",
                url: "/data/car/orderTxt?orderId=" + orderId,
                responseType: "blob", // 指定响应类型为二进制流
                headers: {
                    "Content-Type": "application/octet-stream",
                    Authorization: this.getToken,
                },
            })
                .then((response) => {
                    const url = window.URL.createObjectURL(
                        new Blob([response.data])
                    ); // 创建下载链接
                    const link = document.createElement("a"); // 创建a标签
                    link.href = url;
                    link.setAttribute("download", "detail.txt"); // 设置下载文件名
                    document.body.appendChild(link);
                    link.click(); // 触发点击事件进行下载
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        rowMergeHandle(arr, data) {
            if (!Array.isArray(arr) && !arr.length) return false;
            if (!Array.isArray(data) && !data.length) return false;
            let needMerge = {};
            arr.forEach((i, idx) => {
                needMerge[i] = {
                    rowArr: [],
                    rowMergeNum: 0,
                };
                if (idx == 0) {
                    data.forEach((item, index) => {
                        // 表格首个数据单独处理
                        if (index === 0) {
                            needMerge[i].rowArr.push(1);
                            needMerge[i].rowMergeNum = 0;
                        } else {
                            if (item[i] === data[index - 1][i]) {
                                needMerge[i].rowArr[
                                    needMerge[i].rowMergeNum
                                ] += 1;
                                needMerge[i].rowArr.push(0);
                            } else {
                                needMerge[i].rowArr.push(1);
                                needMerge[i].rowMergeNum = index;
                            }
                        }
                    });
                } else {
                    let firstRowArr = needMerge[arr[0]].rowArr;
                    let firstRowArrDeal = [];
                    firstRowArr.forEach((item, index) => {
                        if (item > 0) {
                            firstRowArrDeal.push(index);
                        }
                    });
                    data.forEach((item, index) => {
                        let sign = false;
                        if (firstRowArrDeal.indexOf(index) > 0) {
                            needMerge[i].rowMergeNum = index;
                            sign = true;
                        }
                        // 表格首个数据单独处理
                        if (index === 0) {
                            needMerge[i].rowArr.push(1);
                            needMerge[i].rowMergeNum = 0;
                        } else {
                            if (item[i] === data[index - 1][i]) {
                                if (sign) {
                                    needMerge[i].rowArr.push(1);
                                } else {
                                    needMerge[i].rowArr[
                                        needMerge[i].rowMergeNum
                                    ] += 1;
                                    needMerge[i].rowArr.push(0);
                                }
                            } else {
                                needMerge[i].rowArr.push(1);
                                needMerge[i].rowMergeNum = index;
                            }
                        }
                    });
                }
            });
            return needMerge;
        },

        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            for (let res in this.needMergeArr) {
                if (this.needMergeArr[res] == column.property) {
                    return this.mergeAction(
                        column.property,
                        rowIndex,
                        columnIndex
                    );
                }
            }
        },

        mergeAction(val, rowIndex) {
            let _row = this.rowMergeArrs[val].rowArr[rowIndex];
            let _col = _row > 0 ? 1 : 0;
            return [_row, _col];
        },

        formatDate(date) {
            let year = date.getFullYear();
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            let day = ("0" + date.getDate()).slice(-2);
            let hours = ("0" + date.getHours()).slice(-2);
            let minutes = ("0" + date.getMinutes()).slice(-2);
            let seconds = ("0" + date.getSeconds()).slice(-2);
            let formattedDate =
                year +
                "-" +
                month +
                "-" +
                day +
                " " +
                hours +
                ":" +
                minutes +
                ":" +
                seconds;
            return formattedDate;
        },

        //获取所有的数据然后开始之后的操作
        async getDataList() {
            let json1;
            if (this.queryInfo.value1.length == 0) {
                json1 = {
                    name: this.queryInfo.name,
                    menuEngname: this.queryInfo.menuEngname,
                    menuChiname: this.queryInfo.menuChiname,
                };
            } else {
                json1 = {
                    name: this.queryInfo.name,
                    menuEngname: this.queryInfo.menuEngname,
                    menuChiname: this.queryInfo.menuChiname,
                    startTime: this.formatDate(this.queryInfo.value1[0]),
                    endTime: this.formatDate(this.queryInfo.value1[1]),
                };
            }
            const { data: res } = await this.$http.post(
                "/data/car/orderList",
                Qs.stringify(json1)
            );
            this.dataLists = res.data;
            this.dataLists.forEach((item) => {
                item.discount = item.discount+"%";
                item.totalPrice = item.totalPrice.toFixed(2);
                item.grandTotal = item.grandTotal.toFixed(2);
                item.price = item.price.toFixed(2);

            });
            this.rowMergeArrs = this.rowMergeHandle(
                this.needMergeArr,
                this.dataLists
            );
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

.exportClass {
    border: #111111;
    background-color: brown;
}
</style>
