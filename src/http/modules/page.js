import axios from '../api' // 导入 api

// export const News = (language = '1', type = '1') => axios('/news/index', {
//     p: 'wx',
//     language,
//     type,
// });


// 1、分页
export const page = (page='1', pageSize='10') =>
    axios('/api/web-merchant/page', { page, pageSize })


// 1、登录
export const login = (params) =>
    axios('/api/web-merchant/login', params, 'post','fromdata')

// 1、获取token
export const getToken = () =>
    axios('/api/web-merchant/login', {}, 'post')    

// 用户管理获取信息    

export const userList = () =>
    axios('/api/web-merchant/merchant/user/add')    


// 用户管理获取信息    

export const pageList = (params) =>
    axios('/api/web-merchant/merchant/user/list/load', params, 'post', 'fromdata')   
    
// 编辑

export const edit = (uesrId) =>
    axios(`/api/web-merchant/merchant/user/edit/${uesrId}`)   
	
// 新增
export const addSave = (params) =>
    axios('/api/web-merchant/merchant/user/add/save', params, 'post', 'fromdata')  
	
	
// 更新
export const editSave = (params) =>
    axios('/api/web-merchant/merchant/user/edit', params, 'post', 'fromdata')  

// 删除
export const deleteUser = (params) =>
    axios('/api/web-merchant/merchant/user/delete', params, 'post', 'fromdata')  	

//登出
export const logout = () =>
    axios('/api/web-merchant/logout',{}, 'post')  