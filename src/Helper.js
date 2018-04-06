export const Helper = {
  sleep(millSeconds) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), millSeconds);
    });
  },
  animateInterpolate(animatedValue, inputRange, outputRange) {
    if(animatedValue && animatedValue.interpolate) {
      return animatedValue.interpolate({inputRange, outputRange});
    }
  }
};