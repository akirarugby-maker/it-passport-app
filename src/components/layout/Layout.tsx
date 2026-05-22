import { NavLink, Outlet } from 'react-router-dom';
import { Home, BookOpen, ClipboardList, BarChart2, BookMarked } from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { to: '/', icon: Home, label: 'ホーム' },
  { to: '/slides', icon: BookOpen, label: 'スライド学習' },
  { to: '/quiz', icon: ClipboardList, label: '問題演習' },
  { to: '/records', icon: BarChart2, label: '学習記録' },
  { to: '/glossary', icon: BookMarked, label: '用語集' },
];

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">IT</span>
            </div>
            <span className="font-semibold text-gray-900">ITパスポート学習</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="md:hidden h-16" />
    </div>
  );
};
