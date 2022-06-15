<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="角色管理" name="role">
            <el-row>
              <el-button type="primary" size="small" @click="showDialog=true">添加角色</el-button>
            </el-row>
            <el-table :data="roleData" style="width: 100%">
              <el-table-column label="序号" type="index" width="120" align="center" />
              <el-table-column label="角色名称" prop="name" width="240" align="center" />
              <el-table-column label="描述" prop="description" align="center" show-overflow-tooltip />
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRoleData(scope.row.id)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end" style="height: 60px" align="middle">
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="dataNum"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="company">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon :closable="false" />

            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="公司名称">
                <el-input v-model="form.name" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="form.companyAddress" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="form.mailbox" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.remarks" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addRole, deleteRole, getCompanyInfo, getRole, getRoleList, updateRole } from '@/api/setting'

export default {
  data() {
    return {
      activeTab: 'role',
      roleData: [],
      dataNum: 0,
      pageSize: 10,
      currentPage: 1,
      form: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      },
      showDialog: false,
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCompanyData()
  },
  mounted() {
    this.getRoleData()
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    async getRoleData() {
      const data = {
        page: this.currentPage,
        pagesize: this.pageSize
      }
      const res = await getRoleList(data)
      console.log(res)
      this.roleData = res.rows
      this.dataNum = res.total
    },
    changePage(val) {
      this.currentPage = val
      this.getRoleData()
    },
    async getCompanyData() {
      const id = this.$store.getters['companyId']
      const res = await getCompanyInfo(id)
      this.form = res
    },
    async deleteRoleData(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定 才能进入到下方
        const res = await deleteRole(id)
        console.log(res)
        this.getRoleData() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      const res = await getRole(id)
      console.log(res)
      this.showDialog = true
      this.roleForm = res
    },
    btnCancel() {
      this.roleForm = {}
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        this.getRoleData()
        this.$message.success('操作成功')
        this.showDialog = false // 关闭弹层  =>  触发el-dialog的事件close事件
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>
