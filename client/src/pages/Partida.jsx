import React, { useEffect, useState } from "react";
import Cartas from "../components/Cartas";

import { useParams } from "react-router-dom";

import { Context } from "../context/Context";
import Mesa from "../components/Mesa";

function Partida() {
  const {
    socket,
    datas,
    setGlobalPokemons,
    setnumeracion,
    setimagen
  } = Context();

  const [nombre, setnombre] = useState([]);
  const [getid, setid] = useState([]);
  const { juego } = useParams();

  useEffect(() => {
    socket.emit("jugadoresjuego", juego);
    socket.on("jugadoresId", (nombre, id) => {
      setnombre(nombre);
      setid(id);
    });

    socket.emit("iniciar", juego);
    socket.on("cartass", async (cartasJugador, numeracion, imagenesJugador) => {
      setnumeracion(numeracion);
      setGlobalPokemons([]);
      setimagen(imagenesJugador);
      const results = await Promise.all(
        cartasJugador.map(async (pokemon) => {
          const res = await fetch(pokemon);
          return res.json();
        })
      );
      setGlobalPokemons(results);
    });
  }, []);

  return (
    <div className="bg-dark">
      <div className=" container bg-dark " style={{ height: "120vh" }}>
        <div className="row">
          <h1 className="mx-2 mt-2 text-danger">
            Jugador:{" "}
            {nombre.map((jugador, index) => {
              if (getid[index] == socket.id) {
                return (
                  <span className="text-white" key={index}>
                    {jugador}
                  </span>
                );
              }
            })}
          </h1>

          <div className="col-4   ">
            <div className=" gap-2  flex-wrap">
              <Cartas />
            </div>
          </div>
          <div className="col-8 bg-danger ">
            <h1>Numero de cartas {datas.length}</h1>
            <Mesa />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Partida;
