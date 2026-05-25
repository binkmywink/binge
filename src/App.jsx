import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ShowPage from "./pages/ShowPage";
import Diary from "./pages/Diary";
import Friends from "./pages/Friends";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/show/:id" element={<ShowPage />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
