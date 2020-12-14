let styles = require('./video.css');

interface Ivideo {
  url: string;
  //  |写法为联合类型
  elem: string | HTMLElement;
  // ? 此参数为可选参数
  width?: string;
  height?: string;
  autoplay?: boolean;
}

//组件规范/约束 -组件开发人员 接口
interface Icomputent {
  tempContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}

function video(options: Ivideo) {
  return new Video(options);
}

class Video implements Icomputent {
  tempContainer;
  constructor(private settings: Ivideo) {
    //由于以下参数为非必传 需设定默认值
    this.settings = Object.assign({
      width: '100%',
      height: '100%',
      autoplay: false
    }, this.settings)
    this.init();
  }
  init() {
    this.template();
    this.handle();
  }
  template() {
    this.tempContainer = document.createElement('div');
    this.tempContainer.className = styles.default.video;
    this.tempContainer.style.width = this.settings.width;
    this.tempContainer.style.height = this.settings.height;
    this.tempContainer.innerHTML = `
    <video class="${styles.default['video-content']}" src="${this.settings.url}"></video>
    <div class="${styles.default['video-controls']}">
      <div class="${styles.default['video-progress']}">
        <div class="${styles.default['video-progress-now']}"></div>
        <div class="${styles.default['video-progress-success']}"></div>
        <div class="${styles.default['video-progress-bar']}"></div>
      </div>
        <div class="${styles.default['video-play']}">
          <i class="iconfont icon-can"></i>
        </div>
        <div class="${styles.default['video-time']}">
          <span>00:00</span> / <span>00:00</span>
        </div>
        <div class="${styles.default['video-full']}">
          <i class="iconfont icon-ds"></i>
        </div>
        <div class="${styles.default['video-volume']}">
          <i class="iconfont icon-focus"></i>
          <div class="${styles.default['video-vol-progress']}">
            <div class="${styles.default['video-vol-progress-now']}"></div>
            <div class="${styles.default['video-vol-progress-success']}"></div>
            <div class="${styles.default['video-vol-progress-bar']}"></div>
          </div>
        </div>
    </div>`;
    // 断言运算符
    if (typeof this.settings.elem === 'object') {
      this.settings.elem.appendChild(this.tempContainer)
    } else {
      document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer)
    }
  }
  handle() {
    let videoContent: HTMLVideoElement = this.tempContainer.querySelector(`.${styles.default['video-content']}`)
    let videoControls = this.tempContainer.querySelector(`.${styles.default['video-controls']}`)
    let videoPlay = this.tempContainer.querySelector(`.${styles.default['video-controls']} i`)
    let videoTimes = this.tempContainer.querySelectorAll(`.${styles.default['video-time']} span`)
    let videoFull = this.tempContainer.querySelector(`.${styles.default['video-full']} i`)
    let videoProgress = this.tempContainer.querySelectorAll(`.${styles.default['video-progress']} div`)
    let videoVolProgress = this.tempContainer.querySelectorAll(`.${styles.default['video-vol-progress']} div`)

    let timer;
    videoContent.volume = 0.5
    //是否自动播放
    if (this.settings.autoplay) {
      timer = setInterval(playing, 1000);
      videoContent.play();
    }

    //mouseenter 不会产生冒泡事件
    this.tempContainer.addEventListener('mouseenter', function () {
      videoControls.style.bottom = 0
    })
    this.tempContainer.addEventListener('mouseleave', function () {
      videoControls.style.bottom = '-50px';
    })

    //视频是否加载完毕
    videoContent.addEventListener('canplay', () => {
      videoTimes[1].innerHTML = formatTime(videoContent.duration)
    })
    //视频播放事件
    videoContent.addEventListener('play', () => {
      videoPlay.className = "iconfont icon-cart"
      timer = setInterval(playing, 1000);
    })
    //视频暂停事件
    videoContent.addEventListener('pause', () => {
      videoPlay.className = "iconfont icon-demo01"
      clearInterval(timer);
    })

    //播放
    videoPlay.addEventListener('click', () => {
      if (videoContent.paused) {
        videoContent.play();
      } else {
        videoContent.pause();
      }
    });
    //全屏
    videoFull.addEventListener('click', () => {
      videoContent.requestFullscreen();
      if (videoContent.requestFullscreen) {
        videoContent.requestFullscreen();
      }
    })

    //拖拽小球获取播放所在的位置和拖拽的位置差值加之前位置得到当前位置
    videoProgress[2].addEventListener('mousedown', function (ev: MouseEvent) {
      let downX = ev.pageX;
      let downL = this.offsetLeft;
      document.onmousemove = (ev: MouseEvent) => {
        let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
        if (scale < 0) {
          scale = 0;
        } else if (scale > 1) {
          scale = 1;
        }
        videoProgress[0].style.width = scale * 100 + "%";
        videoProgress[1].style.width = scale * 100 + "%";
        this.style.left = scale * 100 + "%";
        videoContent.currentTime = scale * videoContent.duration;
      }
      document.onmouseup = () => {
        //阻止鼠标移动
        document.onmousemove = document.onmouseup = null
      }
      //阻止冒泡
      ev.preventDefault();
    });

    //音量
    videoVolProgress[1].addEventListener('mousedown', function (ev: MouseEvent) {
      let downX = ev.pageX;
      let downL = this.offsetLeft;
      document.onmousemove = (ev: MouseEvent) => {
        let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
        if (scale < 0) {
          scale = 0;
        } else if (scale > 1) {
          scale = 1;
        }
        videoVolProgress[0].style.width = scale * 100 + "%";
        videoVolProgress[1].style.width = scale * 100 + "%";
        this.style.left = scale * 100 + "%";
        videoContent.volume = scale;
      }
      document.onmouseup = () => {
        //阻止鼠标移动
        document.onmousemove = document.onmouseup = null
      }
      //阻止冒泡
      ev.preventDefault();
    });

    //播放进度
    function playing() {//正在播放中
      //进度条比例值
      let scale = videoContent.currentTime / videoContent.duration;
      //缓存节点时间
      let scaleSuc = videoContent.buffered.end(0) / videoContent.duration;
      videoTimes[0].innerHTML = formatTime(videoContent.currentTime);
      videoProgress[0].style.width = scale * 100 + '%'
      videoProgress[2].style.left = scale * 100 + '%'
      videoProgress[1].style.width = scaleSuc * 100 + '%'
    }
    //秒数转为分钟
    function formatTime(number: number): string {
      number = Math.round(number);
      let min = Math.floor(number / 60);
      let sec = number % 60;
      return setZero(min) + ':' + setZero(sec)

    }
    //小于10的数字补0
    function setZero(number: number): string {
      if (number < 10) {
        return "0" + number
      } else {
        return "" + number
      }
    }
  }
}

export default video;