const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Configuración de CORS
app.use(cors());

// Configuración de body-parser
app.use(bodyParser.json());

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'activo',
  password: 'root',
  port: 5432,
});

// Obtener todos los colaboradores con sus activos
app.get('/api/colaboradores-activos', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.cedula,
        CONCAT(c.nombre, ' ', c.apellido) AS nombre_completo,
        COALESCE(json_agg(json_build_object(
          'id', a.id,
          'tipo', a.tipo,
          'detalle', a.detalle
        )) FILTER (WHERE a.id IS NOT NULL), '[]') AS activos
      FROM colaboradores c
      LEFT JOIN activos a ON a.colaborador_id = c.id
      GROUP BY c.cedula, c.nombre, c.apellido
    `;
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      res.status(404).send('No se encontraron datos');
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Error al obtener colaboradores con activos:', error);
    res.status(500).send('Error al obtener colaboradores con activos');
  }
});

// Otros endpoints para activos
app.get('/api/computadores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM computadores');
    if (result.rows.length === 0) {
      res.status(404).send('No se encontraron datos');
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Error al obtener computadores:', error);
    res.status(500).send('Error al obtener computadores');
  }
});

app.get('/api/mouse', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mouse');
    if (result.rows.length === 0) {
      res.status(404).send('No se encontraron datos');
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Error al obtener mouse:', error);
    res.status(500).send('Error al obtener mouse');
  }
});

// Otros endpoints para teclados, celulares, simcar...

// Página de inicio
app.get('/api/inicio', (req, res) => {
  res.json({ message: 'Bienvenido a la Gestión de Activos' });
});

// Ruta para manejar cualquier ruta no definida
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
