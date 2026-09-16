export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  leadSource?: "CONTACT" | "CAREERS";
  reply?: string;
  leadId?: string;
  createdAt: string;
}

export interface ContactResponse {
  data: ContactMessage[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
