<template>
  <el-dialog title="新增员工" :visible="visibleDialog" :before-close="handleClose">
    <!-- 表单 -->
    <el-form ref="addEmployeeDialog" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
          @node-click="handleNodeClick"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button type="primary" size="small" @click="submitEmploy">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    visibleDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: [], // 定义数组接收树形数据
      defaultProps: {
        label: 'name'
      },
      showTree: false, // 控制树形的显示或者隐藏
      loading: false,
      hireType: EmployeeEnum.hireType,
      loadingBtn: false,
      // 表单校验
      // 用户名必填，username，长度为1-4位
      // 手机号必填，mobile，需满足 正则表达式 /^1[3-9]\d{9}$/
      // 聘用形式必填， formOfEmployment
      // 工号必填，workNumber
      // 部门必填，departmentName
      // 入职时间必填， timeOfEntry
      // 转正时间可选，correctionTime
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visibleDialog', false)
      this.$refs.addEmployeeDialog.resetFields() // 对整个表单结果进行校验
      this.showTree = false
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
    },
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    handleNodeClick(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async submitEmploy() {
      try {
        await this.$refs.addEmployeeDialog.validate() // 判断验证是否通过
        // 调用新增接口
        this.loadingBtn = true
        await addEmployee(this.formData)
        this.$message.success('新增员工成功')
        this.$emit('refresh')
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingBtn = false
      }
    }
  }
}
</script>

<style></style>
