import type { CreateRoomPayload, CreateRoomResponse } from ".";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { get, post } from "@/service/http.service";

export const createRoom = async (payload: CreateRoomPayload): Promise<CreateRoomResponse> => {
  return (await post(`${baseUrl}/api/room`, payload)).json();
};

export const fetchRoom = async (roomId: string): Promise<CreateRoomResponse> => {
  return (await get(`${baseUrl}/api/room/${roomId}`)).json();
};
