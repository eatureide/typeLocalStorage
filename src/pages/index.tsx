import React from 'react';
import { Toast } from 'antd-mobile';
import 'swiper/swiper-bundle.min.css';
import './index.less';

import mock from './mock';

const transParent =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export default class VideoCarsouel extends React.Component {
  player: any = null;
  swiper: any = null;
  initialPlayer: any = null;

  state = {
    carsouelData: [],
    realIndex: 0,
    virtualData: {
      offset: 0,
      slides: [],
    },
  };

  handleSetPlayer = (
    id: string,
    videoData: { vid: string; playauth: string; cover: string },
  ) => {
    return new window.Aliplayer({
      id,
      ...videoData,
      qualitySort: 'asc',
      format: 'mp4',
      mediaType: 'video',
      width: '100%',
      height: '100%',
      autoplay: false,
      isLive: false,
      rePlay: false,
      playsinline: true,
      preload: true,
      controlBarVisibility: 'hover',
      useH5Prism: true,
    });
  };

  handleSetVideoTransParent = (id: string) => {
    const node: any = document.getElementById(id);
    if (node) {
      const videoNode = node.firstChild;
      videoNode.setAttribute('poster', transParent);
      videoNode.style.visibility = 'visible';
    }
  };

  handleSlideChange = () => {
    /**
     * slider后的回调，每个slider滑动后都一定会重置到底二个slider已达到虚拟滚动的效果，所以只需要传player-1即可
     */

    const realIndex = this.swiper.realIndex || 0;
    const carsouelData = this.state.carsouelData;
    const currVideo: any = carsouelData[realIndex];
    const playerData = {
      vid: currVideo.videoId,
      playauth: currVideo.playAuth,
      cover: transParent,
    };

    if (!this.player) {
      this.player = this.handleSetPlayer('player-1', playerData);
      this.player.on('init', () => {
        this.handleSetVideoTransParent('player-1');
      });
      this.player.on('ready', () => {
        this.handleSetVideoTransParent('player-1');
        this.player.play();
      });
      return;
    }
    if (this.initialPlayer) {
      this.initialPlayer.pause();
    }
    this.player.pause();
    this.player.replayByVidAndPlayAuth(currVideo.videoId, currVideo.playAuth);
  };

  handleSetInitialPlayer = () => {
    /**
     * 设置初始player，用于第一个slider
     */
    const realIndex = this.swiper.realIndex || 0;
    const carsouelData = this.state.carsouelData;
    const currVideo: any = carsouelData[realIndex];
    const playerData = {
      vid: currVideo.videoId,
      playauth: currVideo.playAuth,
      cover: transParent,
    };
    if (!this.initialPlayer) {
      this.initialPlayer = this.handleSetPlayer('player-0', playerData);
      return;
    }
    if (this.player) {
      this.player.pause();
    }
    this.handleSetVideoTransParent('player-0');
    this.initialPlayer.pause();
    this.initialPlayer.play();
  };

  handleGetVideoList = () => {
    const { current } = mock.data;
    const nextList = mock.data.nextPage.list;
    const prevList = mock.data.prevPage.list;
    const result = [{ ...current }, ...prevList, ...nextList];
    this.setState({ carsouelData: result }, () => {
      this.handleSetSwiper();
    });
  };

  handleSetSwiper = () => {
    const mySwiper = new window.Swiper('.swiper-container', {
      direction: 'vertical',
      on: {
        slideChangeTransitionEnd: (e: any) => {
          if (this.swiper.realIndex !== 0) {
            this.handleSlideChange();
            return;
          }
          this.handleSetInitialPlayer();
        },
        init: () => {
          setTimeout(() => {
            this.handleSetInitialPlayer();
          }, 800);
        },
      },
      virtual: {
        slides: this.state.carsouelData,
        renderExternal: (data: any) => {
          this.setState({ virtualData: data });
        },
      },
    });
    this.swiper = mySwiper;
  };

  componentDidMount() {
    this.handleGetVideoList();
  }

  render() {
    const { virtualData } = this.state;

    return (
      <div className="carsouel">
        <div className="swiper-container">
          <div className="swiper-wrapper">
            {virtualData.slides.map((slideContent: any, index) => {
              return (
                <div
                  key={index}
                  className="swiper-slide"
                  style={{
                    height: '100vh',
                    width: '100%',
                    background: `url(${slideContent.coverImgUrl}) center no-repeat`,
                    top: `${virtualData.offset}px`,
                  }}
                >
                  <div className="playerBox">
                    <div id={`player-${index}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
