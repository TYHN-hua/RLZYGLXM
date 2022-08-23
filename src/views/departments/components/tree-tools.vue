<template>
  <el-row type="flex" justify="space-between" align="middle" style="width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <!-- 点击下拉选项触发回调函数 -->
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCommand(type) {
      // type 来区分点击的下拉选项
      console.log('handleCommand', type)
      // 点击添加子部门，弹出弹框
      if (type === 'add') {
        // 传递当前节点
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('editDept', this.treeNode)
      } else {
        // 删除部门
        // 调用删除接口
        // 二次确认
        this.$confirm('确认删除该部门吗？', '提示', {
          type: 'warning'
        }).then(res => {
          // 点击确认对的时候进入
          // 删除数据
          return delDepartments(this.treeNode.id)
        }).then(res => {
          this.$emit('refreshDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style>

</style>
