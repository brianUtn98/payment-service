# payment-service
NewCombin technical test for BackEnd Developer position.

Esta sería una versión de 1° iteración, muchas cosas pueden ser mejoradas en próximas iteraciones.

## Cómo usar

Para levantar el server de desarrollo, 
```bash
npm run dev
```

Al finalizar la traspilación Typescript -> Javascript, nos avisará que está escuchando en:
[http://localhost:4000](http://localhost:4000)

Para documentación específica, seguir leyendo este docuemnto. Además, existe una documentación open-api en 
[http://localhost:4000/swagger](http://localhost:4000/swagger).

En una aplicación real no se suele pushear el archivo .env al repositorio, pero a efectos prácticos y para que sea más fácil de ejecutar se integra un archivo .env con las variables de entorno necesarias. En él, se encuentran las URI de conexión al cluster de MongoDB Atlas, donde está alojada la base de datos de manera gratuita.
## Justificaciones

* No se utilizaron rutas como **create-tax** o **pay-tax** para seguir los lineamientos de REST, por lo que los recursos del sistema serán 2:
  * Payables: Son los impuestos cargados por las empresas de servicios, pueden ser pagados por una transacción.
  * Transaction: Pagan un payable, solo cuando no ha sido pagado previamente. Además, se controla que no esté vencido el plazo, y que
* Se valida que la fecha de pago de una transacción sea menor o igual a la fecha de vencimiento de su impuesto asociado, para no aceptar pagos fuera de término.
* Se valida que el monto pagado de una transacción coincida con el monto a pagar de su impuesto asociado.

## Requerimientos completos

### 1. Debe permitir crear una boleta de pago son la siguiente información, recibiendo la siguiente información [...]
Para crear una nueva boleta de pago, se debe realizar una request HTTP Post del siguiente modo:
```http
POST http://localhost:4000/payables
content-type: application/json
{
    "serviceType": "Electricidad",
    "description": "Edenor",
    "dueDate": "05-25-2022",
    "amount": 5500,
    "barcode": 523456789224,
    "status": "pending"
}
```

### 2. Debe permitir realizar un pago (transacción), recibiendo la siguiente información [...]
Para realizar un pago, se debe realizar una request HTTP Post del siguiente modo:
```http
POST http://localhost:4000/transactions
content-type: application/json
{
    "paymentMethod": "cash",
    "amount": 3000,
    "paymentDate": "05-03-2022",
    "barcode": "523456789224"
}
```
Notese que al ser un pago en efectivo, no aparece el campo cardNumber. En caso de "debit_card" o "credit_card" la request se vería así:
```http
POST http://localhost:4000/transactions
content-type: application/json
{
    "paymentMethod": "debit_card",
    "cardNumber": "4929918084284564",
    "amount": 3000,
    "paymentDate": "05-03-2022",
    "barcode": "523456789224"
}
```
En caso de que el paymentMethod sea "debit_card" o "credit_card" y esté el campo "cardNumber" ausente, no se aceptará el pago.
Algunas validaciones a tener en cuenta:
* Al realizar un pago de un servicio, el mismo no debe tener el campo status como paid, de lo contrario se rechaza el pago.
* Al realizar un pago de un servicio, la fecha de pago debe ser menor o igual a la fecha de vencimiento del mismo, en caso contrario se rechaza por estar fuera de término.
* Al realizar un pago de un servicio, el monto pagado de una transacción debe coincidir con el monto a pagar. De lo contrario, se rechaza el pago.
* El barcode debe coincidir con el de un payable existente, de lo contrario se recahazará el pago con un 404.

### 3. Debe permitir listar aquellas boletas impagas en forma total o filtradas por tipo de servicio, devolviendo la siguiente información [...]

Para que el endpoint de payments sea reutilizable, se agregan los filtros de "boletas impagas" y "filtradas por tipo de servicio" mediante query params. Si bien, se resuelve más de lo que se pide, el esfuerzo es el mismo y contribuye a una API más reutilizable, y más propensa a aceptar cambios futuros sin grandes inconvenientes. A continuación algunos ejemplos para clarificar.

* Obtener boletas (no importa si son pagas o impagas, ni se filtra por servicio)
```http
GET http://localhost:4000/payables

{
  "count": 4,
  "data": [
    {
      "serviceType": "Electricidad",
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 3000,
      "barcode": "123456789224",
      "status": "paid"
    },
    {
      "serviceType": "Electricidad",
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 5500,
      "barcode": "523456789224",
      "status": "paid"
    },
    {
      "serviceType": "Electricidad",
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 3400,
      "barcode": "523452789224",
      "status": "pending"
    },
    {
      "serviceType": "Agua",
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 600,
      "barcode": "523452789214",
      "status": "pending"
    }
  ]
}
```

* Obtener boletas impagas
```http
GET http://localhost:4000/payables?status=pending

{
  "count": 2,
  "data": [
    {
      "serviceType": "Electricidad",
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 3400,
      "barcode": "523452789224",
      "status": "pending"
    },
    {
      "serviceType": "Agua",
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 600,
      "barcode": "523452789214",
      "status": "pending"
    }
  ]
}
```

* Obtener boletas de un tipo (pagas o impagas)
```http
GET http://localhost:4000/payables?serviceType=Agua

{
  "count": 1,
  "data": [
    {
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 600,
      "barcode": "523452789214",
      "status": "pending"
    }
  ]
}
```

* Obtener boletas impagas de un tipo
```http
GET http://localhost:4000/payables?serviceType=Electricidad&status=pending

{
  "count": 1,
  "data": [
    {
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 3400,
      "barcode": "523452789224",
      "status": "pending"
    }
  ]
}
```

### 4. Debe permitir listar los pagos (transacciones) entre un período de fechas, acumulando por día, devolviendo la siguiente información [...]
  
Para satisfacer este requerimiento, primero definí una ruta auxiliar (aunque vale la pena tenerla, ya que es un get estándar).
Para ver todas las transacciones
```http
GET http://localhost:4000/transactions

{
  "count": 4,
  "data": [
    {
      "_id": "6270cca513db12a686024875",
      "paymentMethod": "debit_card",
      "cardNumber": "444411112222",
      "amount": 3000,
      "paymentDate": "2022-05-03T03:00:00.000Z",
      "barcode": "123456789224",
      "__v": 0
    },
    {
      "_id": "62718516a61651698b2d9670",
      "paymentMethod": "cash",
      "amount": 3000,
      "paymentDate": "2022-05-03T03:00:00.000Z",
      "barcode": "523456789224",
      "__v": 0
    },
    {
      "_id": "6271a85ccbc5285d249b04c1",
      "paymentMethod": "cash",
      "amount": 3000,
      "paymentDate": "2022-05-01T03:00:00.000Z",
      "barcode": "523452789214",
      "__v": 0
    },
    {
      "_id": "6271a89df581f14adf595a2c",
      "paymentMethod": "cash",
      "amount": 680,
      "paymentDate": "2022-05-01T03:00:00.000Z",
      "barcode": "623452789214",
      "__v": 0
    }
  ]
}
```
Como podemos ver, en 01 de mayo hay 2 transacciones, y en 03 de mayo hay otras dos.
Para obtener el reporte, entre dos fechas y con el acumulado de transacciones hay que realizar una request GET a /transactions/report

```http
GET http://localhost:4000/transactions/report?dateFrom=05-01-2022&dateTo=05-03-2022

{
  "count": 2,
  "data": [
    {
      "paymentDate": "2022-05-03T03:00:00.000Z",
      "totalAmount": 6000,
      "transactionCount": 2
    },
    {
      "paymentDate": "2022-05-01T03:00:00.000Z",
      "totalAmount": 3680,
      "transactionCount": 2
    }
  ]
}
```
