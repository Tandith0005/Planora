/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const getMyEvents = async () => {
  const res = await axiosInstance.get("/v1/events/my-events");
  return res.data;
};

export const updateEvent = async (id: string, payload: any) => {
  const res = await axiosInstance.patch(`/v1/events/${id}`, payload);
  return res.data;
};

export const deleteEvent = async (id: string) => {
  const res = await axiosInstance.delete(`/v1/events/${id}`);
  return res.data;
};