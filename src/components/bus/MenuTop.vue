<!-- 展示这个admin的一个list的一个属性,在这个地方 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/top' }">Top 10 Customer Order Report</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col :span="6">
                    <JsonExcel class="el-button el-button--primary" name="data.xls" :data="dataLists" :fields="json_fields"
                        :header="['Edan café', 'Top 10 customer order report']">
                        Export File
                    </JsonExcel>
                </el-col>
            </el-row>
            <!-- 用户列表 border边框 stripe就是随行变色-->
            <el-table :data="dataLists" border stripe :header-cell-style="{  fontWeight: 'bolder',fontSize:'18px' }">
                <el-table-column label="Edan café" align="center" >
                    <el-table-column label="Top 10 Customer Order Report" align="center">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="Menu ID" prop="menuId"></el-table-column>
                        <el-table-column label="Chinese Name" prop="menuChiname"></el-table-column>
                        <el-table-column label="English Name" prop="menuEngname"></el-table-column>
                        <el-table-column label="Description" prop="description">
                        </el-table-column>
                        <el-table-column label="Sales(฿)" prop="sumMoney"></el-table-column>

                        <el-table-column label="Picture" prop="picture">
                            <template slot-scope="scope">
                                <el-button type="text" @click="openViwerButton(scope.row.picture)">view the
                                    image</el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </el-card>

        <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="imgUrlList" />
    </div>
</template>

<script>
import Qs from "qs";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import JsonExcel from "vue-json-excel"; // 引入vue-json-excel
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
            json_fields:{
                menuId:"menuId",
                menuChiname:"menuChiname",
                menuEngname:"menuEngname",
                description:"description",
                'sumMoney(฿)':"sumMoney",
            }
        };
    },
    created() {
        //刚开始的地方进行使用的，然后就可以得到这个数据
        this.getDataList();
    },

    methods: {
        closeViewer() {
            this.showViewer = false;
        },

        openViwerButton(url) {
            this.imgUrlList = [url];
            this.showViewer = true;
        },

        async getDataList() {
            const { data: res } = await this.$http.get("/data/car/top10");
            this.dataLists = res.data;
            this.dataLists.forEach((item) => {
                item.sumMoney = item.sumMoney.toFixed(2);
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

.headerClass{
    font-size: 100px !important;
    font-weight: bolder;
}
</style>
