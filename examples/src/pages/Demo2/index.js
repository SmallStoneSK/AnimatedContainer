import React, {PureComponent} from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground
} from 'react-native';

import {Helper} from "../../common/Helper";
import {DeviceSize} from "../../common/Constants";

import {AnimatedContainer} from "react-native-animated-container";

export class Demo2 extends PureComponent {

  constructor(props) {
    super(props);
    this._stars = [];
  }

  componentDidMount() {
    Helper
      .sleep(500)
      .then(() => this.startOpeningAnimation());
  }

  static randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  startOpeningAnimation() {

    // 签到一次性动画
    Promise
      .all([
        this._header.show(),
        this._header.scaleTo({scale: 1}),
        this._header.rotateTo({rotate: Math.PI * 2})
      ])
      .then(() => this._header.sleep(100))
      .then(() => this._header.moveTo({x: 64, y: 150}))
      .then(() => Promise.all([
        this._tips.show(),
        this._ladder.sleep(150).then(() => this._ladder.show())
      ]))
      .then(() => Promise.all([
        this._today.show(),
        this._today.moveTo({x: 105, y: 365})
      ]));

    // 星星闪烁循环动画
    this._stars.forEach(item => item
      .sleep(Math.random() * 2000)
      .then(() => item.blink({period: 1000}))
    );
  }

  _renderHeader() {
    return (
      <AnimatedContainer
        ref={_ => this._header = _}
        initialConfig={{opacity: 0, scale: 0, x: 64, y: 250}}
        >
        <ImageBackground
          style={styles.headerBgImage}
          source={require('../../pic/demo2/header-bg.png')}
          >
          <Text style={styles.checkInText}>签到成功</Text>
          <Text style={styles.dateText}>4月1日 周日</Text>
        </ImageBackground>
      </AnimatedContainer>
    );
  }

  _renderTips() {
    return (
      <AnimatedContainer
        ref={_ => this._tips = _}
        style={styles.tipsContainer}
        initialConfig={{opacity: 0, x: 0, y: 230}}
        >
        <Text style={styles.tipsText}>您今日签到获得1经验值和4金币</Text>
        <Text style={styles.tipsText}>签到每满3次，可获得红包！</Text>
      </AnimatedContainer>
    );
  }

  _renderLadder() {
    return [
      <AnimatedContainer
        key={'ladder'}
        ref={_ => this._ladder = _}
        initialConfig={{opacity: 0, x: 122.5, y: 330}}
        >
        <Image style={styles.ladderImage} source={require('../../pic/demo2/ladder.png')}/>
      </AnimatedContainer>,
      <AnimatedContainer
        key={'today'}
        ref={_ => this._today = _}
        style={styles.todayContainer}
        initialConfig={{opacity: 0, x: 105, y: 380}}
        >
        <Text style={styles.todayText}>4月1日</Text>
        <Image style={styles.diamondImage} source={require('../../pic/demo2/diamond.png')}/>
      </AnimatedContainer>
    ];
  }

  _renderStars() {
    const positions = [
      {x: 50, y: 50},
      {x: 70, y: DeviceSize.HEIGHT - 100},
      {x: 100, y: 300},
      {x: 320, y: DeviceSize.HEIGHT - 200},
      {x: 300, y: 70},
    ];
    return new Array(5).fill(1).map((item, index) => {
      return (
        <AnimatedContainer
          key={`star-${index}`}
          ref={_ => this._stars[index] = _}
          initialConfig={{opacity: 0, x: positions[index].x, y: positions[index].y, scale: Demo2.randomRange(.3, .8)}}
          >
          <Image style={styles.starImage} source={require('../../pic/demo2/star.png')}/>
        </AnimatedContainer>
      );
    });
  }

  render() {
    return (
      <View style={styles.demoContainer}>
        {this._renderStars()}
        {this._renderHeader()}
        {this._renderTips()}
        {this._renderLadder()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  demoContainer: {
    flex: 1,
    backgroundColor: '#22253E'
  },
  headerBgImage: {
    width: 247,
    height: 54
  },
  checkInText: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center'
  },
  dateText: {
    marginTop: 5,
    fontSize: 11,
    color: '#FFF',
    textAlign: 'center'
  },
  tipsContainer: {
    width: DeviceSize.WIDTH,
    alignItems: 'center'
  },
  tipsText: {
    marginBottom: 8,
    color: '#FFF'
  },
  ladderImage: {
    width: 130,
    height: 168
  },
  todayContainer: {
    flexDirection: 'row'
  },
  todayText: {
    marginTop: 2,
    fontSize: 10,
    color: '#FFF'
  },
  diamondImage: {
    width: 15,
    height: 21,
    marginLeft: 6
  },
  starImage: {
    width: 20,
    height: 20
  }
});