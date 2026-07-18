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
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Input,
  Label,
  Textarea,
  Dropdown,
  Option,
  Spinner
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import apiClient from '../api/client';
import type { Group } from '../api/types';
import type { Notification } from '../api/miscTypes';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newNotif, setNewNotif] = useState({
    title: '',
    content: '',
    level: 'info',
    group: ''
  });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<Notification[]>('/notifications/');
      setNotifications(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchNotifications();
    apiClient.get<Group[]>('/groups/').then(res => setGroups(res.data));
  }, []);

  const handlePublish = async () => {
    try {
      await apiClient.post('/notifications/', {
        ...newNotif,
        group: newNotif.group === '' ? null : newNotif.group
      });
      setIsDialogOpen(false);
      setNewNotif({ title: '', content: '', level: 'info', group: '' });
      fetchNotifications();
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title1>Notifications</Title1>
        <Button icon={<AddRegular />} appearance="primary" onClick={() => setIsDialogOpen(true)}>
          Publish Notification
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(_e, data) => setIsDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>New Notification</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Label>Target Group (Leave empty for global)</Label>
              <Dropdown onOptionSelect={(_e, data) => setNewNotif({...newNotif, group: data.optionValue || ''})}>
                <Option value="">-- Global --</Option>
                {groups.map(g => <Option key={g.id} value={g.id}>{g.name}</Option>)}
              </Dropdown>

              <Label>Level</Label>
              <Dropdown
                defaultValue="info"
                onOptionSelect={(_e, data) => setNewNotif({...newNotif, level: data.optionValue as string})}
              >
                <Option value="info">Info</Option>
                <Option value="warning">Warning</Option>
                <Option value="error">Error</Option>
              </Dropdown>

              <Label>Title</Label>
              <Input value={newNotif.title} onChange={e => setNewNotif({...newNotif, title: e.target.value})} />

              <Label>Content</Label>
              <Textarea value={newNotif.content} onChange={(_e, d) => setNewNotif({...newNotif, content: d.value})} />
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button appearance="primary" onClick={handlePublish}>Publish</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {loading ? <Spinner /> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Time</TableHeaderCell>
              <TableHeaderCell>Level</TableHeaderCell>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Target Group</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map(n => (
              <TableRow key={n.id}>
                <TableCell>{new Date(n.created_at).toLocaleString()}</TableCell>
                <TableCell>{n.level}</TableCell>
                <TableCell>{n.title}</TableCell>
                <TableCell>{groups.find(g => g.id === n.group)?.name || 'Global'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
