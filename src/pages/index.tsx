import React from 'react';
import { Toast } from 'antd-mobile';
import 'swiper/swiper-bundle.min.css';
import './index.less';

import mock from './mock';

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

  handleSetPlayer = () => {
    const { carsouelData } = this.state;
    const { realIndex } = this.swiper;
    const transParent =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const setTransParent = () => {
      const node: any = document.getElementById('player-1');
      const videoNode = node.firstChild;
      videoNode.setAttribute('poster', transParent);
      videoNode.style.visibility = 'visible';
    };

    const resetPlayer = () => {
      const currVideo: any = carsouelData[realIndex];
      const player = new window.Aliplayer({
        id: realIndex === 0 ? 'player-0' : 'player-1',
        vid: currVideo.videoId,
        playauth: currVideo.playAuth,
        cover: transParent,
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

      this.player = player;

      this.player.on('init', () => {
        setTransParent();
      });

      this.player.on('ready', () => {
        setTransParent();
        this.player.play();
      });
    };

    if (this.player) {
      const currVideo: any = carsouelData[realIndex];
      this.player.pause();
      this.player.replayByVidAndPlayAuth(currVideo.videoId, currVideo.playAuth);
    } else {
      resetPlayer();
    }
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
          this.handleSetPlayer();
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
