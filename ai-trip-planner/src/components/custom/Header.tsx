import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { getUserProfile, signOut, useAuthUser } from '@/service/GoogleAuth';

export function Header() {
  const user = useAuthUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      try {
        await getUserProfile(tokenInfo);
      } catch {
        toast.error('Could not sign you in. Please try again.');
      }
    },
    onError: () => toast.error('Google sign-in failed.'),
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-lg font-semibold text-slate-900">
          Trip Planner
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/my-trips"
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                My Trips
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="block h-9 w-9 overflow-hidden rounded-full ring-1 ring-slate-200 hover:ring-slate-300"
                >
                  <img
                    src={user.picture}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="truncate text-xs text-slate-500">{user.email}</p>
                      </div>
                      <div className="my-1 h-px bg-slate-100" />
                      <button
                        type="button"
                        onClick={() => {
                          signOut();
                          setMenuOpen(false);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              className="rounded-md bg-slate-900 px-4 py-1.5 text-sm text-white hover:bg-slate-800"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
