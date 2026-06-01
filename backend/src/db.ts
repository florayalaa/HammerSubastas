import * as sql from 'mssql';

const dbConfig: sql.config = {
    user: 'sa',
    password: 'contraseña1234',
    server: '127.0.0.1', // o la IP de servidor SQL
    database: 'DB_DA1_TPO',
    options: {
        encrypt: false, // Habilitar si se usa Azure SQL, en local suele ser false
        trustServerCertificate: true // Requerido para certificados autofirmados en local
    }
};

export const getConnection = async (): Promise<sql.ConnectionPool | undefined> => {
    try {
        const pool = await sql.connect(dbConfig);
        console.log("¡Conexión exitosa a SQL Server!");
        return pool;
    } catch (error) {
        console.error("Error al conectar a la base de datos: ", error);
    }
};
