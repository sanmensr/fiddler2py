// utils/astrology.js
// 宠物紫微占星工具函数

/**
 * 根据生日计算宠物的星座
 */
function getPetZodiac(birthday) {
  const date = new Date(birthday)
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const zodiacs = [
    { name: '水瓶座', start: [1, 20], end: [2, 18], element: '风', lucky: '蓝色', personality: '独立创新' },
    { name: '双鱼座', start: [2, 19], end: [3, 20], element: '水', lucky: '紫色', personality: '温柔梦幻' },
    { name: '白羊座', start: [3, 21], end: [4, 19], element: '火', lucky: '红色', personality: '活泼勇敢' },
    { name: '金牛座', start: [4, 20], end: [5, 20], element: '土', lucky: '绿色', personality: '稳重踏实' },
    { name: '双子座', start: [5, 21], end: [6, 21], element: '风', lucky: '黄色', personality: '聪明好奇' },
    { name: '巨蟹座', start: [6, 22], end: [7, 22], element: '水', lucky: '银色', personality: '温暖体贴' },
    { name: '狮子座', start: [7, 23], end: [8, 22], element: '火', lucky: '金色', personality: '自信威严' },
    { name: '处女座', start: [8, 23], end: [9, 22], element: '土', lucky: '米色', personality: '细心完美' },
    { name: '天秤座', start: [9, 23], end: [10, 23], element: '风', lucky: '粉色', personality: '优雅平衡' },
    { name: '天蝎座', start: [10, 24], end: [11, 22], element: '水', lucky: '深红', personality: '神秘专注' },
    { name: '射手座', start: [11, 23], end: [12, 21], element: '火', lucky: '橙色', personality: '自由乐观' },
    { name: '摩羯座', start: [12, 22], end: [1, 19], element: '土', lucky: '棕色', personality: '务实坚韧' }
  ]
  
  for (let zodiac of zodiacs) {
    const [startMonth, startDay] = zodiac.start
    const [endMonth, endDay] = zodiac.end
    
    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) {
        return zodiac
      }
    } else {
      if ((month === startMonth && day >= startDay) || 
          (month === endMonth && day <= endDay)) {
        return zodiac
      }
    }
  }
  
  return zodiacs[0] // 默认返回水瓶座
}

/**
 * 计算宠物的生命数字
 */
function getLifeNumber(birthday) {
  const date = new Date(birthday)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // 将年月日相加
  let sum = year + month + day
  
  // 数字根算法：不断相加直到得到个位数
  while (sum > 9) {
    let temp = 0
    while (sum > 0) {
      temp += sum % 10
      sum = Math.floor(sum / 10)
    }
    sum = temp
  }
  
  return sum
}

/**
 * 根据生命数字获取性格特征
 */
function getPersonalityByLifeNumber(lifeNumber) {
  const personalities = {
    1: { trait: '领导者', desc: '独立自主，喜欢带头', lucky: '周日' },
    2: { trait: '合作者', desc: '温和友善，善于配合', lucky: '周一' },
    3: { trait: '创造者', desc: '活泼开朗，富有创意', lucky: '周二' },
    4: { trait: '建设者', desc: '稳重可靠，做事有条理', lucky: '周三' },
    5: { trait: '冒险者', desc: '好奇心强，喜欢探索', lucky: '周四' },
    6: { trait: '照顾者', desc: '关爱他人，责任心强', lucky: '周五' },
    7: { trait: '思考者', desc: '聪明睿智，喜欢思考', lucky: '周六' },
    8: { trait: '成就者', desc: '目标明确，执行力强', lucky: '周日' },
    9: { trait: '奉献者', desc: '慷慨大方，乐于助人', lucky: '周一' }
  }
  
  return personalities[lifeNumber] || personalities[1]
}

/**
 * 计算今日运势
 */
function calculateDailyFortune(petProfile) {
  const today = new Date()
  const birthday = new Date(petProfile.birthday)
  const zodiac = getPetZodiac(petProfile.birthday)
  const lifeNumber = getLifeNumber(petProfile.birthday)
  
  // 基于日期和宠物信息的种子
  const seed = today.getDate() + today.getMonth() * 31 + lifeNumber
  
  // 基础运势分数
  const baseScore = 50 + (seed % 40)
  
  // 根据星座元素调整
  const elementBonus = {
    '火': { health: 10, energy: 15 },
    '土': { wealth: 10, stability: 15 },
    '风': { social: 10, communication: 15 },
    '水': { love: 10, intuition: 15 }
  }
  
  const bonus = elementBonus[zodiac.element] || {}
  
  return {
    overall: Math.min(100, baseScore + (bonus.stability || 0)),
    love: Math.min(100, baseScore + (bonus.love || 0) + (seed % 20)),
    health: Math.min(100, baseScore + (bonus.health || 0) + ((seed * 2) % 20)),
    wealth: Math.min(100, baseScore + (bonus.wealth || 0) + ((seed * 3) % 20)),
    social: Math.min(100, baseScore + (bonus.social || 0) + ((seed * 4) % 20)),
    zodiac: zodiac,
    lifeNumber: lifeNumber,
    personality: getPersonalityByLifeNumber(lifeNumber)
  }
}

/**
 * 生成运势建议
 */
function generateAdvice(fortune, petProfile) {
  const { zodiac, lifeNumber, overall } = fortune
  
  const adviceTemplates = {
    high: [ // 80分以上
      `今天${petProfile.name}的${zodiac.name}能量很强，适合学习新技能！`,
      `${petProfile.name}今天特别有魅力，多拍些照片留念吧！`,
      `今天是${petProfile.name}的幸运日，可以尝试一些新的玩具或食物。`
    ],
    medium: [ // 60-80分
      `今天${petProfile.name}的状态不错，保持日常的作息就好。`,
      `给${petProfile.name}一些额外的关爱，会让运势更好哦！`,
      `今天适合和${petProfile.name}进行一些轻松的互动游戏。`
    ],
    low: [ // 60分以下
      `今天${petProfile.name}可能需要更多休息，不要过度活动。`,
      `多关注${petProfile.name}的情绪变化，给予更多陪伴。`,
      `今天让${petProfile.name}在熟悉的环境中放松就好。`
    ]
  }
  
  let level = 'medium'
  if (overall >= 80) level = 'high'
  else if (overall < 60) level = 'low'
  
  const templates = adviceTemplates[level]
  const randomIndex = lifeNumber % templates.length
  
  return templates[randomIndex]
}

/**
 * 获取幸运物品
 */
function getLuckyItems(zodiac, lifeNumber) {
  const zodiacItems = {
    '水瓶座': ['水晶球', '蓝色项圈', '智能玩具'],
    '双鱼座': ['贝壳饰品', '紫色毛毯', '音乐盒'],
    '白羊座': ['红色玩具', '运动球', '铃铛'],
    '金牛座': ['绿色垫子', '美食碗', '舒适窝'],
    '双子座': ['黄色飞盘', '益智玩具', '镜子'],
    '巨蟹座': ['银色项链', '温暖毯子', '月亮灯'],
    '狮子座': ['金色王冠', '豪华床垫', '阳光浴'],
    '处女座': ['米色梳子', '整理箱', '清洁用品'],
    '天秤座': ['粉色蝴蝶结', '平衡木', '美容用品'],
    '天蝎座': ['神秘盒子', '深色玩具', '隐藏零食'],
    '射手座': ['橙色飞镖', '户外用品', '探险包'],
    '摩羯座': ['棕色骨头', '坚固玩具', '训练器材']
  }
  
  const items = zodiacItems[zodiac.name] || ['通用玩具', '美味零食', '舒适用品']
  return items[lifeNumber % items.length]
}

module.exports = {
  getPetZodiac,
  getLifeNumber,
  getPersonalityByLifeNumber,
  calculateDailyFortune,
  generateAdvice,
  getLuckyItems
}
