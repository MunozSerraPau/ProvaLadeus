import { useState, useEffect} from 'react';
import MarvelMovies from './MarvelMovies';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Marvel Movies</h1>
      <>
        <MarvelMovies />
      </>
    </div>
  );
}

export default App