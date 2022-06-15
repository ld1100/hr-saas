import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
export function deleteRole(roleId) {
  return request({
    url: `/sys/role/${roleId}`,
    method: 'delete'
  })
}
export function getRole(roleId) {
  return request({
    url: `/sys/role/${roleId}`
  })
}
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
export function addRole(data) {
  return request({
    url: '/sys/role/',
    data,
    method: 'post'
  })
}
