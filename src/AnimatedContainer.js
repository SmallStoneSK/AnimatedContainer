import React, {PureComponent} from 'react';

import {
  Animated
} from 'react-native';

import {INF} from "./Constants";
import {Helper} from "./Helper";

export class AnimatedContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.cyclicAnimations = {};
    this.cyclicAnimationRunningFlags = {};
  }

  componentWillMount() {
    this._initAnimationConfig();
  }

  _initAnimationConfig() {

    const {initialConfig} = this.props;
    const {opacity = 1, scale = 1, x = 0, y = 0, rotate = 0} = initialConfig;

    // create animated values: opacity, scale, x, y, rotate
    this.opacityAnimatedValue = new Animated.Value(opacity);
    this.scaleAnimatedValue = new Animated.Value(scale);
    this.rotateAnimatedValue = new Animated.Value(rotate);
    this.xAnimatedValue = new Animated.Value(x);
    this.yAnimatedValue = new Animated.Value(y);

    this.style = {
      position: 'absolute',
      left: this.xAnimatedValue,
      top: this.yAnimatedValue,
      opacity: Helper.animateInterpolate(this.opacityAnimatedValue, [0, 1], [0, 1]),
      transform: [
        {scale: this.scaleAnimatedValue},
        {rotate: Helper.animateInterpolate(this.rotateAnimatedValue, [-INF, INF], [`-${INF}rad`, `${INF}rad`])}
      ]
    };
  }

  _createAnimation(animationConfig = []) {
    const len = animationConfig.length;
    if (len === 1) {
      const {animatedValue, toValue, duration} = animationConfig[0];
      return Animated.timing(animatedValue, {toValue, duration});
    } else if (len >= 2) {
      return Animated.parallel(animationConfig.map(config => {
        return this._createAnimation([config]);
      }));
    }
  }

  _createCyclicAnimation(name, animations) {
    this.cyclicAnimationRunningFlags[name] = true;
    this.cyclicAnimations[name] = Animated.sequence(animations);
  }

  _createAnimationPromise(animationConfig = []) {
    return new Promise(resolve => {
      const len = animationConfig.length;
      if(len <= 0) {
        resolve();
      } else {
        this._createAnimation(animationConfig).start(() => resolve());
      }
    });
  }

  _createCyclicAnimationPromise(name, animations) {
    return new Promise(resolve => {
      this._createCyclicAnimation(name, animations);
      this._playCyclicAnimation(name);
      resolve();
    });
  }

  _playCyclicAnimation(name) {
    const animation = this.cyclicAnimations[name];
    animation.start(() => {
      animation.reset();
      this.cyclicAnimationRunningFlags[name] && this._playCyclicAnimation(name);
    });
  }

  _stopCyclicAnimation(name) {
    this.cyclicAnimations[name].stop();
    this.cyclicAnimationRunningFlags[name] = false;
  }

  sleep(millSeconds = 0) {
    return Helper.sleep(millSeconds);
  }

  blink(config = {period: 2000}) {
    return this._createCyclicAnimationPromise('blink', [
      this._createAnimation([{
        toValue: 1,
        duration: config.period / 2,
        animatedValue: this.opacityAnimatedValue
      }]),
      this._createAnimation([{
        toValue: 0,
        duration: config.period / 2,
        animatedValue: this.opacityAnimatedValue
      }])
    ]);
  }

  stopBlink() {
    this._stopCyclicAnimation('blink');
  }

  roll(config = {period: 1000}) {
    return this._createCyclicAnimationPromise('roll', [
      this._createAnimation([{
        toValue: Math.PI * 2,
        duration: config.period,
        animatedValue: this.rotateAnimatedValue
      }])
    ]);
  }

  stopRoll() {
    this._stopCyclicAnimation('roll');
  }

  show(config = {opacity: 1, duration: 500}) {
    return this.opacityTo(config);
  }

  hide(config = {opacity: 0, duration: 500}) {
    return this.opacityTo(config);
  }

  opacityTo(config = {opacity: .5, duration: 500}) {
    return this._createAnimationPromise([{
      toValue: config.opacity,
      duration: config.duration,
      animatedValue: this.opacityAnimatedValue
    }]);
  }

  scaleTo(config = {scale: 1, duration: 1000}) {
    return this._createAnimationPromise([{
      toValue: config.scale,
      duration: config.duration,
      animatedValue: this.scaleAnimatedValue
    }]);
  }

  rotateTo(config = {rotate: 0, duration: 500}) {
    return this._createAnimationPromise([{
      toValue: config.rotate,
      duration: config.duration,
      animatedValue: this.rotateAnimatedValue
    }]);
  }

  moveTo(config = {x: 0, y: 0, duration: 1000}) {
    return this._createAnimationPromise([{
      toValue: config.x,
      duration: config.duration,
      animatedValue: this.xAnimatedValue
    }, {
      toValue: config.y,
      duration: config.duration,
      animatedValue: this.yAnimatedValue
    }]);
  }

  render() {
    return (
      <Animated.View style={[this.style, this.props.style]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

AnimatedContainer.defaultProps = {
  initialConfig: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0
  }
};