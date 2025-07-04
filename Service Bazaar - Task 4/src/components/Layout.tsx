import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Settings, User, Bell } from 'lucide-react'; 

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();

  console.log("Logged-in user: ", user); // for checking

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Service Bazaar</h1>
                <span className="ml-4 px-2 py-1 text-xs font-medium bg-saffron text-white rounded-full">
                  {user.role.toLowerCase()}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User size={16} />
                  <span>{user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-saffron"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {/* Show footer no matter what, even if not logged in */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            Mukul Chauhan | mukul.chauhan2022@vitstudent.ac.in | +91 9003524743
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
