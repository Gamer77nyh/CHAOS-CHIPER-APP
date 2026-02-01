
import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BackendGuide from './components/BackendGuide';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>(AppState.LOGIN);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (pass: string) => {
    // Basic auth logic for demo
    if (pass === "admin123") {
      setIsAuthenticated(true);
      setCurrentPage(AppState.DASHBOARD);
    } else {
      alert("Invalid Access Code");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full"></div>
      </div>

      {currentPage === AppState.LOGIN && (
        <Login onLogin={handleLogin} />
      )}

      {currentPage === AppState.DASHBOARD && isAuthenticated && (
        <Dashboard onShowGuide={() => setCurrentPage(AppState.BACKEND_GUIDE)} />
      )}

      {currentPage === AppState.BACKEND_GUIDE && (
        <BackendGuide onBack={() => setCurrentPage(AppState.DASHBOARD)} />
      )}
    </div>
  );
};

export default App;
