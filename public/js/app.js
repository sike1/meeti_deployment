import {OpenStreetMapProvider} from "leaflet-geosearch"

import asistencia from "./asistencia"
import eliminarComentario from "./eliminarComentario"


//obtener valores de la base de datos


const lat = document.querySelector("#lat").value || 37.3754318
const lng = document.querySelector("#lng").value || -5.9962577
//utilizar el provider y GeoCoder
const direccion = document.querySelector("#direccion").value || ""
const geocodeService = L.esri.Geocoding.geocodeService()

const map = L.map('mapa').setView([lat,lng], 15);

let marker;
let markers = new L.FeatureGroup().addTo(map);

//Colacar pin en editar
if(lat && lng){
    // agrega el pin
    marker = new L.marker([lat,lng],{
        draggable:true,
        autoPan:true,


    }).addTo(map).bindPopup(direccion).openPopup()

    //asignar al contenedor
    markers.addLayer(marker)

    //detectar movimiento del marker
    marker.on("moveend", function(e){
        marker = e.target
        const posicion = marker.getLatLng()
        map.panTo(new L.LatLng(posicion.lat,posicion.lng))

        //reverse geocoding , cuando cambia el pin
        geocodeService.reverse().latlng(posicion,15).run(function(error,result){
            
            llenarInputs(result)
    
            //asigna al PoPup al marke
            marker.bindPopup(result.address.LongLabel)
        })
    })
}


document.addEventListener("DOMContentLoaded",() =>{
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Buscar la direccion
    const buscador = document.querySelector("#formbuscador")
    buscador.addEventListener("input",buscarDireccion)

})

function buscarDireccion(e){
    if(e.target.value.length >= 8){
        //si existe un pin anterior limpiarlo

        markers.clearLayers()

        //utilizar el provider y GeoCoder
        const provider = new OpenStreetMapProvider()
        provider.search({query: e.target.value}).then((resultado)=>{
           
            geocodeService.reverse().latlng(resultado[0].bounds[0],15).run(function(error,result){
                llenarInputs(result)
                 //ubicar el mapa donde este la busqueda
                map.setView(resultado[0].bounds[0],15)

                // agrega el pin
                marker = new L.marker(resultado[0].bounds[0],{
                    draggable:true,
                    autoPan:true,


                }).addTo(map).bindPopup(resultado[0].label).openPopup()

                //asignar al contenedor
                markers.addLayer(marker)

                //detectar movimiento del marker

                marker.on("moveend", function(e){
                    marker = e.target
                    const posicion = marker.getLatLng()
                    map.panTo(new L.LatLng(posicion.lat,posicion.lng))

                    //reverse geocoding , cuando cambia el pin
                    geocodeService.reverse().latlng(posicion,15).run(function(error,result){
                        
                        llenarInputs(result)
                        
                        //asigna al PoPup al marke
                        marker.bindPopup(result.address.LongLabel)
                
                    })
                })

                //asignar contenedor markers
                markers.addLayer(marker)
                
                })
        })
    }
}

function llenarInputs(resultado){
    console.log(resultado)
       document.querySelector("#direccion").value = resultado.address.LongLabel || ""
       document.querySelector("#ciudad").value = resultado.address.City || ""
       document.querySelector("#pais").value = resultado.address.CntryName || ""
       document.querySelector("#estado").value = resultado.address.Region || ""
       document.querySelector("#lat").value = resultado.latlng.lat || ""
       document.querySelector("#lng").value = resultado.latlng.lng || ""
}