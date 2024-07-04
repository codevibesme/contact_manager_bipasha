import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

const setupSwagger = (app: INestApplication): void => {
    const config = new DocumentBuilder()
        .setTitle('Contact Manager')
        .setDescription('Contact Manager API Documentation')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .setExternalDoc('Postman Collection', '/api-docs-json')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
};

export default setupSwagger;