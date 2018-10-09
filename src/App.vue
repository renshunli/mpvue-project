<script>
import appStore from './store.js'
import { checkLoginService, loginwxService, joinGroupService } from './api/api.js';
export default {
    onLaunch(ops){
        console.log(ops);
        // 登录
        this.getUserInfo((userInfo) => {
            appStore.commit('setUserInfo',userInfo);
            this.shareJoinGroup(ops)
        })
    },
    methods:{
        shareJoinGroup(ops){
            //从分享进入项目
            if(ops && ops.scene == 1044){
                console.log(ops.shareTicket)
                console.log("从分享进入的用户")
                wx.getShareInfo({
                    shareTicket: ops.shareTicket,
                    async complete(res){
                        console.log(res)
                        try {
                            encodeURIComponent
                            let result = await joinGroupService({
                                sessionKey: wx.getStorageSync("skey"),
                                encryptedData: encodeURIComponent(res.encryptedData),
                                iv: encodeURIComponent(res.iv)
                            })
                            console.log(result);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                })
            }
        },
        wxLogin(cb) {
            var that = this;
            wx.login({
                success(loginRes) {
                    // 获取用户信息
                    wx.getUserInfo({
                        timeout: 3000,
                        async success(res) {
                            try {
                                let result = await loginwxService({ code: loginRes.code, ...res.userInfo });
                                wx.setStorageSync("skey", result.data.body.sessionKey);
                                cb(result.data.body.userInfo);
                            } catch (error) {
                                console.log(error);
                            }
                        },
                        fail(err) {
                            console.log(err);
                        },
                    })
                }
            })
        },
        async getUserInfo(cb = () => { }) {
            let skey = wx.getStorageSync("skey");
            if (skey == "") {
                if (this.userInfo) {
                    cb(this.userInfo)
                } else {
                    this.wxLogin(cb);
                }
            } else {
                try {
                    var res = await checkLoginService();
                    this.userInfo = res.data.body;
                    cb(res.data.body);
                } catch (error) {
                    this.wxLogin(cb);
                }
            }
        }
    },
}
</script>

<style>
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 0;
    box-sizing: border-box;
}
/* this rule will be remove */
* {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
}
</style>
