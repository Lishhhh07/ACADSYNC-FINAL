import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { FacultyDashboard } from "./components/FacultyDashboard";
import { SchedulingInterface } from "./components/SchedulingInterface";
import { UpcomingMeetingsView } from "./components/UpcomingMeetingsView";
import { RequestsView } from "./components/RequestsView";
import { CoursesView } from "./components/CoursesView";
import { StudentSchedulingModal } from "./components/StudentSchedulingModal";
import { removeToken } from "./utils/api";

type View = 
  | "landing" 
  | "auth" 
  | "student-dashboard" 
  | "faculty-dashboard" 
  | "schedule" 
  | "meetings" 
  | "requests" 
  | "courses";

type UserType = "student" | "faculty" | null;

export default function App() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [userType, setUserType] = useState<UserType>(null);
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);

  const handleGetStarted = () => {
    setCurrentView("auth");
  };

  const handleLogin = () => {
    setCurrentView("auth");
  };

  const handleStudentLogin = () => {
    setUserType("student");
    setCurrentView("student-dashboard");
  };

  const handleFacultyLogin = () => {
    setUserType("faculty");
    setCurrentView("faculty-dashboard");
  };

  const handleLogout = () => {
    // Remove token from localStorage
    removeToken();
    setUserType(null);
    setCurrentView("landing");
  };

  const handleSchedule = () => {
    setCurrentView("schedule");
  };

  const handleBackToDashboard = () => {
    if (userType === "student") {
      setCurrentView("student-dashboard");
    } else if (userType === "faculty") {
      setCurrentView("faculty-dashboard");
    }
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  const handleViewMeetings = () => {
    setCurrentView("meetings");
  };

  const handleViewRequests = () => {
    setCurrentView("requests");
  };

  const handleViewCourses = () => {
    setCurrentView("courses");
  };

  const handleOpenSchedulingModal = () => {
    setShowSchedulingModal(true);
  };

  return (
    <div className="size-full">
      {currentView === "landing" && (
        <LandingPage onGetStarted={handleGetStarted} onLogin={handleLogin} />
      )}

      {currentView === "auth" && (
        <AuthPage
          onBack={handleBackToLanding}
          onStudentLogin={handleStudentLogin}
          onFacultyLogin={handleFacultyLogin}
        />
      )}

      {currentView === "student-dashboard" && (
        <StudentDashboard 
          onLogout={handleLogout} 
          onSchedule={handleSchedule}
          onViewMeetings={handleViewMeetings}
          onViewRequests={handleViewRequests}
          onViewCourses={handleViewCourses}
        />
      )}

      {currentView === "faculty-dashboard" && (
        <FacultyDashboard onLogout={handleLogout} onSchedule={handleSchedule} />
      )}

      {currentView === "schedule" && userType && (
        <SchedulingInterface onBack={handleBackToDashboard} userType={userType} />
      )}

      {currentView === "meetings" && (
        <UpcomingMeetingsView onBack={handleBackToDashboard} />
      )}

      {currentView === "requests" && (
        <RequestsView onBack={handleBackToDashboard} />
      )}

      {currentView === "courses" && (
        <CoursesView onBack={handleBackToDashboard} onOpenScheduling={handleOpenSchedulingModal} />
      )}
    </div>
  );
}