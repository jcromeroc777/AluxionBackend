import mongoose from 'mongoose';
import dotenv from 'dotenv';

// dotenv
dotenv.config({ path: '.env'});

const connectBD = mongoose.connect(process.env.BBDD)
    .then(db => { return true })
    .catch(error => { return false });

export default connectBD;