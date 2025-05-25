const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuración de CORS
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a SQL Server
const dbConfig = {
  user: 'sa',
  password: 'RyusuiSQL',
  server: 'DESKTOP-1AEB28Q',
  database: 'gestion',
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true
  }
};

// Pool de conexiones global
let pool;

// Conectar al iniciar el servidor
async function connectToDatabase() {
  try {
    pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    console.log('Conectado a SQL Server');
    return pool;
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
    process.exit(1);
  }
}

connectToDatabase();

// Middleware para manejar conexiones
app.use(async (req, res, next) => {
  try {
    if (!pool.connected) {
      await pool.connect();
    }
    next();
  } catch (err) {
    console.error('Error al verificar conexión:', err);
    res.status(500).json({ error: 'Error de conexión a la base de datos' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query('SELECT * FROM Encargado WHERE Correo_Encargado = @email AND Contraseña_Encargado = @password');
    
    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      
      const labResult = await pool.request()
        .input('idEncargado', sql.Int, user.Id_Encargado)
        .query('SELECT Id_Lab, Nombre_Lab FROM Laboratorio WHERE Id_Encargado = @idEncargado');
      
      user.laboratorio = labResult.recordset[0] || null;
      
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Registro
app.post('/api/register', async (req, res) => {
  const { nombre, apellidos, email, password, codigoLab } = req.body;
  
  try {
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('apellidos', sql.VarChar, apellidos)
      .input('correo', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query('INSERT INTO Encargado (Nombre_Encargado, Apellido_Encargado, Correo_Encargado, Contraseña_Encargado) OUTPUT INSERTED.Id_Encargado VALUES (@nombre, @apellidos, @correo, @password)');
    
    const newUserId = result.recordset[0].Id_Encargado;
    
    if (codigoLab) {
      await pool.request()
        .input('idEncargado', sql.Int, newUserId)
        .input('codigoLab', sql.VarChar, codigoLab)
        .query('UPDATE Laboratorio SET Id_Encargado = @idEncargado WHERE Nombre_Lab LIKE @codigoLab');
    }
    
    res.json({ success: true, userId: newUserId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al registrar usuario' });
  }
});

// Obtener equipos
app.get('/api/equipos/:labId', async (req, res) => {
  const labId = req.params.labId;
  
  try {
    const result = await pool.request()
      .input('labId', sql.Int, labId)
      .query(
        `SELECT 
          e.Id_Equipo,
          c.Nombre_Cpu AS CPU,
          r.Tipo AS RAM,
          g.Nombre_Gpu AS GPU,
          a.Tipo + ' ' + CAST(a.Capacidad AS VARCHAR) + 'GB' AS Almacenamiento,
          'Monitor ' + CAST(m.Tamaño AS VARCHAR) + '"' AS Monitor,
          es.Descripcion AS Estado
        FROM Equipo e
        JOIN Cpul c ON e.Id_Cpu = c.Id_Cpu
        JOIN Ram r ON e.Id_Ram = r.Id_Ram
        JOIN Gpu g ON e.Id_Gpu = g.Id_Gpu
        JOIN Almacenamiento a ON e.Id_Almacenamiento = a.Id_Almacenamiento
        JOIN Monitor m ON e.Id_Monitor = m.Id_Monitor
        JOIN Estado es ON e.Id_Estado = es.Id_Estado
        WHERE e.Id_Lab = @labId`
      );
    
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
});

// Agregar equipo
app.post('/api/register', async (req, res) => {
  const { nombre, apellidos, email, password, codigoLab } = req.body;
  
  try {
    // Primero crear el nuevo encargado
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('apellidos', sql.VarChar, apellidos)
      .input('correo', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query('INSERT INTO Encargado (Nombre_Encargado, Apellido_Encargado, Correo_Encargado, Contraseña_Encargado) OUTPUT INSERTED.Id_Encargado VALUES (@nombre, @apellidos, @correo, @password)');
    
    const newUserId = result.recordset[0].Id_Encargado;
    
    if (codigoLab) {
      // Si se proporcionó código de laboratorio, asignar a laboratorio existente
      await pool.request()
        .input('idEncargado', sql.Int, newUserId)
        .input('codigoLab', sql.VarChar, codigoLab)
        .query('UPDATE Laboratorio SET Id_Encargado = @idEncargado WHERE Nombre_Lab LIKE @codigoLab');
    } else {
      // Si no se proporcionó código, crear nuevo laboratorio
      const labCount = await pool.request()
        .query('SELECT COUNT(*) as total FROM Laboratorio');
      
      const newLabNumber = labCount.recordset[0].total + 1;
      const labName = `Laboratorio Nuevo ${newLabNumber}`;
      
      await pool.request()
        .input('nombreLab', sql.VarChar, labName)
        .input('idEncargado', sql.Int, newUserId)
        .query('INSERT INTO Laboratorio (Nombre_Lab, Id_Encargado) VALUES (@nombreLab, @idEncargado)');
    }
    
    res.json({ success: true, userId: newUserId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al registrar usuario' });
  }
});

// Eliminar equipo
app.delete('/api/equipos/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Equipo WHERE Id_Equipo = @id');
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al eliminar equipo' });
  }
});

// Generar reporte
app.get('/api/reporte/:labId', async (req, res) => {
  const labId = req.params.labId;
  
  try {
    const totalResult = await pool.request()
      .input('labId', sql.Int, labId)
      .query('SELECT COUNT(*) as total FROM Equipo WHERE Id_Lab = @labId');
    
    const totalEquipos = totalResult.recordset[0].total;
    
    const estadoResult = await pool.request()
      .input('labId', sql.Int, labId)
      .query(`
        SELECT e.Descripcion, COUNT(*) as cantidad 
        FROM Equipo eq
        JOIN Estado e ON eq.Id_Estado = e.Id_Estado
        WHERE eq.Id_Lab = @labId
        GROUP BY e.Descripcion
      `);
    
    let buenEstado = 0;
    let malEstado = 0;
    let enMantenimiento = 0;
    
    estadoResult.recordset.forEach(item => {
      if (item.Descripcion === 'Buen estado') buenEstado = item.cantidad;
      if (item.Descripcion === 'Mal estado') malEstado = item.cantidad;
      if (item.Descripcion === 'En mantenimiento') enMantenimiento = item.cantidad;
    });
    
    const porcentajeBuenEstado = totalEquipos > 0 
      ? Math.round((buenEstado / totalEquipos) * 100) 
      : 0;
    
    res.json({
      totalEquipos,
      buenEstado,
      malEstado,
      enMantenimiento,
      porcentajeBuenEstado
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});