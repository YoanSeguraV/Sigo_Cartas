import React, { useState, useEffect } from "react";

import { Context } from "../context/Context";

function Cartas() {
  const {
    socket,
    contador,
    numeracion,
    imagen,
    juego,
    setcontador,
    datas,
    cartaSeleccionada,
    setCartaSeleccionada,
    setcartapokemones,
  } = Context();

  const [poder, setpoder] = useState(null);
  const handleCambiarCarta = () => {
    if (contador < datas.length) {
      setCartaSeleccionada(datas[contador]);
      setcontador(contador + 1);
    }
  };

  const handlePoderes = () => {
    const poderSeleccionado = {
      carta: cartaSeleccionada.name,
      poder: poder,
      numeracion: numeracion[contador - 1],
      imagen: imagen[contador - 1],
    };
    socket.emit("carta-mesa", juego, poderSeleccionado);
    socket.on("cartas-mesa", (data) => {
      console.log(data);
      setcartapokemones(data);
    });
  };

  return (
    <>
      {cartaSeleccionada && (
        <>
          <div
            className="card mb-3 bg-dark border-danger text-white mt-5 "
            style={{ width: "16rem" }}
          >
            <div className="card-body bg-primary ">
              <h5>{numeracion[contador - 1]}</h5>
              <div className="d-flex justify-content-center ">
                <img
                  src={imagen[contador - 1]}
                  className="card-img-top bg-dark w-75 rounded-circle"
                  alt="..."
                />
              </div>
            </div>
            <h5 className="text-center mt-2">{cartaSeleccionada.name}</h5>
            <div className="card-footer gap-3 d-flex justify-content-around">
              <div className="card-footer-social  text-center">
                <h5 className="text-center">
                  {cartaSeleccionada.stats[1].base_stat}A
                </h5>
                <p className=" opacity-50">Ataque</p>
              </div>

              <div className="card-footer-social  ">
                <h5 className="text-center">
                  {cartaSeleccionada.stats[2].base_stat}A
                </h5>
                <p className=" opacity-50">Defensa</p>
              </div>
              <div className="card-footer-social ">
                <h5 className="text-center">
                  {cartaSeleccionada.stats[3].base_stat}A
                </h5>
                <p className=" opacity-50">Ataque E</p>
              </div>
            </div>
          </div>

          <select
            className="form-select w-75"
            onChange={(e) => setpoder(e.target.value)}
          >
            <option value={cartaSeleccionada.stats[1].base_stat}>Ataque</option>
            <option value={cartaSeleccionada.stats[2].base_stat}>
              Defensa
            </option>
            <option value={cartaSeleccionada.stats[3].base_stat}>
              Ataque Especial
            </option>
          </select>

          <button className="btn btn-danger w-75 mt-2" onClick={handlePoderes}>
            Lanzar Carta
          </button>
        </>
      )}
      <button
        className="btn btn-primary w-75 mt-2"
        onClick={() => handleCambiarCarta()}
      >
        Cambiar Carta
      </button>
    </>
  );
}

export default Cartas;
