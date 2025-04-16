import { useState } from 'react';
import axios from 'axios';

function BookDetails({ book, onReserve }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAvailable, setIsAvailable] = useState(book.availability_status);

  const handleReserve = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in');
      await axios.post(
        'http://localhost:5000/api/reservations',
        { book_id: book.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsAvailable(false);
      setSuccess('Book reserved successfully!');
      if (onReserve) onReserve(book.id);
    } catch (err) {
      setError(err.response?.data.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5>{book.title}</h5>
      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Status: {isAvailable ? 'Available' : 'Reserved'}</p>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <button
        className="btn btn-success"
        onClick={handleReserve}
        disabled={loading || !isAvailable}
        aria-label={`Reserve ${book.title}`}
      >
        {loading ? 'Reserving...' : 'Reserve'}
      </button>
    </div>
  );
}

export default BookDetails;