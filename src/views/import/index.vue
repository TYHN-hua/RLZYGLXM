<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  computed: {
    type() {
      return this.$route.query.type
    }
  },
  methods: {
    async success({ results }) {
      // 如果是导入员工
      if (this.type === 'user') {
        const userRelations = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber'
        }
        //  [
        //   {
        //     入职日期: 43678,
        //     姓名: '高大山',
        //     工号: 20089,
        //     手机号: 13041131879,
        //     转正日期: 43678
        //   }
        //
        // 转换
        //  [
        //   {
        //     timeOfEntry: 43678,
        //     username: '高大山',
        //     workNumber: 20089,
        //     mobile: 13041131879,
        //     correctionTime: 43678
        //   }
        //  ]
        //
        // 另一种写法const arr = result.map(ele => {})
        const arr = []
        results.forEach(ele => {
          const user = {}
          Object.keys(ele).forEach(key => {
            if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
              user[userRelations[key]] = this.formatDate(ele[key], '/')
              return
            }
            user[userRelations[key]] = ele[key]
          })
          arr.push(user)
        })
        console.log(arr)
        await importEmployee(arr)
        this.$message.success('批量导入员工成功')
      }
      // 回到上一个页面
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
