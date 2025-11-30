import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Student/Home";
import Dashboard from "./Components/Student/Dashboard";
import Profile from "./Components/Student/Profile";
import CoverLetter from "./Components/Student/CoverLetter";
import CreateResume from "./Components/Student/CreateResume";
import Update from "./Components/Update";
import NotFound from "./Components/NotFound";
import AdminHome from "./Components/Admin/AdminHome";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import RegisterCompany from "./Components/Admin/RegisterCompany";
import AdminHistory from "./Components/Admin/AdminHistory";
import RegisteredStudents from "./Components/Admin/RegisteredStudents";
import About from "./Components/About";
import Help from "./Components/Help";
import CompanyDetails from "./Components/Student/CompanyDetails";
import ApplicationForm from "./Components/Student/ApplicationForm";
import CompanyApplicants from "./Components/Admin/CompanyApplicants";
import Application from "./Components/Student/Applications";
import ProtectedRoute from "./Components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster
      toastOptions={{
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))",
        },
        classNames: {
          success: "toast-success",
          error: "toast-error",
        },
      }}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminHome />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="register-company" element={<RegisterCompany />} />
          <Route path="history" element={<AdminHistory />} />
          <Route path="students" element={<RegisteredStudents />} />
          <Route path="company/:id" element={<CompanyApplicants />} />
          <Route path="about" element={<About />} />
        </Route>

        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="student">
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="portfolio/cover-letter" element={<CoverLetter />} />
          <Route path="portfolio/resume" element={<CreateResume />} />
          <Route path="applications" element={<Application />} />
          <Route path="company/:id" element={<CompanyDetails />} />
          <Route path="apply/:id" element={<ApplicationForm />} />
          <Route path="update" element={<Update />} />
          <Route path="about" element={<About />} />
          <Route path="help" element={<Help />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
