import axiosInstance from "../lib/axios";


export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface INotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface INotificationResponse {
  data: INotification[];
  meta: INotificationMeta;
}

export const getMyNotifications = async (page = 1, limit = 10): Promise<INotificationResponse> => {
  const res = await axiosInstance.get(`/v1/notifications?page=${page}&limit=${limit}`);
  return res.data;
};

export const markNotificationAsRead = async (id: string) => {
  const res = await axiosInstance.patch(`/v1/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await axiosInstance.patch(`/v1/notifications/read-all`);
  return res.data;
};

export const deleteAllNotificationsAsRead = async () => {
  const res = await axiosInstance.delete(`/v1/notifications`);
  return res.data;
};