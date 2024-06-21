require('dotenv').config();
const {CLAVESITIO,CLAVESECRETA,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET} = process.env;
var express = require('express');

var router = express.Router();
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(CLAVESITIO,CLAVESECRETA);
const ContactosController = require("../controllers/ContactosController");
const contactosController = new ContactosController();
const {ubicacion,protected} = require("../controllers/indexController");
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//configuracion de transporter
/////////////////////////////////////////////////////
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:5000/google/callback",
    passReqToCallback:true
    //Randy Graterol 
  },
  function(request, accessToken, refreshToken, profile, done) {
      return done(null,profile); 
  }
));

passport.serializeUser(function(user,done){
  done(null,user)
});

passport.deserializeUser(function(user,done){
  done(null,user)
});

/////////////////////////////////////////////////////
function isLoggedIn(req,res,next){
  req.user ? next() : res.sendStatus(401);
}
//////////////////////////////////////////////////////
////////////////////////////////////////////////////////
//////////////////////////////////////////////
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    name: 'Giovanni Rassmann',
    ocupation: 'Desarrollador Web Front-End',
    description: 'Soy estudiante de la universidad Romulo Gallegos y soy autodidacta en Desarrollo Web enfocado en programación Frontend.\nAspiro conseguir empleo en el mundo del Desarrollo Web, adquirir experiencia, nuevos conocimientos y fortalecer mi vida profesional.\n\nSoy una persona empática y entusiasta, con competencias enfocadas en el trabajo en equipo, comunicación asertiva, resolución de problemas, responsable y proactiva. Me gusta aprender de los demás y superarme continuamente.',
    og:{
      title: 'Mi Currículum Vitae',
      description:'Prueba',
      image: 'https://www.pexels.com/es-es/foto/persona-sosteniendo-un-smartphone-android-samsung-blanco-6347724/',
      // Otros metadatos OGP que desees especificar
      }
  }
  );
});
router.get('/ubicacion',ubicacion);

//////////////////////////////////////////////////////////
//autenticar con oauth....
router.get('/auth/google',
  passport.authenticate('google',{scope:['email','profile']})
);
//////////////////////////////////////////////////////////
router.get('/google/callback',
  passport.authenticate('google',{
  successRedirect:'/protected',
  failureRedirect:'/auth/failure'
  })
);
//////////////////////////////////////////////////////////
router.get('/auth/failure',(req,res)=>{
 res.send('Error al autenticar , ya que ha ingresado un correo electronico que no se encuentra registrado en la configuracion de consentimientos de OAut2 , por lo tanto debes tener en cuenta que esta metodologia se realizo basada en modo prueba , para mayor informacion revise encarecidamente la documentacion de autenticación con OAut , (¡OJO , no se trata de un error!)');
});
//////////////////////////////////////////////////////////
router.get('/protected',isLoggedIn,protected);
//////////////////////////////////////////////////////////

router.post("/form-contacto",recaptcha.middleware.verify,contactosController.add);

module.exports = router;
