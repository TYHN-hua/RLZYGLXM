<template>
  <div class="departments-container">
    <el-card class="tree-card">
      <treeTools :tree-node="company" :is-root="false" @addDept="addDept" />
    </el-card>
    <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <treeTools slot-scope="{data}" :tree-node="data" @addDept="addDept" />
    </el-tree>
    <addDept :dialog-visible.sync="dialogVisible" :tree-node="currentNode" @refreshDepts="getDepartments" />
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
      dialogVisible: false,
      currentNode: {}
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
      this.company = { name: companyName, manager: companyManage, id: '' }
    },
    addDept(node) {
      this.currentNode = node // 保存当前的节点
      this.dialogVisible = true // 弹窗显示出来
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
