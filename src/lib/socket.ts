import { baseUrl } from "@/util/siteOrigin";
import { io } from "socket.io-client";

export const socket = io(`${baseUrl}`, {
  autoConnect: false,
});
