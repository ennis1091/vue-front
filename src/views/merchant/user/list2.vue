<template>
  <div>
    <div class="list">
      <el-form ref="form" :inline="true" :model="form" label-width="80px">
        <el-form-item label="用户名称">
          <el-input v-model="pageParams.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="pageParams.mobilePhone" maxlength="11" show-word-limit></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="seach">查询</el-button>
          <el-button @click="openAdd">新增</el-button>
          <el-button @click="deleteAll">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="name" label="用户名称"></el-table-column>
      <el-table-column prop="mobilePhone" label="手机号"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column prop="updateDate" label="修改时间"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
          <el-button type="text" size="small" @click="deleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.pageNum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="sum"
      ></el-pagination>
      <add v-if="addShow" @closed="off" @reflsh="reflsh" :userList="userList"></add>
      <edit v-if="editShow" :editList="editList" @editClosed="editOff" @editReflsh="getList"></edit>
    </div>
  </div>
</template>

<script>
import { time } from '@/common/js/time.js'
import add from '@/components/add.vue'
import edit from '@/components/edit.vue'
export default {
  mounted() {
    // this.$api.userList().then((res)=>{
    //   console.log(res)
    // })
    this.reflsh()

    // this.$api.edit().then((res) => {
    //   console.log(res)
    // })
  },
  data() {
    return {
      addShow: 0,
      userList: [],
      editShow: 0,
      editList: {},
      records: [],
      flag: true, // 防止element 分页重复触发 开关
      multipleSelection: [],
      currentPage: 4,
      form: {
        name: '',
        phone: ''
      },
      pageParams: {
        pageSize: 2,
        pageNum: 1,
        name: '',
        mobilePhone: ''
      },
      sum: 1
    }
  },
  computed: {
    tableData() {
      if (this.records.length) {
        this.records.map(value => {
          value.createDate = time(value.createDate)
          value.updateDate = time(value.updateDate)
        })
        return this.records
      } else {
        return []
      }
    }
  },
  components: {
    add,
    edit
  },
  methods: {
    async handleClick(row) {
      try {
        const res = await this.$api.edit(row.id)
        if (res.errorCode == 1) {
          this.editList = res.data
          this.editShow = 1
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.flag = false
      this.pageParams.pageSize = val
      this.pageParams.pageNum = 1
      this.getList()
    },
    handleCurrentChange(val) {
      if (this.flag) {
        this.pageParams.pageNum = val
        this.getList()
      }
    },
    seach() {
      this.reflsh()
    },
    deleteAll() {
      if (this.multipleSelection.length) {
        this.$confirm('删除后数据将无法恢复,确认要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let params = {
              ids: []
            }
            let str = []
            this.multipleSelection.map(value => {
              str.push(value.id)
            })
            let c = str.join(',')
            params.ids = c
            this.delete(params)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message.error('请至少选择一个要删除对象')
      }
    },
    deleteOne(row) {
      this.$confirm('删除后数据将无法恢复,确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: []
          }
          params.ids = row.id
          this.delete(params)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async reflsh() {
      this.pageParams.pageNum = 1
      try {
        const res = await this.$api.pageList(this.pageParams)
        if (res.errorCode == 0) {
          this.records = res.data.records
          this.sum = res.data.total
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    async getList() {
      try {
        const res = await this.$api.pageList(this.pageParams)
        if (res.errorCode == 0) {
          this.records = res.data.records
          this.sum = res.data.total
        }
      } catch (error) {
        this.$message.error(error)
      }
      this.flag = true
    },
    async delete(params) {
      try {
        const res = await this.$api.deleteUser(params)
        if (res.errorCode == 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.reflsh()
        } else {
          this.$message.error('删除失败')
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    async openAdd() {
      try {
        const res = await this.$api.userList()
        if (res.errorCode == 1) {
          this.userList = res.data
          this.addShow = 1
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    off() {
      this.addShow = 0
    },
    editOff() {
      this.editShow = 0
    }
  }
}
</script>
<style lang="scss" scoped>
</style>