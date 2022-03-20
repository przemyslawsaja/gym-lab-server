import express from 'express'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'
import morgan from 'morgan'
import passport from 'passport'
import session from 'express-session'
import authRoute from './src/routes/auth.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import setupPassport from './src/config/passport.js'
import { login, register } from "./src/aai/controllers/AuthController.js";
import {
  createTraining,
  getTrainingById,
  listUserTrainings,
  updateTraining
} from "./src/training/controllers/TrainingController.js";
import { createExercise, listExercises } from "./src/training/controllers/ExerciseController.js";

const DEFAULT_PORT = 3000;
const app = express();
dotenv.config(( { path: './src/config/config.env' } ))

// Passport config
setupPassport(passport)
connectDB();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

// Session middleware

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}))


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())


//__API__

//aai
app.post('/auth/register', register)
app.post('/auth/login', login);


//training
app.post('/training/user/:user/create', createTraining)
app.get('/training/user/:user/', listUserTrainings)
app.get('/training/:training', getTrainingById)
app.put('/training/:training', updateTraining)

//exercise
app.post('/exercise/user/:user/create', createExercise)
app.get('/exercise', listExercises)


const PORT = process.env.PORT || DEFAULT_PORT;
app.use("/auth", authRoute)

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));