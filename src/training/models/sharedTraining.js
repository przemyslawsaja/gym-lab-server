import mongoose from "mongoose";

export const SharedTrainingSchema = new mongoose.Schema({
  training: {
    type: String,
    required: true,
  },
  comments: [{
    user: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  }],
  likes: [
    {
      type: String,
      required: false,
    },
  ]
  ,
  description:
    {
      type: String,
      required: false,
    }
  ,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const SharedTraining = mongoose.model('sharedTraining', SharedTrainingSchema)
export default SharedTraining;