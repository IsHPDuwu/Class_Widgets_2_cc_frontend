export interface Policy {
  policy_version: number;
  overrides: Record<string, any>;
  locked_keys: string[];
  schedule_readonly: boolean;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  level: string;
  group: string | null;
  created_at: string;
}

export interface AuditLog {
  id: number;
  action: string;
  details: Record<string, any>;
  created_at: string;
  user: string | null;
}
