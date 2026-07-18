export type EntryType = 'class' | 'break' | 'activity' | 'free' | 'preparation';
export type WeekType = 'all';

export interface Subject {
  id: string;
  name: string;
  simplifiedName?: string;
  teacher?: string;
  icon?: string;
  color?: string;
  location?: string;
  isLocalClassroom: boolean;
}

export interface Entry {
  id: string;
  type: EntryType;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  subjectId?: string;
  title?: string;
}

export interface Timeline {
  id: string;
  entries: Entry[];
  dayOfWeek?: number[]; // 1-7
  weeks?: WeekType | number[] | number;
  date?: string;
}

export interface MetaInfo {
  id: string;
  version: number;
  maxWeekCycle: number;
  startDate: string; // yyyy-mm-dd
}

export interface Timetable {
  id: string;
  entryId: string;
  dayOfWeek?: number[];
  weeks?: WeekType | number[] | number;
  subjectId?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
}

export interface ScheduleData {
  meta: MetaInfo;
  subjects: Subject[];
  days: Timeline[];
  overrides: Timetable[];
}
