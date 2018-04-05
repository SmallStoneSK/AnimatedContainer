import React, {PureComponent} from 'react';

import {
  View,
  Animated,
  StyleSheet
} from 'react-native';

export class Demo1 extends PureComponent {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this._initAnimation();
  }

  componentDidMount() {
    this._playAnimation();
  }

  _interpolateAnimation(animatedValue, inputRange, outputRange) {
    return animatedValue.interpolate({inputRange, outputRange});
  }

  _initAnimation() {

    this.opacityAnimatedValue = new Animated.Value(0);
    this.scaleAnimatedValue = new Animated.Value(0);
    this.topAnimatedValue = new Animated.Value(400);

    this.balloonStyle = {
      position: 'absolute',
      left: 137.5,
      opacity: this._interpolateAnimation(this.opacityAnimatedValue, [0, 1], [0, 1]),
      top: this._interpolateAnimation(this.topAnimatedValue, [-999999, 999999], [-999999, 999999]),
      transform:[{scale: this._interpolateAnimation(this.scaleAnimatedValue, [0, 1], [0, 1])}]
    };
  }

  _playAnimation() {
    Animated.sequence([
      this.step1(),
      this.step2()
    ]).start();
  }

  step1() {
    return Animated.parallel([
      Animated.timing(this.opacityAnimatedValue, {
        toValue: 1,
        duration: 500
      }),
      Animated.timing(this.scaleAnimatedValue, {
        toValue: 1,
        duration: 500
      })
    ]);
  }

  step2() {
    return Animated.timing(this.topAnimatedValue, {
      toValue: 200,
      duration: 1500
    });
  }

  render() {
    return (
      <View style={styles.demoContainer}>
        <Animated.Image
          style={[styles.balloonImage, this.balloonStyle]}
          source={require('../../pic/demo1/balloon.png')}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  demoContainer: {
    flex: 1
  },
  balloonImage: {
    width: 100,
    height: 159
  }
});