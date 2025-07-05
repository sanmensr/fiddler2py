//fortune.js
const app = getApp()

Page({
  data: {
    petProfile: null,
    fortuneResult: null,
    isCalculating: false,
    showResult: false,
    currentStep: 0,
    steps: [
      '正在连接星象...',
      '分析宠物生辰八字...',
      '计算紫微斗数...',
      '解读星座运势...',
      '生成专属预测...'
    ],
    fortuneTypes: [
      { id: 'today', name: '今日运势', icon: '🌅', desc: '查看今天的整体运势' },
      { id: 'week', name: '本周运势', icon: '📅', desc: '了解本周的运势走向' },
      { id: 'month', name: '本月运势', icon: '🗓️', desc: '掌握本月的运势变化' },
      { id: 'love', name: '爱情运势', icon: '💕', desc: '探索感情方面的运势' },
      { id: 'health', name: '健康运势', icon: '🏥', desc: '关注健康状况预测' },
      { id: 'wealth', name: '财富运势', icon: '💰', desc: '了解财运发展趋势' }
    ]
  },

  onLoad: function (options) {
    this.loadPetProfile()
  },

  onShow: function () {
    this.loadPetProfile()
  },

  loadPetProfile: function() {
    const petProfile = wx.getStorageSync('petProfile') || app.globalData.petProfile
    if (!petProfile) {
      wx.showModal({
        title: '提示',
        content: '请先创建宠物档案',
        showCancel: false,
        success: () => {
          wx.navigateTo({
            url: '/pages/profile/profile'
          })
        }
      })
      return
    }
    
    this.setData({ petProfile })
  },

  startFortuneTelling: function(e) {
    const fortuneType = e.currentTarget.dataset.type
    
    this.setData({
      isCalculating: true,
      currentStep: 0,
      showResult: false
    })

    // 模拟计算过程
    this.simulateCalculation(fortuneType)
  },

  simulateCalculation: function(fortuneType) {
    const { steps } = this.data
    let currentStep = 0

    const timer = setInterval(() => {
      if (currentStep < steps.length) {
        this.setData({ currentStep })
        currentStep++
      } else {
        clearInterval(timer)
        this.generateFortuneResult(fortuneType)
      }
    }, 800)
  },

  generateFortuneResult: function(fortuneType) {
    const { petProfile } = this.data
    
    // 基于宠物信息生成运势
    const result = this.calculateFortune(petProfile, fortuneType)
    
    this.setData({
      fortuneResult: result,
      isCalculating: false,
      showResult: true
    })

    // 保存到历史记录
    this.saveToHistory(result)
  },

  calculateFortune: function(petProfile, fortuneType) {
    // 简化的运势计算算法
    const birthday = new Date(petProfile.birthday)
    const today = new Date()
    const seed = birthday.getTime() + today.getDate() + today.getMonth()
    
    // 基础运势值
    const baseScores = {
      overall: 60 + (seed % 40),
      love: 60 + ((seed * 2) % 40),
      health: 60 + ((seed * 3) % 40),
      wealth: 60 + ((seed * 4) % 40),
      career: 60 + ((seed * 5) % 40),
      social: 60 + ((seed * 6) % 40)
    }

    // 根据宠物特征调整
    if (petProfile.personality === 'active') {
      baseScores.health += 10
      baseScores.social += 5
    } else if (petProfile.personality === 'gentle') {
      baseScores.love += 10
      baseScores.overall += 5
    } else if (petProfile.personality === 'smart') {
      baseScores.career += 10
      baseScores.wealth += 5
    }

    // 根据性别调整
    if (petProfile.gender === 'female') {
      baseScores.love += 5
    } else if (petProfile.gender === 'male') {
      baseScores.career += 5
    }

    const fortuneTexts = this.getFortuneTexts(fortuneType, baseScores, petProfile)
    
    return {
      type: fortuneType,
      typeName: this.data.fortuneTypes.find(t => t.id === fortuneType).name,
      date: this.formatDate(today),
      petName: petProfile.name,
      scores: baseScores,
      ...fortuneTexts,
      luckyColor: this.getLuckyColor(seed),
      luckyNumber: (seed % 9) + 1,
      luckyItem: this.getLuckyItem(seed),
      advice: this.getAdvice(fortuneType, baseScores, petProfile)
    }
  },

  getFortuneTexts: function(type, scores, petProfile) {
    const texts = {
      today: {
        title: `${petProfile.name}的今日运势`,
        summary: `今天${petProfile.name}的整体运势${scores.overall >= 80 ? '非常不错' : scores.overall >= 60 ? '还算平稳' : '需要注意'}，特别是在${scores.love >= scores.health ? '感情' : '健康'}方面表现突出。`
      },
      week: {
        title: `${petProfile.name}的本周运势`,
        summary: `本周${petProfile.name}的运势呈现${scores.overall >= 75 ? '上升' : '平稳'}趋势，建议多关注${scores.wealth >= 80 ? '财运机会' : '日常护理'}。`
      },
      month: {
        title: `${petProfile.name}的本月运势`,
        summary: `本月${petProfile.name}的运势整体${scores.overall >= 70 ? '向好' : '需要耐心'}，在${scores.career >= 80 ? '新技能学习' : '健康管理'}方面会有不错的表现。`
      },
      love: {
        title: `${petProfile.name}的爱情运势`,
        summary: `${petProfile.name}的感情运势${scores.love >= 80 ? '桃花满满' : scores.love >= 60 ? '温馨平稳' : '需要更多关爱'}，${petProfile.gender === 'female' ? '她' : '他'}会给主人带来更多温暖。`
      },
      health: {
        title: `${petProfile.name}的健康运势`,
        summary: `${petProfile.name}的健康状况${scores.health >= 80 ? '非常良好' : scores.health >= 60 ? '基本稳定' : '需要关注'}，建议${petProfile.personality === 'active' ? '适当运动' : '注意休息'}。`
      },
      wealth: {
        title: `${petProfile.name}的财富运势`,
        summary: `${petProfile.name}会给主人带来${scores.wealth >= 80 ? '意外的好运' : scores.wealth >= 60 ? '稳定的陪伴' : '需要更多投入的关爱'}。`
      }
    }
    
    return texts[type] || texts.today
  },

  getLuckyColor: function(seed) {
    const colors = ['#FF69B4', '#FFB6C1', '#DDA0DD', '#87CEEB', '#F0E68C', '#98FB98']
    return colors[seed % colors.length]
  },

  getLuckyItem: function(seed) {
    const items = ['小鱼干', '毛线球', '小铃铛', '蝴蝶结', '小骨头', '羽毛玩具']
    return items[seed % items.length]
  },

  getAdvice: function(type, scores, petProfile) {
    const advices = {
      today: [
        `今天多陪${petProfile.name}玩耍，会带来好运气！`,
        `给${petProfile.name}准备一些特别的小零食吧。`,
        `今天是拍照的好日子，记录${petProfile.name}的可爱瞬间。`,
        `带${petProfile.name}晒晒太阳，对健康有益。`
      ],
      week: [
        `本周可以尝试教${petProfile.name}一些新技能。`,
        `安排一次宠物美容，让${petProfile.name}更加漂亮。`,
        `本周适合和其他宠物主人交流经验。`
      ],
      love: [
        `多给${petProfile.name}一些拥抱和抚摸。`,
        `为${petProfile.name}准备一个舒适的小窝。`,
        `用温柔的声音和${petProfile.name}说话。`
      ],
      health: [
        `注意${petProfile.name}的饮食均衡。`,
        `定期检查${petProfile.name}的身体状况。`,
        `保持${petProfile.name}生活环境的清洁。`
      ]
    }
    
    const typeAdvices = advices[type] || advices.today
    const seed = Date.now() % typeAdvices.length
    return typeAdvices[seed]
  },

  formatDate: function(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  saveToHistory: function(result) {
    let history = wx.getStorageSync('fortuneHistory') || []
    history.unshift(result)
    
    // 只保留最近20条记录
    if (history.length > 20) {
      history = history.slice(0, 20)
    }
    
    wx.setStorageSync('fortuneHistory', history)
    app.globalData.fortuneHistory = history
  },

  shareResult: function() {
    const { fortuneResult } = this.data
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  backToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
