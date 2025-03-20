const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({

    name: String,
    location: String,
    salary: Number,
    description: String,
    crackWidth: Number,  // New field for crack width
    dangerLevel: String, // New field for danger level
    image: String,
    idUser : { type: mongoose.Schema.Types.ObjectId , ref : 'User' }

})


module.exports = mongoose.model('Service' , serviceSchema);