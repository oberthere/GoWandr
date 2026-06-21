import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/custom/header';
import { LandingPage } from './components/custom/hero';
import { useAuthUser } from './service/GoogleAuth';
import CreateTrip from './create-trip';
import ViewTrip from './view-trip';
import MyTrips from './my-trips';
import './App.css';

export default function App() {
  const isLoggedIn = !!useAuthUser();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
        <Header />
        <main className="pt-24 pb-16">
          <Routes>
            <Route path="/" element={<CreateTrip />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/view-trip/:tripId" element={<ViewTrip />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/home" element={<LandingPage isLoggedIn={isLoggedIn} />} />
          </Routes>
        </main>
        <Toaster position="bottom-center" />
      </div>
    </BrowserRouter>
  );
}
