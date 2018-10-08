import wxRequest from './wxRequest.js'

// 微信小程序登录
export const loginwxService = params => wxRequest('login/loginwx',params,'POST');

// 检查登录
export const checkLoginService = params => wxRequest('login/checkLogin',params,"GET");

//群主添加群
export const addGroupService = params => wxRequest('groupwechat/addGroup',params,"POST");

//加入群
export const joinGroupService = params => wxRequest('groupwechat/joinGroup',params,"POST");


