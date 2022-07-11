## Prueba de Aluxion Backend

### Instrucciones para correr el proyecto:

1. Usar node v16 en adelante. 
2. Pedir al desarrollador el archivo .env ya que tiene datos sensibles.
3. Agregar archivo .env en la raiz del proyecto.
4. Ejecutar en la raiz del proyecto npm install para instalar lo modulos.
5. Ejecutar en la raiz del proyecto el comando `npm run dev`, si se ve en la consola el mensaje Server listen port 8080 significa que la API se encuentra corriendo. De caso contrario se mostrara que hubo un problema con la BD.
6. La ruta del swagger es la siguiente: http://localhost:8080/api-docs/, en ella se podra probar todos los endpoints del proyecto menos el de subir una imagen ya que la version del swagger no envia la imagen por files.
7. Para probar todos los endpoints del proyecto incluido el de subir un archivo se recomienda usar el archivo Postman incluido en el proyecto.
8. A disfrutar de la API!!!