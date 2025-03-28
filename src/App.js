import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const MovieApp = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'a3b7fa89e4msh7ac639de5de230dpi19bebj9nb6205f8f', // Ваш ключ з RapidAPI
        'X-RapidAPI-Host': 'imdb236.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(
          `https://imdb236.p.rapidapi.com/search/${query}`,
          options
      );

      if (!response.ok) {
        throw new Error('Помилка отримання даних');
      }

      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        setMovies(data.results);
      } else {
        setError("Фільми не знайдено");
        setMovies([]);
      }
    } catch (error) {
      setError(error.message || "Помилка підключення до API");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="app">
        <div className="card">
          <h1>Болгарка Кіно</h1>

          <div className="search">
            <input
                type="text"
                placeholder="Введіть назву фільму"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchMovies()}
            />
            <button onClick={fetchMovies} disabled={loading}>
              {loading ? 'Завантаження...' : 'Пошук'}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="movies-list">
            {movies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  {movie.image && (
                      <img
                          src={movie.image}
                          alt={movie.title}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/150x225?text=No+Image'}
                      />
                  )}
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{movie.year}</p>
                    {movie.rating && <p className="rating">★ {movie.rating}</p>}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};
function App() {
  return (
    <div className="App">
      <MovieApp/>
    </div>
  );
}

export default App;
