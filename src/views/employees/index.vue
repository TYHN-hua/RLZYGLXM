<template>
  <div class="app-container">
    <PageTools>
      <span slot="before">共计{{ total }}条记录</span>
      <template slot="after">
        <el-button size="small" type="warning">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
        <el-button size="small" type="primary" @click="add">新增员工</el-button>
        <add-employee :visible-dialog.sync="visibleDialog" @refresh="getEmployeeList" />
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatterFn" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="scope">
            <!-- scope.row一行的所有数据 -->
            {{ scope.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
          <template slot-scope="{ row }">
            <!-- 根据当前状态来确定 是否打开开关 -->
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          v-if="total>0"
          background=""
          layout="total, prev, pager, next,sizes"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[5,10,15,20]"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee'
export default {
  name: 'Hrsaas1Index',
  components: {
    addEmployee
  },
  data() {
    return {
      page: {
        page: 1,
        size: 10
      },
      list: [],
      total: 0,
      visibleDialog: false,
      loading: false
    }
  },

  mounted() {
    this.getEmployeeList()
  },

  methods: {
    async getEmployeeList() {
      try {
        this.loading = true
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
        if (total !== 0 && rows.length === 0) {
          // 说明没有数据==》1.真没有 2. 假没有
          // 去掉真没有的情况
          // 重新调用接口
          this.page.page = this.page.page - 1
          this.getEmployeeList()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    formatterFn(row, column, cellValue, index) {
      // row每一项，每一行 column当前行的格  cellValue 当前格的值 index当前格的索引号
      const obj = EmployeeEnum.hireType.find(ele => ele.id === cellValue * 1)
      return obj ? obj.value : '非正式'
      // return obj?.value ?? '非正式' ?.如果obj成立,就取obj.value值,??是当表达式为underfind或null时，取的值
    },
    add() {
      this.visibleDialog = true
    },
    async del(id) {
      try {
        await this.$confirm('确定删除吗', '提示', {
          type: 'warning'
        })
        await delEmployee(id)
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang='scss'>

</style>
