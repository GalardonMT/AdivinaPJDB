'use strict'

window.addEventListener('load', async() => {    
    
    let id = Math.floor(Math.random() * 43) + 1 ;
    
    // funcion para traer personaje de la api
    const getPersonaje = (id) => {
        return fetch(`https://dragonball-api.com/api/characters/${id}`);
    };
    
    // esperar promesa
    const res = await getPersonaje(id);
    // transformar en json el res
    const data = await res.json();
 
    //guardar informacion del personaje
    const nombrePJ = data.name;
    const imagenPJ = data.image;
    
    /* Forma antigua 
    function getPersonaje(){
        return fetch('https://dragonball-api.com/api/characters/1');
    }

    getPersonaje()
        .then(function(value){
            return value.json();
        })
        .then(function(value){
            var personaje = value.name;
            var imagen = value.image;
        });
    */

    let form = document.querySelector("#formulario");
    let imagen = document.querySelector("#imagen");

    // asigno la imagen de la api al elemento imagen con .src para darle formato
    imagen.src = imagenPJ;

    form.addEventListener("submit",function(event){

        
        let intento = event.target.input.value;
        
        // Comparacion estricta
        if(nombrePJ.toLowerCase().trim() === intento.toLowerCase().trim()){
            console.log(true);
        }else{
            event.preventDefault(); // recargar pagina
            console.log(false);
        }
    });

    // faltante: que funcione sin recargar pagina cuando ganes. 
    // mensaje de acertaste personaje y que se pueda seguir jugando
    // no se repitan los pjs
    // boton rendirse, revela el nombre del pj - seguir jugando

});

