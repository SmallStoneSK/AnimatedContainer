# AnimatedContainer
A container component for creating PPT-like animations in react-native

## Introduction
In RN, Animated provides the ability to create animations. However, when we need to create some complex animations just like in PPT, it is rather hard for us. Fortunately, you can use AnimatedContainer to solve this problem.

## How to use

**Installation**

```
npm install react-native-animated-container --save
```

**Usage**

It only needs two steps: 

1. Get the ref of AnimatedContainer and set the initial config for it. Just like this:

```javascript
<View style={{flex: 1}}>
  <AnimatedContainer
    ref={_ => this._animationRef = _}
    initialConfig={{opacity: 0, x: 0, y: 0}}
    >
    {/*put your components here*/}
  </AnimatedContainer>
</View>
```

2. Use promise to control the animation flow. Just like this:

```javascript
playAnimation() {
  this._animationRef
    .show()                                                                  // appear
    .then(() => this._animationRef.sleep(1000))                              // sleep 1s
    .then(() => this._animationRef.moveTo({x: 200, y: 0, duration: 1000}))   // move to (200, 0)
    .then(() => this._animationRef.moveTo({x: 0, y: 200, duration: 500}))    // move to (0, 200)
    .then(() => this._animationRef.hide());                                  // disappear
}
```

**Demo**

```javascript
class Demo extends Component {

  constructor(props) {
    super(props);
    this._animationRefs = {};
  }

  componentDidMount() {
    this._playAnimation();
  }

  _playAnimation() {
    // here is to control the animation flow
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
```

To see more detailed example, you can open the file: examples/src/pages/Demo2/index.js

## More Details

### initialConfig

AnimatedContainer needs the initialConfig to set initial values when first rendering. initialConfig is an object, including the following attributes:

|attribute|type|default value|description|
|---------|----|-------------|-----------|
|opacity|number|1|the opacity of element|
|scale|number|1|by changing the scale, the element's size will change|
|rotate|number|0|the rotated angle of element|
|x|number|0|the x position of element|
|y|number|0|the y position of element|

Note: as animated container uses absolute position, you should put all of them in a wrapper. In addition, you should set the x, y value for each animatedContainer. Or all of elements will be at the left top corner.

### animation playing functions

AnimatedContainer provides two kinds of animation: cyclic and not cyclic.

**cyclic animations**

In the period, the element's opacity grows to 1, and then decay to 0.  
blink({period: 1000})  
stopBlink()

In the period, the elements will keep rolling.  
roll({period: 1000})  
stopRoll()

**not cyclic animations**

By passing the value of duration, you can control the speed of show/hide animation.  
show({duration: 1000})  
hide({duration: 1000})

By passing the value of scale, you can control the size of element.  
scaleTo({scale: 1, duration: 1000})

By passing the value of x and y, you can control the position of element.  
movaTo({x: 100, y: 100, duration: 1000})

By passing the value of rotate, you can control the rotated angle of element.  
rotateTo({rotate: Math.PI, duration: 1000})

### sequent and parallel playing

As each animation provided by AnimatedContainer is a promise, so it is easy to realize sequent and parallel playing.

sequent playing:

```javascript
this._animationRef
  .show()
  .then(() => this._animationRef.moveTo({x: 100, y: 100}))
  .then(() => this._animationRef.scaleTo({scale: .5, duartion: 2000}))
  .then(() => this._animationRef.moveTo({x: 0, y: 100}))
  .then(() => this._animationRef.hide())
```

parallel playing:

```javascript
Promise.all([
  this._animationRef.scaleTo({scale: 1.5}),
  this._animationRef.moveTo({x: 100, y: 100})
]).then(() => Promise.all([
  this._animationRef.opacityTo({opacity: .5}),
  this._animationRef.moveTo({x: 0, y: 0})
)).then(() => this._animationRef.hide());
```
