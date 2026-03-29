import axiosInstance from "../lib/axios";


interface JoinResponse {
  success: boolean;
  message: string;
  data: {
    participant: string;
    checkoutSession?: {
      url: string;
      sessionId: string;
    };
  };
}

export const joinEvent = async (eventId: string) => {
  const res = await axiosInstance.post<JoinResponse>(`/v1/event-participants/${eventId}/join`);
  return res.data.data;
};