<template>
  <el-dialog
    :title="`${formData.id ? '编辑' : '新增'}权限`"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-form ref="perForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" placeholder="填写权限名称" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" placeholder="填写权限标识" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述" prop="description">
        <el-input v-model="formData.description" placeholder="填写权限描述" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启" prop="enVisible">
        <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button v-loading="loading" size="small" type="primary" @click="sureAdd">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addPermission, updatePermission } from '@/api/permisson'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '权限名称必填' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '权限标识必填' }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.perForm.resetFields()
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
    },
    async sureAdd() {
      try {
        await this.$refs.perForm.validate()
        this.loading = true
        this.formData.id ? await updatePermission(this.formData) : await addPermission(this.formData)
        this.$parent.getPermissionList()
        this.$message.success(`${this.formData.id ? '编辑' : '新增'}权限成功`)
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
