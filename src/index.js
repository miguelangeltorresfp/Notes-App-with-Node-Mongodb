const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

/* INITIALIZATIONS */
const app = express();
require('./database');
require('./config/passport');

/* SETTINGS */

// Si existe un puerto ofrecido por el servidor que lo use, si no que use el 3000
app.set('port', process.env.PORT || 3000);
// join permite unir directorios
// __dirname es una constante de node que devuelve la ruta del archivo donde se use
// node espera que la carpeta views esté en la raiz del proyecto
app.set('views', path.join(__dirname, 'views'));
// Configuramos el módulo handlebar - el motor de plantillas compatible con express
app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
  }),
);
app.set('view engine', '.hbs');

/* MIDDLEWARES */

// Sirve para entender los formularios enviados por los usuarios
// Solo admite datos simples no imágenes
app.use(express.urlencoded({ extended: false }));
// Sirve para que los formularios pueden usar otros métodos aparte de get y post
// como put y delete
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true,
  }),
);
// Se configura passport, debe ir después de express session
app.use(passport.initialize());
// Utiliza la sesión definida arriba
app.use(passport.session());
// Para enviar mensajes entre las vistas
app.use(flash());

/* GLOBAL VARIABLES (en realidad es un middleware) */
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  // Passport usa la vaiable console.error();
  res.locals.error = req.flash('error');
  // A través de passport nos proporciona los datos del usuarios logueado o null si no existe tal usuario
  res.locals.user = req.user || null;
  // Para asegurar que no se quede bloqueado y siga ejecutando la app.
  next();
});
/* ROUTES */

app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

/* STATIC FILES */
app.use(express.static(path.join(__dirname, 'public')));

// Server is listening
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});
