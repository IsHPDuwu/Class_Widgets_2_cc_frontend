import * as React from 'react';
import {
  makeStyles,
  tokens,
  Text,
  TabList,
  Tab,
} from '@fluentui/react-components';
import {
  HomeRegular,
  PeopleRegular,
  PhoneDesktopRegular,
  CalendarLtrRegular,
  ShieldKeyholeRegular,
  AlertRegular,
  DocumentDataRegular,
} from '@fluentui/react-icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  sidebar: {
    width: '250px',
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '20px',
  },
  content: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  header: {
    padding: '0 20px 20px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    marginBottom: '10px',
  },
});

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <HomeRegular /> },
  { path: '/groups', label: 'Groups', icon: <PeopleRegular /> },
  { path: '/devices', label: 'Devices', icon: <PhoneDesktopRegular /> },
  { path: '/schedule', label: 'Schedule Editor', icon: <CalendarLtrRegular /> },
  { path: '/policies', label: 'Policies', icon: <ShieldKeyholeRegular /> },
  { path: '/notifications', label: 'Notifications', icon: <AlertRegular /> },
  { path: '/logs', label: 'Audit Logs', icon: <DocumentDataRegular /> },
];

export const AppLayout: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabSelect = (_event: any, data: any) => {
    navigate(data.value as string);
  };

  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <Text size={500} weight="semibold">Class Widgets 2</Text>
          <Text size={300} block>Admin Panel</Text>
        </div>
        <TabList
          vertical
          selectedValue={location.pathname.startsWith('/schedule') ? '/schedule' : location.pathname}
          onTabSelect={handleTabSelect}
          style={{ flexGrow: 1, paddingLeft: 10, paddingRight: 10 }}
        >
          {menuItems.map((item) => (
            <Tab
              key={item.path}
              value={item.path}
              icon={item.icon}
            >
              {item.label}
            </Tab>
          ))}
        </TabList>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};
