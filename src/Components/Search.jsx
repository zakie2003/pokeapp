import React, { useState, useRef } from 'react';
import typeColors from "../Assests/Poketypes";
import { Link } from "react-router-dom";

export const Search = () => {
  const [query, setQuery] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchDetails = async (url) => {
    let final_result = await fetch(url);
    final_result = await final_result.json();
    setPokemon(final_result);
  };

  const fetchPokemon = async () => {
    if (!query) return;
    setPokemon(null);
    setLoading(true);
    setError(null);


    if (abortControllerRef.current) 
    {
      abortControllerRef.current.abort();
    }


    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`, { signal });
      const data = await response.json();
      let url = data.next;
      let searched_arr = data.results.filter((element) => element.name === query);
      if (searched_arr.length === 0) {
        while (url) {
          let result = await fetch(url, { signal });
          result = await result.json();
          searched_arr = result.results.filter((element) => element.name === query);
          if (searched_arr.length !== 0) {
            let final_result_url = searched_arr[0].url;
            fetchDetails(final_result_url);
            setLoading(false);
            return;
          }
          url = result.next;
        }
        throw new Error('Pokémon not found');
      } else {
        fetchDetails(searched_arr[0].url);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        setError(err.message);
        setPokemon(null);
      }
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    let val = e.target.value;
    setQuery(val.toLowerCase());
  };

  const handleSearchClick = () => {
    fetchPokemon();
  };

  return (
    <div>
      <h1 className='bg-gray-900 text-center text-cyan-50' style={{ fontSize: "5vh" }}>Pokedex App</h1>
      <div className="flex justify-center py-3 bg-gray-900">
        <Link to="/">
          <button className="text-white bg-slate-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-700 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Show All Pokemon
          </button>
        </Link>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="max-w-4xl w-full bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center md:space-x-4">
            <div className="w-full md:w-1/2 mb-4 md:mb-0 flex">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for a Pokémon..."
                className="flex-grow p-2 rounded-l bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearchClick}
                className="px-4 py-2 bg-slate-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
            <div className="w-full md:w-1/2">
              {loading && <p className="text-white">Searching Please Wait A Minute...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {pokemon && (
                <div className="bg-gray-700 p-4 rounded-lg text-white">
                  <h2 className="text-2xl font-bold mb-2 capitalize">{pokemon.name}</h2>
                  <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} className="w-32 h-32 mx-auto" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="font-bold">Height:</p>
                      <p>{pokemon.height}</p>
                    </div>
                    <div>
                      <p className="font-bold">Weight:</p>
                      <p>{pokemon.weight}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-bold">Types:</p>
                      <div className="flex flex-wrap">
                        {pokemon.types.map((typeInfo, index) => (
                          <span
                            key={index}
                            className="m-1 px-3 py-2 text-sm font-medium text-white rounded-lg"
                            style={{ backgroundColor: typeColors[typeInfo.type.name] }}
                          >
                            {typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="font-bold">Moves:</p>
                      <div className="flex flex-wrap">
                        {pokemon.moves.slice(0, 5).map((moveInfo, index) => (
                          <span
                            key={index}
                            className="m-1 px-3 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg"
                          >
                            {moveInfo.move.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
