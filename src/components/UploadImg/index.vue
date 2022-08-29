<template>
  <div>
    <el-upload
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      action="#"
      :file-list="fileList"
      list-type="picture-card"
      :on-change="change"
      :http-request="Request"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :limit="limit"
      :class="`${fileList.length === limit ? 'hideCard' : ''}`"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 预览弹出层 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewImgDialogVisible"
    >
      <img style="width: 100%" :src="imgUrl">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDXw865pKafXRHuOefRyHMFxYx73kCPN7d',
  SecretKey: 'KPGrDNHxRhiU1JNBk38yZv3wb1C8pIXY'
})
export default {
  name: 'UploadImg',
  props: {
    limit: {
      type: Number,
      default: 1
    },
    // eslint-disable-next-line
    beforeUploadCheck: Function
  },
  data() {
    return {
      fileList: [
        { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      previewImgDialogVisible: false,
      imgUrl: '',
      loading: false
    }
  },
  methods: {
    // 文件状态发生变化
    change(file, fileList) {
      console.log(file)
      console.log(fileList)
      console.log(this.fileList)
      this.fileList = fileList
    },
    // 自定义请求
    Request(data) {
      // console.log('===')
      this.loading = true
      cos.putObject({
        Bucket: 'hxm-rzxm-1313544738', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: data.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: data.file, // 上传文件对象
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        this.loading = false
        console.log(err || data)
        if (!err && data.statusCode === 200) {
          this.$emit('onSuccess', {
            url: 'https:' + data.Location
          })
        }
      })
    },
    // 移除文件列表文件
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    onPreview(file) {
      this.previewImgDialogVisible = true
      this.imgUrl = file.url
    },
    // 文件上传前调用，返回一个布尔值，true上传成功
    // 要开始做文件上传的检查了
    beforeUpload(file) {
      if (this.beforeUploadCheck && !this.beforeUploadCheck(file)) {
        return false
      }
      // 一般分两种情况
      // 自定义 完全 ==》所有的逻辑取决于 自定义， 自定义和默认是相互排斥的
      // if (this.beforeUploadCheck) {
      //   return this.beforeUploadCheck(file)
      // }
      // 自定义 完全 ==》所有的逻辑取决于 先自定义 再默认， 自定义和默认是不相互排斥的

      // if (this.beforeUploadCheck && !this.beforeUploadCheck(file)) {
      //   return false
      // }

      // 处理文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/svg+xml']
      if (!types.includes(file.type)) {
        this.$message.error(`请选择一下${types.join(',')}图片格式`)
        return false
      }
      // 检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大5MB')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss">
.hideCard {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
