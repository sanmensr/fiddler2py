//history.js
const app = getApp()

Page({
  data: {
    fortuneHistory: [],
    isEmpty: false,
    selectedFilter: 'all',
    filters: [
      { id: 'all', name: '全部', icon: '📋' },
      { id: 'today', name: '今日运势', icon: '🌅' },
      { id: 'week', name: '本周运势', icon: '📅' },
      { id: 'month', name: '本月运势', icon: '🗓️' },
      { id: 'love', name: '爱情运势', icon: '💕' },
      { id: 'health', name: '健康运势', icon: '🏥' },
      { id: 'wealth', name: '财富运势', icon: '💰' }
    ]
  },

  onLoad: function (options) {
    this.loadHistory()
  },

  onShow: function () {
    this.loadHistory()
  },

  loadHistory: function() {
    const history = wx.getStorageSync('fortuneHistory') || []
    const isEmpty = history.length === 0
    
    this.setData({
      fortuneHistory: history,
      isEmpty: isEmpty
    })
    
    this.filterHistory()
  },

  onFilterChange: function(e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({
      selectedFilter: filter
    })
    this.filterHistory()
  },

  filterHistory: function() {
    const { fortuneHistory, selectedFilter } = this.data
    let filteredHistory = fortuneHistory
    
    if (selectedFilter !== 'all') {
      filteredHistory = fortuneHistory.filter(item => item.type === selectedFilter)
    }
    
    this.setData({
      filteredHistory: filteredHistory
    })
  },

  viewDetail: function(e) {
    const index = e.currentTarget.dataset.index
    const { filteredHistory } = this.data
    const fortuneResult = filteredHistory[index]
    
    // 将选中的运势结果存储到全局，然后跳转到详情页
    app.globalData.selectedFortune = fortuneResult
    
    wx.navigateTo({
      url: '/pages/fortune/fortune?from=history'
    })
  },

  deleteItem: function(e) {
    const index = e.currentTarget.dataset.index
    const { filteredHistory, fortuneHistory } = this.data
    const itemToDelete = filteredHistory[index]
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条运势记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 从原始历史记录中删除
          const originalIndex = fortuneHistory.findIndex(item => 
            item.date === itemToDelete.date && 
            item.type === itemToDelete.type &&
            item.petName === itemToDelete.petName
          )
          
          if (originalIndex !== -1) {
            fortuneHistory.splice(originalIndex, 1)
            wx.setStorageSync('fortuneHistory', fortuneHistory)
            
            this.setData({
              fortuneHistory: fortuneHistory
            })
            
            this.filterHistory()
            
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        }
      }
    })
  },

  clearAllHistory: function() {
    if (this.data.fortuneHistory.length === 0) {
      wx.showToast({
        title: '暂无记录',
        icon: 'none'
      })
      return
    }
    
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有运势记录吗？此操作不可恢复。',
      confirmColor: '#FF1493',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('fortuneHistory')
          app.globalData.fortuneHistory = []
          
          this.setData({
            fortuneHistory: [],
            filteredHistory: [],
            isEmpty: true
          })
          
          wx.showToast({
            title: '清空成功',
            icon: 'success'
          })
        }
      }
    })
  },

  shareHistory: function() {
    const { fortuneHistory } = this.data
    
    if (fortuneHistory.length === 0) {
      wx.showToast({
        title: '暂无记录可分享',
        icon: 'none'
      })
      return
    }
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  goToFortune: function() {
    wx.switchTab({
      url: '/pages/fortune/fortune'
    })
  },

  formatDate: function(dateStr) {
    const date = new Date(dateStr)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    const diffTime = today.getTime() - targetDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays === 2) {
      return '前天'
    } else if (diffDays <= 7) {
      return `${diffDays}天前`
    } else {
      return dateStr
    }
  },

  getScoreColor: function(score) {
    if (score >= 80) return '#32CD32'
    if (score >= 60) return '#FFD700'
    return '#FF6347'
  },

  getScoreText: function(score) {
    if (score >= 90) return '极佳'
    if (score >= 80) return '很好'
    if (score >= 70) return '良好'
    if (score >= 60) return '一般'
    return '需注意'
  }
})
