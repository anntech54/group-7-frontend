import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Admin Dashboard for inventory, book management, and user activity
function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
  });
  const [editBook, setEditBook] = useState(null);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch books and activity, check admin role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role === 'admin');
        const fetchData = async () => {
          try {
            const [booksResponse, activityResponse] = await Promise.all([
              axios.get('http://localhost:5000/api/books', {
                headers: { Authorization: `Bearer ${token}` },
              }),
              axios.get('http://localhost:5000/api/activity', {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);
            setBooks(Array.isArray(booksResponse.data) ? booksResponse.data : []);
            setActivity(Array.isArray(activityResponse.data) ? activityResponse.data : []);
            setLoading(false);
          } catch (err) {
            setError('Failed to fetch data');
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

  // Add a new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/books',
        { ...newBook, availability_status: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooks([...books, { ...newBook, id: response.data.id, availability_status: true }]);
      setNewBook({ title: '', author: '', genre: '', isbn: '' });
      alert('Book added successfully');
    } catch (err) {
      setError(err.response?.data.error || 'Failed to add book');
    }
  };

  // Start editing a book
  const handleEditBook = (book) => {
    setEditBook({ ...book });
  };

  // Save edited book
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/books/${editBook.id}`,
        editBook,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooks(books.map((b) => (b.id === editBook.id ? editBook : b)));
      setEditBook(null);
      alert('Book updated successfully');
    } catch (err) {
      setError(err.response?.data.error || 'Failed to update book');
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditBook(null);
  };

  // Delete a book
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((b) => b.id !== id));
      alert('Book deleted successfully');
    } catch (err) {
      setError(err.response?.data.error || 'Failed to delete book');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!isAdmin) return <div className="alert alert-danger">Access denied</div>;

  return (
    <div className="admin-page">
      <div className="container-fluid">
        <div className="content-card">
          <h2>Admin Dashboard</h2>

          {/* Add New Book */}
          <h3>Add New Book</h3>
          <form onSubmit={handleAddBook}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  required
                  aria-label="Book title"
                />
              </div>
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  required
                  aria-label="Book author"
                />
              </div>
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Genre"
                  value={newBook.genre}
                  onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  required
                  aria-label="Book genre"
                />
              </div>
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="ISBN"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  required
                  aria-label="Book ISBN"
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">Add Book</button>
              </div>
            </div>
          </form>

          {/* Edit Book */}
          {editBook && (
            <div className="mt-4">
              <h3>Edit Book</h3>
              <form onSubmit={handleSaveEdit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Title"
                      value={editBook.title}
                      onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                      required
                      aria-label="Edit book title"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Author"
                      value={editBook.author}
                      onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                      required
                      aria-label="Edit book author"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Genre"
                      value={editBook.genre}
                      onChange={(e) => setEditBook({ ...editBook, genre: e.target.value })}
                      required
                      aria-label="Edit book genre"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ISBN"
                      value={editBook.isbn}
                      onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
                      required
                      aria-label="Edit book ISBN"
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-success me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Book Inventory */}
          <h3 className="mt-4">Book Inventory</h3>
          {books.length ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>ISBN</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.isbn}</td>
                      <td>{book.availability_status ? 'Yes' : 'No'}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEditBook(book)}
                          aria-label={`Edit ${book.title}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteBook(book.id)}
                          aria-label={`Delete ${book.title}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No books available.</p>
          )}

          {/* User Activity Log */}
          <h3 className="mt-4">User Activity Log</h3>
          {activity.length ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((log) => (
                    <tr key={log.id}>
                      <td>{log.username}</td>
                      <td>{log.action}</td>
                      <td>{log.details}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No activity recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;