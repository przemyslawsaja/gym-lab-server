import mongoose from "mongoose";

export const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  images: [
    {
      type: String,
    }
  ],
})

const Exercise = mongoose.model('Exercise', ExerciseSchema)
export default Exercise;