import { useEffect, useState } from 'react';
   import axios from 'axios';
   import { jwtDecode } from 'jwt-decode';
   import BookList from '../components/BookList';

   // User profile with personalized welcome, reservations, and due dates
   function Profile() {
     const [user, setUser] = useState(null);
     const [reservations, setReservations] = useState([]);
     const [availableBooks, setAvailableBooks] = useState([]);
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const token = localStorage.getItem('token');
       if (token) {
         try {
           const decoded = jwtDecode(token);
           setUser(decoded);
           const fetchData = async () => {
             try {
               const reservationsResponse = await axios.get(
                 'http://localhost:5000/api/reservations',
                 { headers: { Authorization: `Bearer ${token}` } }
               );
               setReservations(reservationsResponse.data);
               const booksResponse = await axios.get('http://localhost:5000/api/books');
               const booksData = Array.isArray(booksResponse.data) ? booksResponse.data : [];
               const available = booksData.filter((book) => book.availability_status);
               setAvailableBooks(available);
             } catch (err) {
               setError(err.response?.data?.error || 'Failed to fetch data');
             } finally {
               setLoading(false);
             }
           };
           fetchData();
         } catch (err) {
           setError('Invalid token');
           setLoading(false);
         }
       } else {
         setError('Please log in');
         setLoading(false);
       }
     }, []);

     const handleReserve = async (bookId) => {
       try {
         const token = localStorage.getItem('token');
         const response = await axios.post(
           'http://localhost:5000/api/reservations',
           { book_id: bookId },
           { headers: { Authorization: `Bearer ${token}` } }
         );
         const reservedBook = availableBooks.find((b) => b.id === bookId);
         setAvailableBooks((prev) => prev.filter((book) => book.id !== bookId));
         setReservations((prev) => [
           ...prev,
           {
             id: response.data.id,
             book_id: bookId,
             title: reservedBook.title,
             author: reservedBook.author,
             due_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
           },
         ]);
         alert('Book reserved');
       } catch (err) {
         setError(err.response?.data.error || 'Failed to reserve book');
       }
     };

     const handleReturn = async (reservationId, bookId) => {
       try {
         const token = localStorage.getItem('token');
         await axios.delete(`http://localhost:5000/api/reservations/${reservationId}`, {
           headers: { Authorization: `Bearer ${token}` },
         });
         const returnedBook = reservations.find((r) => r.id === reservationId);
         setReservations((prev) => prev.filter((r) => r.id !== reservationId));
         setAvailableBooks((prev) => [
           ...prev,
           { id: bookId, title: returnedBook.title, author: returnedBook.author, availability_status: true },
         ]);
         alert('Book returned successfully');
       } catch (err) {
         setError(err.response?.data.error || 'Failed to return book');
       }
     };

     if (loading) return <div>Loading...</div>;
     if (error) return <div className="alert alert-danger">{error}</div>;

     return (
       <div className="profile-page">
         <div className="container-fluid">
           <div className="content-card">
             <h2>Welcome back, {user?.username || 'Guest'}!</h2>
             <p>Role: {user?.role || 'Unknown'}</p>
             <h3>Your Reserved Books</h3>
             {reservations.length ? (
               <ul className="list-group mb-4">
                 {reservations.map((reservation) => (
                   <li key={reservation.id} className="list-group-item">
                     <strong>{reservation.title}</strong> by {reservation.author}<br />
                     Reserved on: {new Date(reservation.reservation_date).toLocaleDateString()}<br />
                     Due by: {reservation.due_date ? new Date(reservation.due_date).toLocaleDateString() : 'N/A'}
                     <button
                       className="btn btn-warning btn-sm mt-2"
                       onClick={() => handleReturn(reservation.id, reservation.book_id)}
                       aria-label={`Return ${reservation.title}`}
                     >
                       Return
                     </button>
                   </li>
                 ))}
               </ul>
             ) : (
               <p>No reserved books.</p>
             )}
             <h3>Available Books</h3>
             {availableBooks.length ? (
               <BookList books={availableBooks} onReserve={handleReserve} />
             ) : (
               <p>No available books found.</p>
             )}
           </div>
         </div>
       </div>
     );
   }

   export default Profile;