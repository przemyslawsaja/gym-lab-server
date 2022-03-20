import mongoose from "mongoose";

export const ExerciseSetSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
})

const ExerciseSet = mongoose.model('ExerciseSet', ExerciseSetSchema)
export default ExerciseSet;

