import React, {PureComponent} from 'react';

import {
  View,
  Text,
} from 'react-native';

import {AnimatedContainer} from "react-native-animated-container";

export class Demo3 extends PureComponent {

  constructor(props) {
    super(props);
    this._animationRefs = {};
  }

  componentDidMount() {
    this._playAnimation();
  }

  _playAnimation() {
    this._animationRefs[1]
      .moveTo({x: 200, y: 0})
      .then(() => this._animationRefs[2].moveTo({x: 0, y: 200}))
      .then(() => this._animationRefs[4].moveTo({x: 200, y: 200}))
      .then(() => this._animationRefs[3].moveTo({x: 0, y: 0}));
  }

  _renderAnimationElement(text, index, position) {
    return (
      <AnimatedContainer
        ref={_ => this._animationRefs[index] = _}
        initialConfig={{opacity: 1, x: position.x, y: position.y}}
      >
        <Text>put your {text} here</Text>
      </AnimatedContainer>
    );
  }

  render() {
    return (
      <View style={{width: 200, height: 200}}>
        {this._renderAnimationElement('1st element', 1, {x: 0, y: 0})}
        {this._renderAnimationElement('2nd element', 2, {x: 200, y: 0})}
        {this._renderAnimationElement('3rd element', 3, {x: 200, y: 200})}
        {this._renderAnimationElement('4th element', 4, {x: 0, y: 200})}
      </View>
    );
  }
}