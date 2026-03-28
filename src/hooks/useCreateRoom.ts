import { useMutation } from "@tanstack/react-query";
import { createRoom } from "@/service/api";

export const useCreateRoom = () => {
  return useMutation({
    mutationFn: createRoom,
  });
};
