<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" />
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  components: {
    TreeTools
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name', // 表示 从这个属性显示内容
        children: 'child'
      },
      company: {}
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      // console.log(result)
      this.company = { name: result.companyName, manager: result.companyManage	}
      this.departs = tranListToTreeData(result.depts, '')
      // console.log(this.departs)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
