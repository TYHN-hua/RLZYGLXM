<template>
  <!-- 新增部门的弹层 -->
  <el-dialog title="新增部门" :visible.sync="dialogVisible" :before-close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submitDept">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 部门编码 在整个模块中都不允许重复
    // 通过自定义校验函数validator来实现
    // 在编辑部门失去焦点，调用接口拿到最新数据进行校验
    // 拿到你输入的部门编码值，在新数据中进行匹配
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      console.log(depts)
      console.log(value)
      // some只要满足一个条件就返回true
      const isRepeat = depts.some(ele => ele.code === value)
      console.log(isRepeat)
      isRepeat ? callback(new Error(`部门编码${value}已经存在`)) : callback()
    }
    // 部门名称 同级部门中禁止出现重复部门
    // 拿到所有部门的数据
    // 拿到同级部门数据
    // 过滤所有子部门
    // 拿到你输入的值部门名称
    // 判断部门名称是否在同级部门里出现过
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 拿到同级部门的数据
      // 确定了当前部门的ID，这个部门下的子部门的PID就可以拿到（当前部门ID=子部门的PID）
      // console.log(this.treeNode.id)
      const list = depts.filter(ele => this.treeNode.id === ele.pid)
      // console.log(list)
      const isRepeat = list.some(ele => ele.name === value)
      // 第一级部门的pid为"",所以在总的部门里面手动加一个id为空，才能进行一级部门校验
      isRepeat ? callback(new Error(`部门名称${value}在同级部门已经存在`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      // 对表单进行数据绑定和校验
      // 部门名称（name）：必填 1-50个字符 / 同级部门中禁止出现重复部门
      // 部门编码（code）：必填 1-50个字符 / 部门编码在整个模块中都不允许重复
      // 部门负责人（manager）：必填
      // 部门介绍 ( introduce)：必填 1-300个字符
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples: []
    }
  },
  methods: {
    handleClose() {
      // 触发update:dialogVisible去关闭弹窗
      this.$emit('update:dialogVisible', false)
      // 重置表单
      this.$refs.deptForm.resetFields()
      // 复原初始化数据
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      }
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    submitDept() {
      this.$refs.deptForm.validate(async vali => {
        console.log(vali)
        if (vali) {
          // 表单校验通过
          // 新增部门接口
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
          this.$message.success('部门新增成功')
          this.$emit('refreshDepts')
          this.handleClose()
        }
      })
    }
  }
}
</script>

<style>

</style>
