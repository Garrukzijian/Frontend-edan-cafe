<!-- 日志管理系统 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >Home</el-breadcrumb-item
            >
            <el-breadcrumb-item :to="{ path: '/log' }"
                >Log Management</el-breadcrumb-item
            >
        </el-breadcrumb>
        <el-card>
                <!-- 用户列表 border边框 stripe就是随行变色-->
            <el-table :data="logLists" border stripe>
                <el-table-column label="Name" prop="realname"></el-table-column>
                <el-table-column label="Username" prop="loginname"></el-table-column>
                <el-table-column label="Operation" prop="operation"></el-table-column>
                <el-table-column label="Method" prop="method"></el-table-column>
                <el-table-column label="Arams" prop="params"></el-table-column>
                <el-table-column label="Ip" prop="ip"></el-table-column>
                <el-table-column label="Createdate" prop="createdate"></el-table-column>
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
    </div>
</template>

<script>
import Qs from "qs";
export default {
    name: "LogManage",
    data() {
        return {
            logLists:[],
            queryInfo: {
                pageNum: 1, //当前页
                pageSize: 5, //每页最大数
            },
            total: 0, //总的记录数
        };
    },
    created() {
        //获取到这个日志
        this.getLogList();
    },
    methods:{
                //获取所有的数据然后开始之后的操作
        async getLogList() {
            let json1 = {
                page: this.queryInfo.pageNum,
                limit: this.queryInfo.pageSize,
            };
            const { data: res } = await this.$http.post(
                "/log/page",
                Qs.stringify(json1)
            );
            this.logLists = res.data.list;
            this.total = res.data.total;
        },
                // 更新这个下面的分页条的作用，然后可以在这个地方进行使用。
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getLogList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage;
            this.getLogList();
        },
    }
};
</script>

<style  scoped>
</style>
