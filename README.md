# Microservices App

This project was created for learning microservice architecture and Docker usage in a simple Node.js application with an API gateway, user service, order service, and product service.

## Services

| Service | Port | Database |
| --- | --- | --- |
| API Gateway | 3000 | - |
| User Service | 3001 | MongoDB |
| Order Service | 3002 | MongoDB |
| Product Service | 3003 | MySQL |

## Run

Requirements:
- Docker
- Docker Compose
- Node.js 18+

Start the app:

```bash
docker compose up --build
```

Access:

```text
http://localhost:3000
```

## Health Checks

- API Gateway: http://localhost:3000/health
- User Service: http://localhost:3001/health
- Order Service: http://localhost:3002/health
- Product Service: http://localhost:3003/health

## Routes

### User Service
- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Order Service
- GET /api/orders
- GET /api/orders/:id
- POST /api/orders
- PATCH /api/orders/:id/status
- DELETE /api/orders/:id

### Product Service
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- PATCH /api/products/:id/stock
- DELETE /api/products/:id

## Notes

- The API Gateway routes requests to the correct service.
- The Order Service retrieves user data from the User Service.
- User and Order data are stored in MongoDB; Product data is stored in MySQL.

## Stop

```bash
docker compose down
```
