class UIGoods {
  constructor(goods) {
    this.data = goods
    this.choose = 0
  }
  // 计算单个商品的总价
  getTotalPrice() {
    return this.data.price * this.choose
  }
  // 增加商品
  increase() {
    this.choose++
  }
  // 减少商品
  decrease() {
    if (this.choose <= 0) return
    this.choose--
  }
  // 商品是否被选择
  isChoose() {
    return this.choose > 0
  }
}

class UIData {
  constructor(goodsList, deliveryThreshold, deliveryPrice) {
    this.dataList = goodsList.map(item => new UIGoods(item))
    this.deliveryThreshold = deliveryThreshold
    this.deliveryPrice = deliveryPrice
  }
  // 增加某个商品
  increase(index) {
    this.dataList[index].increase()
  }
  // 减少某个商品
  decrease(index) {
    this.dataList[index].decrease()
  }
  // 计算购物车商品总价
  getTotalPrice() {
    return this.dataList.reduce((prev, current) => prev + current.getTotalPrice(), 0)
  }
  // 计算购物车商品总量
  getTotalChooseCount() {
    return this.dataList.reduce((prev, current) => prev + current.choose, 0)
  }
  // 判断购物车中是否有商品
  hasGoodsInCar() {
    return this.getTotalChooseCount() > 0
  }
  // 判断是否超过配送门槛
  isCrossDeliveryThreshold() {
    return this.getTotalPrice() >= this.deliveryThreshold
  }
  // 计算距离配送门槛还差多少钱
  getDistanceToDeliveryThreshold() {
    return this.deliveryThreshold - this.getTotalPrice() > 0 ? Math.round(this.deliveryThreshold - this.getTotalPrice()) : 0
  }
  // 商品是否被选择
  isChoose(index) {
    return this.dataList[index].isChoose()
  }
}

class UI {
  constructor(goodsList, deliveryThreshold, deliveryPrice) {
    this.data = new UIData(goodsList, deliveryThreshold, deliveryPrice)
    this.doms = {
      goodsContainer: document.querySelector('.goods-list'),
      footerPay: document.querySelector('.footer-pay'),
      footerCarTotal: document.querySelector('.footer-car-total'),
      footerCarTip: document.querySelector('.footer-car-tip'),
      footerCar: document.querySelector('.footer-car'),
      footerCarBadge: document.querySelector('.footer-car-badge')
    }
    const animationEndInfo = this.doms.footerCar.getBoundingClientRect()
    this.animationEnd = {
      x: animationEndInfo.left + animationEndInfo.width / 2,
      y: animationEndInfo.top
    }
    this.createGoodsHtml()
    this.updateFooter()
    // 设置配送费
    this.doms.footerCarTip.textContent = `配送费￥${this.data.deliveryPrice}`
    this.listern()
  }
  // 监听事件
  listern() {
    // 购物车动画效果结束
    this.doms.footerCar.addEventListener('animationend', function () {
      this.classList.remove('animate')
    })
  }
  // 创建商品的 html 结构
  createGoodsHtml() {
    const html = this.data.dataList.reduce((prev, current, index) => prev + `<div class="goods-item">
    <img src="${current.data.pic}" alt="" class="goods-pic" />
    <div class="goods-info">
      <h2 class="goods-title">${current.data.title}</h2>
      <p class="goods-desc">${current.data.desc}</p>
      <p class="goods-sell">
        <span>月售 ${current.data.sellNumber}</span>
        <span>好评率${current.data.favorRate}%</span>
      </p>
      <div class="goods-confirm">
        <p class="goods-price">
          <span class="goods-price-unit">￥</span>
          <span>${current.data.price}</span>
        </p>
        <div class="goods-btns">
          <i data-index="${index}" class="iconfont i-jianhao"></i>
          <span>0</span>
          <i data-index="${index}" class="iconfont i-jiajianzujianjiahao"></i>
        </div>
      </div>
    </div>
  </div>`, '')
    this.doms.goodsContainer.innerHTML = html
  }
  // 添加商品
  increase(index) {
    this.data.increase(index)
    this.updateGoodsItem(index)
    this.updateFooter(index)
  }
  // 减少商品
  decrease(index) {
    this.data.decrease(index)
    this.updateGoodsItem(index)
    this.updateFooter()
  }
  // 更新 goods-item
  updateGoodsItem(index) {
    const goodsItem = this.doms.goodsContainer.children[index]
    if (this.data.isChoose(index)) {
      goodsItem.classList.add('active')
    }
    else {
      goodsItem.classList.remove('active')
    }
    goodsItem.querySelector('.goods-btns span').textContent = this.data.dataList[index].choose
  }
  // 更新页脚
  updateFooter(index) {
    if (this.data.isCrossDeliveryThreshold()) {
      this.doms.footerPay.classList.add('active')
    } else {
      this.doms.footerPay.classList.remove('active')
      this.doms.footerPay.querySelector('span').innerHTML = `还差￥${this.data.getDistanceToDeliveryThreshold()}元起送`
    }
    this.doms.footerCarTotal.textContent = this.data.getTotalPrice().toFixed(2)
    if (this.data.hasGoodsInCar()) {
      this.doms.footerCar.classList.add('active')
      this.doms.footerCarBadge.textContent = this.data.getTotalChooseCount()
      this.doAnimation(index)
    } else {
      this.doms.footerCar.classList.remove('active')
    }
  }
  // 购物车动画
  carAnimation() {
    this.doms.footerCar.classList.add('animate')
  }
  // + 的动画效果
  doAnimation(index) {
    const addBtnInfo = this.doms.goodsContainer.children[index].querySelector('.i-jiajianzujianjiahao').getBoundingClientRect()
    const animateStart = {
      x: addBtnInfo.x,
      y: addBtnInfo.y
    }
    const div = document.createElement('div')
    div.className = 'add-to-car'
    div.style.transform = `translateX(${animateStart.x}px)`
    const i = document.createElement('i')
    i.className = 'iconfont i-jiajianzujianjiahao'
    i.style.transform = `translateY(${animateStart.y}px)`
    div.appendChild(i)
    document.body.appendChild(div)

    // reflow强行渲染
    div.clientWidth

    div.style.transform = `translateX(${this.animationEnd.x}px)`
    i.style.transform = `translateY(${this.animationEnd.y}px)`

    // 添加商品过渡效果结束
    div.addEventListener('transitionend', () => {
      div.remove()
      this.carAnimation()
    }, {
      once: true
    })
  }
}

const ui = new UI(goods, 30, 5)

// 点击事件
ui.doms.goodsContainer.addEventListener('click', function (e) {
  if (e.target.className.includes('i-jiajianzujianjiahao')) {
    ui.increase(e.target.dataset.index)
  } else if (e.target.className.includes('i-jianhao')) {
    ui.decrease(e.target.dataset.index)
  }
})