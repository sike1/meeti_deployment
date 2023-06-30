import axios from "axios"



document.addEventListener("DOMContentLoaded",()=>{
    const asistencia = document.querySelector("#confirmarAsistencia")

    if(asistencia){
        asistencia.addEventListener("submit",confirmarAsistancia)
    }

})

function confirmarAsistancia(e){
        e.preventDefault()

        const btn = document.querySelector("#confirmarAsistencia input[type='submit']")
        let accion = document.querySelector("#accion").value
        const mensaje = document.querySelector("#mensaje")

       

        //obtner valor confirmar o cancelar
        const datos = {
            accion
        }

        axios.post(this.action,datos)
        .then(respuesta =>{
            if(accion === "confirmar"){
                //modifica los elementos del boton
                document.querySelector("#accion").value = "cancelar"
                btn.value = "Cancelar"
                btn.classList.remove("btn-azul")
                btn.classList.add("btn-rojo")
                setTimeout('document.location.reload()',1000);
            }else{
                document.querySelector("#accion").value = "confirmar"
                btn.value = "Si"
                btn.classList.remove("btn-rojo")
                btn.classList.add("btn-azul")
                setTimeout('document.location.reload()',1000);
            }

            //mostrar mensaje
            mensaje.appendChild(document.createTextNode(respuesta.data))
        })
}