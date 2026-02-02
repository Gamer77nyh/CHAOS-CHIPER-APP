
import React, { useState } from 'react';
import { InspectAppState } from '../types';
import InspectLogin from './InspectLogin';
import InspectDashboard from './InspectDashboard';
import InspectBackendGuide from './InspectBackendGuide';

const InspectModule: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<InspectAppState>(InspectAppState.LOGIN);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (pass: string) => {
    // Basic auth logic matching the original
    if (pass === "ETCHERO123") {
      setIsAuthenticated(true);
      setCurrentPage(InspectAppState.DASHBOARD);
    } else {
      alert("INVALID ACCESS KEY");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage(InspectAppState.LOGIN);
  };

  return (
    <div className="h-full w-full bg-[#050505] relative overflow-hidden flex flex-col font-mono text-green-500">
      {/* Background Ambience Specific to Inspect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-900/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {currentPage === InspectAppState.LOGIN && (
          <InspectLogin onLogin={handleLogin} />
        )}

        {currentPage === InspectAppState.DASHBOARD && isAuthenticated && (
          <InspectDashboard 
            onShowGuide={() => setCurrentPage(InspectAppState.BACKEND_GUIDE)} 
            onLogout={handleLogout}
          />
        )}

        {currentPage === InspectAppState.BACKEND_GUIDE && (
          <InspectBackendGuide onBack={() => setCurrentPage(InspectAppState.DASHBOARD)} />
        )}
      </div>
    </div>
  );
};

export default InspectModule;
