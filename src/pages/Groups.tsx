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
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Input,
  Label,
  Spinner
} from '@fluentui/react-components';
import { DeleteRegular, AddRegular } from '@fluentui/react-icons';
import apiClient from '../api/client';
import type { Group } from '../api/types';

export const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<Group[]>('/groups/');
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName) return;
    try {
      await apiClient.post('/groups/', { name: newGroupName });
      setNewGroupName('');
      setIsDialogOpen(false);
      fetchGroups();
    } catch (error) {
      console.error('Failed to create group', error);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      try {
        await apiClient.delete(`/groups/${id}/`);
        fetchGroups();
      } catch (error) {
        console.error('Failed to delete group', error);
      }
    }
  };

  const handleRefreshCode = async (id: string) => {
    try {
      await apiClient.post(`/groups/${id}/refresh_code/`);
      fetchGroups();
    } catch (error) {
      console.error('Failed to refresh pairing code', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title1>Groups</Title1>
        <Dialog open={isDialogOpen} onOpenChange={(_e, data) => setIsDialogOpen(data.open)}>
          <DialogTrigger disableButtonEnhancement>
            <Button icon={<AddRegular />} appearance="primary">Create Group</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Label htmlFor="groupName">Group Name</Label>
                <Input id="groupName" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cancel</Button>
                </DialogTrigger>
                <Button appearance="primary" onClick={handleCreateGroup}>Create</Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Pairing Code</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>
                  {group.pairing_code}
                  <Button size="small" appearance="transparent" onClick={() => handleRefreshCode(group.id)}>Refresh</Button>
                </TableCell>
                <TableCell>
                  <Button icon={<DeleteRegular />} appearance="transparent" onClick={() => handleDeleteGroup(group.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
