import * as React from 'react';
import { useState, useEffect } from 'react';
import { Title1, Dropdown, Option, Spinner, Button, Checkbox, Textarea, Text } from '@fluentui/react-components';
import { SaveRegular } from '@fluentui/react-icons';
import apiClient from '../api/client';
import type { Group } from '../api/types';
import type { Policy } from '../api/miscTypes';

export const Policies: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(false);
  const [overridesStr, setOverridesStr] = useState('{}');

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await apiClient.get<Group[]>('/groups/');
      setGroups(response.data);
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadPolicy(selectedGroup);
    } else {
      setPolicy(null);
    }
  }, [selectedGroup]);

  const loadPolicy = async (groupId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get<Policy>(`/groups/${groupId}/policy/`);
      setPolicy(response.data);
      setOverridesStr(JSON.stringify(response.data.overrides, null, 2));
    } catch (error) {
      console.error('Failed to load policy', error);
      // Initialize empty policy
      setPolicy({
        policy_version: 0,
        overrides: {},
        locked_keys: [],
        schedule_readonly: true
      });
      setOverridesStr('{}');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedGroup || !policy) return;
    try {
      let parsedOverrides = {};
      try {
        parsedOverrides = JSON.parse(overridesStr);
      } catch (e) {
        alert('Invalid JSON in overrides');
        return;
      }

      await apiClient.put(`/groups/${selectedGroup}/policy/`, {
        ...policy,
        overrides: parsedOverrides
      });
      alert('Policy saved successfully');
      loadPolicy(selectedGroup);
    } catch (error) {
      console.error('Failed to save policy', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title1>Policies</Title1>
        <Button icon={<SaveRegular />} appearance="primary" onClick={handleSave} disabled={!selectedGroup || !policy}>
          Save Policy
        </Button>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <label>Select Group:</label>
        <Dropdown
          placeholder="Select a group to configure"
          onOptionSelect={(_e, data) => setSelectedGroup(data.optionValue as string)}
        >
          {groups.map(g => (
            <Option key={g.id} value={g.id}>{g.name}</Option>
          ))}
        </Dropdown>
      </div>

      {loading ? (
        <Spinner />
      ) : policy ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}>
          <Checkbox
            label="Schedule Readonly (Clients cannot edit schedule)"
            checked={policy.schedule_readonly}
            onChange={(_e, data) => setPolicy({ ...policy, schedule_readonly: !!data.checked })}
          />

          <div>
            <Text weight="semibold">Config Overrides (JSON)</Text>
            <Textarea
              value={overridesStr}
              onChange={(_e, data) => setOverridesStr(data.value)}
              style={{ width: '100%', height: 200, fontFamily: 'monospace' }}
            />
          </div>
        </div>
      ) : (
        <p>Please select a group to view its policy.</p>
      )}
    </div>
  );
};
