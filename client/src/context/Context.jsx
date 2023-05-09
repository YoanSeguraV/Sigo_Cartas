import { useContext, createContext, useState, useEffect } from "react";
import io from "socket.io-client";

export const ServiceContext = createContext();

export const Context = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    new Error("context no funciona");
  }
  return context;
};

export const ServiceContextProvider = ({ children }) => {
  const URLBACKEND = "http://localhost:3000/";
  const socket = io(URLBACKEND);
  const [CartasMesa, setCartasMesa] = useState([]);
  const [cartapokemones, setcartapokemones] = useState([]);
  const [contador, setcontador] = useState(0);
  const [datas, setGlobalPokemons] = useState([]);
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const [numeracion, setnumeracion] = useState([]);
  const [imagen, setimagen] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("usuario conectado");
    });

    // socket.emit("sendCards", urlpokemon);

    socket.on("disconnect", () => {
      console.log("usuario desconectado");
      localStorage.clear();
    });
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        socket,
        CartasMesa,
        setCartasMesa,
        cartapokemones,
        setcartapokemones,
        contador,
        setcontador,
        datas,
        setGlobalPokemons,
        cartaSeleccionada,
        setCartaSeleccionada,
        numeracion,
        setnumeracion,
        imagen,
        setimagen,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
