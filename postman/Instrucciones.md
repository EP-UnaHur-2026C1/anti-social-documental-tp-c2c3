# Instrucciones de Prueba - API Red Anti-Social (MongoDB)

Este documento detalla los pasos necesarios para importar, configurar y ejecutar las pruebas de la API utilizando la colección de Postman provista en el repositorio.

## 1. Requisitos

Antes de ejecutar las pruebas en Postman:

1. Levantar el motor de base de datos (MongoDB) vía Docker:
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

1. Abrir la aplicación **Postman** o la extensión de Postman en VS Code.
2. Hacer clic en el botón **Import** (arriba a la izquierda).
3. Seleccionar o arrastrar el archivo `anti-social-documental-tp-c2c3.postman_collection.json` ubicado en la carpeta `postman/` de este repositorio.

---

## 3. Flujo Principal E2E (IMPORTANTE)

### PASO PREVIO OBLIGATORIO (Carga de Imagen Física)
Como Postman no exporta archivos físicos locales al generar el JSON, **es necesario adjuntar una imagen manualmente** antes de correr la prueba automatizada para que Multer funcione correctamente:
1. Despliegue la carpeta `0. Flujo Principal - E2E - TestDocente`.
2. Haga clic en la petición **"12. Agregar imagen a post existente - Multer (VER INSTRUCTIVO)"**.
3. Vaya a la pestaña **Body** (`form-data`).
4. En la fila `image`, haga clic en "Select Files" y elija cualquier imagen (.jpg, .png) desde su computadora. (En la carpeta assets existe LogoUnahur.png)
5. Guarde los cambios en la petición (Ctrl + S o botón Save).

### Ejecutar el Flujo
1. Haga clic en los tres puntos (`...`) junto a la carpeta **`0. Flujo Principal - E2E - TestDocente`** y seleccione **Run folder**.
2. En la columna derecha de configuración, **marque la casilla "Save responses"** (o "Persist responses for a session") para poder visualizar los JSON creados.
3. Haga clic en el botón azul **Run**.

### Pasos que ejecuta este flujo en cascada:
1. `POST` 1. Registrar Usuario - MDW - OK (Guarda el `userNick`).
2. `POST` 2. Registrar Post - MDW - OK (Guarda el `postId`).
3. `POST` 3. Agregar Tag a Post 1 (Guarda el ID del tag para actualizarlo).
4. `POST` 4. Agregar Tag a Post 2 (Guarda el ID del tag para eliminarlo).
5. `PUT` 5. Actualizar Tag 1.
6. `DELETE` 6. Eliminar Tag 2 de Post (Rompe la relación).
7. `POST` 7. Agregar comentario 1 a post existente.
8. `POST` 8. Agregar comentario 2 a post existente (Guarda el ID del comentario).
9. `DELETE` 9. Eliminar Comentario 2.
10. `GET` 10. Obtener todos los posts.
11. `GET` 11. Obtener post por id.
12. `POST` 12. Agregar imagen a post existente - Multer (Upload de archivo físico).
13. `POST` 13. Agregar comentario 3 a post existente (Guarda el ID del comentario).
14. `GET` 14. Obtener comentario 3 por id.
15. `PUT` 15. Actualizar Post - Descripción.
16. `GET` 16. Obtener post por id (Para verificar el cambio en la descripción).
17. `DELETE` 17. Eliminar post por id.
18. `DELETE` 18. Eliminar usuario por nickName (Limpieza final de la BD).

---

## 4. Colección

Además del flujo E2E automatizado, la colección incluye todos los endpoints individuales separados por entidad para probar validaciones (Middlewares) y errores de forma aislada.

### 📁 1. Usuario
* `POST` Validaciones de request vacío, longitud mínima de Nickname y duplicidad (Espera código 400).
* `POST` 1. Registrar Usuario - MDW - OK.
* `GET` 2. Obtener usuarios por nickName / 3. Obtener todos los usuarios.
* `PUT` 4. Actualizar Usuario.
* `DELETE` 5. Eliminar usuario por nickName.

### 📁 2. Posts
* `POST` Validaciones por falta de descripción y usuario inexistente.
* `POST` 1. Registrar Post - MDW - OK.
* `GET` 2. Obtener todos los posts / 5. Obtener post por id (Retornan arrays populados).
* `PUT` 3. Actualizar Post - Descripción.
* `DELETE` 4. Eliminar post por id.

### 📁 3. Imagenes
* `POST` 1. Agregar imagen a post existente - Incrustación (Por URL estática). DEPRECADO.
* `DELETE` 2. Borrar imagen a post existente - Incrustación.
* `POST` 3. Agregar imagen a post existente - Multer (Carga de archivo físico).

### 📁 4. Tags
* `POST` 1. Agregar Tag a Post / 2. Create Tag.
* `GET` 3. Obtener todos los tags / 6. Obtener tag por id.
* `PUT` 4. Actualizar Tag.
* `DELETE` 5. Eliminar Tag / 7. Eliminar tag de Post (Relacional).

### 📁 5. Comment
* `POST` 1. Agregar comentario a post existente.
* `GET` 2. Obtener Comentarios desde Post / 5. Obtener todos los comentarios / 6. Obtener comentario por id.
* `PUT` 3. Actualizar Comentario.
* `DELETE` 4. Eliminar Comentario.