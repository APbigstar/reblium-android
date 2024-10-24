import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function AvatarScreen() {
  return (
    <View style={styles.container}>
      <Text>Avatar Screen</Text>
      <Pressable>
        <Link href="/avatarMode">Go to Avatar mode Screen</Link>
      </Pressable>
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
