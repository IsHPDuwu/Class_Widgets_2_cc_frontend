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
  Spinner,
  TabList,
  Tab
} from '@fluentui/react-components';
import apiClient from '../api/client';
import type { AuditLog } from '../api/miscTypes';

export const Logs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [clientLogs, setClientLogs] = useState<any[]>([]); // Using any for brevity on diagnostic logs
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('audit');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        if (activeTab === 'audit') {
          const res = await apiClient.get('/audit_logs/');
          setAuditLogs(res.data);
        } else {
          const res = await apiClient.get('/diagnostics/');
          setClientLogs(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [activeTab]);

  return (
    <div>
      <Title1 style={{ marginBottom: 20 }}>Logs</Title1>

      <TabList selectedValue={activeTab} onTabSelect={(_e, d) => setActiveTab(d.value as string)} style={{ marginBottom: 20 }}>
        <Tab value="audit">Audit Logs</Tab>
        <Tab value="client">Client Diagnostics</Tab>
      </TabList>

      {loading ? <Spinner /> : activeTab === 'audit' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Time</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Details</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map(log => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user || 'System'}</TableCell>
                <TableCell><pre style={{ margin: 0, fontSize: '0.8em' }}>{JSON.stringify(log.details, null, 2)}</pre></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Time</TableHeaderCell>
              <TableHeaderCell>Device</TableHeaderCell>
              <TableHeaderCell>Level</TableHeaderCell>
              <TableHeaderCell>Message</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientLogs.map(log => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                <TableCell>{log.device}</TableCell>
                <TableCell>{log.log_level}</TableCell>
                <TableCell>{log.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
