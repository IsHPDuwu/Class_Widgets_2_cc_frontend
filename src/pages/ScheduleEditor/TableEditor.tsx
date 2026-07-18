import * as React from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from '@fluentui/react-components';
import type { ScheduleData, Timetable, Subject } from '../../api/scheduleTypes';

interface TableEditorProps {
  schedule: ScheduleData;
  onChange: (schedule: ScheduleData) => void;
  currentWeek: number;
}

export const TableEditor: React.FC<TableEditorProps> = ({ schedule, onChange, currentWeek }) => {
  const defaultTimeline = schedule.days[0]; // Assuming day[0] holds the default structure for simplicity in this implementation

  if (!defaultTimeline) {
    return <div>No timeline defined. Please set up the timeline first.</div>;
  }

  const daysOfWeek = [1, 2, 3, 4, 5, 6, 7]; // Monday to Sunday

  const getSubjectForCell = (entryId: string, day: number): Subject | undefined => {
    // Check overrides
    const override = schedule.overrides.find(o =>
      o.entryId === entryId &&
      o.dayOfWeek?.includes(day) &&
      (o.weeks === 'all' || (Array.isArray(o.weeks) ? o.weeks.includes(currentWeek) : o.weeks === currentWeek))
    );

    if (override && override.subjectId) {
      return schedule.subjects.find(s => s.id === override.subjectId);
    }

    // Default subject mapping logic could be extended here
    return undefined;
  };

  const handleCellClick = (entryId: string, day: number) => {
    // Simple quick add behavior: cycle through subjects
    if (schedule.subjects.length === 0) return;

    const currentSubject = getSubjectForCell(entryId, day);
    let nextSubjectId = schedule.subjects[0].id;

    if (currentSubject) {
      const idx = schedule.subjects.findIndex(s => s.id === currentSubject.id);
      if (idx + 1 < schedule.subjects.length) {
        nextSubjectId = schedule.subjects[idx + 1].id;
      } else {
        nextSubjectId = ''; // Clear subject
      }
    }

    // Update override
    let newOverrides = [...schedule.overrides];
    const existingIndex = newOverrides.findIndex(o => o.entryId === entryId && o.dayOfWeek?.includes(day));

    if (nextSubjectId === '') {
      if (existingIndex >= 0) newOverrides.splice(existingIndex, 1);
    } else {
      const newOverride: Timetable = {
        id: crypto.randomUUID(),
        entryId,
        dayOfWeek: [day],
        weeks: 'all', // Simplify to apply to all weeks for now
        subjectId: nextSubjectId
      };
      if (existingIndex >= 0) {
        newOverrides[existingIndex] = newOverride;
      } else {
        newOverrides.push(newOverride);
      }
    }

    onChange({ ...schedule, overrides: newOverrides });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Time</TableHeaderCell>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
             <TableHeaderCell key={d}>{d}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {defaultTimeline.entries.filter(e => e.type === 'class' || e.type === 'activity').map(entry => (
          <TableRow key={entry.id}>
            <TableCell>
              {entry.title || entry.type}<br/>
              <small>{entry.startTime} - {entry.endTime}</small>
            </TableCell>
            {daysOfWeek.map(day => {
              const subject = getSubjectForCell(entry.id, day);
              return (
                <TableCell
                  key={day}
                  style={{
                    backgroundColor: subject?.color ? `${subject.color}33` : 'transparent',
                    borderLeft: `4px solid ${subject?.color || 'transparent'}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCellClick(entry.id, day)}
                >
                  {subject ? subject.name : '-'}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
