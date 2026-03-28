export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  type: 'PUBLIC' | 'PRIVATE';
  registrationFee: number;
  creatorId: string;
  creator: User;
}