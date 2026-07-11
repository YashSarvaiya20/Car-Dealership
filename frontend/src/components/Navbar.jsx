import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                🚗 Incubyte Motors
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                Catalog
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/admin') ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex md:hidden items-center gap-2 mr-2">
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className={`text-xs px-2.5 py-1.5 rounded-lg border ${
                    isActive('/admin')
                      ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                      : 'border-slate-800 text-slate-300'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-200">{user.email}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                    {user.isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-semibold border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-300 rounded-lg active:scale-95 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg active:scale-95 transition-all shadow-lg shadow-blue-500/10"
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
