import React, { useState } from 'react';
import BookList from './components/BookList';
import axios from "axios";

function App() {

  const [title, setTitle] = useState('');
  const [books, setBooks] = useState([]);
  const handleChange = (e) => {
    const title = e.target.value;
    setTitle(title);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
    setTitle('');
  }

  const fetchData = async () => {
    const url = 'http://localhost:5000/search-book-title'
    const response = await axios.post(url, { title: title });
    setBooks((response.data.items));
  };





  return (
    <div>
      <form action="/search-book-title" method='POST' onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={handleChange} />
        <button type='submit' >Submit title</button>
      </form>

      <BookList books={books} />


    </div>

  )
}

export default App;