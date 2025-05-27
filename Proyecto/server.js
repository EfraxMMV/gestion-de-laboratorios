const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
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
  const { nombre, apellidos, email, password, nombreLab, codigoLab } = req.body;
  
  if (!nombre || !apellidos || !email || !password || !nombreLab) {
    return res.status(400).json({ success: false, message: 'Todos los campos obligatorios son requeridos' });
  }

  try {
    // Verificar si el correo ya existe
    const emailCheck = await pool.request()
      .input('correo', sql.VarChar, email)
      .query('SELECT Id_Encargado FROM Encargado WHERE Correo_Encargado = @correo');
    
    if (emailCheck.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    // Si se proporcionó un código de laboratorio, verificar si existe
    if (codigoLab) {
      const labCheck = await pool.request()
        .input('codigoLab', sql.VarChar, codigoLab)
        .query('SELECT Id_Lab FROM Laboratorio WHERE Id_Lab = @codigoLab');
      
      if (labCheck.recordset.length === 0) {
        return res.status(404).json({ success: false, message: 'El código de laboratorio no existe' });
      }
    }

    // Crear nuevo encargado
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('apellidos', sql.VarChar, apellidos)
      .input('correo', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query('INSERT INTO Encargado (Nombre_Encargado, Apellido_Encargado, Correo_Encargado, Contraseña_Encargado) OUTPUT INSERTED.Id_Encargado VALUES (@nombre, @apellidos, @correo, @password)');
    
    const newUserId = result.recordset[0].Id_Encargado;
    
    if (codigoLab) {
      // Asociar el encargado al laboratorio existente
      await pool.request()
        .input('idLab', sql.Int, codigoLab)
        .input('idEncargado', sql.Int, newUserId)
        .query('UPDATE Laboratorio SET Id_Encargado = @idEncargado WHERE Id_Lab = @idLab');
    } else {
      // Crear nuevo laboratorio para el encargado
      await pool.request()
        .input('nombreLab', sql.VarChar, nombreLab)
        .input('idEncargado', sql.Int, newUserId)
        .query('INSERT INTO Laboratorio (Nombre_Lab, Id_Encargado) VALUES (@nombreLab, @idEncargado)');
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
          a.Tipo + ' ' + CAST(a.Capacidad AS VARCHAR) AS Almacenamiento,
          CAST(m.Tamaño AS VARCHAR) AS Monitor,
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
app.post('/api/equipos', async (req, res) => {
  const { labId, cpu, ram, gpu, almacenamiento, monitor, estado } = req.body;
  
  try {
    // Verificar si el laboratorio existe
    const labCheck = await pool.request()
      .input('labId', sql.Int, labId)
      .query('SELECT Id_Lab FROM Laboratorio WHERE Id_Lab = @labId');
    
    if (labCheck.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Laboratorio no encontrado' });
    }

    // Generar IDs únicos para los componentes
    const cpuId = `CPU${Math.floor(Math.random() * 900 + 100)}`;
    const ramId = `RAM${Math.floor(Math.random() * 900 + 100)}`;
    const gpuId = `GPU${Math.floor(Math.random() * 900 + 100)}`;
    const almId = `ALM${Math.floor(Math.random() * 900 + 100)}`;
    const monId = `MON${Math.floor(Math.random() * 900 + 100)}`;

    // Extraer tipo y capacidad del almacenamiento
    const [almTipo, almCapacidad] = almacenamiento.split(' ');
    const monitorTamaño = parseFloat(monitor);

    // Insertar componentes primero
    await pool.request()
      .input('id', sql.VarChar, cpuId)
      .input('nombre', sql.VarChar, cpu)
      .input('nucleos', sql.Int, 4)
      .input('hilos', sql.Int, 8)
      .query('INSERT INTO Cpul (Id_Cpu, Nombre_Cpu, Nucleos, Hilos) VALUES (@id, @nombre, @nucleos, @hilos)');

    await pool.request()
      .input('id', sql.VarChar, ramId)
      .input('tipo', sql.VarChar, ram)
      .query('INSERT INTO Ram (Id_Ram, Tipo) VALUES (@id, @tipo)');

    await pool.request()
      .input('id', sql.VarChar, gpuId)
      .input('nombre', sql.VarChar, gpu)
      .input('flops', sql.Float, 5.0)
      .query('INSERT INTO Gpu (Id_Gpu, Nombre_Gpu, Flops) VALUES (@id, @nombre, @flops)');

    await pool.request()
      .input('id', sql.VarChar, almId)
      .input('tipo', sql.VarChar, almTipo)
      .input('capacidad', sql.Int, almCapacidad)
      .query('INSERT INTO Almacenamiento (Id_Almacenamiento, Tipo, Capacidad) VALUES (@id, @tipo, @capacidad)');

    await pool.request()
      .input('id', sql.VarChar, monId)
      .input('tamaño', sql.Decimal, monitorTamaño)
      .input('frecuencia', sql.Int, 60)
      .query('INSERT INTO Monitor (Id_Monitor, Tamaño, Frecuencia) VALUES (@id, @tamaño, @frecuencia)');

    // Insertar el nuevo equipo (el ID se genera automáticamente)
    const result = await pool.request()
      .input('labId', sql.Int, labId)
      .input('cpu', sql.VarChar, cpuId)
      .input('ram', sql.VarChar, ramId)
      .input('gpu', sql.VarChar, gpuId)
      .input('almacenamiento', sql.VarChar, almId)
      .input('monitor', sql.VarChar, monId)
      .input('estado', sql.Int, estado)
      .query(`
        INSERT INTO Equipo (Id_Lab, Id_Cpu, Id_Ram, Id_Monitor, Id_Gpu, Id_Estado, Id_Almacenamiento)
        OUTPUT INSERTED.Id_Equipo
        VALUES (@labId, @cpu, @ram, @monitor, @gpu, @estado, @almacenamiento)
      `);
    
    const newEquipoId = result.recordset[0].Id_Equipo;
    res.json({ success: true, equipoId: newEquipoId });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al agregar equipo' });
  }
});

// Editar equipo
app.put('/api/equipos/:id', async (req, res) => {
  const id = req.params.id;
  const { cpu, ram, gpu, almacenamiento, monitor, estado } = req.body;
  
  try {
    // Obtener el equipo actual para actualizar sus componentes
    const equipo = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Equipo WHERE Id_Equipo = @id');
    
    if (equipo.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
    }

    const equipoActual = equipo.recordset[0];

    // Actualizar los componentes
    await pool.request()
      .input('id', sql.VarChar, equipoActual.Id_Cpu)
      .input('nombre', sql.VarChar, cpu)
      .query('UPDATE Cpul SET Nombre_Cpu = @nombre WHERE Id_Cpu = @id');

    await pool.request()
      .input('id', sql.VarChar, equipoActual.Id_Ram)
      .input('tipo', sql.VarChar, ram)
      .query('UPDATE Ram SET Tipo = @tipo WHERE Id_Ram = @id');

    await pool.request()
      .input('id', sql.VarChar, equipoActual.Id_Gpu)
      .input('nombre', sql.VarChar, gpu)
      .query('UPDATE Gpu SET Nombre_Gpu = @nombre WHERE Id_Gpu = @id');

    await pool.request()
      .input('id', sql.VarChar, equipoActual.Id_Almacenamiento)
      .input('tipo', sql.VarChar, almacenamiento.split(' ')[0])
      .input('capacidad', sql.Int, parseInt(almacenamiento.split(' ')[1]))
      .query('UPDATE Almacenamiento SET Tipo = @tipo, Capacidad = @capacidad WHERE Id_Almacenamiento = @id');

    await pool.request()
      .input('id', sql.VarChar, equipoActual.Id_Monitor)
      .input('tamaño', sql.Decimal, parseFloat(monitor.split('"')[0]))
      .query('UPDATE Monitor SET Tamaño = @tamaño WHERE Id_Monitor = @id');

    // Actualizar el estado del equipo
    await pool.request()
      .input('id', sql.Int, id)
      .input('estado', sql.Int, estado)
      .query('UPDATE Equipo SET Id_Estado = @estado WHERE Id_Equipo = @id');
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al actualizar equipo' });
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
    // Obtener estadísticas generales
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
    
    // Obtener equipos problemáticos
    const equiposProblema = await pool.request()
      .input('labId', sql.Int, labId)
      .query(`
        SELECT 
          'EQ' + RIGHT('000' + CAST(eq.Id_Equipo AS VARCHAR(3)), 3) AS Id_Equipo,
          es.Descripcion AS Estado
        FROM Equipo eq
        JOIN Estado es ON eq.Id_Estado = es.Id_Estado
        WHERE eq.Id_Lab = @labId AND es.Descripcion IN ('Mal estado', 'En mantenimiento')
      `);
    
    res.json({
      totalEquipos,
      buenEstado,
      malEstado,
      enMantenimiento,
      porcentajeBuenEstado,
      equiposProblema: equiposProblema.recordset
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

// Generar PDF del reporte
app.post('/api/reporte-pdf', async (req, res) => {
  const { reporteData } = req.body;
  
  // Validar datos del reporte
  if (!reporteData || !reporteData.totalEquipos) {
    return res.status(400).json({ error: 'Datos del reporte inválidos' });
  }

  try {
    // Crear directorio temp si no existe
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          h1 { color: #2c3e50; text-align: center; }
          .report-section { margin-bottom: 20px; }
          .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; }
          .equipment-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .equipment-table th, .equipment-table td { border: 1px solid #dee2e6; padding: 8px; text-align: left; }
          .equipment-table th { background-color: #343a40; color: white; }
          .status-good { color: #28a745; }
          .status-bad { color: #dc3545; }
          .status-maintenance { color: #ffc107; }
        </style>
      </head>
      <body>
        <h1>Reporte de Laboratorio</h1>
        <div class="report-section">
          <h2>Resumen General</h2>
          <div class="summary">
            <p><strong>Total de equipos:</strong> ${reporteData.totalEquipos}</p>
            <p><strong>Equipos en buen estado:</strong> 
              <span class="status-good">${reporteData.buenEstado} (${reporteData.porcentajeBuenEstado}%)</span>
            </p>
            <p><strong>Equipos en mal estado:</strong> 
              <span class="status-bad">${reporteData.malEstado}</span>
            </p>
            <p><strong>Equipos en mantenimiento:</strong> 
              <span class="status-maintenance">${reporteData.enMantenimiento}</span>
            </p>
          </div>
        </div>

        <div class="report-section">
          <h2>Equipos con problemas</h2>
          <table class="equipment-table">
            <thead>
              <tr>
                <th>ID del Equipo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${reporteData.equiposProblema.map(eq => `
                <tr>
                  <td>${eq.Id_Equipo}</td>
                  <td class="${eq.Estado.includes('Buen') ? 'status-good' : 
                              eq.Estado.includes('Mal') ? 'status-bad' : 'status-maintenance'}">
                    ${eq.Estado}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    const options = {
      format: "A4",
      orientation: "portrait",
      border: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm"
      },
      header: {
        height: "15mm",
        contents: '<div style="text-align: center; font-size: 12px; color: #666;">Reporte de Inventario de Laboratorio</div>'
      },
      footer: {
        height: "15mm",
        contents: {
          default: '<div style="text-align: center; font-size: 10px; color: #666;">Página {{page}} de {{pages}} - Generado el ' + new Date().toLocaleDateString() + '</div>'
        }
      },
      timeout: 30000 // 30 segundos de timeout
    };

    const document = {
      html: html,
      data: {},
      path: path.join(tempDir, `reporte_${Date.now()}.pdf`),
      type: "pdf",
    };

    // Generar PDF
    const result = await pdf.create(document, options);
    
    // Leer el archivo generado y enviarlo
    const pdfFile = fs.readFileSync(result.filename);
    fs.unlinkSync(result.filename); // Eliminar archivo temporal
    
    // Configurar respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_laboratorio.pdf"');
    res.send(pdfFile);

  } catch (err) {
    console.error('Error al generar PDF:', err);
    res.status(500).json({ error: 'Error al generar el documento PDF' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});