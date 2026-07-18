import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Title1,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
  Spinner,
  Dropdown,
  Option
} from '@fluentui/react-components';
import { DeleteRegular, PersonDeleteRegular } from '@fluentui/react-icons';
import apiClient from '../api/client';
import type { Group, Device } from '../api/types';

export const Devices: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await apiClient.get<Group[]>('/groups/');
        setGroups(response.data);
      } catch (error) {
        console.error('Failed to fetch groups', error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchDevices(selectedGroup);
    } else {
      setDevices([]);
    }
  }, [selectedGroup]);

  const fetchDevices = async (groupId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get<Device[]>(`/groups/${groupId}/devices/`);
      setDevices(response.data);
    } catch (error) {
      console.error('Failed to fetch devices', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (!selectedGroup) return;
    if (confirm('Are you sure you want to kick this device?')) {
      try {
        await apiClient.delete(`/groups/${selectedGroup}/devices/${deviceId}/`);
        fetchDevices(selectedGroup);
      } catch (error) {
        console.error('Failed to remove device', error);
      }
    }
  };

  const handleKickOffline = async () => {
    if (!selectedGroup) return;
    try {
      await apiClient.post(`/groups/${selectedGroup}/kick_offline_devices/`);
      fetchDevices(selectedGroup);
    } catch (error) {
      console.error('Failed to kick offline devices', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title1>Devices</Title1>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <label>Select Group:</label>
        <Dropdown
          placeholder="Select a group"
          onOptionSelect={(_e, data) => setSelectedGroup(data.optionValue as string)}
        >
          {groups.map(g => (
            <Option key={g.id} value={g.id}>{g.name}</Option>
          ))}
        </Dropdown>
        {selectedGroup && (
          <Button icon={<PersonDeleteRegular />} onClick={handleKickOffline}>
            Kick Offline Devices
          </Button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : selectedGroup ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Device Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Last Seen</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>{device.device_name}</TableCell>
                <TableCell>{device.is_online ? 'Online' : 'Offline'}</TableCell>
                <TableCell>{device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}</TableCell>
                <TableCell>
                  <Button icon={<DeleteRegular />} appearance="transparent" onClick={() => handleRemoveDevice(device.id)} />
                </TableCell>
              </TableRow>
            ))}
            {devices.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>No devices found in this group.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <p>Please select a group to view devices.</p>
      )}
    </div>
  );
};
