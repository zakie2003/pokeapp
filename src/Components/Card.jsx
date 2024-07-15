import React from "react";
import typeColors from "../Assests/Poketypes";
export function Card(props) {
    return (
        <div className="max-w-sm bg-yellow-50 border border-yellow-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <center>
                <p className="align-middle">

                    <img className="p-3 rounded-t-lg object-cover w-32" src={props.image} alt={props.name}  />
                </p>
            </center>
            <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-yellow-900 dark:text-white">{props.name.charAt(0).toUpperCase() + props.name.slice(1)}</h5>

                <div className="grid grid-cols-2 gap-4">
                    <p className="font-normal text-yellow-700 dark:text-gray-100">Health : {props.hp}</p>
                    <p className="font-normal text-yellow-700 dark:text-gray-100">Attack : {props.atk}</p>
                    <p className="font-normal text-yellow-700 dark:text-gray-100">Defense : {props.def}</p>
                    <p className="font-normal text-yellow-700 dark:text-gray-100">Speed : {props.speed}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {props.types.map((i, index) => (
                        <span
                        style={{backgroundColor:typeColors[i.type.name]}}
                            key={index}
                            className={`px-2 py-1 text-sm font-medium text-white rounded-lg`}
                        >
                            {i.type.name.charAt(0).toUpperCase() + i.type.name.slice(1)}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
