# HAMMER - API REST Documentation

## Tabla de Contenidos
1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Subastas](#subastas)
4. [Catálogos](#catálogos)
5. [Pujas](#pujas)
6. [Medios de Pago](#medios-de-pago)
7. [Artículos para Vender](#artículos-para-vender)
8. [Seguros](#seguros)

---

## Base URL
```
https://api.hammer-subastas.com/v1
```

## Autenticación

Todos los endpoints (excepto login y registro inicial) requieren un token JWT en el header:
```
Authorization: Bearer {token}
```

---

### POST /auth/register/step1
Primer paso del registro de usuario - Datos básicos

**Parámetros:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, email format)",
  "address": "string (required)",
  "country": "string (required)",
  "documentFrontImage": "string (required, base64)",
  "documentBackImage": "string (required, base64)"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "userId": "integer",
  "status": "pending_verification",
  "message": "Registro iniciado. Recibirás un correo cuando tu cuenta sea verificada."
}
```

**Errores:**
- `400 Bad Request` - Datos inválidos o incompletos
- `409 Conflict` - El email ya está registrado

---

### POST /auth/register/step2
Segundo paso del registro - Completar perfil y generar clave

**Parámetros:**
```json
{
  "userId": "integer (required)",
  "password": "string (required, min 8 characters)",
  "confirmPassword": "string (required)"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Registro completado exitosamente",
  "category": "string (Común|Especial|Plata|Oro|Platino)"
}
```

**Errores:**
- `400 Bad Request` - Contraseñas no coinciden o muy débil
- `404 Not Found` - Usuario no encontrado
- `403 Forbidden` - Usuario no verificado aún

---

### POST /auth/login
Iniciar sesión

**Parámetros:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "integer",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "category": "string",
    "verified": "boolean",
    "hasPaymentMethods": "boolean"
  },
  "expiresIn": "integer (seconds)"
}
```

**Errores:**
- `401 Unauthorized` - Credenciales inválidas
- `403 Forbidden` - Cuenta suspendida o pendiente de verificación

---

### POST /auth/logout
Cerrar sesión

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

## Usuarios

### GET /users/profile
Obtener perfil del usuario autenticado

**Respuesta exitosa (200 OK):**
```json
{
  "id": "integer",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "address": "string",
  "country": "string",
  "category": "string",
  "verified": "boolean",
  "memberSince": "string (ISO 8601 date)",
  "stats": {
    "totalBids": "integer",
    "wonAuctions": "integer",
    "totalSpent": "number",
    "paymentMethodsCount": "integer"
  }
}
```

**Errores:**
- `401 Unauthorized` - Token inválido o expirado

---

### PUT /users/profile
Actualizar perfil del usuario

**Parámetros:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "address": "string (optional)",
  "phone": "string (optional)"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Perfil actualizado exitosamente",
  "user": { /* objeto usuario actualizado */ }
}
```

**Errores:**
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado

---

### GET /users/statistics
Obtener estadísticas detalladas del usuario

**Respuesta exitosa (200 OK):**
```json
{
  "totalBids": "integer",
  "wonAuctions": "integer",
  "lostAuctions": "integer",
  "totalSpent": "number",
  "averageBid": "number",
  "categoriesParticipated": ["string"],
  "monthlyActivity": [
    {
      "month": "string",
      "bids": "integer",
      "spent": "number"
    }
  ]
}
```

**Errores:**
- `401 Unauthorized` - No autenticado

---

## Subastas

### GET /auctions
Listar todas las subastas

**Query Parameters:**
- `status` (optional): `upcoming|live|completed`
- `category` (optional): `Común|Especial|Plata|Oro|Platino`
- `currency` (optional): `USD|ARS`
- `page` (optional, default: 1): integer
- `limit` (optional, default: 10): integer

**Respuesta exitosa (200 OK):**
```json
{
  "auctions": [
    {
      "id": "integer",
      "title": "string",
      "date": "string (ISO 8601)",
      "time": "string",
      "location": "string",
      "category": "string",
      "currency": "string",
      "auctioneer": "string",
      "status": "string",
      "itemsCount": "integer",
      "minStartingBid": "number",
      "imageUrl": "string"
    }
  ],
  "pagination": {
    "page": "integer",
    "limit": "integer",
    "total": "integer",
    "totalPages": "integer"
  }
}
```

**Errores:**
- `400 Bad Request` - Parámetros de query inválidos

---

### GET /auctions/{id}
Obtener detalles de una subasta específica

**Respuesta exitosa (200 OK):**
```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "date": "string (ISO 8601)",
  "time": "string",
  "location": "string",
  "category": "string",
  "currency": "string",
  "auctioneer": "string",
  "status": "string",
  "streamingUrl": "string (optional)",
  "catalogItems": [
    {
      "id": "integer",
      "itemNumber": "string",
      "title": "string",
      "description": "string",
      "startingBid": "number",
      "currentBid": "number (nullable)",
      "images": ["string"],
      "artist": "string (optional)",
      "year": "string (optional)",
      "history": "string (optional)"
    }
  ]
}
```

**Errores:**
- `404 Not Found` - Subasta no encontrada

---

### GET /auctions/{id}/live
Obtener estado en vivo de una subasta

**Respuesta exitosa (200 OK):**
```json
{
  "auctionId": "integer",
  "currentItem": {
    "id": "integer",
    "itemNumber": "string",
    "title": "string",
    "basePrice": "number",
    "currentBid": "number",
    "leadingBidder": "string (anonymized)",
    "timeRemaining": "integer (seconds)"
  },
  "participants": "integer",
  "recentBids": [
    {
      "userId": "integer (anonymized)",
      "amount": "number",
      "timestamp": "string (ISO 8601)"
    }
  ]
}
```

**Errores:**
- `404 Not Found` - Subasta no encontrada
- `403 Forbidden` - Subasta no está en vivo o usuario no tiene acceso

---

## Catálogos

### GET /auctions/{auctionId}/catalog
Obtener catálogo completo de una subasta

**Respuesta exitosa (200 OK):**
```json
{
  "auctionId": "integer",
  "items": [
    {
      "id": "integer",
      "itemNumber": "string",
      "title": "string",
      "description": "string",
      "startingBid": "number (visible solo si autenticado)",
      "currentBid": "number (nullable)",
      "images": ["string"],
      "artist": "string (optional)",
      "year": "string (optional)",
      "history": "string (optional)",
      "dimensions": "string (optional)",
      "condition": "string"
    }
  ]
}
```

**Errores:**
- `404 Not Found` - Subasta no encontrada

---

### GET /catalog/items/{id}
Obtener detalles de un artículo específico

**Respuesta exitosa (200 OK):**
```json
{
  "id": "integer",
  "itemNumber": "string",
  "title": "string",
  "description": "string",
  "startingBid": "number",
  "currentBid": "number (nullable)",
  "images": ["string"],
  "artist": "string (optional)",
  "year": "string (optional)",
  "history": "string (optional)",
  "owner": {
    "id": "integer",
    "name": "string (anonymized unless current owner)"
  },
  "auctionId": "integer",
  "status": "string (pending|active|sold)"
}
```

**Errores:**
- `404 Not Found` - Artículo no encontrado

---

## Pujas

### POST /bids
Realizar una puja

**Parámetros:**
```json
{
  "auctionId": "integer (required)",
  "itemId": "integer (required)",
  "amount": "number (required)",
  "paymentMethodId": "integer (required)"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "bidId": "integer",
  "status": "accepted",
  "amount": "number",
  "position": "leading|outbid",
  "timestamp": "string (ISO 8601)"
}
```

**Errores:**
- `400 Bad Request` - Monto inválido (no cumple requisitos de min/max)
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin medio de pago verificado o categoría insuficiente
- `409 Conflict` - Puja ya superada por otra

---

### GET /bids/my-bids
Obtener historial de pujas del usuario

**Query Parameters:**
- `status` (optional): `active|won|lost`
- `page` (optional, default: 1): integer
- `limit` (optional, default: 20): integer

**Respuesta exitosa (200 OK):**
```json
{
  "bids": [
    {
      "id": "integer",
      "auctionId": "integer",
      "auctionTitle": "string",
      "itemId": "integer",
      "itemTitle": "string",
      "amount": "number",
      "status": "string",
      "timestamp": "string (ISO 8601)",
      "isLeading": "boolean"
    }
  ],
  "pagination": {
    "page": "integer",
    "limit": "integer",
    "total": "integer",
    "totalPages": "integer"
  }
}
```

**Errores:**
- `401 Unauthorized` - No autenticado

---

### GET /bids/{bidId}
Obtener detalles de una puja específica

**Respuesta exitosa (200 OK):**
```json
{
  "id": "integer",
  "auctionId": "integer",
  "itemId": "integer",
  "amount": "number",
  "status": "string",
  "timestamp": "string (ISO 8601)",
  "paymentMethodId": "integer"
}
```

**Errores:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es tu puja
- `404 Not Found` - Puja no encontrada

---

## Medios de Pago

### GET /payment-methods
Listar medios de pago del usuario

**Respuesta exitosa (200 OK):**
```json
{
  "paymentMethods": [
    {
      "id": "integer",
      "type": "bank_account|credit_card|certified_check",
      "status": "pending|verified|rejected",
      "details": {
        "bankName": "string (for bank_account)",
        "accountLast4": "string",
        "cardLast4": "string (for credit_card)",
        "checkAmount": "number (for certified_check)"
      },
      "verifiedAt": "string (ISO 8601, nullable)",
      "createdAt": "string (ISO 8601)"
    }
  ]
}
```

**Errores:**
- `401 Unauthorized` - No autenticado

---

### POST /payment-methods
Agregar nuevo medio de pago

**Parámetros:**
```json
{
  "type": "string (required: bank_account|credit_card|certified_check)",
  "bankName": "string (required for bank_account)",
  "accountNumber": "string (required for bank_account)",
  "routingNumber": "string (optional for bank_account)",
  "cardNumber": "string (required for credit_card)",
  "expiryDate": "string (required for credit_card, format MM/YY)",
  "cvv": "string (required for credit_card)",
  "checkNumber": "string (required for certified_check)",
  "checkAmount": "number (required for certified_check)",
  "checkImage": "string (required for certified_check, base64)"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "id": "integer",
  "status": "pending",
  "message": "Medio de pago agregado. Pendiente de verificación."
}
```

**Errores:**
- `400 Bad Request` - Datos inválidos o incompletos
- `401 Unauthorized` - No autenticado

---

### DELETE /payment-methods/{id}
Eliminar medio de pago

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Medio de pago eliminado exitosamente"
}
```

**Errores:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No puedes eliminar un medio de pago en uso
- `404 Not Found` - Medio de pago no encontrado

---

## Artículos para Vender

### POST /items/submit
Solicitar inclusión de artículo en subasta

**Parámetros:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "images": ["string (required, base64, min 6)"],
  "category": "string (required)",
  "artistName": "string (optional)",
  "year": "string (optional)",
  "history": "string (optional)",
  "ownershipConfirmation": "boolean (required, must be true)",
  "legalOriginDocuments": ["string (optional, base64)"]
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "itemId": "integer",
  "status": "pending_review",
  "message": "Artículo enviado para revisión. Recibirás una respuesta en 5-7 días hábiles."
}
```

**Errores:**
- `400 Bad Request` - Datos inválidos (menos de 6 imágenes, confirmación no aceptada, etc.)
- `401 Unauthorized` - No autenticado

---

### GET /items/my-submissions
Obtener artículos enviados para venta

**Query Parameters:**
- `status` (optional): `pending_review|accepted|rejected|in_auction|sold`

**Respuesta exitosa (200 OK):**
```json
{
  "items": [
    {
      "id": "integer",
      "title": "string",
      "status": "string",
      "submittedAt": "string (ISO 8601)",
      "reviewedAt": "string (ISO 8601, nullable)",
      "basePrice": "number (nullable)",
      "commission": "number (nullable)",
      "auctionId": "integer (nullable)",
      "auctionDate": "string (ISO 8601, nullable)",
      "soldPrice": "number (nullable)",
      "rejectionReason": "string (nullable)",
      "insurance": {
        "policyNumber": "string",
        "company": "string",
        "contact": "string"
      }
    }
  ]
}
```

**Errores:**
- `401 Unauthorized` - No autenticado

---

### GET /items/my-submissions/{id}
Obtener detalles de un artículo enviado

**Respuesta exitosa (200 OK):**
```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "images": ["string"],
  "status": "string",
  "submittedAt": "string (ISO 8601)",
  "reviewedAt": "string (ISO 8601, nullable)",
  "basePrice": "number (nullable)",
  "commission": "number (nullable)",
  "auctionId": "integer (nullable)",
  "auctionDate": "string (ISO 8601, nullable)",
  "soldPrice": "number (nullable)",
  "location": "string (nullable)",
  "rejectionReason": "string (nullable)"
}
```

**Errores:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es tu artículo
- `404 Not Found` - Artículo no encontrado

---

### PUT /items/my-submissions/{id}/accept-terms
Aceptar términos de subasta (precio base y comisiones)

**Parámetros:**
```json
{
  "accept": "boolean (required)",
  "bankAccountId": "integer (required if accept=true)"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Términos aceptados. Tu artículo será incluido en la subasta.",
  "auctionDate": "string (ISO 8601)"
}
```

**Errores:**
- `400 Bad Request` - Términos ya fueron respondidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es tu artículo
- `404 Not Found` - Artículo no encontrado

---

## Seguros

### GET /insurance/my-items
Obtener información de seguros de artículos propios

**Respuesta exitosa (200 OK):**
```json
{
  "items": [
    {
      "itemId": "integer",
      "itemTitle": "string",
      "insurance": {
        "policyNumber": "string",
        "company": "string",
        "companyPhone": "string",
        "companyEmail": "string",
        "coverageAmount": "number",
        "startDate": "string (ISO 8601)",
        "endDate": "string (ISO 8601, nullable)",
        "status": "active|expired"
      },
      "location": "string"
    }
  ]
}
```

**Errores:**
- `401 Unauthorized` - No autenticado

---

### GET /insurance/policy/{policyNumber}
Obtener detalles de una póliza específica

**Respuesta exitosa (200 OK):**
```json
{
  "policyNumber": "string",
  "company": "string",
  "companyPhone": "string",
  "companyEmail": "string",
  "coverageAmount": "number",
  "items": [
    {
      "itemId": "integer",
      "title": "string",
      "baseValue": "number"
    }
  ],
  "startDate": "string (ISO 8601)",
  "endDate": "string (ISO 8601, nullable)",
  "status": "string"
}
```

**Errores:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No tienes acceso a esta póliza
- `404 Not Found` - Póliza no encontrada

---

## Códigos de Estado HTTP

### Códigos de Éxito
- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Solicitud exitosa sin contenido de respuesta

### Códigos de Error del Cliente
- `400 Bad Request` - Solicitud malformada o parámetros inválidos
- `401 Unauthorized` - No autenticado o token inválido
- `403 Forbidden` - Autenticado pero sin permisos para esta acción
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto con el estado actual del recurso

### Códigos de Error del Servidor
- `500 Internal Server Error` - Error interno del servidor
- `503 Service Unavailable` - Servicio temporalmente no disponible

---

## Formato de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

**Ejemplo:**
```json
{
  "error": {
    "code": "INVALID_BID_AMOUNT",
    "message": "El monto de la puja debe ser al menos $45,450 (1% del precio base)",
    "details": {
      "minBid": 45450,
      "maxBid": 54000,
      "providedBid": 45000
    }
  }
}
```

---

## Rate Limiting

- **Límite general:** 100 requests por minuto por usuario
- **Endpoints de pujas en vivo:** 20 requests por minuto
- **Endpoints de autenticación:** 5 requests por minuto

Cuando se excede el límite, se devuelve:
- **Código:** `429 Too Many Requests`
- **Header:** `Retry-After: {seconds}`

---

## Websockets (Para Subastas en Vivo)

### Conexión
```
wss://api.hammer-subastas.com/v1/live
```

### Autenticación
```json
{
  "type": "auth",
  "token": "JWT_TOKEN"
}
```

### Suscribirse a Subasta
```json
{
  "type": "subscribe",
  "auctionId": "integer"
}
```

### Eventos Recibidos
```json
{
  "type": "bid_update",
  "data": {
    "itemId": "integer",
    "currentBid": "number",
    "leadingBidder": "string (anonymized)",
    "timestamp": "string (ISO 8601)"
  }
}
```

```json
{
  "type": "item_change",
  "data": {
    "previousItemId": "integer",
    "currentItemId": "integer",
    "timeRemaining": "integer (seconds)"
  }
}
```

```json
{
  "type": "auction_end",
  "data": {
    "auctionId": "integer",
    "timestamp": "string (ISO 8601)"
  }
}
```

---

## Versionado

La API utiliza versionado mediante URL. La versión actual es `v1`.

Cuando se lance una nueva versión, se mantendrá soporte para versiones anteriores durante al menos 6 meses.

---

## Soporte

Para soporte técnico y consultas sobre la API:
- Email: api-support@hammer-subastas.com
- Documentación interactiva: https://docs.hammer-subastas.com
- Status de la API: https://status.hammer-subastas.com
