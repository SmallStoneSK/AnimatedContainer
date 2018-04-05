import {
  Dimensions
} from 'react-native';

const INF = 999999999;

const device = Dimensions.get('window');
const DeviceSize = {
  WIDTH: device.width,
  HEIGHT: device.height
};

export {
  INF,
  DeviceSize
};