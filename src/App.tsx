import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Groups } from './pages/Groups';
import { Devices } from './pages/Devices';
import { ScheduleEditorRoot } from './pages/ScheduleEditor';
import { Policies } from './pages/Policies';
import { Notifications } from './pages/Notifications';
import { Logs } from './pages/Logs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/schedule" element={<ScheduleEditorRoot />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/logs" element={<Logs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
