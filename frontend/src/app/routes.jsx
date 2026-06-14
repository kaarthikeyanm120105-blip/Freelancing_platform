import { createBrowserRouter, Navigate } from "react-router-dom";

// Landing & Auth
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import OTPVerification from "./pages/auth/OTPVerification";
import RoleSelection from "./pages/auth/RoleSelection";
import FreelancerProfileSetup from "./pages/auth/FreelancerProfileSetup";
import ClientProfileSetup from "./pages/auth/ClientProfileSetup";

// Home Components
import DashboardHome from "./components/DashboardHome";
import RoleBasedComponent from "./components/RoleBasedComponent";
import ProtectedRoute from "./components/ProtectedRoute";

// Freelancer Module
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import FreelancerProfile from "./pages/freelancer/FreelancerProfile";
import JobBrowse from "./pages/freelancer/JobBrowse";
import JobDetails from "./pages/freelancer/JobDetails";
import Applications from "./pages/freelancer/Applications";
import FreelancerWallet from "./pages/freelancer/FreelancerWallet";
import Earnings from "./pages/freelancer/Earnings";
import LearningRecommendations from "./pages/freelancer/LearningRecommendations";
import MessagesPage from "./pages/chat/MessagesPage";

import ConnectPage from "./pages/ConnectPage";
import PublicProfile from "./pages/PublicProfile";

// Client Module
import ClientDashboard from "./pages/client/ClientDashboard";
import PostJob from "./pages/client/PostJob";
import ManageJobs from "./pages/client/ManageJobs";
import JobApplications from "./pages/client/JobApplications";
import ClientPayments from "./pages/client/ClientPayments";
import ClientProfile from "./pages/client/ClientProfile";
import EditJob from "./pages/client/EditJob";

// Admin Module
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import JobModeration from "./pages/admin/JobModeration";
import PaymentMonitoring from "./pages/admin/PaymentMonitoring";
import CourseManagement from "./pages/admin/CourseManagement";
import PlatformReports from "./pages/admin/PlatformReports";
import ProposalMonitoring from "./pages/admin/ProposalMonitoring";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/otp-verify",
    element: <OTPVerification />,
  },
  {
    path: "/role-selection",
    element: <RoleSelection />,
  },
  {
    path: "/freelancer/profile-setup",
    element: <FreelancerProfileSetup />,
  },
  {
    path: "/client/profile-setup",
    element: <ClientProfileSetup />,
  },

  // Protected Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Navigate to="/dashboard-redirect" replace />,
      },
      {
        path: "/dashboard-redirect",
        element: <RoleBasedComponent
          freelancerComponent={() => <Navigate to="/freelancer/dashboard" replace />}
          clientComponent={() => <Navigate to="/client/dashboard" replace />}
          adminComponent={() => <Navigate to="/admin" replace />}
        />
      },
      // Unified Dashboard Routes
      {
        element: <DashboardLayout />,
        children: [
          { path: "/messages", element: <MessagesPage /> },
          { path: "/messages/:conversationId", element: <MessagesPage /> },
          { path: "/connect", element: <ConnectPage /> },
          { path: "/profile/:id", element: <PublicProfile /> },
        ]
      },
      // Freelancer Routes
      {
        path: "/freelancer",
        element: <ProtectedRoute allowedRole="freelancer" />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <Navigate to="/freelancer/dashboard" replace /> },
              { path: "dashboard", element: <FreelancerDashboard /> },
              { path: "profile", element: <FreelancerProfile /> },
              { path: "jobs", element: <JobBrowse /> },
              { path: "jobs/:id", element: <JobDetails /> },
              { path: "applications", element: <Applications /> },
              { path: "wallet", element: <FreelancerWallet /> },
              { path: "earnings", element: <Earnings /> },
              { path: "learning", element: <LearningRecommendations /> },
            ]
          }
        ]
      },
      // Client Routes
      {
        path: "/client",
        element: <ProtectedRoute allowedRole="client" />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: "dashboard", element: <ClientDashboard /> },
              { path: "profile", element: <ClientProfile /> },
              { path: "post-job", element: <PostJob /> },
              { path: "edit-job/:id", element: <EditJob /> },
              { path: "jobs", element: <ManageJobs /> },
              { path: "job-applications/:jobId", element: <JobApplications /> },
              { path: "payments", element: <ClientPayments /> },
            ]
          }
        ]
      },
      // Admin Routes
      {
        path: "/admin",
        element: <ProtectedRoute allowedRole="admin" />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: "users", element: <UserManagement /> },
              { path: "jobs", element: <JobModeration /> },
              { path: "payments", element: <PaymentMonitoring /> },
              { path: "courses", element: <CourseManagement /> },
              { path: "reports", element: <PlatformReports /> },
              { path: "proposals", element: <ProposalMonitoring /> },
            ]
          }
        ],
      },
    ]
  },

  // Redirect legacy routes
  { path: "/student/*", element: <Navigate to="/dashboard" replace /> },
  { path: "/client/*", element: <Navigate to="/dashboard" replace /> },
  { path: "/freelancerwallet", element: <Navigate to="/freelancer/wallet" replace /> },
]);
