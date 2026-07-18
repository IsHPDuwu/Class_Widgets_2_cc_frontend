import * as React from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
} from '@fluentui/react-components';
import { AddRegular, DeleteRegular } from '@fluentui/react-icons';
import type { Timeline, Entry } from '../../api/scheduleTypes';

interface TimelineEditorProps {
  timeline: Timeline;
  onChange: (timeline: Timeline) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ timeline, onChange }) => {
  const handleAddEntry = () => {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      type: 'class',
      startTime: '08:00',
      endTime: '08:45',
      title: 'New Class'
    };
    onChange({ ...timeline, entries: [...timeline.entries, newEntry] });
  };

  const handleRemoveEntry = (id: string) => {
    onChange({ ...timeline, entries: timeline.entries.filter(e => e.id !== id) });
  };

  const handleUpdateEntry = (id: string, updates: Partial<Entry>) => {
    onChange({
      ...timeline,
      entries: timeline.entries.map(e => e.id === id ? { ...e, ...updates } : e)
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<AddRegular />} onClick={handleAddEntry}>Add Period</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Start Time</TableHeaderCell>
            <TableHeaderCell>End Time</TableHeaderCell>
            <TableHeaderCell>Title / Default Name</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeline.entries.map(entry => (
            <TableRow key={entry.id}>
              <TableCell>
                <select value={entry.type} onChange={(e) => handleUpdateEntry(entry.id, { type: e.target.value as any })}>
                  <option value="class">Class</option>
                  <option value="break">Break</option>
                  <option value="activity">Activity</option>
                  <option value="free">Free</option>
                  <option value="preparation">Preparation</option>
                </select>
              </TableCell>
              <TableCell>
                <input type="time" value={entry.startTime} onChange={(e) => handleUpdateEntry(entry.id, { startTime: e.target.value })} />
              </TableCell>
              <TableCell>
                <input type="time" value={entry.endTime} onChange={(e) => handleUpdateEntry(entry.id, { endTime: e.target.value })} />
              </TableCell>
              <TableCell>
                <input type="text" value={entry.title || ''} onChange={(e) => handleUpdateEntry(entry.id, { title: e.target.value })} />
              </TableCell>
              <TableCell>
                <Button icon={<DeleteRegular />} appearance="transparent" onClick={() => handleRemoveEntry(entry.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
