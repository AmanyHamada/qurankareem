import { StyleSheet } from "react-native";

export const MAIN_BUTTON_STYLES = {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#e8e8e8"
};

export const STOP_BUTTON_STYLES = {
  width: 40,
  height: 40,
};

export const BUTTON_ACTIVE_COLOR = "#bcbaba";

export const styles = StyleSheet.create({
  view: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 10
  },

  panel: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 120
  },
  stopButtonContainer: {
    position: "absolute",
    left: 80
  }
});
