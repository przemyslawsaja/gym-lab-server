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
  updateTraining,
  shareTraining,
  getSharedTrainings,
  likeTraining, commentTraining, assignTrainingToUser, dislikeTraining
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

//Auth
app.post('/auth/register', register)
app.post('/auth/login', login);


//Training
app.post('/training/user/:user/create', createTraining)
app.get('/training/user/:user/', listUserTrainings)
app.get('/training/:training', getTrainingById)
app.put('/training/:training', updateTraining)

//Community
app.post('/community/:training/share', shareTraining)
app.get('/community/trainings', getSharedTrainings)
app.put('/community/:training/user/:user/like', likeTraining)
app.put('/community/:training/user/:user/dislike', dislikeTraining)
app.put('/community/:training/user/:user/comment', commentTraining)
app.post('/community/:training/user/:user/assign', assignTrainingToUser)

//Exercise
app.post('/exercise/user/:user/create', createExercise)
app.get('/exercise', listExercises)


const PORT = process.env.PORT || DEFAULT_PORT;
app.use("/auth", authRoute)

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));