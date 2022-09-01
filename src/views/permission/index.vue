<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools :show-before="false">
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addper('0', 1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        border
        :data="perList"
        row-key="id"
        :default-expand-all="true"
      >
        <el-table-column label="序号" type="index" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.type*1 === 1" type="text" icon="el-icon-circle-plus-outline" @click="addper(row.id, 2)">添加</el-button>
            <el-button type="text" icon="el-icon-edit" @click="edit(row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <addPermission ref="addPermission" :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { getPermissionList, delPermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils/index'
import addPermission from './components/add-permission.vue'
export default {
  name: 'Hrsaas1Index',
  components: {
    addPermission
  },
  data() {
    return {
      perList: [],
      loading: false,
      dialogVisible: false
    }
  },

  mounted() {
    this.getPermissionList()
  },

  methods: {
    async getPermissionList() {
      try {
        this.loading = true
        const res = await getPermissionList()
        this.perList = tranListToTreeData(res, '0')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async del(id) {
      try {
        await this.$confirm('确定删除吗？', '提示', {
          typr: 'warning'
        })
        await delPermission(id)
        this.getPermissionList()
      } catch (error) {
        console.log(error)
      }
    },
    addper(pid, type) {
      this.$refs.addPermission.formData.pid = pid
      this.$refs.addPermission.formData.type = type
      this.dialogVisible = true
    },
    edit(row) {
      this.$refs.addPermission.formData = { ...row }
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
