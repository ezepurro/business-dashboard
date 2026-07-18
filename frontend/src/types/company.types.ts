export interface Company {
  _id: string;
  name: string;
  industry: string | null;
  currency: string;
  foundedAt: string | null;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyPayload {
  name: string;
  industry?: string | null;
  currency?: string;
  foundedAt?: string | null;
}
