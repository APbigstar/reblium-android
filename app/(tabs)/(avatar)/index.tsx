import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function AvatarScreen() {
  return (
    <View style={styles.container}>
      <Text>Avatar Screen</Text>
      <Link href="/avatarMode">Go to Avatar mode Screen</Link>
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
