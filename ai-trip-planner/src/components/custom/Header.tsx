import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { getUserProfile, signOut, useAuthUser } from '@/service/GoogleAuth';

export function Header() {
  const user = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';
  const showTabs = !isLanding || !!user;

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

  const tabClass = (active: boolean) =>
    `rounded-full px-5 py-2 text-[0.95rem] font-semibold transition-colors ${
      active ? 'bg-ink text-white' : 'text-muted2 hover:text-ink'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex max-w-[min(1600px,92vw)] items-center gap-6 px-6 py-3.5">
        <Link to="/" className="mr-auto flex items-center gap-2.5" aria-label="GoWandr home">
          <span
            aria-hidden="true"
            className="grid h-7.5 w-7.5 place-items-center rounded-lg bg-ink font-display text-[0.95rem] font-bold text-white"
          >
            G
          </span>
          <span className="font-display text-xl font-semibold tracking-[-0.03em]">GoWandr</span>
        </Link>

        {showTabs && (
          <nav
            aria-label="Primary"
            className="flex gap-1 rounded-full border border-line bg-surface-2 p-1"
          >
            <button
              type="button"
              onClick={() => navigate('/create-trip')}
              aria-current={location.pathname.startsWith('/create-trip') ? 'page' : undefined}
              className={tabClass(location.pathname.startsWith('/create-trip'))}
            >
              Plan
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-trips')}
              aria-current={location.pathname.startsWith('/my-trips') ? 'page' : undefined}
              className={tabClass(location.pathname.startsWith('/my-trips'))}
            >
              My trips
            </button>
          </nav>
        )}

        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label={`Account menu for ${user.name ?? 'your account'}`}
                className="grid h-8.5 w-8.5 place-items-center overflow-hidden rounded-full bg-ink text-sm font-semibold text-white"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span aria-hidden="true">{user.name?.charAt(0).toUpperCase()}</span>
                )}
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden="true"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    role="menu"
                    className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-line bg-surface p-1 shadow-soft"
                  >
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                      <p className="truncate font-mono text-xs text-muted2">{user.email}</p>
                    </div>
                    <div className="my-1 h-px bg-line" aria-hidden="true" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-graphite hover:bg-surface-2"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : isLanding ? (
            <>
              <button
                type="button"
                onClick={() => login()}
                className="px-1.5 py-2 text-sm font-semibold text-graphite hover:text-ink"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => navigate('/create-trip')}
                className="rounded-full bg-ink px-4.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Start free
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              className="rounded-full bg-ink px-4.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
