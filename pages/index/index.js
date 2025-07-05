//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '萌宠紫微占星',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    petTypes: [
      { id: 1, name: '猫咪', icon: '🐱', color: '#FF69B4' },
      { id: 2, name: '狗狗', icon: '🐶', color: '#FFB6C1' },
      { id: 3, name: '兔兔', icon: '🐰', color: '#DDA0DD' },
      { id: 4, name: '仓鼠', icon: '🐹', color: '#F0E68C' },
      { id: 5, name: '鸟儿', icon: '🐦', color: '#87CEEB' },
      { id: 6, name: '鱼儿', icon: '🐠', color: '#40E0D0' }
    ],
    todayFortune: {
      overall: 85,
      love: 92,
      health: 78,
      wealth: 88,
      lucky_color: '#FF69B4',
      lucky_number: 7,
      advice: '今天是个充满爱意的日子，多陪陪你的小宠物吧！'
    }
  },

  onLoad: function () {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    
    // 检查是否有宠物档案
    this.checkPetProfile()
    
    // 生成今日运势
    this.generateTodayFortune()
  },

  getUserProfile: function(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo
      }
    })
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  checkPetProfile: function() {
    const petProfile = wx.getStorageSync('petProfile')
    if (petProfile) {
      app.globalData.petProfile = petProfile
    }
  },

  generateTodayFortune: function() {
    // 简单的运势生成算法
    const today = new Date()
    const seed = today.getDate() + today.getMonth() * 31
    
    const fortunes = [
      { overall: 85, love: 92, health: 78, wealth: 88, advice: '今天是个充满爱意的日子，多陪陪你的小宠物吧！' },
      { overall: 78, love: 85, health: 92, wealth: 75, advice: '健康运势很棒，带宠物出去运动运动吧！' },
      { overall: 92, love: 88, health: 85, wealth: 95, advice: '财运亨通，可以给宠物买些小礼物哦！' },
      { overall: 88, love: 95, health: 82, wealth: 78, advice: '爱情运势满满，单身的可能会遇到同样爱宠物的人！' },
      { overall: 75, love: 78, health: 88, wealth: 85, advice: '平稳的一天，和宠物一起享受宁静时光。' }
    ]
    
    const todayFortune = fortunes[seed % fortunes.length]
    todayFortune.lucky_color = ['#FF69B4', '#FFB6C1', '#DDA0DD', '#87CEEB', '#F0E68C'][seed % 5]
    todayFortune.lucky_number = (seed % 9) + 1
    
    this.setData({ todayFortune })
  },

  goToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  goToFortune: function() {
    if (!app.globalData.petProfile) {
      wx.showToast({
        title: '请先创建宠物档案',
        icon: 'none'
      })
      this.goToProfile()
      return
    }
    
    wx.navigateTo({
      url: '/pages/fortune/fortune'
    })
  },

  selectPetType: function(e) {
    const petType = e.currentTarget.dataset.pet
    wx.setStorageSync('selectedPetType', petType)
    this.goToProfile()
  }
})
