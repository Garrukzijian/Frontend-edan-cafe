<!-- 展示这个admin的一个list的一个属性,在这个地方 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >Home</el-breadcrumb-item
            >
            <el-breadcrumb-item :to="{ path: '/top' }"
                >Sale Report</el-breadcrumb-item
            >
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col :span="5">
                    <el-date-picker
                        v-model="queryInfo.value1"
                        type="daterange"
                        range-separator="to"
                        start-placeholder="Start Date"
                        end-placeholder="End Date"
                        clearable
                    >
                    </el-date-picker>
                </el-col>
                <el-col :span="3">
                    <el-input
                        placeholder="Enter Chinese Name"
                        v-model="queryInfo.menuChiname"
                        clearable
                    >
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-input
                        placeholder="Enter English Name"
                        v-model="queryInfo.menuEngname"
                        clearable
                    >
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button @click="getDataList">Add</el-button>
                    <el-button @click="clearData">Clear</el-button>
                </el-col>
                <el-col :span="6">
                    <JsonExcel
                        class="el-button el-button--primary"
                        name="data.xls"
                        :data="dataLists"
                        :header="['Edan café', 'Sale report']"
                        :fields="json_fields"
                    >
                        Export File
                    </JsonExcel>
                </el-col>
            </el-row>

            <!-- 用户列表 border边框 stripe就是随行变色-->
            <el-table
                :data="dataLists"
                border
                stripe
                show-summary
                :summary-method="getSummaries"
                :header-cell-style="{  fontWeight: 'bolder',fontSize:'18px' }"
            >
                <el-table-column label="Edan café" align="center">
                    <el-table-column label="Sale report" align="center">
                        <el-table-column type="index" width="150"></el-table-column>
                        <el-table-column
                            label="StartTime"
                            prop="startTime"
                        ></el-table-column>
                        <el-table-column
                            label="EndTime"
                            prop="endTime"
                        ></el-table-column>
                        <el-table-column
                            label="TotalPrice"
                            prop="totalPrice"
                        ></el-table-column>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import Qs from "qs";
import JsonExcel from "vue-json-excel"; // 引入vue-json-excel
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
    name: "MenuTop",
    components: {
        ElImageViewer,
        JsonExcel,
    },
    data() {
        return {
            dataLists: [], //用户列表
            total: 0, //总的记录数
            showViewer: false,
            imgUrlList: [],
            json_fields: {
                startTime: "startTime",
                endTime: "endTime",
                totalPrice: "totalPrice",
            },
            queryInfo: {
                menuEngname: "",
                menuChiname: "",
                value1: [],
                pageNum: 1, //当前页
                pageSize: 1000, //每页最大数
            },
        };
    },
    created() {
        //刚开始的地方进行使用的，然后就可以得到这个数据
        // this.getDataList();
    },

    methods: {
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = "Total";
                    return;
                }
                const values = data.map((item) =>
                    Number(item[column.property])
                );
                if (index === 3 || index === 5) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index] = sums[index].toFixed(2);
                } else {
                    sums[index] = "";
                }
            });

            return sums;
        },
        closeViewer() {
            this.showViewer = false;
        },

        openViwerButton(url) {
            this.imgUrlList = [url];
            this.showViewer = true;
        },

        clearData() {
            this.dataLists = [];
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

        async getDataList() {
            let json1;
            if (this.queryInfo.value1.length == 0) {
                return this.$message.error("Please enter the time to confirm!"); //信息的提示
            } else {
                json1 = {
                    menuEngname: this.queryInfo.menuEngname,
                    menuChiname: this.queryInfo.menuChiname,
                    startTime: this.formatDate(this.queryInfo.value1[0]),
                    endTime: this.formatDate(this.queryInfo.value1[1]),
                };
            }
            const { data: res } = await this.$http.post(
                "/data/car/orderTotalList",
                Qs.stringify(json1)
            );
            this.dataLists.push({
                startTime: this.formatDate(this.queryInfo.value1[0]),
                endTime: this.formatDate(this.queryInfo.value1[1]),
                totalPrice: res.data ? res.data.toFixed(2) : 0,
            });
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
