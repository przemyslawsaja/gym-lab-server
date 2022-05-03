import mongoose from "mongoose";

export const HistoryTrainingSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  exercises: [
    {
      label: {
        type: String,
        required: true,
      },
      sets: [
        {
          weight: Number,
          reps: Number
        }
      ]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const HistoryTraining = mongoose.model('historyTraining', HistoryTrainingSchema)
export default HistoryTraining;