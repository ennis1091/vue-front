<template>
  <div class="edit">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
            <div>修改登录密码，不填不修改</div>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="ruleForm.status" placeholder="状态">
              <el-option label="启用" value="Y"></el-option>
              <el-option label="停用" value="N"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <el-form-item label="手机号" prop="mobilePhone">
            <el-input v-model.number="ruleForm.mobilePhone" maxlength="11" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="角色选择" prop="roleIdList" v-if="userList.length">
				<el-checkbox-group v-model="ruleForm.roleIdList">
					<el-checkbox :label="item.id" name="roleIdList" v-for="(item,index) in userList">{{ item.name }}</el-checkbox>
				</el-checkbox-group>
      </el-form-item>-->

      <el-row>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <el-form-item>
            <el-button @click="closed">关闭页面</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    editList: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value.toString().length < 11) {
            callback(new Error('请输入11位手机号'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var checkuserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        id: '',
        password: '',
        name: '',
        mobilePhone: '',
        status: 'Y'
        // roleIdList: []
      },
      rules: {
        name: [
          {
            validator: checkuserName,
            trigger: 'blur'
          }
        ],
        mobilePhone: [
          {
            validator: checkPhone,
            trigger: 'blur'
          }
        ]
        // roleIdList: [{
        // 	type: 'array',
        // 	required: true,
        // 	message: '请至少选择一个用户角色',
        // 	trigger: 'change'
        // }],
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const res = await this.$api.editSave(this.ruleForm)
            if (res.errorCode == 1) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.closed()
              this.$emit('editReflsh')
            }
          } catch (error) {
            this.$message.error(error)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    closed() {
      this.$emit('editClosed')
    }
  },
  watch: {
    editList: {
      handler(newVal, oldVal) {
        this.ruleForm.id = newVal.id
        this.ruleForm.name = newVal.name
        this.ruleForm.mobilePhone = parseInt(newVal.mobilePhone)
        this.ruleForm.status = newVal.status
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.edit {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #f0f2f5;
  z-index: 3;
}
</style>
