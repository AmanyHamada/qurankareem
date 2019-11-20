import React from "react";
import { Animated } from "react-native";
import Foundation from "react-native-vector-icons/dist/Foundation";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome";

function iconType(name) {
  switch (name) {
    case "play":
      return { font: Foundation, id: "play" };
    case "pause":
      return { font: Foundation, id: "pause" };
    case "stop":
      return { font: Foundation, id: "stop" };
    case "radio":
      return { font: Foundation, id: "sound" };
    default:
      return { font: FontAwesome, id: "question" };
  }
}

type Props = {
  name: string,
  size?: number,
  color?: string,
  animated?: boolean,
  isLive?: boolean
};

export class Icon extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.scale = new Animated.Value(1);
  }

  componentDidMount() {
    const { isLive } = this.props;
    if (isLive) {
      this.makeLive();
    }
  }

  componentDidUpdate(prevProps) {
    const { isLive } = this.props;
    if (prevProps.isLive !== isLive) {
      if (isLive) {
        this.makeLive();
      } else {
        this.kill();
      }
    }
  }

  makeLive() {
    Animated.sequence([
      Animated.timing(this.scale, {
        toValue: 1.25,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(this.scale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start(o => {
      if (o.finished) {
        this.makeLive();
      }
    });
  }

  kill() {
    Animated.timing(this.scale, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }

  render() {
    const { name, size, color, animated } = this.props;
    const { font: ActiveIcon, id } = iconType(name);
    const IconCore = <ActiveIcon name={id} size={size} color={color} />;

    if (animated) {
      return (
        <Animated.View style={{ transform: [{ scale: this.scale }] }}>
          {IconCore}
        </Animated.View>
      );
    }
    return IconCore;
  }
}

Icon.defaultProps = {
  size: 25,
  color: "black",
  animated: false,
  isLive: false
};
