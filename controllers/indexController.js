const axios = require('axios');
const ContactosModel = require("../models/ContactosModel");
const models = new ContactosModel();
const toIndex = (req, res, next) => {
  res.render("index", { title: "Express" });
};

const ubicacion = async (req, res) => {

  let lat = req.query.lat;

  let lng = req.query.lng;
  console.log(`lat : ${lat} lng : ${lng}`);

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  const config = {
  headers: {
    'Referer': 'https://curriculum-upeh.onrender.com', // Establece el Referer personalizado
    'User-Agent': 'curriculumVitae' // Establece el User-Agent personalizado
  },
  timeout: 60000 // 60 segundos
};
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,config);
    //res.json(response.data);
    res.cookie('location',response.data.address.country, { httpOnly: true, secure: true });
    res.json(response.data.address.country);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the data' });
  }
};

const protected = async (req,res)=>{
const datos = await models.obtenerAllContactos();
 res.render('contactos',{datos});
}

module.exports = {
  toIndex,
  ubicacion,
  protected
}

