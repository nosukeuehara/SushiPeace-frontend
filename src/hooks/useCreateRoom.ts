import { useMutation } from "@tanstack/react-query";
import { createRoom, type CreateRoomPayload, type CreateRoomResponse } from "../api/room";

export const useCreateRoom = (
  onSuccess: (data: CreateRoomResponse) => void
) => {
  return useMutation({
    mutationFn: (payload: CreateRoomPayload) => createRoom(payload),
    onSuccess,
  });
};
