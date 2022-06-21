<template>
  <div class="dashboard-container">
    <div class="app-container">
      <breadcrumb/>
      <page-tools :show-before="true">
        <span slot="before">共{{ pageData.total }}条记录</span>
        <template slot="after">
          <el-button type="primary" size="small" @click="$router.push('/import?type=user')">
            导入
          </el-button>
          <el-button type="primary" size="small" @click="exportData">
            导出
          </el-button>
          <el-button type="primary" size="small" @click="showDialog=true">
            新增员工
          </el-button>
        </template>
      </page-tools>
      <el-card>
        <el-table v-loading="loading" :data="employeeList" border>
          <el-table-column label="序号" type="index" sortable="" align="center"/>
          <el-table-column label="姓名" prop="username" sortable="" align="center"/>
          <el-table-column label="工号" prop="workNumber" sortable="" align="center"/>
          <el-table-column label="聘用形式" prop="formOfEmployment" sortable="" :formatter="formatEmployment"
                           align="center"/>
          <el-table-column label="部门" prop="departmentName" sortable="" align="center"/>
          <el-table-column label="入职时间" sortable="" align="center">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="pageData.size"
            :current-page="pageData.page"
            :total="pageData.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <add-employee :show-dialog.sync="showDialog"/>
      <!--      角色编辑-->
      <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId"/>
    </div>
  </div>
</template>

<script>
import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from '@/views/employees/components/add-employee'
import AssignRole from '@/views/employees/components/assign-role'
import { formatDate } from '@/filters'

export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      employeeList: [],
      pageData: {
        page: 1,
        size: 6,
        total: 0
      },
      loading: false,
      showDialog: false,
      showRoleDialog:false,
      userId:''
    }
  },
  mounted() {
    this.getEmployeeListData()
  },
  methods: {
    async getEmployeeListData() {
      this.loading = true
      const res = await getEmployeeList(this.pageData)
      console.log(res)
      this.employeeList = res.rows
      this.pageData.total = res.total
      this.loading = false
    },
    changePage(val) {
      this.pageData.page = val
      this.getEmployeeListData()
    },
    formatEmployment(row, column, cellValue) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('是否删除该员工', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await delEmployee(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getEmployeeListData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出excel
      import('@/vendor/Export2Excel').then(async excel => {
        //  excel是引入文件的导出对象
        // 导出  header从哪里来
        // data从哪里来
        // 现在没有一个接口获取所有的数据
        // 获取员工的接口 页码 每页条数    100   1 10000
        const { rows } = await getEmployeeList({ page: 1, size: this.pageData.total })
        const data = this.formatJson(headers, rows) // 返回的data就是 要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })

        // excel.export_json_to_excel({
        //   header: ['姓名', '工资'],
        //   data: [['张三', 3000], ['李四', 5000]],
        //   filename: '员工工资表'
        // })
        // [{ username: '张三',mobile: 13112345678 }]  => [[]]
        // 要转化 数据结构 还要和表头的顺序对应上
        // 要求转出的标题是中文
      })
    },
    // 将表头数据和数据进行对应
    // [{}]  =>   [[]]
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象  { mobile: 132111,username: '张三'  }
        // ["手机号", "姓名", "入职日期" 。。]
        return Object.keys(headers).map(key => {
          // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
        // ["132", '张三’， ‘’，‘’，‘’d]
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
      // 需要处理时间格式问题
    },
    async editRole(id) {
      this.userId = id // props传值 是异步的
      await this.$refs.assignRole.getRoleDetail(id) // 父组件调用子组件方法
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>
