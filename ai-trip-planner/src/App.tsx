import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/custom/Header';
import { Landing } from './components/custom/Landing';
import { Footer } from './view-trip/Footer';
import './App.css';

// Splits the heavier routes so their Firebase/Gemini code only loads once the
// user navigates to them. The landing page stays eager so home paints instantly.
const CreateTrip = lazy(() => import('./create-trip'));
const ViewTrip = lazy(() => import('./view-trip'));
const MyTrips = lazy(() => import('./my-trips'));

function RouteFallback() {
  return (
    <div
      role="status"
      className="mx-auto max-w-[min(1600px,92vw)] px-6 py-20 text-center font-mono text-sm text-muted2"
    >
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans text-foreground">
        <Header />
        <main>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/create-trip" element={<CreateTrip />} />
              <Route path="/view-trip/:tripId" element={<ViewTrip />} />
              <Route path="/my-trips" element={<MyTrips />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster position="bottom-center" />
      </div>
    </BrowserRouter>
  );
}
