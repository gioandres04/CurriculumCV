require('dotenv').config();
const {PASSWORDAPP} = process.env;
const ContactosModel = require("../models/ContactosModel");
//Mensaje al destinatario
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service:'Gmail',
   auth:{
    user:'programacionjavascript9@gmail.com',
    pass:PASSWORDAPP
  }
});
class ContactosController {

  constructor() {
    this.contactosModel= new ContactosModel();
    this.add = this.add.bind(this);
  }

  async add(req, res) {
    // Validar los datos del formulario
    if(!req.recaptcha.error){

     let pais = req.cookies.location;
     const { email, name, mensaje } = req.body;

    if (!email || !name || !mensaje) {
      res.status(400).send("Faltan campos requeridos");
      return;
    }

    // Guardar los datos del formulario
    const ip = req.ip;
    //const fecha = new Date().toISOString();

    const respuesta = await this.contactosModel.crearContacto(email, name, mensaje, ip,pais);

     const mailOptions = {
    from:'programacionjavascript9@gmail.com',
    to: 'programacion2ais@dispostable.com', // Agrega aquí la dirección de correo a la lista de destinatarios
    subject: 'Un usuario a enviado un mensaje',
    text: `Datos del usuario:\n\n
           Nombre: ${name}\n
           Email: ${email}\n
           Comentario: ${mensaje}\n
           ip: ${ip}\n
           pais: ${pais}\n`
  };

  // Envío del correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {

    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }

  });
    //const contactos = await this.contactosModel.obtenerAllContactos();

    //console.log(contactos);
    // Redireccionar al usuario a una página de confirmación
    res.redirect("/");
    }else{
      // El reCAPTCHA no se ha verificado correctamente
    res.send('Error en el reCAPTCHA');
    }
  }
}

module.exports = ContactosController;
