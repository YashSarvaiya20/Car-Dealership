import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  const isActive = (path) => location.pathname === path;
  
  const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const dashboardPath = user?.isAdmin ? '/admin' : '/catalog';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-850 bg-[#0F172A] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-lg font-black text-white tracking-tight">
                🚗 Incubyte Motors
              </span>
            </Link>
            
            {/* Center navigation links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive('/') ? 'text-blue-400' : 'text-slate-450 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                to="/catalog"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive('/catalog') ? 'text-blue-400' : 'text-slate-450 hover:text-white'
                }`}
              >
                Cars
              </Link>
              <button
                onClick={handleAboutClick}
                className="text-xs font-semibold uppercase tracking-wider text-slate-455 hover:text-white transition-colors cursor-pointer"
              >
                About
              </button>
            </div>
          </div>

          {/* Right side login actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 tracking-tight">{user.email}</span>
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/25">
                    {user.role}
                  </span>
                </div>
                <Link
                  to={dashboardPath}
                  className="px-3 py-1.5 text-xs font-bold bg-[#1E293B] hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-455 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg active:scale-95 transition-all shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
