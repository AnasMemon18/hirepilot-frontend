import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Upload,
  Users,
  Trophy,
  BarChart3 
} from 'lucide-react';

const Sidebar = React.memo(({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: PlusCircle, label: 'Create Job', path: '/create-job' },
    { icon: FileText, label: 'All Jobs', path: '/jobs' },
    { icon: Users, label: 'All Candidates', path: '/all-candidates' }, // ✅ NEW
    { icon: Upload, label: 'Upload Resumes', path: '/upload' },
    { icon: Trophy, label: 'Top Performers', path: '/top-performers' }, // ✅ NEW
  ];

  return (
    <aside className={`
      fixed left-0 top-16 h-full bg-white border-r border-gray-200 
      transition-transform duration-300 ease-in-out z-50
      w-64
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:w-64
    `}>
      <div className="h-full overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path || 
                            (item.label === 'All Candidates' && location.pathname.startsWith('/candidates')) ||
                            (item.label === 'Top Performers' && location.pathname === '/top-performers');
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                  transition-all duration-200 text-sm font-medium
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon size={20} className={isActive ? 'text-blue-700' : 'text-gray-500'} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-6 bg-blue-600 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">AI Engine Active</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">Processing resumes in real-time</p>
          </div>
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;