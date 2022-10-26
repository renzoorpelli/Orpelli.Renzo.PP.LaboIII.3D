import { crearAnuncioAnimal } from './anuncio.js'

import { crearTabla } from "./tablaDinamica.js";

import {
    guardarLocalStorage,
    leerLocalStorage,
    agregarLocalStorage,
  } from "./localstorage.js";
  
  import {
    validarCampoVacio,
    validarNumeros,
    validarPrecio,
    validarLongitudMaxima
  } from "./validaciones.js";
  





//referencia a la tabla
const divTabla = document.querySelector(".divTabla");

//referencia al formulario
const $formulario = document.forms[0];
const $formElements = $formulario.elements;

//botnes crud
const $btnCancelar = document.getElementById("btnCancelar");
const $btnBorrar = document.getElementById("btnBorrar");
const $btnGuardar = document.getElementById("btnGuardar");
const $spinner = document.getElementById("spinner");
const $smallAlert = document.getElementById("alertSubmit");

$btnBorrar.classList.add("escondido");


//si los datos que traigo del localStorage no son null, muestro la tabla creada
const dataFromLocalStorage = leerLocalStorage();

//llamo a actualizar tabla
actualizarTabla();

let idSeleccionado;
divTabla.addEventListener("click", (e) => {
  const emisor = e.target;

  if (emisor.matches("tbody tr td")) {
    // de cada celda que clickeo obtengo el id
    let idAnuncio = emisor.parentElement.dataset.id;

    const anuncio = dataFromLocalStorage.find((element) => {
      return element.id == idAnuncio;
    });

    idSeleccionado = idAnuncio;
    cargarFormulario(anuncio);

    $btnGuardar.textContent = "Modificar";
    $btnCancelar.classList.add("visible");
    $btnBorrar.classList.remove("escondido");
    $btnBorrar.classList.add("visible");
    console.log("🚀 ~ file: app.js ~ line 35 ~ anuncio ~ anuncio", anuncio);
  }
});


// si apreto el boton cancelar, no muestro las acciones de borrar
$btnCancelar.addEventListener("click", () => {
    $btnBorrar.classList.remove("visible");
    $btnBorrar.classList.add("escondido");
    $btnGuardar.textContent = "Guardar";
  });
  
  // agregar/ modificar addEventListener
  window.addEventListener("load", () => {
    esconderSpinner()
    $formulario.addEventListener("submit", (e) => {
      //evito que el evento sea disparado y valido
      e.preventDefault();
  
      if (validarSubmit() && !validarFormVacio()) {
        $smallAlert.classList.remove("danger");
        $smallAlert.textContent = "";
  
        //si el boton guardar tiene como texto el "modificar", significa que la proxima accion a realizar
        //sera una modificacion de un objeto entidad seleccionado, entonces modifico la entidad
        if ($btnGuardar.textContent == "Modificar") {
          const entidadModificar = dataFromLocalStorage.find((element) => {
            return element.id == idSeleccionado;
          });
          if (modificarEntidad(entidadModificar)) {
            actualizarTabla();
            guardarLocalStorage(dataFromLocalStorage);
            console.log("entidad modificada con exito");
          }
        } else if ($btnGuardar.textContent == "Guardar") {
          const {
            titulo,
            animal,
            descripcion,
            precio,
            fechaNacimiento,
            raza,
            vacunado,
          } = e.target;

          const nuevoAnuncio = crearAnuncioAnimal(
            null,
            titulo.value,
            animal.value,
            descripcion.value,
            precio.value,
            fechaNacimiento.value,
            raza.value,
            vacunado.value
          );
  
          mostrarSpinner();
          setTimeout(() => {
            //si agrego la entidad al localstorage comunico con un mensaje
            if (agregarEntidad(nuevoAnuncio)) {
              console.log("agregado al local storage correctamente");
              esconderSpinner();
            }
          }, "2000");
        }
      } else {
        $smallAlert.classList.add("danger");
        $smallAlert.textContent = "ERROR, faltan campos para enviar";
      }
    });
  });
  
  //eliminar addEventListener
  $btnBorrar.addEventListener("click", (e) => {
    e.preventDefault();
    const entidadEliminar = dataFromLocalStorage.find((element) => {
      return element.id == idSeleccionado;
    });
    //verifico que lo que quiero eliminar exista
    if (entidadEliminar) {
      //cacheo el indice de la entidad a eliminar
      let indexToRemove = dataFromLocalStorage.findIndex(
        (element) => element.id == idSeleccionado
      );
  
      //elimino a apartir del indice eliminado 1 posicion
      dataFromLocalStorage.splice(indexToRemove, 1);
  
      //actualizo la tabla
      actualizarTabla();
  
      //guardo en el localStorage
      guardarLocalStorage(dataFromLocalStorage);
    }
  });
  
  /*
      funcion encargada de actualizar los miembros de la tabla segun la data del local storage
  
  */
  function actualizarTabla() {
    while (divTabla.hasChildNodes()) {
      divTabla.removeChild(divTabla.firstChild);
    }
  
    divTabla.appendChild(crearTabla(dataFromLocalStorage));
  }
  
  /*
  
  **********FUNCIONES CRUD**********************
  
  */
  
  /*
      funcion engcargada de agregar una objeto entidad al local storage
  
  */
  function agregarEntidad(entidad) {
    if (entidad && agregarLocalStorage(dataFromLocalStorage, entidad)) {
      actualizarTabla();
      return true;
    }
  }
  
  //funcion encargada de modificar el objeto entidad
  function modificarEntidad(entidadModificar) {
    if (entidadModificar) {
      entidadModificar.titulo = $formulario.titulo.value;
      entidadModificar.descripcion = $formulario.descripcion.value;
      entidadModificar.animal = $formulario.animal.value;
      entidadModificar.precio = $formulario.precio.value;
      entidadModificar.raza = $formulario.raza.value;
      entidadModificar.fechaNacimiento = $formulario.fechaNacimiento.value;
      entidadModificar.vacunado = $formulario.vacunado.value;
      return true;
    }
    return false;
  }
  // funcion encargargada de cargar los campos del formulario con los datos del objeto entidad seleccionado
  
  function cargarFormulario(entidad) {
    if (entidad) {
      $formulario.titulo.value = entidad.titulo;
      $formulario.animal.value = entidad.animal;
      $formulario.descripcion.value = entidad.descripcion;
      $formulario.precio.value = entidad.precio;
      $formulario.raza.value = entidad.raza;
      $formulario.fechaNacimiento.value = entidad.fechaNacimiento;
      $formulario.vacunado.value = entidad.vacunado;
    }
    return false;
  }
  
  /*
  *
      Validaciones
  *
  */
  
  for (let i = 0; i < $formElements.length; i++) {
    const controles = $formElements.item(i);
  
    if (controles.matches("input")) {
      if (
        controles.matches("[type=text]") ||
        controles.matches("[type=number]")
      ) {
        //este control hace referencia a el salto hacia otro input
          controles.addEventListener("blur", validarCampoVacio);
          if (controles.matches("[type=text]")) { 
            controles.addEventListener("input", validarLongitudMaxima);
          }
        if (controles.matches("[id=idPrecio]")) {
          controles.addEventListener("input", validarPrecio);
          controles.addEventListener("blur", validarPrecio);
        } else if (controles.matches("[type=number]")) {
          controles.addEventListener("blur", validarNumeros);
        }
      }
    }
  }
  
  // funciones validaciones para enviar
  
  function validarSubmit() {
    const controles = $formulario.elements;
  
    for (const control of controles) {
      //si alguno de los controles tiene la clase error, no continuo
      if (control.classList.contains("inputError")) {
        return false;
      }
    }
    return true;
  }
  
  function validarFormVacio() {
    if (
      $formulario.titulo.value == "" ||
      $formulario.descripcion.value == "" ||
      $formulario.precio.value == "" ||
      $formulario.raza.value == "" ||
      $formulario.fechaNacimiento.value == "" ||
      $formulario.vacunado.value == ""
    ) {
      return true;
    }
    return false;
  }
  
  
  //funciones spinner
  
  function mostrarSpinner() {
    $spinner.classList.add("loader");
  
    $spinner.classList.add("mostrarSpinner");
  
  }
  
  function esconderSpinner() {
    $spinner.classList.remove("loader");
  
    $spinner.classList.add("escondeSpinner");
  
  }
  