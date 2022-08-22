<template>
  <el-dialog :title="`${roleForm.id ? '修改' : '新增'}角色`" :visible.sync="dialogVisible" :before-close="handleClose">
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="roleForm"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{required: true, message: '角色必填', trigger: 'blur'}]"
      >
        <el-input v-model="roleForm.name" placeholder="请输入角色" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitRole">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from '@/api/setting'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.roleDialogForm.resetFields()
      // this.roleForm = {
      //   name: '',
      //   description: ''
      // }
    },
    async submitRole() {
      // 标签校验通过的时候，调用表单校验方法validata()
      // validata返回的是一个布尔值
      try {
        await this.$refs.roleDialogForm.validate() // 获取到的是一个promise
        // console.log('===')
        // 新增角色接口
        this.loading = true
        this.roleForm.id ? await updateRole(this.roleForm) : await addRole(this.roleForm)
        // 提示新增成功
        this.$message.success(`角色${this.roleForm.id ? '修改' : '新增'}成功`)
        // this.$emit('refresh') $parent不行可以用$emit
        // 调用父组件里的获取角色列表的方法
        this.$parent.getRoleList()
        // 弹窗关闭
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
