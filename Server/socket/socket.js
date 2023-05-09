import axios from "axios";
export default (io) => {
  let numeracion = [
    "1A",
    "1B",
    "1C",
    "1D",
    "1E",
    "1F",
    "1G",
    "1H",
    "2A",
    "2B",
    "2C",
    "2D",
    "2E",
    "2F",
    "2G",
    "2H",
    "3A",
    "3B",
    "3C",
    "3D",
    "3E",
    "3F",
    "3G",
    "3H",
    "4A",
    "4B",
    "4C",
    "4D",
    "4E",
    "4F",
    "4G",
    "4H",
  ];
  let juegos = {
    nombres: {},
    id: {},
  };

  let users = [];
  const numbers = [];
  const URL = [];
  let Image = [];
  let cartasJuego = [];

  io.on("connection", (socket) => {
    console.log("Ususario conectado");
    socket.on("sendCards", (data) => {
      card = data;
    });

    //!crear partida
    socket.on("crear-juego", (username) => {
      const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
      if (!juegos.nombres[codigo]) {
        juegos.nombres[codigo] = [];
        juegos.id[codigo] = [];
      }
      socket.join(codigo);
      console.log(
        `el usuario ${username} se ha conectado a  la sala ${codigo}`
      );
      juegos.nombres[codigo].push(username);
      juegos.id[codigo].push(socket.id);

      const user = {
        username,
        id: socket.id,
        codigo,
      };
      users.push(user);
      loadCards();

      io.to(codigo).emit("juego-creado", user);
    });

    //!unirme a la sala
    socket.on("unirse-juego", (codigo, nombre) => {
      if (!codigo) {
        return socket.emit("codigo-invalido", "codigo invalido");
      } else if (juegos.nombres[codigo].length > 7) {
        return socket.emit("max-jugadores", "Sala llena 7 jugadores");
      } else {
        socket.emit("user-conect", "usuario conectado a la sala" + codigo);
        socket.join(codigo);
        console.log(
          `el usuario ${nombre} se ha conectado a  la sala ${codigo}`
        );

        juegos.nombres[codigo].push(nombre);
        juegos.id[codigo].push(socket.id);
        actualizarJugadores(codigo);

        io.to(codigo).emit("juego");
        socket.emit("unido-juegos", codigo);
      }
      socket.on("disconnect", () => {
        const index = juegos.id[codigo].indexOf(socket.id);
        juegos.nombres[codigo].splice(index, 1);
        juegos.id[codigo].splice(index, 1);
        io.to(codigo).emit("nick", juegos.nombres[codigo], juegos.id[codigo]);
        console.log(
          `el usuario ${socket.id} se ha desconectado de la sala ${codigo}`
        );
      });
    });

    function actualizarJugadores(codigo) {
      setInterval(() => {
        io.to(codigo).emit("nick", juegos.nombres[codigo], juegos.id[codigo]);
      }, 1000);
    }
    socket.on("iniciar", async (codigo) => {
      const cartasss = [...URL];
      const numero = [...numeracion];
      const imagenes = [...Image];
      if (juegos.nombres[codigo].length === 1) {
        io.to(codigo).emit("validacionjugador");
      } else {
        io.to(codigo).emit("iniciar-juego");

        const { cartasJugador, number, imagen } = repartirCartas(
          juegos.id[codigo],
          cartasss,
          numero,
          imagenes
        );

        juegos.id[codigo].map((jugadorr) => {
          const cartaporJugador = cartasJugador[jugadorr];
          const numeracioncard = number[jugadorr];
          const imagenesJugador = imagen[jugadorr];
          io.to(jugadorr).emit(
            "cartass",
            cartaporJugador,
            numeracioncard,
            imagenesJugador
          );
        });
      }
    });

    socket.on("jugadoresjuego", (codigo) => {
      io.to(codigo).emit(
        "jugadoresId",
        juegos.nombres[codigo],
        juegos.id[codigo]
      );
    });

    //!cartas mesa
    socket.on("carta-mesa", (codigo, poder) => {
      console.log(poder);
      cartasJuego.push(poder);

      io.to(codigo).emit("cartas-mesa", cartasJuego);
    });
  });
  function repartirCartas(jugadores, cartaxxx, numero, imagenn) {
    const numCartasJugador = Math.floor(cartaxxx.length / jugadores.length);

    const cartasJugador = {};
    const number = {};
    const imagen = {};
    jugadores.forEach((jugador, index) => {
      cartasJugador[jugador] = [];
      number[jugador] = [];
      imagen[jugador] = [];

      for (let i = 0; i < numCartasJugador; i++) {
        const cartaIndex = Math.floor(Math.random() * cartaxxx.length);
        const carta = cartaxxx.splice(cartaIndex, 1)[0];
        const numeracion = numero.splice(cartaIndex, 1)[0];
        const img = imagenn.splice(cartaIndex, 1)[0];

        cartasJugador[jugador].push(carta);
        number[jugador].push(numeracion);
        imagen[jugador].push(img);
      }
    });
    return { cartasJugador, number, imagen };
  }
  const loadCards = () => {
    try {
      while (numbers.length < 32) {
        const randomNum = Math.floor(Math.random() * 150) + 1;

        if (!numbers.includes(randomNum)) {
          numbers.push(randomNum);
          URL.push(`https://pokeapi.co/api/v2/pokemon/${randomNum}`);
          Image.push(
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomNum}.png`
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const handleCartas = async () => {

  //     const { data } = await axios.get(
  //       "https://pokeapi.co/api/v2/pokemon?limit=32&offset=0"
  //     );
  //     const { results } = data;

  //     const promises = results.map(async (pokemon) => {
  //         urlpokemon.push(pokemon.url);
  //       const res = await fetch(pokemon.url);
  //       const data = await res.json();
  //       return data;
  //     });

  //   };
};
