
export type MemberRole = 'admin' | 'staff' | 'manager' | 'warden';

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  email?: string;
  created_at: string;
}

export interface MemberFormData {
  name: string;
  role: MemberRole;
  email: string;
}
