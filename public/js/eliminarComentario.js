import axios from "axios"
import Swal from "sweetalert2"


document.addEventListener("DOMContentLoaded",() =>{

    const formsEliminar = document.querySelectorAll(".eliminarComentario")
    

    //revisar que exista  los formularios
    if(formsEliminar.length > 0){
        formsEliminar.forEach(form =>{
            form.addEventListener("submit", eliminarComentario)
        })
    }
})


function eliminarComentario(e){
    e.preventDefault()

    Swal.fire({
      title: "¿Estas seguro?",
      text: "No se puede revertir esta accion",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {

        //tomar el id del cometario
        const idComentario = this.children[1].value

        //Crear el objeto
        const datos={
            idComentario
        }
        axios.post(this.action, datos).then((respuesta) => {
          Swal.fire("¡Eliminado!", respuesta.data, "success");

          //eliminar del DOM
          this.parentElement.parentElement.remove()
        }).catch(error =>{
            if(error.response.status == 403 || error.response.status === 404 ){
                Swal.fire("Error!", error.response.data, "error");
            }
        });

        
      }
    });

    
}