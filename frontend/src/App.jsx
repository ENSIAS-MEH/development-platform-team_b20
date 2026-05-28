import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Calendar, Plus } from "lucide-react";
import EventList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import EventForm from "./pages/EventForm";
import LikeButton from "./components/interaction/LikeButton";
import JoinLeaveButton from "./components/interaction/JoinLeaveButton";
import CommentSection from "./components/interaction/CommentSection";

function TestPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Component Test Lab</h1>
      <p className="text-slate-400">Testing components against eventId=1, no real event needed.</p>

      <div className="glass-effect rounded-2xl p-8 space-y-3">
        <h2 className="text-xl font-bold">Likes</h2>
        <LikeButton eventId={1} />
      </div>

      <div className="glass-effect rounded-2xl p-8 space-y-3">
        <h2 className="text-xl font-bold">Participation</h2>
        <JoinLeaveButton eventId={1} />
      </div>

      <div className="glass-effect rounded-2xl p-8">
        <CommentSection eventId={1} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-950 text-slate-200">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <Routes>
            <Route path="/test" element={<TestPage />} />
            <Route path="/" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/new" element={<EventForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Calendar className="w-6 h-6 text-primary-600" />
          <span>Smart Social Events</span>
        </Link>
        <Link
          to="/events/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-white font-semibold transition-all shadow-lg shadow-primary-600/20"
        >
          <Plus className="w-4 h-4" />
          New Event
        </Link>
      </div>
    </header>
  );
}