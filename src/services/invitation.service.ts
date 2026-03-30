import axiosInstance from "../lib/axios";

export const sendInvitation = async ({
  eventId,
  invitedUserId,
}: {
  eventId: string;
  invitedUserId: string;
}) => {
  const res = await axiosInstance.post(`/v1/invitations/${eventId}/invite`, {
    invitedUserId,
  });
  return res.data;
};

export const getMyInvitations = async () => {
  const res = await axiosInstance.get("/v1/invitations/my-invitations");
  return res.data?.data || [];
};

export const acceptInvitation = async (invitationId: string) => {
  const res = await axiosInstance.patch(`/v1/invitations/${invitationId}/accept`);
  return res.data?.data;
};

export const declineInvitation = async (invitationId: string) => {
  const res = await axiosInstance.patch(`/v1/invitations/${invitationId}/decline`);
  return res.data;
};