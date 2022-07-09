import path from 'path';

const info = {
    "definition": {
        "openapi": "3.0.0",
        "info": {
            "title": "Aluxion",
            "description": "API para subir archivos.",
            "termsOfService": "http://example.com/terms/",
            "contact": {
                "name": "Julio Romero",
                "url": "http://www.example.com/support",
                "email": "jcromeroc.19@gmail.com"
            },
            "license": {
                "name": "Apache 2.0",
                "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
            },
            "version": "1.0.1"
        },
        servers: [
            {
                url: "http://localhost:8080"
            }
        ]
    },
    "apis": [`${path.join(__dirname, "../routes/*.js")}`]
};

export default info;