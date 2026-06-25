import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/custom/Header';
import { Landing } from './components/custom/Landing';
import { Footer } from './view-trip/Footer';
import CreateTrip from './create-trip';
import ViewTrip from './view-trip';
import MyTrips from './my-trips';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans text-foreground">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/view-trip/:tripId" element={<ViewTrip />} />
            <Route path="/my-trips" element={<MyTrips />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="bottom-center" />
      </div>
    </BrowserRouter>
  );
}
