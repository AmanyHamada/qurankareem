import React from "react";
import {
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  StyleSheet
} from "react-native";
import { Icon } from "./Icon";

const touchables = {
  opacity: TouchableOpacity,
  highlight: TouchableHighlight
};

type Props = {
  type: string,
  icon: Object,
  buttonStyles: Object,
  activeColor?: string,
  onPress?: Function,
  disabled?: boolean
};

export class Button extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.scale = new Animated.Value(1);
    this.handlePressIn = this.handlePressIn.bind(this);
    this.handlePressOut = this.handlePressOut.bind(this);
  }

  handlePressIn() {
    Animated.spring(this.scale, {
      toValue: 0.8,
      useNativeDriver: true
    }).start();
  }

  handlePressOut() {
    const { onPress } = this.props;
    Animated.spring(this.scale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true
    }).start();
    onPress();
  }

  render() {
    const { type, icon, buttonStyles, activeColor, disabled } = this.props;
    const { name, size, color } = icon;
    const accessibilityTraits = ["button"];
    let opacity = 1;

    if (disabled) {
      opacity = 0.5;
      accessibilityTraits.push("disabled");
    }

    const touchable = {
      ...buttonStyles,
      opacity,
      justifyContent: "center",
      alignItems: "center"
    };

    const styles = StyleSheet.create({ touchable });
    const Touchable = touchables[type];

    return (
      <Animated.View style={{ transform: [{ scale: this.scale }] }}>
        <Touchable
          disabled={disabled}
          style={styles.touchable}
          accessibilityTraits={accessibilityTraits}
          underlayColor={activeColor}
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
        >
          <Icon name={name} size={size} color={color} />
        </Touchable>
      </Animated.View>
    );
  }
}

Button.defaultProps = {
  activeColor: undefined,
  onPress: () => {},
  disabled: false
};
