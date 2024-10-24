// WebRTCManager.ts
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  RTCView,
} from "react-native-webrtc";
import { RefObject } from "react";

type WebRTCConfig = {
  address: string;
  shareId: string;
  onResponse?: (response: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
};

class WebRTCManager {
  private static instance: WebRTCManager;
  private peerConnection: RTCPeerConnection | null = null;
  private webSocket: WebSocket | null = null;
  private remoteStream: MediaStream | null = null;
  private config: WebRTCConfig | null = null;
  private latestAvatarData: string | null = null;

  private constructor() {}

  public static getInstance(): WebRTCManager {
    if (!WebRTCManager.instance) {
      WebRTCManager.instance = new WebRTCManager();
    }
    return WebRTCManager.instance;
  }

  public async initialize(
    videoRef: RefObject<typeof RTCView>,
    config: WebRTCConfig
  ): Promise<void> {
    this.config = config;
    this.config.onLoadingChange?.(true);

    try {
      await this.setupWebRTC(videoRef);
      this.setupWebSocket();
    } catch (error) {
      console.error("WebRTC initialization failed:", error);
      this.config.onLoadingChange?.(false);
      throw error;
    }
  }

  private async setupWebRTC(videoRef: RefObject<typeof RTCView>) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    (this.peerConnection as any).addEventListener("track", (event: any) => {
      if (event.streams?.[0]) {
        this.remoteStream = event.streams[0];
        if (videoRef.current) {
          (videoRef.current as any).streamURL = this.remoteStream?.toURL();
        }
        this.config?.onLoadingChange?.(false);
      }
    });
  }

  private setupWebSocket() {
    if (!this.config?.address) return;

    this.webSocket = new WebSocket(this.config.address);

    this.webSocket.onopen = () => {
      console.log("WebSocket connected");
      this.webSocket?.send(
        JSON.stringify({
          type: "connect",
          shareId: this.config?.shareId,
        })
      );
    };

    this.webSocket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received message:", message.type);

        switch (message.type) {
          case "offer":
            await this.handleOffer(message);
            break;
          case "candidate":
            await this.handleCandidate(message);
            break;
          case "response":
            this.config?.onResponse?.(message.data);
            break;
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    this.webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.webSocket.onclose = () => {
      console.log("WebSocket closed");
    };
  }

  private async handleOffer(message: any) {
    if (!this.peerConnection) return;

    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(message)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.webSocket?.send(
        JSON.stringify({
          type: "answer",
          sdp: answer.sdp,
        })
      );
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  }

  private async handleCandidate(message: any) {
    if (!this.peerConnection || !message.candidate) return;
    try {
      await this.peerConnection.addIceCandidate(
        new RTCIceCandidate(message.candidate)
      );
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  }

  public async loadAvatar(jsonFilePath: string): Promise<void> {
    try {
      const response = await fetch(jsonFilePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      const avatarCommand = JSON.stringify(jsonData);
      this.latestAvatarData = avatarCommand;
      await this.sendCommand({ resetavatar: avatarCommand });
    } catch (error) {
      console.error("Failed to load avatar:", error);
      throw error;
    }
  }

  public async sendCommand(command: Record<string, string>): Promise<void> {
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    try {
      this.webSocket.send(
        JSON.stringify({
          type: "command",
          command: command,
        })
      );
      console.log("Command sent:", command);
    } catch (error) {
      console.error("Error sending command:", error);
      throw error;
    }
  }

  public resetAvatar(): void {
    if (this.latestAvatarData) {
      this.sendCommand({ resetavatar: this.latestAvatarData });
    }
  }

  public cleanup(): void {
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }

    this.config = null;
    this.latestAvatarData = null;
  }
}

export const webRTCManager = WebRTCManager.getInstance();
