import { Link, useNavigate } from 'react-router-dom';
   import SearchBar from './SearchBar';

   // Navigation bar with single search button
   function Navbar() {
     const navigate = useNavigate();
     const token = localStorage.getItem('token');
     const isLoggedIn = !!token;

     const handleLogout = () => {
       localStorage.removeItem('token');
       navigate('/login');
     };

     return (
       <nav className="navbar navbar-expand-lg navbar-dark">
         <div className="container-fluid">
           <Link className="navbar-brand" to="/">LMS</Link>
           <button
             className="navbar-toggler"
             type="button"
             data-bs-toggle="collapse"
             data-bs-target="#navbarNav"
             aria-controls="navbarNav"
             aria-expanded="false"
             aria-label="Toggle navigation"
           >
             <span className="navbar-toggler-icon"></span>
           </button>
           <div className="collapse navbar-collapse" id="navbarNav">
             <ul className="navbar-nav me-auto">
               <li className="nav-item">
                 <Link className="nav-link" to="/">Home</Link>
               </li>
               <li className="nav-item">
                 <Link className="nav-link" to="/search">Search</Link>
               </li>
               {isLoggedIn ? (
                 <>
                   <li className="nav-item">
                     <Link className="nav-link" to="/profile">Profile</Link>
                   </li>
                   <li className="nav-item">
                     <button className="nav-link btn btn-link" onClick={handleLogout}>
                       Logout
                     </button>
                   </li>
                 </>
               ) : (
                 <>
                   <li className="nav-item">
                     <Link className="nav-link" to="/login">Login</Link>
                   </li>
                   <li className="nav-item">
                     <Link className="nav-link" to="/register">Register</Link>
                   </li>
                 </>
               )}
             </ul>
             <SearchBar />
           </div>
         </div>
       </nav>
     );
   }

   export default Navbar;