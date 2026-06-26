# Respuestas BONUS 

## 1. ¿Cómo modelarías que un usuario pueda "seguir" a otros usuarios, y a su vez ser seguido por muchos?

En bases de datos NoSQL como MongoDB, la relación "Seguidores / Seguidos" (que es de Muchos a Muchos) se puede modelar utilizando dos estrategias principales, dependiendo de la escala que se espere para la red social:

### A: Arrays de Referencia
Agregar dos arrays dentro del esquema `User` que guarden los `ObjectId` de los otros usuarios.
* **`followers` (Seguidores):** Array con las referencias de los usuarios que me siguen.
* **`following` (Siguiendo):** Array con las referencias de los usuarios a los que yo sigo.
* **Pro:** Con un solo `.populate()` ya accederiamos a la lista de seguidores.
* **Contra** Los documentos en MongoDB tienen un tamaño máximo de 16MB. Si un usuario llegara a millones de seguidores, el array `followers` crecería tanto que rompería el documento.

### B: Colección
Para evitar el problema de los 16MB, se crea una nueva colección dedicada exclusivamente a guardar la relación, simulando una tabla intermedia de bases de datos relacionales (SQL). Se podría llamar `Follows`.
* Cada documento de esta colección tendría solo dos campos: `follower_id` y `followed_id`.
* Para saber cuántos seguidores tiene un usuario, se haria un conteo buscando su ID en el campo `followed_id`.

> **Conclusión:** Para esta red "Anti-Social", implementaría la solución ** A**, ya que cubre perfectamente el alcance inicial del proyecto con consultas simples y rapidas.

---

## 2. Con la información de los post que no varía muy seguido, ¿qué estrategias podrían utilizar para que la información no sea constantemente consultada desde la base de datos?

Para evitar saturar a MongoDB con consultas repetitivas sobre datos que casi no cambian (como el listado general de publicaciones pasadas), la estrategia estándar en la industria es implementar un sistema de **Caché en Memoria (In-Memory Caching)**.

### La arquitectura con Caché (ej: Redis)
En lugar de ir siempre a MongoDB, se coloca un servidor de caché súper rápido (como **Redis** o **Memcached**) en el medio, que guarda los datos directamente en la memoria RAM del servidor.

### ¿Cómo funcionaría el flujo?
1. **Lectura:** Cuando un cliente pide un `GET /api/posts`, el backend de Express primero le pregunta a Redis: *"¿Tenés los posts guardados?"*.
   * Si Redis los tiene (**Cache Hit**), los devuelve instantáneamente sin tocar la base de datos.
   * Si Redis NO los tiene (**Cache Miss**), el backend