import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
    import Navbar from './components/Navbar';
    import Home from './pages/Home';
    import SearchResults from './pages/SearchResults';
    import Login from './pages/Login';
    import Profile from './pages/Profile';
    import Register from './pages/Register';
    import AdminDashboard from './pages/AdminDashboard';
    import './styles/App.css';

    // Main app with routing
    function App() {
      return (
        <Router>
          <Navbar />
          <div className="container-fluid mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </Router>
      );
    }

    export default App;