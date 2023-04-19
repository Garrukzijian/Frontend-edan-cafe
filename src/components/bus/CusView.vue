<!-- 客户展示的数据 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >Home</el-breadcrumb-item
            >
            <el-breadcrumb-item :to="{ path: '/cusview' }"
                >Food Page</el-breadcrumb-item
            >
        </el-breadcrumb>
        <el-row>
            <el-col :span="6">
                <el-input
                    placeholder="Enter Chinese Name"
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
        </el-row>

        <el-row>
            <el-col
                :span="6"
                v-for="(item, index) in dataLists"
                :key="item"
                :offset="index % 3 == 0 ? 0 : 1"
            >
                <el-card :body-style="{ padding: '0px', marginBottom: '20px' }">
                    <img :src="item.picture" class="image" />
                    <div style="padding: 14px">
                        <p class="title">
                            {{ item.menuChiname }}/{{ item.menuEngname }}
                        </p>
                        <div class="desc">{{ item.description }}</div>
                        <div class="bottom clearfix">
                            <div>{{ item.price }}฿</div>
                            <el-button
                                type="text"
                                class="button"
                                @click="toCar(item.menuId)"
                                >Add</el-button
                            >
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[6]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Qs from "qs";
export default {
    name: "CusView",
    data() {
        return {
            //查询信息的一个数
            queryInfo: {
                menuChiname: "", //查询信息
                menuEngname: "", //查询信息
                pageNum: 1, //当前页
                pageSize: 6, //每页最大数
            },

            dataLists: [], //用户列表
            total: 0, //总的记录数
        };
    },
    created() {
        this.getDataList();
    },
    computed: {
        ...mapGetters([
            //把 `this.getEditProduct` 映射为 `this.$store.getters.getEditProduct`
            "getCurUser",
        ]),
    },
    methods: {
        // 更新这个下面的分页条的作用，然后可以在这个地方进行使用。
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getDataList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage;
            this.getDataList();
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
        },
        async toCar(menuId) {
            this.$prompt("Please enter the need to add the number", "hit", {
                confirmButtonText: "Sumbit",
                cancelButtonText: "Cancel",
                inputPattern: /^([1-9]\d|\d)$/,
                inputErrorMessage: "Input format error",
            })
                .then( async ({ value }) => {
                    let json1 = {
                        name: this.getCurUser.sysUser.loginName,
                        menuId,
                        num: value,
                    };
                    const { data: res } = await this.$http.post(
                        "/data/car/add",
                        Qs.stringify(json1)
                    );
                    if (res.code == 200) {
                        this.$message.success("Successfully added"); //信息的提示
                    } else {
                        this.$message.error("Fail to add"); //信息的提示
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "Unadd",
                    });
                });
        },
    },
};
</script>

<style lang="less"  scoped>
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

.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    height: 250px;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}

.title {
    font-size: 16px;
    font-weight: bolder;
}

.desc {
    font-size: 10px;
    width: 100%;
    height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
