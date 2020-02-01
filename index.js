const express = require('express'); //Import express
const conectarDB = require('./config/db');
const cors = require('cors');

//Creo el server
const app = express();

conectarDB();

//Habilitar express.json
app.use(express.json({extended: true}));

app.use(cors());

const port = process.env.PORT || 4000;


app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyectos'));
app.use('/api/tareas',require('./routes/tareas'));

//start server
app.listen(port,'0.0.0.0', () => {
    console.log(`SV Running on ${port}`)
})