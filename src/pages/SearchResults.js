import { useEffect, useState } from 'react';
   import { useLocation } from 'react-router-dom';
   import axios from 'axios';
   import BookList from '../components/BookList';

   // Search results page for books
   function SearchResults() {
     const [books, setBooks] = useState([]);
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(true);
     const location = useLocation();
     const query = new URLSearchParams(location.search).get('query') || '';

     useEffect(() => {
       axios
         .get(`http://localhost:5000/api/books/search?query=${encodeURIComponent(query)}`)
         .then((response) => {
           setBooks(Array.isArray(response.data) ? response.data : []);
           setLoading(false);
         })
         .catch((err) => {
           setError('Failed to fetch books');
           setLoading(false);
         });
     }, [query]);

     if (loading) return <div>Loading...</div>;
     if (error) return <div className="alert alert-danger">{error}</div>;

     return (
       <div className="search-page">
         <div className="container-fluid">
           <div className="content-card">
             <h2>Search Results for "{query}"</h2>
             {books.length ? (
               <BookList books={books} />
             ) : (
               <p>No books found.</p>
             )}
           </div>
         </div>
       </div>
     );
   }

   export default SearchResults;