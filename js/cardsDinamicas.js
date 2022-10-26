import { data } from './data.js';
import {leerLocalStorage} from './localstorage.js'

//si los datos que traigo del localStorage no son null, muestro la tabla creada
const dataFromLocalStorage = leerLocalStorage();

const $divCards = document.querySelector(".divCards");


const crearCard = (anuncio) => {

    const newCard = document.createElement("figure");

    const id = anuncio.id;

    newCard.setAttribute('data-id', id);
    
    const titulo = document.createElement("h3");
    titulo.textContent = `Titulo: ${anuncio.titulo}`;
    
    const descripcion = document.createElement("p");
    descripcion.textContent = `Descripcion: ${anuncio.descripcion}`;
    
    const precio = document.createElement("p");
    precio.textContent = `Precio: ${anuncio.precio}`;

    const animal = document.createElement("p");
    animal.textContent = `Animal: ${anuncio.animal}`;

    const raza = document.createElement("p");
    raza.textContent = `Raza: ${anuncio.raza}`;

    const fechaNac = document.createElement("p");
    fechaNac.textContent = `Fecha Nacimiento: ${anuncio.fechaNacimiento}`;

    const vacuna = document.createElement("p");
    vacuna.textContent = `Vacuna ${anuncio.vacunado}`;
    
    newCard.appendChild(titulo);
    newCard.appendChild(descripcion);
    newCard.appendChild(animal);
    newCard.appendChild(precio);
    newCard.appendChild(raza);
    newCard.appendChild(fechaNac);
    newCard.appendChild(vacuna);
    
    newCard.classList.add('figure');

    return newCard;

};


if (dataFromLocalStorage == null) {
    
    $textoNoCards = document.createElement('h1');
    $textoNoCards.TextContent = "No hay animales en el sistema";
    $divCards.appendChild($textoNoCards);
} else {
    
    dataFromLocalStorage.forEach((x) => {

        const $card = crearCard(x);
        $divCards.appendChild($card)
        console.log($card)
    })

}
