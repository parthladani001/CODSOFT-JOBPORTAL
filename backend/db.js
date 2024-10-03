const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/Jobify?directConnection=true"

const connectMongo = async ()=> {
    try {
        mongoose.connect(mongoURI, {
            dbName: "Jobify"
        } )
        console.log('Connection Successful')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectMongo;