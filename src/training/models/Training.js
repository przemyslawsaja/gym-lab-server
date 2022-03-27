import mongoose from "mongoose";
import { ExerciseSetSchema } from "./ExerciseSet.js";

export const TrainingSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  break: {
    type: Number,
    required: true,
  },
  exercises: [
    {
      exercise: String,
      sets: [ ExerciseSetSchema ],
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Training = mongoose.model('Training', TrainingSchema)
export default Training;