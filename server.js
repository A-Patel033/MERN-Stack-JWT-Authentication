import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/routes.js';
import router from './routes/private.js';
import connectDB from './config/db.js';    
import {errorHandler} from './middleware/error.js' 

dotenv.config({path: './config.env'});

const app = express();
app.use(express.json());
const PORT  = process.env.PORT || 5000;
 
//DB Connection
connectDB();

app.use('/api/auth', routes); 
app.use('/api/private', router); 

app.use(errorHandler);

const server = app.listen(PORT , () => console.log(`Server is runinng on port ${PORT}`));

