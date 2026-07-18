export interface Group {
  id: string;
  name: string;
  pairing_code: string;
  org: string;
  schedule_version: number;
}

export interface Device {
  id: string;
  device_name: string;
  status: string;
  last_seen: string | null;
  is_online: boolean;
}
