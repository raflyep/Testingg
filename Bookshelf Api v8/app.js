const baseUrl = "http://localhost:9000/books";

// Function to fetch all books
const fetchBooks = async () => {
  const response = await fetch(baseUrl);
  const { data } = await response.json();
  const booksTableBody = document.getElementById('booksTableBody');
  booksTableBody.innerHTML = "";

  data.books.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.name}</td>
      <td>${book.publisher}</td>
      <td>
        <button onclick="deleteBook('${book.id}')">Delete</button>
      </td>
    `;
    booksTableBody.appendChild(row);
  });
};

// Function to add a new book
const addBook = async (event) => {
  event.preventDefault();

  const form = document.getElementById('addBookForm');
  const formData = new FormData(form);
  const bookData = {};
  formData.forEach((value, key) => bookData[key] = key === 'reading' ? value === 'true' : value);

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });

  if (response.ok) {
    alert('Book added successfully!');
    form.reset();
    fetchBooks();
  } else {
    alert('Failed to add book.');
  }
};

// Function to delete a book
const deleteBook = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });

  if (response.ok) {
    alert('Book deleted successfully!');
    fetchBooks();
  } else {
    alert('Failed to delete book.');
  }
};

// Attach event listeners
document.getElementById('addBookForm').addEventListener('submit', addBook);

// Fetch books on page load
fetchBooks();
