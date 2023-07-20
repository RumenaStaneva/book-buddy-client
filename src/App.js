import React from 'react';
import Home from './pages/Home';
import About from './pages/About';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>

  )
}

export default App;