'use strict'

// enlaza los elementos del DOM a variables
let form;
let botRendirse;
let botReintentar;
let imagen;
let contador = 1;
let nombrePJ;
let imagenPJ;
const historialPJ = [];

// obtener el parametro de la url 
const parametros = new URLSearchParams(window.location.search);
let nivelDificultad = parametros.get('dificultad');

let cantidadPJ = 1;

switch (nivelDificultad) {
    case "1":
        cantidadPJ = 10;
        break;
    case "2":
        cantidadPJ = 20;
        break;
    case "3":
        cantidadPJ = 30;
        break;
    default:
        cantidadPJ = 30;
        break;
}

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

function terminarJuego(){
    // Verificar historial de personajes
    // este if es equivalente a (verificacionHistorial(historialPJ) == true)
        if(verificacionHistorial(historialPJ)){
        document.querySelector('#resultado').style.display = '';
        document.querySelector('#error_nombre').innerHTML = '';
        document.querySelector('#resultado').innerHTML = '<h1>El juego ha terminado</h1>';
        document.querySelector('#resultado').innerHTML = '<h1>Tu record fué de ' + contador + ' puntos!</h1>';
        document.querySelector('#reintentar').style.display = '';
        document.querySelector('#personaje').style.display = 'none';
        document.querySelector('#scoreboard').style.display = 'none';
        document.querySelector('#input').style.display = 'none';
        document.querySelector('#enviar').style.display = 'none';
        document.querySelector('#rendirse').style.display = 'none';
        document.querySelector('#imagen').style.display = 'none';
        return true;
    }else{
        return false;
    }
}

function scoreboard(){
    document.querySelector('#scoreboard').innerHTML = 'Scoreboard: ' + contador + '/' + cantidadPJ;
    return contador++;
}
    
// verificar la longitud del historial/*
function verificacionHistorial(historialPJ){
    // aqui se cambia el limite de personajes actualmente 10 el maximo es 41
    return historialPJ.length >= cantidadPJ;
};

function restaurarBotonesUI(){
    document.getElementById("input").value = '';
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

function mostrarDificultad(cantidadPJ){
    
    if(cantidadPJ == 10){
        document.querySelector('#dificultad').innerHTML = '<h2 id="dificultad" class="dificultad">Modo Facil</h2>';
        document.querySelector('#scoreboard').innerHTML = 'ScoreBoard: 0/' + cantidadPJ;
    }
    else if(cantidadPJ == 20) {
        document.querySelector('#dificultad').innerHTML = '<h2 id="dificultad" class="dificultad">Modo Medio</h2>';
        document.querySelector('#scoreboard').innerHTML = 'ScoreBoard: 0/' + cantidadPJ;
    }
    else if(cantidadPJ == 30){
        document.querySelector('#dificultad').innerHTML = '<h2 id="dificultad" class="dificultad">Modo Dificil</h2>';
        document.querySelector('#scoreboard').innerHTML = 'ScoreBoard: 0/' + cantidadPJ;
    }
    else{
        document.querySelector('#dificultad').innerHTML = '<h2 id="dificultad" class="dificultad">Modo Dificil</h2>';
        document.querySelector('#scoreboard').innerHTML = 'ScoreBoard: 0/' + cantidadPJ;
    };

}


window.addEventListener('load', async() => {    

    form = document.querySelector("#formulario");
    botRendirse = document.querySelector("#rendirse");
    botReintentar = document.querySelector("#reintentar");
    imagen = document.querySelector("#imagen");
    
    mostrarDificultad(cantidadPJ);
    recargarPJ();

    //formulario se le agrega el evento submit
    form.addEventListener('submit',function(event){
        event.preventDefault(); // se ejecuta siempre para no recargar la pagina
        
        let intento = event.target.input.value.toLowerCase().trim();

        let opcionesCorrectas = traducciones[nombrePJ] ? [...traducciones[nombrePJ], nombrePJ.toLowerCase()] : [nombrePJ.toLowerCase()];

        // Comparacion estricta
        if(opcionesCorrectas.includes(intento)){
            //alert("Acertaste");
            document.querySelector('#error_nombre').innerHTML = 'Ingrese algun nombre';
            recargarPJ();
            //elimina lo que contiene dentro el input
            document.getElementById("input").value = '';
            scoreboard();  
        }else{
            document.querySelector('#error_nombre').innerHTML = 'Nombre incorrecto, ingrese otro.';
            console.log(nombrePJ);
        }
    });
    
    // boton de rendirse
    botRendirse.addEventListener('click',function(){
        historialPJ.length = 0;
        console.log(nombrePJ);
        //elimina lo que contiene dentro el input
        document.querySelector('#error_nombre').innerHTML = '';
        document.getElementById("input").value = '';
        //revela el nombre del personaje
        document.querySelector('#error_nombre').innerHTML = 'Nombre del personaje: ' + nombrePJ;
        ocultarBotonesUI();
    });
    

    // boton de reintentar
    botReintentar.addEventListener('click',async function(){
        document.querySelector('#error_nombre').innerHTML = 'Ingrese algun nombre';
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

