/* Este es un desarrollo que servira para administrar grupos electrogenos
en tres aspectos: alquiler, venta y mantenimiento de correctivo
 */

//creo objeto de errores
const ERRORES = {
                 error_voltaje: "Ha seleccionado correctivo. No hace falta calcular Voltaje.",
                 error_formato: "Ingresado las horas en formato incorrecto",
                 error_equipo: "No se encuentra el equipo buscado",
                 error_deposito: "No existe equipo registrado en el depósito."};

let output = "";

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
                    equiposSeleccionados.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
            }
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
            output += `<tr><td>${i}</td><td> ${arr[i]?.nombre}</td> <td>${arr[i]?.kva}</td> <td>${arr[i]?.descripcion}</td> <td>${arr[i]?.tipo}</td> <td>Usd ${arr[i]?.precio}</td>
                       <td><button class="btn btn-outline-success prealquiler" id="${i}" data-bs-toggle="modal" data-bs-target="#modal-prueba">Alquiler</button>
                       </td>
                       </tr>`;
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
    msgResponse(`Equipo ${nombre} ingresado con exito`, `El equipo tiene ${kva} kva y es de tipo ${tipo}. El precio ingresado es ${precio}. Si desea modificarlo puede hacerlo luego.`, 5000)

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
    let direccion = document.getElementById("direccion_alquiler").value;
    let ciudad = document.getElementById("ciudad_alquiler").value;
    let provincias = document.getElementById("provincias").value;
    div.classList.add("card-2");
    divPadre.innerHTML = "";
    div.innerHTML = `   <div class="row" style="padding: 10px;">
                        <div class="col-sm-6">
                        <div class="detailsAlquiler"><b><h3>Equipo: </b> ${resposnseFind[el].nombre}</h3></div>
                        <div class="detailsAlquiler"><b>Descripcion:</b> ${resposnseFind[el].descripcion}</div>
                        <div class="detailsAlquiler"><b>Tipo: </b> ${resposnseFind[el].tipo}</div>
                        <div class="detailsAlquiler"><b>Precio: Usd </b> ${resposnseFind[el].precio}</div>
                        </div>
                        <div class="col-sm-6">
                        <div class="detailsAlquiler"><b><h3>Localizacion: </b></h3></div>
                        <div class="detailsAlquiler"><b>Dirección:</b>${direccion}   </div>
                        <div class="detailsAlquiler"><b>Ciudad:   </b> ${ciudad}  </div>
                        <div class="detailsAlquiler"><b>Provincia: </b> ${provincias}  </div>
                        </div>
                        </div>`
    divPadre.append(div)
    
}

//verify direccion alquiler
const verifyDireccion = (arr) => {
    let control = 0;
    arr.forEach((element => {
        let val = element.value;
        if(val === ""){
            element.style.borderColor = "red";
            ++control;
        }else{
            element.style.borderColor = "green";
        }

    }))
    return control === 0? true : false;
}

//orden
const search = () => {
    let arr = [];
    fetch("/../../provincias.json")
    .then(response => response.json())
    .then(datos => {

    for (let provincia of datos.provincias){
        arr.push({id: provincia.id, option: `<option value=${provincia.nombre}>${provincia.nombre}</option>`});
    }
    let select = document.querySelector(".provincias");
        for (let i = 0; i < arr.length; i++) {
            select.innerHTML += arr[i].option
            }
});      
}

const fectchProvincias = () => {
    let listadoProvincias = new Promise((resolve, reject) => {
        resolve(search())
    });

    listadoProvincias.then((result) => {
        console.log("Provincias actualizadas");
    })
}

const loaderEventos = () => {
    if(localStorage.length != 0){
        let arrAlqu = document.querySelectorAll(".alquilar");
        let arrPrueba = document.querySelectorAll(".prealquiler");
        agregarEventos(arrAlqu, "alquiler");
        agregarEventos(arrPrueba, "prealquiler");
    }
}

//agregaeventos
const agregarEventos = (arr, evento) => {
    
    switch (evento) {
        case "alquiler":
            arr.forEach(element => {
                element.addEventListener("click", () => {
                    let formDireccion = document.querySelectorAll("#datos-entrega input, select")
                    if(verifyDireccion(formDireccion)){
                        Swal.fire({
                            title: '¿Está seguro de alquilar el equipo?',
                            text: "Al alquilarlo quedara confirmado el alquiler y debera listarlo con el boton listar alquileres.",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Alquilar'
                          }).then((result) => {
                            let equipo = element.id;
                            if (result.isConfirmed) {
                                deposito.alquilarEquipo(equipo, divAviso);
                                element.setAttribute("disabled","disabled")
                                let arrPrueba = document.querySelectorAll(".prealquiler");
                                arrPrueba.forEach((element) => {
                                    if(element.getAttribute("id") === equipo){
                                        element.setAttribute("disabled","disabled");
                                        element.style.backgroundColor = "Red";
                                        element.style.color = "white";
                                        element.style.borderColor = "white";
                                        element.innerHTML = "Alquilado"
                                    }
                                })
                              Swal.fire(
                                'Equipo alquilado con exito',
                                'El equipo ha sido reservado',
                                'success'
                              )
                            }
                            let divDatos = "#datos-entrega"
                            cleanFields(divDatos);
                          })
                    }

                })
            })
            break;
            case "prealquiler":
                arr.forEach(element => {
                    element.addEventListener("click", () => {
                        fectchProvincias();
                        let equipo = element.id;
                        let div = document.querySelector(".btn-alquiler-equipo");
                        let btn = `<button class="btn btn-outline-success alquilar" style="margin-right: 5px;" 
                                    id="${equipo}"> <i class="fa-solid fa-plus"></i> Alquilar</button>`;
                        div.innerHTML = btn;
                        loaderEventos();
                        
                    })
                })
                break;
            
        default:
            break;
    }

}

//busca equipo
const searchEquipo = (el) => {
    
    const resposnseFind = deposito.obtenerDepositoStorage().find((element) => element.nombre == el);
    if(resposnseFind != undefined){
        msgResponse("Equipo encontrado", 'El equipo con nombre '+resposnseFind.nombre+' se encuentra registrado', 2000);
        el.value = "";
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El equipo '+el+' no fue creado o tiene un error de tipeo.',
            footer: 'Vuelva a intentarlo.'
          })
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
    let resp = false;
    arrElements.forEach(element => {
        verifyElement(element.value, element)? control = control + 0: ++control;
    });

    control === 0 ? (
        cleanFields(div),
        resp = true
    ) : (
        resp = false
    );
    return resp;

}

const msgResponse = (title, msg, timer) => {
    let timerInterval
    Swal.fire({
      title: title,
      html: msg,
      timer: timer,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('booyia')
      }
    })
}

