import axiosInstance from "../lib/axios";


interface JoinResponse {
  success: boolean;
  message: string;
  data: {
    requiresPayment?: boolean;
    eventId?: string;
    // for free events, backend returns the participant object directly
    id?: string;
    userId?: string;
    status?: string;
    isPaid?: boolean;
  };
}

export const joinEvent = async (eventId: string) => {
  const res = await axiosInstance.post<JoinResponse>(`/v1/event-participants/${eventId}/join`);
  return res.data.data;
};