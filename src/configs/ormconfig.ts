import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { entities } from "src/modules/entities.export";

const ormconfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities,
    synchronize: true,
    dropSchema: false,
    connectTimeoutMS: 50000,
    extra: {
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
        ...(process.env.DB_SSL === 'true' && {
            ssl: {
                rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
                ca: process.env.DB_CA_CERT,
                key: process.env.DB_CLIENT_KEY,
                cert: process.env.DB_CLIENT_CERT
            }
        })
    },
};

export default ormconfig;