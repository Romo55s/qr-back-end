var express = require('express');
var app = express();
var serviceAccount = require("./reservaciones-adf27-firebase-adminsdk-vjpju-9b68e16cb3.json");

var admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://reservaciones-adf27-default-rtdb.firebaseio.com"
});
var db = admin.database();

// Middleware de CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/registros', function (req, res) {
    var ref = db.ref('/users-list');
    
    ref.once('value')
      .then((snapshot) => {
        var registros = snapshot.val();
        //console.log("Registros obtenidos:", registros); // Agrega este mensaje de depuración
        res.json(registros);
      })
      .catch((error) => {
        console.error("Error al obtener los registros: ", error);
        res.status(500).send("Error al obtener los registros");
      });
  });

  app.get('/reserva', function (req, res) {
    var ref = db.ref('/users-list');
  
    ref.once('value', function (snapshot) {
      var registros = snapshot.val();
      if (registros) {
        // Filtrar registros por correo electrónico (aquí usaremos el parámetro "email" en la consulta)
        var email = req.query.email;
        if (email) {
          registros = Object.values(registros).filter(registro => registro.email === email);
        }
        res.json(registros);
      } else {
        res.json([]);
      }
    }, function (error) {
      console.error("Error al obtener los registros:", error);
      res.status(500).send("Error al obtener los registros");
    });
  });
  

app.listen(3000, function () {
  console.log('Servidor iniciado en el puerto 3000');
});
