import React, { useState } from 'react';
import BookList from './components/BookList';
import axios from "axios";
import './styles/App.css'
import SubmitButton from './components/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Spinner from 'react-spinner-material';

function App() {

  const [title, setTitle] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const title = e.target.value;
    setTitle(title);
    setError('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title === '' || title === undefined || title === null) {
      setError('Please enter a title or author.');
    } else {
      fetchData();
      setTitle('');
    }
  }


  const fetchData = async () => {
    setLoading(true);
    const url = 'http://localhost:5000/search-book-title'

    const response = await axios.post(url, { title: title });
    setBooks((response.data.items));
    setLoading(false);
  };





  return (
    <div>


      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        action="/search-book-title" method='POST' onSubmit={handleSubmit}
        className='form__container'
      >
        <div className='search__container'>
          <TextField id="outlined-basic"
            label="Title/author"
            variant="outlined"
            value={title}
            onChange={handleChange}
            error={Boolean(error)}
            helperText={error}
            className='search__input' />
          <SubmitButton variant="contained" type='submit'>Search</SubmitButton>
        </div>


      </Box>
      <div className='spinner__container'>
        {loading ? <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} /> : null}
      </div>
      <BookList books={books} />


    </div>

  )
}

export default App;