<template>
    <div class="container" @click="clickHandle('test click', $event)">

        <div class="userinfo" @click="bindViewTap">
            <img class="userinfo-avatar" v-if="userInfo" :src="userInfo.avatarUrl" background-size="cover" />
            <div class="userinfo-nickname">
                <card v-if="userInfo" :text="userInfo.username"></card>
            </div>
        </div>

        <div class="usermotto">
            <div class="user-motto">
                <card :text="motto"></card>
                {{count}}
            </div>
        </div>

        <form class="form-container">
            <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
            <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
        </form>
        <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a>
        <button open-type='getUserInfo'>获取授权</button>
        <view class="section">
            <input v-model="groupName" maxlength="10" placeholder="输入群名称" />
        </view>
        <view class="section">
            <input v-model="categoryName" maxlength="10" placeholder="群分类" />
        </view>
        <view class="section">
            <input v-model="introduction" maxlength="10" placeholder="群介绍" />
        </view>
        <view>
            <button id="create" open-type='share' type='primary'>创建群并分享</button>
            <button id="share" open-type='share' type='primary'>群分享</button>
        </view>
    </div>
</template>

<script>
import card from '@/components/card'
import counterStore from '../counter/store.js';
import appStore from '../../store.js'
import { checkLoginService, loginwxService, joinGroupService, addGroupService } from '../../api/api.js';


export default {
    data() {
        return {
            motto: 'Hello Word',
            groupName: "",
            categoryName: "",
            introduction: ""
        }
    },
    computed: {
        count() {
            return counterStore.state.count
        },
        userInfo(){
            return appStore.state.userInfo
        }
    },
    components: {
        card
    },
    created() {

    },
    methods: {
        bindViewTap() {
            wx.navigateTo({ url: '../logs/main' })
        },
        clickHandle(msg, ev) {
            console.log('clickHandle:', msg, ev)
        }
    },
    onShareAppMessage(resMessage) {
        var createType = resMessage.target.id === 'create' ? 1 : 0;
        var that = this;
        wx.showShareMenu({
            withShareTicket: true
        })
        console.log(`这是通过：${resMessage.from}`)
        console.log(this);
        // 分享卡片内容
        return {
            title: that.groupName,
            imageUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLERLpErfNmo2B9ZIECmbEkwvVsX3hpCY6C0Ksfl0CJS3HnxfZYFm2hIMRvScewFQT96RgQkffXdw/132',
            desc: that.introduction,
            path: 'pages/index/index',
            success(res) {
                // 转发成功，向后台发送openGId
                console.log(res)
                wx.getShareInfo({
                    shareTicket: res.shareTickets[0],
                    async success(res) {
                        try {
                            console.log('已成功获取到加密信息')
                            console.log(res);
                            var result = await addGroupService({
                                sessionKey: wx.getStorageSync("skey"),
                                encryptedData: encodeURIComponent(res.encryptedData),
                                iv: encodeURIComponent(res.iv),
                                categoryName: that.categoryName,
                                groupName: that.groupName,
                                introduction: that.introduction,
                                createType
                            })
                            console.log(result);
                        } catch (error) {
                            console.log(error)
                        }
                    },
                    fail(res) {
                        console.log(res)
                    }
                })
            },
            fail: (res) => {
                // 转发失败
                console.log(res)
            }
        }
    },
}
</script>

<style scoped lang=scss>
.userinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.userinfo-avatar {
    width: 128rpx;
    height: 128rpx;
    margin: 20rpx;
    border-radius: 50%;
}

.userinfo-nickname {
    color: #aaa;
}

.usermotto {
    margin-top: 150px;
}

.form-control {
    display: block;
    padding: 0 12px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
}

.counter {
    display: inline-block;
    margin: 10px auto;
    padding: 5px 10px;
    color: blue;
    border: 1px solid blue;
}
</style>
