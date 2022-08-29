<template>
  <div class="app-container">
    <PageTools>
      <span slot="before">共计{{ total }}条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
        <el-button size="small" type="danger" @click="exportData">导出</el-button>
        <el-button size="small" type="primary" @click="add">新增员工</el-button>
        <add-employee :visible-dialog.sync="visibleDialog" @refresh="getEmployeeList" />
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="头像">
          <template slot-scope="{row}">
            <img
              v-imgerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              alt=""
              style="border-radius: 50%; width: 100px; height: 100px; padding:10px;"
              @click="showErCodeDialog(row.staffPhoto)"
            >
          </template>
        </el-table-column>
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
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
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
    <el-dialog title="头像二维码" :visible.sync="ercodeDialog" custom-class="canvaseq">
      <el-row type="flex" justify="center">
        <canvas id="canvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
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
      loading: false,
      ercodeDialog: false
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
    },
    async exportData() {
    //     //  做操作
    //     // 表头对应关系
    //     const headers = {
    //       '姓名': 'username',
    //       '手机号': 'mobile',
    //       '入职日期': 'timeOfEntry',
    //       '聘用形式': 'formOfEmployment',
    //       '转正日期': 'correctionTime',
    //       '工号': 'workNumber',
    //       '部门': 'departmentName'
    //     }
    //     console.log(this.fromJson(headers, rows))
    //     // 1、获取需要导出的数据
    //     const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
    //     console.log(rows)
    //     Object.keys(headers) //
    //     // const arr1 = rows.map(ele => { //
    //     //   return Object.keys(headers).map(
    //     //     // ['姓名','手机号','入职日期',...]
    //     //     key => { // 是汉字
    //     //       return ele[headers[key]]
    //     //     }
    //     //   )
    //     //   // ele  {  correctionTime: "2019/9/11",mobile: "13041130789",timeOfEntry: "2019/3/11",username: "高小山",workNumber: "20099"}
    //     // })
    //     // console.log(arr1)
    //     fromJson(headers, rows) {
    //       const arr1 = rows.map(ele => { //
    //       return Object.values(headers).map(
    //         // ['姓名','手机号','入职日期',...]
    //         key => { // 是汉字
    //           return ele[key]
    //         }
    //       )
    //       // ele  {  correctionTime: "2019/9/11",mobile: "13041130789",timeOfEntry: "2019/3/11",username: "高小山",workNumber: "20099"}
    //     })
    //     }
    //     return arr1
    //     console.log(arr1)
      //  做操作
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        // 1、获取需要导出的数据
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // 2、调用自己封装的方法进行数据的转化
        const data = this.fromJson(headers, rows)
        // 将后端放回的数据 转换成 到出excel写入的数据
        // [{correctionTime: "2018-11-30", departmentName: "总裁办",formOfEmployment: "1",mobile: "13800000002",timeOfEntry: "2018-11-02",username: "管理员"}]
        // [['张三', '13800000002', '2018-11-02', '1', '2018-11-30', ....]]

        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头数组 -> ['姓名', '手机号', '入职日期', '聘用形式', ....]
          data, // [['13399999', '张三', '2020-2020-2020', '2020', '79119'],[],[],[],[],[],[]]
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
        // 获取所有的数据

        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
      })
    },
    // 该方法负责将数组转化成二维数组
    fromJson(headers, rows) {
      // rows的结构 ->
      // rows: [{username: '234234', mobile: '1398888888', 'workNumber': 123123}, ....]
      // headers的结构 ['姓名', '手机号', '入职日期', ....] -> 配置项里面生效的数据结构
      // rows的预期结果 -> result数组的每一项要和和headers一一对应
      // result -> [['张三', '138888888', '2020-10-01', ...], ['张三', '138888888', '2020-10-01', ...]]
      const result = rows.map(item => {
        // item 为对象 ->
        // 替换成数组即可 ->
        // 数组的结构要和headers对应起来 ->
        return Object.keys(headers).map(key => {
          // key -> 中文的key
          // 预期 -> 返回当前项的值
          // 值在哪？-> item为真实的数据对象 -> 取到正确的值返回即可
          // 返回值的思路
          // 1. 数据里面的key是中文还是英文？ -> 英文
          // 2. headers里面取到中文key对应的英文key
          // 3. 直接去数据对象里面取数据
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
          // 格式化日期 -> 已经定义过过滤器直接使用即可
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
          // 需要引入EmployeeEnum常量进行处理
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
      return result
    },
    async showErCodeDialog(staffPhoto) {
      if (!staffPhoto) return this.$message.error('该用户还未设置头像')
      this.ercodeDialog = true
      await this.$nextTick()
      const dom = document.querySelector('#canvas')
      QrCode.toCanvas(dom, staffPhoto)
    }
  }
}
</script>

<style lang="scss">
.canvaseq .el-dialog__body {
  text-align: center;
}
</style>
