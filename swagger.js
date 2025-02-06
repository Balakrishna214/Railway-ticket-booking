const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Railway Ticket Booking API',
      version: '1.0.0',
      description: 'API for booking railway tickets',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Train: {
          type: 'object',
          properties: {
            trainName: { type: 'string' },
            source: { type: 'string' },
            destination: { type: 'string' },
            totalSeats: { type: 'number' },
            availableSeats: { type: 'number' },
            departureTime: { type: 'string', format: 'date-time' },
            arrivalTime: { type: 'string', format: 'date-time' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            trainId: { type: 'string' },
            userId: { type: 'string' },
            seatsBooked: { type: 'number' },
            status: { type: 'string', enum: ['confirmed', 'cancelled'] },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};