# 🍽️ Alegra - Sistema de Gestión de Restaurante

**Alegra - Sistema de Gestión de Restaurante** es un sistema distribuido para la gestión de un restaurante, dividido en microservicios que manejan diferentes aspectos del negocio: pedidos, cocina, inventario, mercado, interfaz de usuario y comunicación entre servicios mediante Apache Kafka. Está desarrollado en **Node.js / TypeScript** y se ejecuta utilizando **Docker Compose**.

---

## 🧱 Arquitectura

El sistema se compone de los siguientes microservicios:

| Servicio            | Puerto | Descripción                                                           |
| ------------------- | ------ | --------------------------------------------------------------------- |
| `order-service`     | 3000   | Gestiona la creación de órdenes del cliente y las publica en Kafka.   |
| `kitchen-service`   | 3001   | Escucha órdenes de cocina desde Kafka y actualiza su estado.          |
| `market-service`    | 3002   | Escucha eventos de compras en Kafka y se conecta a Mongo/Postgres.    |
| `inventory-service` | 3003   | Gestiona el inventario y se alimenta de eventos de mercado.           |
| `ui-service`        | 3004   | Punto de entrada para el cliente. Se conecta con los otros servicios. |
| `kafka`             | 9092   | Sistema de mensajería entre microservicios.                           |
| `zookeeper`         | 2181   | Coordinador de Kafka.                                                 |
| `postgres`          | 5432   | Base de datos relacional para órdenes, recetas, inventario, etc.      |
| `mongodb`           | 27017  | Base de datos NoSQL para alamcenar las recetas                        |

> Todos los servicios están orquestados con `Docker Compose`.

---

## 🚀 Inicio rápido

### 🔧 Requisitos

- Docker & Docker Compose
- Node.js (para desarrollo local sin contenedores)
- PM2 (para manejar procesos en producción)

### 📦 Clonar el repositorio

```bash
git clone https://github.com/FenixLM/alegra-restaurant.git
cd alegra-restaurant
```

## ▶️ Ejecutar con Docker

```bash
docker-compose up --build
```

### 📡 Endpoints disponibles

Desde ui-service en http://localhost:3004

| Método | Endpoint     | Descripción                                        |
| ------ | ------------ | -------------------------------------------------- |
| `GET ` | `/orders`    | Lista las órdenes desde order-service              |
| `GET`  | `/inventory` | Consulta de inventario desde inventory-service     |
| `GET ` | `/recipes`   | Consulta de recetas                                |
| `GET`  | `/purchases` | Consultas de compras desde MongoDB                 |
| `POST` | `/order`     | Crea una nueva orden que se envía al order-service |

### 📁 Estructura del proyecto

```plaintext
/services
├── order_services
├── kitchen_services
├── market_services
├── inventory_services
└── ui_services

Cada servicio contiene su propia lógica, incluyendo archivos de conexión a base de datos, clientes Kafka y configuración de PM2.
```

### 🔄 Comunicación entre servicios

Kafka se usa como intermediario para eventos asincrónicos (ordenes, compras, cambios de inventario).

HTTP se usa para comunicación síncrona entre el UI y los servicios internos.

### 🗃️ Base de Datos

PostgreSQL: almacena entidades estructuradas como órdenes, inventario.

MongoDB: guarda datos semi-estructurados como recetas.

### Desarrollado por Felix Lamadrid Morales
