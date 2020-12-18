import React from 'react';
import { Toast } from 'antd-mobile';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Virtual } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import './index.less';

import mock from './mock';

SwiperCore.use([Virtual]);

let playerTimeout: any = null;
let sliderTimeout: any = null;

export default class VideoCarsouel extends React.Component {
  player: any = null;
  swiper: any = null;

  state = {
    carsouelData: [],
    realIndex: 0,
  };

  handleSetPlayer = () => {
    const { realIndex, carsouelData } = this.state;

    const resetPlayer = () => {
      console.log(realIndex);
      const currVideo: any = carsouelData[realIndex];
      const player = new window.Aliplayer({
        id: `player-${realIndex}`,
        vid: currVideo.videoId,
        playauth: currVideo.playAuth,
        cover: currVideo.coverImgUrl,
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

      this.player.on('init', () => {});

      this.player.on('ready', () => {
        this.player.play();
      });
    };

    if (this.player) {
      clearTimeout(playerTimeout);
      this.player.pause();
      this.player.dispose();
      this.player = null;
      playerTimeout = setTimeout(() => {
        resetPlayer();
      }, 1000);
    } else {
      resetPlayer();
    }
  };

  handleGetVideoList = () => {
    const { current } = mock.data;
    const nextList = mock.data.nextPage.list;
    const prevList = mock.data.prevPage.list;
    const result = [{ ...current }, ...prevList, ...nextList];
    this.setState({ carsouelData: result });
  };

  handleSliderChange = (e: any) => {
    this.setState({ realIndex: e.realIndex }, () => {
      clearTimeout(sliderTimeout);
      sliderTimeout = setTimeout(() => {
        this.handleSetPlayer();
      }, 500);
    });
  };

  handleOnSwiper = (swiper: any) => {
    /**
     * 获取swiper的实例
     */
    this.swiper = swiper;
  };

  componentDidMount() {
    this.handleGetVideoList();
  }

  render() {
    const { carsouelData } = this.state;
    return (
      <div className="carsouel">
        <Swiper
          virtual
          direction="vertical"
          onSlideChange={this.handleSliderChange}
          onSwiper={this.handleOnSwiper}
        >
          {carsouelData.map((slideContent: any, index) => {
            return (
              <SwiperSlide key={slideContent.refId} virtualIndex={index}>
                <div
                  className="playerBox"
                  style={{
                    height: '100vh',
                    width: '100%',
                    background: `url(${slideContent.coverImgUrl}) center no-repeat`,
                  }}
                >
                  <div id={`player-${index}`} className="swiper-slide" />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }
}
