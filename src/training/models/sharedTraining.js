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
  likes:
    {
      type: Number,
      required: false,
    }
  ,
})

const SharedTraining = mongoose.model('sharedTraining', SharedTrainingSchema)
export default SharedTraining;