import app from './app';
import dotenv from 'dotenv';
import BD from './database';

// dotenv
dotenv.config({ path: '.env'});

BD.then((db) => {
    if (db) {
        app.listen(process.env.PORT);
        console.log("Server listen port", process.env.PORT);
    }
    else {
        console.log("Error al conectar con la BD, vuelva a ejecutar la aplicacion con la conexion corrrecta");
    }
});