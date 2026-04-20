# City Train — Ushuaia

Monorepo con **frontend** (Next.js), **backend** (NestJS + Prisma) y **PostgreSQL**, listo para desarrollo con Docker Compose.

Repositorio: [https://github.com/rodrigueziba/citytrain](https://github.com/rodrigueziba/citytrain)

## Requisitos

- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose v2)

## Obtener el código desde GitHub

### Primera vez (clonar)

```bash
git clone https://github.com/rodrigueziba/citytrain.git
cd citytrain
```

### Actualizar el proyecto (pull)

Desde la carpeta del repositorio:

```bash
git pull origin main
```

Si trabajás en otra rama, cambiá `main` por el nombre de tu rama (por ejemplo `git pull origin mi-rama`).

## Levantar el entorno con Docker Compose

En la raíz del repo (donde está `docker-compose.yml`):

```bash
docker compose up --build
```

- La **primera vez** o tras cambios en `Dockerfile.dev` / dependencias, `--build` reconstruye las imágenes.
- El backend ejecuta al iniciar: `prisma generate`, `prisma migrate deploy` (crea/actualiza tablas) y luego el servidor en modo desarrollo.

### URLs locales

| Servicio   | URL |
|-----------|-----|
| Frontend  | [http://localhost:3000](http://localhost:3000) |
| API (Nest)| [http://localhost:3001](http://localhost:3001) |
| PostgreSQL| puerto `5432` (usuario/contraseña/base definidos en `docker-compose.yml`) |

### Datos iniciales (seed)

Opcional: cargar categorías de pasajes y horarios de ejemplo.

```bash
docker exec train_backend npx prisma db seed
```

Solo hace falta si necesitás regenerar esos datos o es la primera vez y querés asegurarte de tener el seed aplicado.

### Ver logs

```bash
docker compose logs -f
```

Para un solo servicio: `docker compose logs -f backend` (o `frontend`, `db`).

### Detener

`Ctrl+C` en la terminal donde corre Compose, o en otra terminal:

```bash
docker compose down
```

Para borrar también el volumen de Postgres (**se pierden los datos locales**):

```bash
docker compose down -v
```

## Variables de entorno (opcional)

- La base de datos ya está configurada en `docker-compose.yml` (`DATABASE_URL` en el servicio `backend`).
- Pagos con Mercado Pago: el backend usa `MERCADOPAGO_ACCESS_TOKEN`. Podés añadirla al servicio `backend` en `docker-compose.yml` o usar un archivo `.env` y [`env_file`](https://docs.docker.com/compose/environment-variables/set-environment-variables/) en Compose **sin commitear secretos**.

## Desarrollo sin Docker

Podés instalar dependencias en `frontend/` y `backend/` con `npm install` y seguir los README de cada carpeta; necesitás una instancia de PostgreSQL y la misma `DATABASE_URL` que apunte a esa base.
