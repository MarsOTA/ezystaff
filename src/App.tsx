
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Calendar from "./pages/Calendar";
import Operators from "./pages/Operators";
import OperatorProfile from "./pages/OperatorProfile";
import EventPlanner from "./pages/EventPlanner";
import Clients from "./pages/Clients";
import ClientCreate from "./pages/ClientCreate";
import ClientDetail from "./pages/ClientDetail";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import OperatorRoute from "./components/OperatorRoute";
import EventCreate from "./pages/EventCreate";
import TasksPage from "./pages/operator/TasksPage";
import ProfilePage from "./pages/operator/ProfilePage";
import AttendancePage from "./pages/operator/AttendancePage";
import AdminAttendancePage from "./pages/AdminAttendancePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute component={Dashboard} />}
      />
      <Route path="/events" element={<ProtectedRoute component={Events} />} />
      <Route
        path="/events/create"
        element={<ProtectedRoute component={EventCreate} />}
      />
      <Route
        path="/events/create/:id"
        element={<ProtectedRoute component={EventCreate} />}
      />
      <Route
        path="/calendar"
        element={<ProtectedRoute component={Calendar} />}
      />
      <Route
        path="/operators"
        element={<ProtectedRoute component={Operators} />}
      />
      <Route
        path="/operator-profile/:id"
        element={<ProtectedRoute component={OperatorProfile} />}
      />
      <Route
        path="/event-planner/:operatorId"
        element={<ProtectedRoute component={EventPlanner} />}
      />
      <Route
        path="/clients"
        element={<ProtectedRoute component={Clients} />}
      />
      <Route
        path="/client-create"
        element={<ProtectedRoute component={ClientCreate} />}
      />
      <Route
        path="/client-detail/:id"
        element={<ProtectedRoute component={ClientDetail} />}
      />
      <Route
        path="/attendances"
        element={<ProtectedRoute component={AdminAttendancePage} />}
      />
      
      {/* Operator routes */}
      <Route
        path="/operator/tasks"
        element={<OperatorRoute component={TasksPage} />}
      />
      <Route
        path="/operator/profile"
        element={<OperatorRoute component={ProfilePage} />}
      />
      <Route
        path="/operator/attendance"
        element={<OperatorRoute component={AttendancePage} />}
      />
    </Routes>
  );
}

export default App;
