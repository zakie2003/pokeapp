import React, { useEffect, useState } from "react";
import { Card } from "./Card";

function CardContainer() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchval, setval] = useState("");
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon');
    const [hasMore, setHasMore] = useState(true);

    const fetchBatchData = async (url, batchSize = 20, delay = 500) => {
        try {
            const allData = [];
            let nextBatchUrl = url;

            while (nextBatchUrl && allData.length < batchSize) {
                const response = await fetch(nextBatchUrl);
                const result = await response.json();
                nextBatchUrl = result.next;
                allData.push(...result.results);


                await new Promise((resolve) => setTimeout(resolve, delay));
            }

            const detailedData = await Promise.all(
                allData.map(async (pokemon) => {
                    const res = await fetch(pokemon.url);
                    return res.json();
                })
            );

            setData((prevData) => [...prevData, ...detailedData]);
            setFilteredData((prevData) => [...prevData, ...detailedData]);
            setNextUrl(nextBatchUrl);
            setHasMore(!!nextBatchUrl);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchBatchData(nextUrl);
    }, []);

    useEffect(() => {
        if (searchval === "") {
            setFilteredData(data);
        } else {
            const searchResults = data.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchval.toLowerCase())
            );
            setFilteredData(searchResults);
        }
    }, [searchval, data]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && hasMore && !loading) {
            fetchBatchData(nextUrl);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll, hasMore, loading]);

    return (
        <div className="bg-slate-900 min-h-screen">
            <div>
                <h1 className="text-yellow-50 p-5 text-center text-5xl">
                    Pokedex App
                </h1>
            </div>
            <center>
                <div className="container">
                    <input
                        value={searchval}
                        onChange={(e) => setval(e.target.value)}
                        style={{ width: "50%" }}
                        type="text"
                        id="first_name"
                        className="my-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search Pokemon"
                    />
                </div>
            </center>
            <div className="grid-cols-4">
                {error && <div className="text-center text-yellow-50">Error: {error.message}</div>}
                {filteredData.length === 0 && !loading && (
                    <div className="text-center text-yellow-50">
                        No Pokémon found with the name "{searchval}"
                    </div>
                )}
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredData.map((val, key) => (
                            <Card
                                key={key}
                                name={val.name}
                                image={val.sprites.other["official-artwork"].front_default}
                                hp={val.stats[0].base_stat}
                                atk={val.stats[1].base_stat}
                                def={val.stats[2].base_stat}
                                speed={val.stats[5].base_stat}
                                types={val.types}
                            />
                        ))}
                    </div>
                </div>
                {loading && (
                    <div className="bg-slate-800">
                        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 text-center bg-slate-900 w-max">
                            <div role="status">
                                <svg
                                    aria-hidden="true"
                                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                )}
                {!hasMore && (
                    <div className="text-center text-yellow-50">
                        No more Pokémon to load.
                    </div>
                )}
            </div>
        </div>
    );
}

export default CardContainer;
