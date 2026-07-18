export const ROUTES = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  companies: '/companies',
  companyDetail: (companyId: string) => `/companies/${companyId}`,
} as const;
