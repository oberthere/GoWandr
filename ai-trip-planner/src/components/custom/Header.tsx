import { Sparkles, Menu, User, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
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
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-linear-to-tr from-indigo-500 to-purple-500 p-1.5 rounded-lg text-white">
            <Sparkles size={20} />
          </div>
          <span className="font-semibold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
            AuraTrip
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button className="hover:text-slate-900 transition-colors">Explore</button>
          <button className="hover:text-slate-900 transition-colors">How it works</button>
          <button onClick={handleCartClick} className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
            <ShoppingBag size={16} />
            Cart
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setIsLoggedIn(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Log Out
              </button>
              <div className="h-8 w-8 rounded-full bg-linear-to-tr from-indigo-200 to-purple-200 flex items-center justify-center text-indigo-700">
                <User size={16} />
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                Log In
              </button>
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="text-sm font-medium px-4 py-2 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-sm shadow-indigo-200"
              >
                Sign Up
              </button>
            </>
          )}
          
          <button className="md:hidden text-slate-600 p-2">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}