import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";

import PhoneFrame      from "./components/PhoneFrame/PhoneFrame.jsx";
import LoginScreen     from "./screens/Auth/LoginScreen.jsx";
import SignupScreen    from "./screens/Auth/SignupScreen.jsx";
import HomeScreen      from "./screens/Home/HomeScreen.jsx";
import SearchScreen    from "./screens/Search/SearchScreen.jsx";
import FacilityDetailScreen  from "./screens/Facility/FacilityDetailScreen.jsx";
import BookingScreen         from "./screens/Booking/BookingScreen.jsx";
import BookingConfirmScreen  from "./screens/Booking/BookingConfirmScreen.jsx";
import MyBookingsScreen      from "./screens/MyBookings/MyBookingsScreen.jsx";
import ProfileScreen         from "./screens/Profile/ProfileScreen.jsx";
import CommunityScreen       from "./screens/Community/CommunityScreen.jsx";
import AdminDashboard        from "./screens/Admin/AdminDashboard.jsx";

// ── Responsive helper ─────────────────────────────────────────────────────────
// Returns true when on desktop (≥768px). Used once at app boot.
function isDesktop() {
  return typeof window !== 'undefined' && window.innerWidth >= 768
}

// ── Protected route ───────────────────────────────────────────────────────────
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return null; // wait for localStorage check
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "admin" && user?.role !== "operator") {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ── App routes (the real SPA, used inside the iframe and on mobile) ───────────
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"   element={<LoginScreen />} />
      <Route path="/signup"  element={<SignupScreen />} />

      <Route path="/" element={
        <ProtectedRoute><HomeScreen /></ProtectedRoute>
      }/>
      <Route path="/search" element={
        <ProtectedRoute><SearchScreen /></ProtectedRoute>
      }/>
      <Route path="/facility/:id" element={
        <ProtectedRoute><FacilityDetailScreen /></ProtectedRoute>
      }/>
      <Route path="/booking/:id" element={
        <ProtectedRoute><BookingScreen /></ProtectedRoute>
      }/>
      <Route path="/booking-confirm" element={
        <ProtectedRoute><BookingConfirmScreen /></ProtectedRoute>
      }/>
      <Route path="/my-bookings" element={
        <ProtectedRoute><MyBookingsScreen /></ProtectedRoute>
      }/>
      <Route path="/profile" element={
        <ProtectedRoute><ProfileScreen /></ProtectedRoute>
      }/>
      <Route path="/community" element={
        <ProtectedRoute><CommunityScreen /></ProtectedRoute>
      }/>
      <Route path="/admin" element={
        <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
      }/>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ── Root: phone frame on desktop, app directly on mobile ─────────────────────
function Root() {
  // Check if we're inside an iframe (loaded by PhoneFrame)
  const inIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Desktop landing: show phone frame (unless we're already inside the iframe)
  if (isDesktop() && !inIframe) {
    return <PhoneFrame />;
  }

  // Mobile or inside iframe: render the real app
  return (
    <AuthProvider>
      <BookingProvider>
        <AppRoutes />
      </BookingProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  );
}
