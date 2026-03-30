import axiosInstance from "../lib/axios";

export const createCheckoutSession = async (eventId: string) => {
  const res = await axiosInstance.post("/v1/payments/create-checkout", { eventId });
  return res.data.data as { url: string; sessionId: string };
};