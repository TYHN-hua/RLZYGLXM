<template>
  <el-dialog
    title="分配角色"
    :visible="value"
    :before-close="handleClose"
  >
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'HrsaasAssignRole',
  // v-model 也可以通过 model:{prop: 'checked', event: 'change'} 字段来修改属性和事件
  model: {
    event: 'update'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleIds: [],
      roleList: [],
      loading: false
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getUserDetailById()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update', false)
      this.roleIds = []
    },
    async getRoleList() {
      const { rows } = await getRoleList()
      this.roleList = rows
    },
    async getUserDetailById() {
      const { roleIds } = await getUserDetailById(this.$attrs['user-id'])
      // console.log(res)
      this.roleIds = roleIds || []
    },
    async btnOK() {
      try {
        this.loading = true
        await assignRoles({ id: this.$attrs['user-id'], roleIds: this.roleIds })
        this.$message.success('更新成功')
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
