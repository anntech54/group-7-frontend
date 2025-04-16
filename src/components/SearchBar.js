import { useState } from 'react';
   import { useNavigate } from 'react-router-dom';

   // Search bar for Navbar
   function SearchBar() {
     const [query, setQuery] = useState('');
     const navigate = useNavigate();

     const handleSearch = (e) => {
       e.preventDefault();
       if (query.trim()) {
         navigate(`/search?query=${encodeURIComponent(query)}`);
         setQuery('');
       }
     };

     return (
       <form onSubmit={handleSearch} className="d-flex">
         <input
           type="text"
           className="form-control me-2"
           placeholder="Search books..."
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           aria-label="Search books"
         />
         <button className="btn btn-outline-light" type="submit">
           Search
         </button>
       </form>
     );
   }

   export default SearchBar;