<!--  -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">Home</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple left">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Welcome</span>
            </div>
            <div v-for="o in welcomeTest" :key="o" class="text item">
              {{ o }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light right">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Today event</span>
            
            </div>
            <br>Drinks are 10% off
            <div v-for="o in foucsTest" :key="o" class="text item">
              {{ o }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "WelcomeTest",
  data() {
    return {
      WelcomeTest: [
        ,
      ],
      FoucsTest: [

      ],
    };
  },
};
</script>

<style lang="less"  scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.left .text:nth-child(odd) {
  font-size: 14px;
  color: rgb(209, 168, 32);
}

.right .text{
    font-size: 14px;
    color: red;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
  // 水平居中
  margin:0 auto ;    
}


</style>
