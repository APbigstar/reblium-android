// AvatarModeScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { RTCView } from "react-native-webrtc";
import { webRTCManager } from "@/lib/useWebRTCManager ";

export default function AvatarModeScreen() {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastResponse, setLastResponse] = useState<string>("");

  useEffect(() => {
    initializeAvatar();
    return () => {
      webRTCManager.cleanup();
    };
  }, []);

  const initializeAvatar = async () => {
    try {
      await webRTCManager.initialize(videoRef, {
        address: "wss://signalling-client.ragnarok.arcware.cloud/",
        shareId: process.env.EXPO_PUBLIC_ARCWARE_SHARE_ID || "",
        onResponse: setLastResponse,
        onLoadingChange: setIsLoading,
      });

      // Load default avatar after connection is established
      const avatarJsonUrl = "YOUR_AVATAR_JSON_URL"; // Replace with your actual avatar JSON URL
      await webRTCManager.loadAvatar(avatarJsonUrl);
    } catch (error) {
      console.error("Failed to initialize avatar:", error);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    await webRTCManager.sendCommand({
      usermessage: "Hello, Avatar!",
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading Avatar...</Text>
      ) : (
        <>
          <RTCView
            ref={videoRef}
            streamURL=""
            style={styles.videoStream}
            objectFit="cover"
            zOrder={0}
            mirror={false}
          />
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => webRTCManager.resetAvatar()}
            >
              <Text style={styles.buttonText}>Reset Avatar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
              <Text style={styles.buttonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
          {lastResponse && <Text style={styles.response}>{lastResponse}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  videoStream: {
    flex: 1,
    width: "100%",
  },
  controls: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  response: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 8,
    color: "#000",
  },
});
