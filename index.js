
//creo nuevo deposito
let deposito = new Deposito();
const btnAgregar = document.querySelector("#agregar-grupo");
let table = document.getElementById("electrogeno")
const btnBuscar = document.getElementById("buscar-grupo")
let divAviso = document.getElementById("aviso")
const btnEliminar = document.getElementById("eliminar-grupo")
const btnAgregarIndividual = document.getElementById("prueba")

refresh();

btnBuscar.addEventListener("click", () => {
    let element = document.getElementById("nombre-buscar").value;
    searchEquipo(divAviso, element)
});

btnAgregar.addEventListener("click", () => {

     let nombre = document.getElementById("nombre").value;
     let kva = document.getElementById("kva").value;
     let descripcion = document.getElementById("descripcion").value;
     let tipo = document.getElementById("tipo").value;
     let precio = document.getElementById("precio").value;

     let form = '#guardar-grupo';
     if(verifyLoop(form)){
        table.innerHTML = addEquipo(nombre, kva, descripcion, tipo, precio);
        recorrerDeposito(deposito);
        refresh()
     }
})

