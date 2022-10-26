import { crearAnuncioAnimal } from "./anuncio.js";
import {data} from "./data.js"



//leer
export const leerLocalStorage = () => {
  const anuncios = [];
  if (localStorage.getItem("inmubles")) {
    JSON.parse(localStorage.getItem("inmubles")).forEach((inmueble) =>
    anuncios.push(inmueble)
    );
  } else {
    guardarLocalStorage(data);
  }
  return anuncios;
};

//guardar

export const guardarLocalStorage = (inmubles) => {
  const arrAnuncios = [];

  inmubles.forEach((elemento) => {
    const anuncio = crearAnuncioAnimal(
      elemento.id,
      elemento.titulo,
      elemento.animal,
      elemento.descripcion,
      elemento.precio,
      elemento.fechaNacimiento,
      elemento.raza,
      elemento.vacunado
    );
    arrAnuncios.push(anuncio);
  });

  localStorage.setItem("inmubles", JSON.stringify(arrAnuncios));
};

//agrega un elemento a las entidades del localStorage
export const agregarLocalStorage = (entidadesLocalStorage, entidad) => {
  if (entidadesLocalStorage != null && entidad != null) {
    entidadesLocalStorage.push(entidad);
    guardarLocalStorage(entidadesLocalStorage);
    return true;
  } else {
    return false;
  }

};
