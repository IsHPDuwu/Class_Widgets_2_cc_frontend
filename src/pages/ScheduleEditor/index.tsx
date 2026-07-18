import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Title1,
  TabList,
  Tab,
  Button,
  Dropdown,
  Option,
  Spinner,
  Text,
  Input,
  Label,
} from '@fluentui/react-components';
import { SaveRegular } from '@fluentui/react-icons';
import apiClient from '../../api/client';
import type { Group } from '../../api/types';
import type { ScheduleData } from '../../api/scheduleTypes';
import { SubjectsEditor } from './SubjectsEditor';
import { TimelineEditor } from './TimelineEditor';
import { TableEditor } from './TableEditor';

const defaultScheduleData: ScheduleData = {
  meta: {
    id: crypto.randomUUID(),
    version: 4,
    maxWeekCycle: 1,
    startDate: new Date().toISOString().split('T')[0]
  },
  subjects: [],
  days: [{
    id: crypto.randomUUID(),
    entries: []
  }],
  overrides: []
};

export const ScheduleEditorRoot: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('table');
  const [currentWeek] = useState(1);

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await apiClient.get<Group[]>('/groups/');
      setGroups(response.data);
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadSchedule(selectedGroup);
    } else {
      setScheduleData(null);
    }
  }, [selectedGroup]);

  const loadSchedule = async (groupId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/groups/${groupId}/schedule/`);
      setScheduleData(response.data.schedule_json || defaultScheduleData);
    } catch (error) {
      console.error('Failed to load schedule', error);
      setScheduleData(defaultScheduleData); // Fallback if no schedule yet
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedGroup || !scheduleData) return;
    try {
      await apiClient.put(`/groups/${selectedGroup}/schedule/`, {
        schedule_json: scheduleData
      });
      alert('Schedule saved successfully!');
    } catch (error) {
      console.error('Failed to save schedule', error);
      alert('Failed to save schedule');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title1>Schedule Editor</Title1>
        <Button icon={<SaveRegular />} appearance="primary" onClick={handleSave} disabled={!selectedGroup || !scheduleData}>
          Save Schedule
        </Button>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <label>Select Group:</label>
        <Dropdown
          placeholder="Select a group to edit"
          onOptionSelect={(_e, data) => setSelectedGroup(data.optionValue as string)}
        >
          {groups.map(g => (
            <Option key={g.id} value={g.id}>{g.name}</Option>
          ))}
        </Dropdown>
      </div>

      {loading ? (
        <Spinner />
      ) : scheduleData ? (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TabList selectedValue={activeTab} onTabSelect={(_e, data) => setActiveTab(data.value as string)}>
            <Tab value="table">Weekly Table</Tab>
            <Tab value="timeline">Timeline Config</Tab>
            <Tab value="subjects">Subjects Config</Tab>
            <Tab value="meta">Settings</Tab>
          </TabList>

          <div style={{ marginTop: 20, flexGrow: 1, overflow: 'auto', backgroundColor: '#fff', padding: 20, borderRadius: 8 }}>
            {activeTab === 'table' && (
              <TableEditor
                schedule={scheduleData}
                onChange={setScheduleData}
                currentWeek={currentWeek}
              />
            )}
            {activeTab === 'timeline' && (
              <TimelineEditor
                timeline={scheduleData.days[0]}
                onChange={(tl) => setScheduleData({ ...scheduleData, days: [tl] })}
              />
            )}
            {activeTab === 'subjects' && (
              <SubjectsEditor
                subjects={scheduleData.subjects}
                onChange={(subjs) => setScheduleData({ ...scheduleData, subjects: subjs })}
              />
            )}
            {activeTab === 'meta' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
                <Text weight="semibold">Schedule Meta Settings</Text>
                <div>
                  <Label htmlFor="metaStartDate">Start Date</Label>
                  <Input type="date" id="metaStartDate" value={scheduleData.meta.startDate} onChange={e => setScheduleData({ ...scheduleData, meta: { ...scheduleData.meta, startDate: e.target.value } })} />
                </div>
                <div>
                  <Label htmlFor="metaCycle">Max Week Cycle</Label>
                  <Input type="number" id="metaCycle" value={scheduleData.meta.maxWeekCycle.toString()} onChange={e => setScheduleData({ ...scheduleData, meta: { ...scheduleData.meta, maxWeekCycle: parseInt(e.target.value) } })} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Please select a group to begin editing its schedule.</p>
      )}
    </div>
  );
};
