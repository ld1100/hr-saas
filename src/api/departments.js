import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

export function deleteDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
