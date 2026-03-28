import type { RoomData } from "@/types";
import type { CreateRoomPayload, CreateRoomResponse, RoomResponse } from ".";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { get, post } from "@/service/http.service";

export const createRoom = async (payload: CreateRoomPayload): Promise<CreateRoomResponse> => {
  return (await post(`${baseUrl}/api/room`, payload)).json();
};

export const fetchRoom = async (roomId: string): Promise<RoomData> => {
  const raw: RoomResponse = await (await get(`${baseUrl}/api/room/${roomId}`)).json();

  return {
    ...raw,
    template: {
      prices: raw.templateData ?? {},
    },
  };
};
