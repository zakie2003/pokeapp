import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "./Card";

function CardContainer() {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  const [allData, setAllData] = useState([]);
  // eslint-disable-next-line
  const [searchval, setval] = useState("");
  const [url, setNextUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [detailedData, setDetailedData] = useState([]);
  const [batch, setBatch] = useState(20);
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    async function getData() {
      let data = await fetch("https://pokeapi.co/api/v2/pokemon");
      data = await data.json();

      setAllData(data.results);

      const DetailedData = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );

      setDetailedData(DetailedData);
      // console.log(DetailedData);
      setLoading(false);
    }
    getData();
  }, []);

  useEffect(() => {
    async function seescroll() {
      let totalHeight = document.documentElement.scrollHeight;
      let windowHeight = window.innerHeight;
      let scrollLength = Math.ceil(document.documentElement.scrollTop);
      if (totalHeight <= windowHeight + scrollLength) {
        let newBatch = batch;
        let newUrl = `https://pokeapi.co/api/v2/pokemon?offset=${batch}&limit=20`;
        setNextUrl(newUrl);
        setBatch(newBatch + 20);

      }
      //   console.log("Window Scroll", windowHeight);
      //   console.log("Total Scroll:", totalHeight);
      //   console.log("How much scroll done", scrollLength);
    }
    window.addEventListener("scroll", seescroll);
    return () => window.removeEventListener("scroll", seescroll);
  }, [batch]);

  useEffect(() => {
    async function addMoreData() {
      if (!url) return;
      let data = await fetch(url);
      data = await data.json();
      let newResults = data.results;
      setAllData((prevAllData) => [...prevAllData, ...newResults]);

      const moreDetailedData = await Promise.all(
        newResults.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );

      setDetailedData((prevDetailedData) => [...prevDetailedData, ...moreDetailedData]);

      // console.log(moreDetailedData);
    }

    addMoreData();

  }, [url]);


  useEffect(() => {
    if (searchval === "") {
      setFilteredData(detailedData);
    } else {
      const searchResults = detailedData.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchval.toLowerCase())
      );
      setFilteredData(searchResults);
    }
  }, [searchval, detailedData]);

  return (
    <div className="bg-slate-900 min-h-screen">
      <div>
        <h1 className="text-yellow-50 p-5 text-center text-5xl">
          Pokedex App
        </h1>

        <h1 className="text-yellow-50 p-5 text-center text-5xl">
          All Pokemon
        </h1>

      </div>
      <center>
        <div className="container">
          <Link to="/search">
            <button className="my-2 text-white bg-slate-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-700 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Search Pokemon</button>
          </Link>
        </div>
      </center>
      <div className="grid-cols-4">

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
                image={val.sprites.other.showdown.front_default}
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

        <div className="p-4" role="status">
          <center>
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span class="sr-only">Loading...</span>
          </center>
        </div>

      </div>
    </div>
  );
}

export default CardContainer;
