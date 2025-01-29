### Instalación

Una vez clonado el repositoriodebemos de ejecutar

`$npm install `

Esto para que se descarguen todas las dependencias 

despues, 

`$npm start`

Para ejecutar la aplicación.

##### Lista de bibliotecas usadas
                
+ **mui/material**:  El principal componente usado en esta aplicación. 
+ **mui/icons-material**:  Conjunto de iconos de Google Material Design listos para usarse en Material UI.
+ **mui-datatables**:  Este componente me ayudo en la visualización de la tabla.
+ **react-leafletl**: Especialmente útil para la visualización del mapa..
+ **react-router-dom**:  Me permitió manejar rutas de manera precisa..
+ **axios**:  Me permitió manejar peticiones al back de una forma más sencilla.


#### UserForm.js
Este archivo contiene la mayor cantidad de confiscación, lo especial de este archivo es que dependiendo de si es edición o es creación va a actuar, para ello use monitores de estados, de hecho, fue ampliamente usado para monitorear continente las acciones del usuario, aquí también se hizo hicieron las validaciones y la carga de imagen a de imgbb.

##### TableUser
Aquí se controlan las acciones de los usuarios, como eliminar o editar, además de la paginación y los filtros, esto gracias a la biblioteca de mui-datatables

##### Navbar.js
Aquí esta la barra estática donde se coloca el botón de añadir usuario y el botón de la página principal.

##### MapDialog.js
Considere separar este componente para que al momento de dar clik en el formulario para seleccionar la dirección me muestre una ventana flotante para escoger el lugar deseado y que se autocomplete mientras existan datos disponibles ya que algunas locaciones no tienen los datos completos por lo que el formulario no se completa completamente, considere usar leaflet porque Google es de pago si se superan ciertas peticiones por lo que lo decidí usar leaflet por practicidad y además su fácil manejo.

##### App.js 
La utilice para enrutar las vistas mas importantes en general.




#### Desafios
Uno de los principales desafíos fue integrar el mapa ya que como Google puede cobrar por ello empecé en la búsqueda e implementación alternativa de como realizar el mapa, al final se implementó con éxito.






