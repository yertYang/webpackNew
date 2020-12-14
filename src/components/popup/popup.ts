//全局css引入操作
// import './popup.css' 

//node方式引入局部css
let styles = require('./popup.css')

//声明文件 转换式方法 将css转换成ts能理解的语言
// import styles from './popup.css'


// 参数规范/约束 -业务开发人员 接口
interface Ipopup {
  width?: string;
  height?: string;
  title?: string;
  //位置
  pos?: string;
  //遮照
  mask?: boolean;
  content?: (content: HTMLElement) => void
}

//组件规范/约束 -组件开发人员 接口
interface Icomputent {
  tempContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}

function popup(options: Ipopup) {
  return new Popup(options);
}

class Popup implements Icomputent {
  // private settings 为如下写法的简写
  //  let settings={} settings={****}

  tempContainer;
  mask;
  constructor(private settings: Ipopup) {
    //设置默认值
    this.settings = Object.assign({
      width: '100%',
      height: '100%',
      title: '',
      pos: 'center',
      mask: true,
      content: function () { }
    }, this.settings)
    this.init()
  }
  // 初始化
  init() {
    this.template();
    this.settings.mask && this.createMask();
    this.handle();
    this.contentCallback();
  }
  // 创建模版
  template() {
    this.tempContainer = document.createElement('div');
    // 若为require 方式引入css 则需要写为styles.default.popup
    // 若为d.ts转义 则写为styles.popup
    this.tempContainer.style.width = this.settings.width;
    this.tempContainer.style.height = this.settings.height;
    this.tempContainer.className = styles.default.popup;
    this.tempContainer.innerHTML = `
      <div class="${styles.default['popup-title']}">
        <h3>${this.settings.title}</h3> 
        <i class="iconfont icon-shouji"></i> 
      </div>
      <div class="${styles.default['popup-content']}"></div>
    `;
    document.body.appendChild(this.tempContainer)
    if (this.settings.pos === 'left') {
      this.tempContainer.style.left = 0;
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px';
    } else if (this.settings.pos === 'right') {
      this.tempContainer.style.right = 0;
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px';
    } else {
      this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 + 'px';
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px';
    }
  }
  // 事件操作
  handle() {
    let popupClose = this.tempContainer.querySelector(`.${styles.default['popup-title']} i`);
    popupClose.addEventListener('click', () => {
      document.body.removeChild(this.tempContainer);
      this.settings.mask && document.body.removeChild(this.mask)
    })
  }
  //遮罩效果
  createMask() {
    this.mask = document.createElement('div');
    this.mask.className = styles.default.mask;
    this.mask.style.width = "100%";
    this.mask.style.height = document.body.offsetHeight + 'px';
    document.body.appendChild(this.mask);
  }
  // 回调函数
  contentCallback() {
    let popupContent = this.tempContainer.querySelector(`.${styles.default['popup-content']}`)
    this.settings.content(popupContent);
  }
}

export default popup;