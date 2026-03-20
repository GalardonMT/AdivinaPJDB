'use strict'

window.addEventListener('load', async() => {    
    
    // enlaza los elementos del DOM a variables
    let form = document.querySelector("#formulario");
    let botRendirse = document.querySelector("#rendirse");
    let botReintentar = document.querySelector("#reintentar");
    let imagen = document.querySelector("#imagen");
    let nombrePJ;
    let imagenPJ;
    const historialPJ = [];

    
    // funcion para traer personaje de la api FETCH
    const getPersonaje = async() => {
    
        //funcion para generar numero random, se quitan los numeros 41 y 36 debido a 
        //que en la api no existen esos ids de personajes.
        function numeroID(){
            let numero = Math.floor(Math.random() * 43) + 1;
            //si el numero es distinto de 41 y numero es distinto 36 se returna
            if(numero !== 41 && numero !== 36){
                return numero;
            }else{
                return numeroID();
            };
        };

        // asignar numero random a id
        let id = numeroID();
        //guarda en una array las ids de los personajes que no se han visto y generado. tambien se guarda la id del primer pj
        if(historialPJ.length == 0 || historialPJ.includes(id) == false){
            historialPJ.push(id);
        }else{
            // genera un nuevo pj en caso de que se haya visto
            return await getPersonaje();
        };
        
        console.log(historialPJ);
        
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
        };
    };
    
    
    // verificar la longitud del historial/*
    function verificacionHistorial(historialPJ){
        // aqui se cambia el limite de personajes actualmente 42
        return historialPJ.length >= 41;
    };


    function terminarJuego(){
        // Verificar historial de personajes
        // este if es equivalente a (verificacionHistorial(historialPJ) == true)
        if(verificacionHistorial(historialPJ)){
            document.querySelector('#resultado').innerHTML = '<h1>El juego ha terminado</h1>';
            document.querySelector('#reintentar').style.display = 'none';
            document.querySelector('#input').style.display = 'none';
            document.querySelector('#enviar').style.display = 'none';
            document.querySelector('#rendirse').style.display = 'none';
            return true;
        }else{
            return false;
        };
    }
    
    async function recargarPJ() {
        
        let termino = terminarJuego();
        if(termino == true){
            return;
        }

        // recargar pj
        let data = await getPersonaje();
        // en caso de que sea undefinido, se recarga el personaje nuevamente
        if(data === undefined || data.name === undefined){
            return await recargarPJ();
        };
        
        nombrePJ = data.name;
        imagenPJ = data.image;
        imagen.src = imagenPJ;
        imagen.width = '300';
        imagen.height = '300';
    };

    recargarPJ();
    
    //formulario se le agrega el evento submit
    form.addEventListener('submit',function(event){
        
        event.preventDefault(); // se ejecuta siempre para no recargar la pagina
        
        let intento = event.target.input.value;
        // Comparacion estricta
        if(nombrePJ.toLowerCase().trim() === intento.toLowerCase().trim()){
            //alert("Acertaste");
            recargarPJ();
            //elimina lo que contiene dentro el input
            document.getElementById("input").value = '';
            console.log("true");
        }else{
            console.log(nombrePJ);
            console.log("false");
        }
    });


    // boton de rendirse
    botRendirse.addEventListener('click',function(){
        console.log(nombrePJ);
        //revela el nombre del personaje
        document.querySelector('#error_nombre').innerHTML = 'Nombre del personaje: ' + nombrePJ;
        //ocultar botones con css simple
        document.querySelector('#reintentar').style.display = '';
        document.querySelector('#input').style.display = 'none';
        document.querySelector('#enviar').style.display = 'none';
        document.querySelector('#rendirse').style.display = 'none';
    });
    
    // boton de reintentar
    botReintentar.addEventListener('click',async function(){
        let termino = terminarJuego();
        if(termino == true){
            return;
        }
        await recargarPJ();
        document.querySelector('#error_nombre').innerHTML = '';
        //mostrar botones con css simple
        document.querySelector('#reintentar').style.display = 'none';
        document.querySelector('#input').style.display = '';
        document.querySelector('#enviar').style.display = '';
        document.querySelector('#rendirse').style.display = '';
    });
    
});

