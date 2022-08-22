<template>
  <div class="departments-container">
    <el-card class="tree-card">
      <treeTools :tree-node="company" :is-root="false" />
    </el-card>
    <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <treeTools slot-scope="{data}" :tree-node="data" />
    </el-tree>
    <addDept :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import addDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'Hrsaas1Index',
  components: {
    treeTools,
    addDept
  },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      dialogVisible: false
    }
  },

  mounted() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      const { depts, companyName, companyManage } = await getDepartments()
      // console.log(res)
      this.departs = tranListToTreeData(depts, '')
      this.company = { name: companyName, manager: companyManage }
    }
  }
}
</script>

<style lang="scss">
  .departments-container {
    width: 900px;
    margin: 20px auto;
    .el-tree {
      .el-tree-node__content {
        padding-right: 20px;
      }
    }
  }
</style>
