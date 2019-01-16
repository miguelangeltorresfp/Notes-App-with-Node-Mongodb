const mongoose = require('mongoose');

// Si no existe la base de datos la crea y si existe se conecta a ella
// La configuración no es importante, solo es requerida sin más, antes no era así
mongoose
  .connect(
    'mongodb://localhost/notes-db-app',
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    },
  )
  .then(db => console.log('DB is connected'))
  .catch(err => console.err(err));
