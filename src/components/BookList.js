// Reusable book list component
function BookList({ books, onReserve }) {
  return (
    <ul className="list-group">
      {books.map((book) => (
        <li key={book.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{book.title}</strong> by {book.author}<br />
            Genre: {book.genre} | ISBN: {book.isbn}
          </div>
          {onReserve && book.availability_status && (
            <button
              className="btn btn-success btn-sm"
              onClick={() => onReserve(book.id)}
              aria-label={`Reserve ${book.title}`}
            >
              Reserve
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default BookList;