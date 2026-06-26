# Instrucciones de Prueba - API Red Anti-Social (MongoDB)

Este documento detalla los pasos necesarios para importar, configurar y ejecutar las pruebas de la API utilizando la colección de Postman provista en el repositorio.

## 1. Requisitos

Antes de ejecutar las pruebas en Postman:

1. Levantar el motor de base de datos (MongoDB) vía Docker.
    ```bash
   docker compose up -d
   ```
2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Levantar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   *(El servidor se ejecutará por defecto en `http://localhost:3000`)*

---

## 2. Importar la Colección

1. Abrir la aplicación **Postman** o **Extensión de VSCode**.
2. Hacer clic en el botón **Import** (arriba a la izquierda).
3. Seleccionar o arrastrar el archivo `anti-social-documental-tp-c2c3.postman_collection.json` ubicado en la carpeta `postman/` de este repositorio.

---

## 3. Ejecución Rápida: Flujo Principal (E2E)

Para facilitar la corrección, se diseñó una carpeta especial llamada **`0. Flujo Principal - E2E - TestDocente`**. Este flujo ejecuta el camino feliz completo de la aplicación, capturando automáticamente los IDs generados (`_id`) y pasándolos de una petición a otra mediante variables de entorno temporales.

### ⚠️ IMPORTANTE: Cómo ver los JSON de respuesta
Por defecto, el "Runner" de Postman no guarda el cuerpo de las respuestas. Para poder visualizar los datos creados durante la prueba automática, siga estos pasos:

1. Haga clic en los tres puntos (`...`) junto a la carpeta **`0. Flujo Principal - E2E - TestDocente`** y seleccione **Run folder**.
2. En la ventana de configuración del Runner, busque la columna derecha (o despliegue las opciones avanzadas).
3. **Marque la casilla que dice "Save responses"** (o "Persist responses for a session").
4. Haga clic en el botón azul **Run 0. Flujo Principal...**.
5. Al finalizar, haga clic en el nombre de cualquier petición de la lista para ver el código `200 OK / 201 Created` y el cuerpo completo (Response Body) de lo que devolvió la base de datos.

### Pasos que ejecuta este flujo:
1. `POST` 1. Registrar Usuario - MDW - OK (Crea el usuario y guarda su NickName).
2. `POST` 2. Registrar Post - MDW - OK (Usa el usuario anterior y guarda el ID del Post).
3. `POST` 3. Agregar Tag a Post (Asigna un tag usando el ID del Post).
4. `POST` 4. Agregar comentario a post existente.
5. `GET` 5. Obtener todos los posts (Para verificar el esquema populado con incrustaciones y referencias).

---

## 4. Resto de la Colección

Además del flujo automatizado, la colección incluye todos los endpoints individuales separados por entidad para probar validaciones (Middlewares) y errores (Casos Negativos).

### 📁 1. Usuario
* `POST` Registrar Usuario - MDW - Request vacio (Espera código 400).
* `POST` Registrar Usuario - MDW - Nickname menor a 3 caracteres (Espera código 400).
* `POST` Registrar Usuario - MDW - Usuario existente (Espera código 400 - Duplicado).
* `POST` Registrar Usuario - MDW - OK (Camino feliz).
* `GET` Obtener todos los usuarios.
* `GET` Obtener usuarios por nickName.
* `PUT` Actualizar Usuario.

### 📁 2. Posts
* `GET` Obtener todos los posts (Trae arrays incrustados y referenciados populados).
* `POST` Registrar Post - MDW - Falta descripcion.
* `POST` Registrar Post - MDW - Usuario no registrado (Espera código 404).
* `POST` Registrar Post - MDW - OK.
* `PUT` Actualizar Post - Descripción.

### 📁 3. Imagenes
* `POST` Agregar imagen a post existente - Incrustación.
* `DELETE` Borrar imagen a post existente - Incrustación.

### 📁 4. Tags
* `POST` 1. Agregar Tag a Post (Referencia un tag al post, si no existe lo crea).
* `POST` 2. Create Tag (Creación independiente).
* `GET` 3. Obtener todos los tags.
* `PUT` 4. Actualizar Tag.
* `DELETE` 5. Eliminar Tag.

### 📁 5. Comment
* `POST` 1. Agregar comentario a post existente.
* `GET` 2. Obtener Comentarios desde Post.
* `PUT` 3. Actualizar Comentario.
* `DELETE` 4. Eliminar Comentario.