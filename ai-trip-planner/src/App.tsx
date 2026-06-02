import { useState } from 'react';
import { Toaster } from 'sonner';
import { Header } from './components/custom/Header';
import { LandingPage } from './components/custom/hero';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="pt-24 pb-16">
        <LandingPage isLoggedIn={isLoggedIn} />
      </main>
      <Toaster position="bottom-center" />
    </div>
  );
}
