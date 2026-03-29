import axiosInstance from "../lib/axios";

interface EventQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  minFee?: number;
  maxFee?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getAllEvents = async (params?: EventQueryParams) => {
  try {
    const res = await axiosInstance.get("/v1/events", { params }); // Axios handles ?key=value automatically
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getSingleEvent = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/v1/events/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};