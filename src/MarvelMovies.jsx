import React, { useEffect, useState, useCallback } from 'react';
import './MarvelMovies.css';  // Estil que crearem a continuació
import md5 from 'md5';


const MarvelMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
      const fetchMovies = useCallback(async () => {
        // Claus Privades i publiques mes crear la url per conectar-nos a la API
        const publicKey = 'aa33e39d808e7d586983b0b147fe1c07';
        const privateKey = '3cbe548aaa47bbebefcb3d317080ec7a01c0cc7c';
        const ts = Date.now().toString();
        const hash = md5(ts + privateKey + publicKey);
        const limit = 100;
    

        const url = `https://gateway.marvel.com/v1/public/comics?format=comic&formatType=comic&orderBy=onsaleDate&limit=${limit}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        // console.log(url);
    

        try {
          // Fem la connexio al servidor i guardem el resultat (SI o NO)
          const response = await fetch(url);
          // Mirem si ha entrat i sino tirem un ERROR
          if (!response.ok) {
            throw new Error('ERROR no s\'ha pogut conectar a la BD.');
          }
          // Si hem pogut conectarnos guardem la informació en un variable que contindra el json
          const llistatComics = await response.json();
    
          // Funcio per guardar la array ordenada/filtrar de la que hem rebut
          const sortedMovies = llistatComics.data.results
            // Filtrem conforme els comics tenen dates disponibles
            .filter(comic => comic.dates && comic.dates.length > 0 && comic.format === "Comic")
            // Ara creem una nova aray amb els elements que ens interessen (Titol, Any, Foto)
            .map(comic => ({
              titleId: comic.id,
              title: comic.title,
              year: new Date(comic.dates[0].date).getFullYear(),
              thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
            }))
            // Aquí ho ordena de manera ascendent segons l'any.
            .sort((a, b) => a.year - b.year);
    
            // Ara guardem l'estat disn de "movies"
          setMovies(sortedMovies);
        } catch (error) {
          setError(error.message || 'Unknown error');
        } finally {
          setLoading(false);
        }
      }, []);
    

      // ara cridem a la funcio fetchMovies i li passem la dependencia
      useEffect(() => {
        fetchMovies();
      }, [fetchMovies]);
    

      // Ara fem que apareixi que esta carregant fins que canvi l'estat
      if (loading) return <p>Loading...</p>;
      // Aquí el mateix pero si apareix erro que ens surti l'error
      if (error) return <p>Error: {error}</p>;
    
      // Ara retornem l'estructura de com es veura
      // El movies.map es per recorre tota la array i li anem apssant parametres (key fiquem la id pk ha de ser unica per cada div)
      return (
        <div className="movie-list">
          {movies.map(movie => (
            <div key={movie.titleId} className="movie-card">
              <img src={movie.thumbnail} alt={movie.title} />
              <h2>{movie.title}</h2>
              <p>{movie.year}</p>
            </div>
          ))}
        </div>
      );
    };
    
    export default MarvelMovies;