/**
 * 处理字符串数据，转换为数组对象
 * { time:'', words:'' }
 */
function getLrcData() {
  const result = lrc.split('\n')
  const data = []
  for (let i = 0; i < result.length; i++) {
    const lrc = result[i].split(']')
    const lrcTime = lrc[0].substring(1)
    const obj = {
      time: getTime(lrcTime),
      words: lrc[1]
    }
    data.push(obj)
  }
  return data
}

const data = getLrcData()

/**
 * 根据时间字符串，获取时间（秒）
 * @param {String} lrcTime 
 */
function getTime(lrcTime) {
  const time = lrcTime.split(':')
  return parseInt(time[0]) * 60 + parseFloat(time[1])
}

/**
 * 根据歌曲播放的时间，获取当前正在播放歌词的下标
 * @param {*} time 
 */
function findIndex(time) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].time > time) return i - 1;
  }
  return data.length - 1;
}

const doms = {
  ul: document.querySelector('.lrc-list'),
  container: document.querySelector('.container'),
  audio: document.querySelector('audio')
}
/**
 * 渲染歌词
 */
function renderWords() {
  // 创建 DocumentFragment 用于接收创建的所以 li 后面直接向 ul 里面一次性添加 优化速率
  const frag = document.createDocumentFragment()
  for (let i = 0; i < data.length; i++) {
    const li = document.createElement('li')
    li.innerHTML = data[i].words
    frag.appendChild(li)
  }
  doms.ul.appendChild(frag)
}

renderWords()

const containerHeight = doms.container.clientHeight
const liHeight = doms.ul.children[0].clientHeight
const maxOffset = doms.ul.clientHeight - containerHeight
/**
 * 设置 ul 的偏移量
 * 偏移量 = 上方li的总高度 + li高度的一半 - container盒子高度的一半
 * @param {*} time 
 */
function setOffset() {
  const time = doms.audio.currentTime
  const index = findIndex(time)
  let offset = index * liHeight + liHeight / 2 - containerHeight / 2
  // 设置最小偏移量为 0
  if (offset < 0) offset = 0
  // 设置最大偏移量为 ul的总高度 - container盒子的高度
  if (offset > maxOffset) offset = maxOffset
  let li = doms.ul.querySelector('.active')
  if (li) li.classList.remove('active')
  doms.ul.style.transform = `translateY(-${offset}px)`
  li = doms.ul.children[index]
  if (li) li.classList.add('active')
}

// 注册音乐播放事件
doms.audio.addEventListener('timeupdate', setOffset)