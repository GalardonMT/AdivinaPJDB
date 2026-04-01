'use strict'

window.addEventListener('load', async() => {    
    
    // enlaza los elementos del DOM a variables
    let form = document.querySelector("#formulario");
    let botRendirse = document.querySelector("#rendirse");
    let botReintentar = document.querySelector("#reintentar");
    let imagen = document.querySelector("#imagen");
    let errorNombre = document.querySelector('#error_nombre');
    let contador = 1;
    let nombrePJ;
    let imagenPJ;
    const historialPJ = [];

    function mostrarMensajeGuia() {
        document.querySelector('#error_nombre').style.display = '';
        errorNombre.innerHTML = 'Ingrese su nombre';
        errorNombre.classList.remove('error');
    }


    function mostrarMensajeError(texto) {
        errorNombre.innerHTML = texto;
        errorNombre.classList.add('error');
    }

    
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
        
        //se realiza un fetch con la id que no se repite y se guarda en la constante url
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
    
    const traducciones = { 
        "Chi-Chi": ["milk", "chichi", "chi chi"], 
        "Piccolo": ["picoro"], 
        "Mr. Satan": ["mister satan", "mr satan", "mrsatan"], 
        "Android 20 (Dr. Gero)": ["android 20", "androide 20", "drgero", "dr gero", "dr maki gero", "maki gero", "makigero", "gero"],
        "Zeno": ["zeno sama"], 
        "Android 13" : ["androide 13"], 
        "Android 14" : ["androide 14"],
        "Android 15" : ["androide 15"],
        "Android 16" : ["androide 16"],
        "Android 17" : ["androide 17"],
        "Android 19" : ["androide 19"],
        "Celula" : ["cell"],
        "Kibito-Shin" : ["kibitoshin", "kibito shin"],
        "Master Roshi" : ["maestro roshi", "roshi"],
        "Marcarita " : ["marcarita"],
    };

    // verificar la longitud del historial/*
    function verificacionHistorial(historialPJ){
        // aqui se cambia el limite de personajes actualmente 30, el maximo es 41
        return historialPJ.length >= 30;
    };

    function terminarJuego(){
        // Verificar historial de personajes
        // este if es equivalente a (verificacionHistorial(historialPJ) == true)
        if(verificacionHistorial(historialPJ)){
            document.querySelector('#resultado').style.display = '';
            document.querySelector('#resultado').innerHTML = '<h1>El juego ha terminado</h1>';
            document.querySelector('#resultado').innerHTML = '<h1>Tu record fué de ' + contador + ' puntos!</h1>';
            document.querySelector('#reintentar').style.display = '';
            document.querySelector('#personaje').style.display = 'none';
            document.querySelector('#scoreboard').style.display = 'none';
            document.querySelector('#input').style.display = 'none';
            document.querySelector('#error_nombre').style.display = 'none';
            document.querySelector('#enviar').style.display = 'none';
            document.querySelector('#rendirse').style.display = 'none';
            document.querySelector('#imagen').style.display = 'none';
            return true;
        }else{
            return false;
        };
    }
    
    async function recargarPJ() {
        
        if(terminarJuego()){
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
    mostrarMensajeGuia();

    function scoreboard(){
        document.querySelector('#scoreboard').innerHTML = 'Scoreboard: ' + contador + '/30';
        return contador++;
    }
    
    //formulario se le agrega el evento submit
    form.addEventListener('submit',function(event){
        event.preventDefault(); // se ejecuta siempre para no recargar la pagina
        
        let intento = event.target.input.value.toLowerCase().trim();

        let opcionesCorrectas = traducciones[nombrePJ] ? [...traducciones[nombrePJ], nombrePJ.toLowerCase()] : [nombrePJ.toLowerCase()];

        // Comparacion estricta
        if(opcionesCorrectas.includes(intento)){
            mostrarMensajeGuia();
            //alert("Acertaste");
            recargarPJ();
            //elimina lo que contiene dentro el input
            document.getElementById("input").value = '';
            scoreboard();  
        }else{
            mostrarMensajeError('Nombre incorrecto, ingrese otro.');
            console.log(nombrePJ);
        }
    });

    function restaurarBotonesUI(){
        document.getElementById("input").value = '';
        mostrarMensajeGuia();
        //mostrar botones con css simple
        document.querySelector('#reintentar').style.display = 'none';
        document.querySelector('#input').style.display = '';
        document.querySelector('#enviar').style.display = '';
        document.querySelector('#rendirse').style.display = '';
    }

    function ocultarBotonesUI(){
        //ocultar botones con css simple
        document.querySelector('#reintentar').style.display = '';
        document.querySelector('#input').style.display = 'none';
        document.querySelector('#enviar').style.display = 'none';
        document.querySelector('#rendirse').style.display = 'none';
    }

    
    // boton de rendirse
    botRendirse.addEventListener('click',function(){
        historialPJ.length = 0;
        console.log(nombrePJ);
        //elimina lo que contiene dentro el input
        document.getElementById("input").value = '';
        //revela el nombre del personaje
        mostrarMensajeError('Nombre del personaje: ' + nombrePJ);
        ocultarBotonesUI();
    });
    

    // boton de reintentar
    botReintentar.addEventListener('click',async function(){
        document.querySelector('#resultado').innerHTML = '';
        document.querySelector('#personaje').style.display = '';
        document.querySelector('#scoreboard').style.display = '';
        document.querySelector('#imagen').style.display = '';
        historialPJ.length = 0;
        contador = 0;
        let termino = terminarJuego();
        if(termino == true){
            return;
        }
        scoreboard();
        await recargarPJ();
        restaurarBotonesUI();
    });
});

