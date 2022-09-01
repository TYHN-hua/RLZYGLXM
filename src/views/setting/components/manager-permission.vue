<template>
  <el-dialog
    title="分配权限"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-tree
      ref="permTree"
      :data="permData"
      show-checkbox
      :props="defaultProps"
      :default-checked-keys="selectedKeys"
      :default-expand-all="true"
      :check-strictly="true"
      node-key="id"
    />
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="sureAdd">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils/index'
import { assignPerm, getRoleDetail } from '@/api/setting'
export default {
  name: 'HrsaasManagerPermission',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permData: [
        // 测试数据
        // {
        //   code: 'employees',
        //   description: '用户管理菜单',
        //   enVisible: '1',
        //   id: '604f7df5f900be1850edb152',
        //   name: '员工管理',
        //   pid: '0',
        //   type: 1,
        //   children: [
        //     {
        //       code: '214234',
        //       description: '412214',
        //       enVisible: '0',
        //       id: '62f0d56637ecc10a881557f5',
        //       name: '智商250',
        //       pid: '604f7df5f900be1850edb152',
        //       type: 2
        //     }
        //   ]
        // }
      ],
      defaultProps: {
        label: 'name'
      },
      selectedKeys: [],
      userId: '',
      loading: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.selectedKeys = []
    },
    async getPermissionList(id) {
      this.userId = id
      try {
        const res = await getPermissionList()
        this.permData = tranListToTreeData(res, '0')
        const { permIds } = await getRoleDetail(id)
        // this.selectedKeys = ['630feb4937ecc10a888b2b63']
        this.selectedKeys = permIds
        console.log(this.permData)
      } catch (error) {
        console.log(error)
      }
    },
    async sureAdd() {
      try {
        this.loading = true
        const res = this.$refs.permTree.getCheckedKeys()
        await assignPerm({ permIds: res, id: this.userId })
        this.$message.success('角色权限分配成功')
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
