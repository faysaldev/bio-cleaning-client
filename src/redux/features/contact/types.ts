export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  reply?: string;
  createdAt: string;
}

export interface ContactResponse {
  data: ContactMessage[];
}
