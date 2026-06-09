import { toast } from 'sonner';

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
}

export function Header({ isLoggedIn, setIsLoggedIn }: HeaderProps) {
  const handleCartClick = () => {
    if (!isLoggedIn) {
      toast.error('Account required', {
        description: 'Please log in or sign up to view your trip cart.',
      });
    } else {
      toast.info('Your cart is empty');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="text-lg font-semibold text-slate-900">
          Trip Planner
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          <button type="button" className="hover:text-slate-900">Explore</button>
          <button type="button" className="hover:text-slate-900">How it works</button>
          <button type="button" onClick={handleCartClick} className="hover:text-slate-900">
            Cart
          </button>
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => setIsLoggedIn(false)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
                Log Out
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsLoggedIn(true)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setIsLoggedIn(true)}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}