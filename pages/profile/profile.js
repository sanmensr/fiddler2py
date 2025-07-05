//profile.js
const app = getApp()

Page({
  data: {
    petProfile: {
      name: '',
      type: '',
      gender: '',
      birthday: '',
      color: '',
      personality: '',
      avatar: ''
    },
    petTypes: [
      { id: 1, name: '猫咪', icon: '🐱' },
      { id: 2, name: '狗狗', icon: '🐶' },
      { id: 3, name: '兔兔', icon: '🐰' },
      { id: 4, name: '仓鼠', icon: '🐹' },
      { id: 5, name: '鸟儿', icon: '🐦' },
      { id: 6, name: '鱼儿', icon: '🐠' }
    ],
    genders: [
      { id: 'male', name: '男孩子', icon: '♂️' },
      { id: 'female', name: '女孩子', icon: '♀️' }
    ],
    personalities: [
      { id: 'active', name: '活泼好动', desc: '精力充沛，喜欢玩耍' },
      { id: 'gentle', name: '温柔安静', desc: '性格温和，喜欢安静' },
      { id: 'smart', name: '聪明机灵', desc: '智商很高，学习能力强' },
      { id: 'lazy', name: '慵懒可爱', desc: '喜欢睡觉，动作缓慢' },
      { id: 'brave', name: '勇敢无畏', desc: '胆子很大，保护意识强' },
      { id: 'shy', name: '害羞内向', desc: '比较胆小，需要时间熟悉' }
    ],
    colors: [
      { id: 'white', name: '白色', color: '#FFFFFF' },
      { id: 'black', name: '黑色', color: '#000000' },
      { id: 'brown', name: '棕色', color: '#8B4513' },
      { id: 'gray', name: '灰色', color: '#808080' },
      { id: 'orange', name: '橙色', color: '#FFA500' },
      { id: 'mixed', name: '混色', color: 'linear-gradient(45deg, #FF69B4, #87CEEB)' }
    ],
    isEditing: false
  },

  onLoad: function (options) {
    // 检查是否有预选的宠物类型
    const selectedPetType = wx.getStorageSync('selectedPetType')
    if (selectedPetType) {
      this.setData({
        'petProfile.type': selectedPetType.name
      })
      wx.removeStorageSync('selectedPetType')
    }

    // 加载已保存的宠物档案
    this.loadPetProfile()
  },

  loadPetProfile: function() {
    const savedProfile = wx.getStorageSync('petProfile')
    if (savedProfile) {
      this.setData({
        petProfile: savedProfile,
        isEditing: true
      })
      app.globalData.petProfile = savedProfile
    }
  },

  onInputChange: function(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`petProfile.${field}`]: value
    })
  },

  onDateChange: function(e) {
    this.setData({
      'petProfile.birthday': e.detail.value
    })
  },

  selectPetType: function(e) {
    const petType = e.currentTarget.dataset.type
    this.setData({
      'petProfile.type': petType.name
    })
  },

  selectGender: function(e) {
    const gender = e.currentTarget.dataset.gender
    this.setData({
      'petProfile.gender': gender.id
    })
  },

  selectPersonality: function(e) {
    const personality = e.currentTarget.dataset.personality
    this.setData({
      'petProfile.personality': personality.id
    })
  },

  selectColor: function(e) {
    const color = e.currentTarget.dataset.color
    this.setData({
      'petProfile.color': color.id
    })
  },

  chooseAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.setData({
          'petProfile.avatar': tempFilePath
        })
      }
    })
  },

  savePetProfile: function() {
    const { petProfile } = this.data
    
    // 验证必填字段
    if (!petProfile.name) {
      wx.showToast({
        title: '请输入宠物姓名',
        icon: 'none'
      })
      return
    }
    
    if (!petProfile.type) {
      wx.showToast({
        title: '请选择宠物类型',
        icon: 'none'
      })
      return
    }
    
    if (!petProfile.birthday) {
      wx.showToast({
        title: '请选择宠物生日',
        icon: 'none'
      })
      return
    }

    // 保存到本地存储
    wx.setStorageSync('petProfile', petProfile)
    app.globalData.petProfile = petProfile

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })

    this.setData({
      isEditing: true
    })

    // 延迟跳转到运势页面
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/fortune/fortune'
      })
    }, 1500)
  },

  editProfile: function() {
    this.setData({
      isEditing: false
    })
  },

  previewAvatar: function() {
    if (this.data.petProfile.avatar) {
      wx.previewImage({
        urls: [this.data.petProfile.avatar]
      })
    }
  },

  getPersonalityName: function(id) {
    const personality = this.data.personalities.find(p => p.id === id)
    return personality ? personality.name : ''
  },

  getColorName: function(id) {
    const color = this.data.colors.find(c => c.id === id)
    return color ? color.name : ''
  },

  getGenderName: function(id) {
    const gender = this.data.genders.find(g => g.id === id)
    return gender ? gender.name : ''
  }
})
