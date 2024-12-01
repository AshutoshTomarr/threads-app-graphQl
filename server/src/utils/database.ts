import mongoose from "mongoose";

const connectDB = (uri:string)=>
    mongoose.connect(uri,{dbName : "graphqlDatabase"})
    .then(connectedDB => {
    console.log(`Connected to ${connectedDB.connection.name}`)
    })
    .catch(error => console.log("Error connecting to database: " + error));


export default connectDB