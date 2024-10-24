import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function AvatarModeScreen() {
  return (
    <View style={styles.container}>
      <Text>Avatar Mode Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
