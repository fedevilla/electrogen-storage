/* Este es un desarrollo que servira para administrar grupos electrogenos
en tres aspectos: alquiler, venta y mantenimiento de correctivo
 */

//creo objeto de errores
const ERRORES = {
                 error_voltaje: "Ha seleccionado correctivo. No hace falta calcular Voltaje.",
                 error_formato: "Ingresado las horas en formato incorrecto",
                 error_equipo: "No se encuentra el equipo buscado",
                 error_deposito: "No existe equipo registrado en el depósito."};


//mensajes de inputs
const ENTRADAS = {msg_voltaje: "Ingrese la cantidad de horas necesarias para calcular voltaje",
                 }

//Objeto de limites
const LIMITS = {limit_menu_down: 0, limit_menu_up: 5, limit_down_q_electrogenos: 1, limit_up_q_electrogenos: 5};
let output = "";

 //voltaje
let voltaje = (tipo, horas) => {
    if(tipo === 1 || tipo === 2){
        horas = parseInt(prompt(ENTRADAS.msg_voltaje));
        while(isNaN(horas)){
            alert(ERRORES.error_formato);
            horas = parseInt(prompt(ENTRADAS.msg_voltaje));
        }
        const VOLTAJE = 2;
        return horas * VOLTAJE;
    }else{
        alert(ERRORES.error_voltaje);
    }
}

//Creacion de Clase grupo electrogeno
class Electrogeno{
    constructor(nombre, kva, descripcion, tipo, precio){
        this.nombre = nombre;
        this.kva = kva;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.precio = precio;
    }

    actividad(){
        return true;
    }

    traerGrupo(){
        let equipo = {
            "Equipo": this.nombre,
            "kva": this.kva,
            "Descripcion": this.descripcion,
            "Tipo": this.tipo,
            "Precio": this.precio
          }
        return equipo;

    }

}

//Creacion de deposito

class Deposito{
    constructor(){
        this.nuevoEquipo = [];
    }

    agregarEquipo(Equipo){
        this.nuevoEquipo.push(Equipo)
    }

    eliminarEquipo(Equipo, details){

        const index = this.nuevoEquipo.map(obj => obj.nombre).indexOf(Equipo);
        if(index != -1){
            this.nuevoEquipo.splice(index, 1);
            details.innerHTML = "";
            details.innerHTML = '<div class="alert alert-danger" id="detalle" role="alert">El equipo ' + Equipo +  ' ha sido eliminado del depósito`</div>';
            
        }else{
            details.innerHTML = "";
            details.innerHTML = '<div class="alert alert-danger" id="detalle" role="alert">El equipo ' + Equipo +  'no se encuentra registrado en deposito`</div>';
        }

    }

    eliminarEquipoStorage(equipo, details){
        localStorage.removeItem(equipo);
        details.innerHTML = "";
        details.innerHTML = '<div class="alert alert-danger" id="detalle" role="alert">El equipo ' + equipo +  ' ha sido eliminado del depósito`</div>';
    }

    obtenerDeposito(){
       let equiposSeleccionados = [];
       for (let i = 0; i < this.nuevoEquipo.length; i++) {
           if(typeof this.nuevoEquipo[i].nombre != undefined){
                equiposSeleccionados.push(this.nuevoEquipo[i].traerGrupo())
           }
       }
     
      return equiposSeleccionados;
      
    }

        //con storage
    obtenerDepositoStorage(){
            let equiposSeleccionados = [];
            for (let i = 0; i < localStorage.length; i++) {
                    equiposSeleccionados.push(JSON.parse(localStorage.getItem(i)))
            }
            console.log(localStorage)
           return equiposSeleccionados;
           
         }

    alquilarEquipo(Equipo, details){
        agregarAlquiler(Equipo)
        details.innerHTML = "";
        details.innerHTML = '<div class="alert alert-info" id="detalle" role="alert">El equipo seleccionado ha sido enviado a alquiler`</div>';

    }

}


//listamos todas los equipos con sus caracteristicas
const list = (arr, details) => {
    let output = "";
    if(arr.length > 0){
        for (let i = 0; i < arr.length; i++) {
            output += `<tr><td>${i}</td><td> ${arr[i].nombre}</td> <td>${arr[i].kva}</td> <td>${arr[i].descripcion}</td> <td>${arr[i].tipo}</td> <td>Usd ${arr[i].precio}</td>
                       <td><button class="btn btn-outline-success alquilar" style="margin-right: 5px;" id="${i}">Alquilar</button></td></tr>`;
        }
        details.innerHTML = "";
        details.innerHTML = '<div class="alert alert-success" id="detalle" role="alert">Existen '+ arr.length +' electrogenos en deposito</div>';
        return output;
        
    }else{
        details.innerHTML = "";
        details.innerHTML = '<div class="alert alert-primary" id="detalle" role="alert">'+ ERRORES.error_deposito+'</div>'
        return output = "";
    }
    
} 


//agrego equipos
const addEquipo = (nombre, kva, descripcion, tipo, precio) => {

    let nuevoEquipo;
    let divAviso = document.getElementById("aviso")
    nuevoEquipo = new Electrogeno(nombre, kva, descripcion, tipo, precio);
     //activo equipo
    deposito.agregarEquipo(nuevoEquipo);
    nuevoEquipo.actividad();

    return list(deposito.obtenerDeposito(), divAviso);
}



//agregar Local Storage
const agregarLocalstorage = (clave, valor) => {
        localStorage.setItem(clave, valor)
}

const recorrerDeposito = (deposito) => {
    if(localStorage.length != 0){
        let claveInicial = parseInt(localStorage.length)
        for (let i = 0; i < deposito.nuevoEquipo.length; i++) {
            agregarLocalstorage(claveInicial, JSON.stringify(deposito.nuevoEquipo[i]))
        }
    }else{
        for (let i = 0; i < deposito.nuevoEquipo.length; i++) {
            agregarLocalstorage(i, JSON.stringify(deposito.nuevoEquipo[i]))
    
        }
    }

}


//agregar equipo alquilado

const agregarAlquiler = (el) => {
    const resposnseFind = deposito.obtenerDepositoStorage();
    let divPadre = document.getElementById("alquilado-equipo")
    let div = document.createElement("div")
    div.classList.add("card-2");
    div.innerHTML = `    <div style="padding: 10px;">
    <div style="padding-bottom: 3px;"><b><h3>Equipo: </b> ${resposnseFind[el].nombre}</h3></div>
    <div style="padding-bottom: 3px;"<b>Descripcion:</b> ${resposnseFind[el].descripcion}</div>
    <div style="padding-bottom: 3px;"<b>Tipo: </b> ${resposnseFind[el].tipo}</div>
    <div style="padding-bottom: 3px;"<b>Precio: Usd </b> ${resposnseFind[el].precio}</div>
    </div>`
    divPadre.append(div)
}

const loaderEventos = () => {
    if(localStorage.length != 0){
        let arrAlqu = document.querySelectorAll(".alquilar");
        let arrElim = document.querySelectorAll(".eliminar");
        agregarEventos(arrAlqu, "alquiler");
        agregarEventos(arrElim, "eliminar");
    }
}


//agregaeventos
const agregarEventos = (arr, evento) => {
    switch (evento) {
        case "alquiler":
            arr.forEach(element => {
                element.addEventListener("click", () => {
                    let equipo = element.id;
                    deposito.alquilarEquipo(equipo, divAviso)
                    element.disabled = true;
                    element.innerHTML = "Alquilado"
                    element.style.background = "red";
                    element.style.color = "white";
                    element.style.border = "1px solid white"
                })
            })
            break;
        
        case "eliminar":
            arr.forEach(element => {
                element.addEventListener("click", () => {
                    let equipo = element.id;
                    borrarEquipoStorage(deposito.obtenerDepositoStorage(), divAviso, equipo)
                    refresh();
                })
            })
             break;
    
        default:
            break;
    }

}



//busca equipo
const searchEquipo = (details, el) => {
    
    const resposnseFind = deposito.obtenerDeposito().find((element) => element.Equipo == el);
    if(resposnseFind != undefined){
        details.innerHTML = "";
        details.innerHTML = '<div class="alert alert-info" id="detalle" role="alert">El equipo '+resposnseFind.Equipo+' se encuentra en sistema.</div>'
        el.value = "";
        
    }else{
        details.innerHTML = "";
        details.innerHTML = '<div class="alert alert-danger" id="detalle" role="alert">'+ERRORES.error_equipo+'. El equipo <b>'+el+'</b> no fue creado o tiene un error de tipeo.</div>';
    }
}

//borra equipo
const borrarEquipoStorage = (arr, details, equipoEliminar) => {
    if(arr.length > 0){
        deposito.eliminarEquipoStorage(equipoEliminar, details);
    }

}

//refresh
const refresh = () => {
    let table = document.getElementById("electrogeno")
    let divAviso = document.getElementById("aviso")
    table.innerHTML = list(deposito.obtenerDepositoStorage(), divAviso);
    loaderEventos();
}

//borro todos los campos
const cleanFields = (div) => {
    let arrElements = document.querySelectorAll(div + '> input');
    arrElements.forEach(element => {
        element.value = ""
    });
}

//verificar campos
const verifyElement = (input, el) => {
    let spanName = el.getAttribute("id");
    let id = spanName+"-error";
    let span = document.getElementById(id);
    if(input.length === 0 || input === ""){
        span.className = "error-span-data"
        span.innerHTML = "Este campo no puede estar vacio";
        el.style.borderColor = "red";
        return false;
     }else{
        span.className = ""
        span.innerHTML = "";
        el.style.borderColor = "grey";
        return true;
     }
}


const verifyLoop = (div) => {
    let arrElements = document.querySelectorAll(div + '> input');
    let control = 0;
    arrElements.forEach(element => {
        if(verifyElement(element.value , element)){
            control = control + 0;
        }else{
            control = control + 1;
        }
    });

    if(control === 0){
        cleanFields(div)
        return true;
    }else{
        return false;
    }
    
}



