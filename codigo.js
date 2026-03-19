'use strict'

window.addEventListener('load', async() => {    
    
    
    // funcion para traer personaje de la api
    const getPersonaje = async(id) => {
        id = Math.floor(Math.random() * 43) + 1 ;
        
        const url = fetch(`https://dragonball-api.com/api/characters/${id}`);
        
        try{ // try singnifica prueba este codigo
            // esperar la respuesta de la api la promesa
            const res = await url;
            // transformamos la respuesta en formato JSON
            const data = await res.json();
            // retornamos datosss
            return data;
        }catch(error){ // captura el error
            console.log("Error no se pudo conectar con la api.");
        }
    }
    
    let data = await getPersonaje();

    let nombrePJ = data.name;
    let imagenPJ = data.image;

    
    let form = document.querySelector("#formulario");
    let botRendirse = document.querySelector("#rendirse");
    let botReintentar = document.querySelector("#reintentar");
    let imagen = document.querySelector("#imagen");
    
    // asigno la imagen de la api al elemento imagen con .src para darle formato
    imagen.src = imagenPJ;
    imagen.width = '300';
    imagen.height = '300';
    
    
    //formulario se le agrega el evento submit
    form.addEventListener('submit',function(event){
        
        event.preventDefault(); // se ejecuta siempre para no recargar la pagina
        
        let intento = event.target.input.value;
        // Comparacion estricta
        if(nombrePJ.toLowerCase().trim() === intento.toLowerCase().trim()){
            console.log("true");
        }else{
            console.log(nombrePJ);
            console.log("false");
        }
    });
    
    
    // boton de rendirse
    botRendirse.addEventListener('click',function(){
        //revela el nombre del personaje
        document.querySelector('#error_nombre').innerHTML = '<br> Nombre del personaje: ' + nombrePJ;
        document.querySelector('#reintentar').innerHTML = '<input type="submit" value="reintentar" id="reintentar">';
        //ocultar botones con css simple
        document.querySelector('#enviar').style.display = 'none';
        document.querySelector('#rendirse').style.display = 'none';
    });
    
    // boton de reintentar
    botReintentar.addEventListener('click', async () => {
        // recargar pj
        data = await getPersonaje();

        nombrePJ = data.name;
        imagenPJ = data.image;
        imagen.src = imagenPJ;
        imagen.width = '300';
        imagen.height = '300';

        document.querySelector('#error_nombre').innerHTML = '';
        document.querySelector('#reintentar').innerHTML = '';
        //mostrar botones con css simple
        document.querySelector('#enviar').style.display = 'block';
        document.querySelector('#rendirse').style.display = 'block';
    });
    
});

