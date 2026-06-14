import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/custom/header';
import { LandingPage } from './components/custom/hero';
import CreateTrip from './create-trip';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="pt-24 pb-16">
          <Routes>
            <Route path="/" element={<CreateTrip />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/home" element={<LandingPage isLoggedIn={isLoggedIn} />} />
          </Routes>
        </main>
        <Toaster position="bottom-center" />
      </div>
    </BrowserRouter>
  );
}
