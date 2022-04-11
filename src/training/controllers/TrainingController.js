import Training from "../models/Training.js";
import User from '../../aai/models/User.js';
import Exercise from "../models/Exercise.js";
import SharedTraining from "../models/sharedTraining.js";

export const createTraining = async (req, res) => {
  const training = req.body;
  const userId = req.params.user
  const user = await User.findOne({ _id: userId }).select("_id").lean();

  if (!user) {
    return res.status(404).json({ message: 'User does not exist' })
  }

  try {
    await Training.create({
      user: userId,
      name: training.name,
      duration: training.duration,
      break: training.break,
      exercises: training.exercises.map(exercise => {
        return {
          sets: exercise.sets,
          _id: exercise.id
        }
      })
    })
    return res.status(200).json({ message: req.body })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const listUserTrainings = async (req, res) => {
  const user = req.params.user;

  try {
    const existingUser = await User.find({ user })

    if (!existingUser) {
      return res.status(400).json({ message: 'Nie znaleziono uzytkownika' })
    }

    const trainings = await Training.find({ user })

    const filteredTrainings = trainings.map(training => {
      return {
        id: training.id,
        name: training.name,
        parent: training.parent,
        duration: training.duration,
        break: training.break,
        exercises: training.exercises,
        createdAt: training.createdAt,
      }
    })

    return res.status(200).json({ trainings: filteredTrainings })

  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getTrainingById = async (req, res) => {
  const id = req.params.training;

  try {
    const existingTraining = await Training.findById(id).exec();
    let extendedExercises = [];

    await Promise.all(existingTraining.exercises.map((exercise) => {
      return Exercise.findById(exercise._id).then((fetchedExercise) => {
        return {
          sets: exercise.sets.map(set => {
            return {
              weight: set.weight,
              reps: set.reps,
              id: set._id,
            }
          }),
          id: fetchedExercise._id,
          name: fetchedExercise.name,
          images: fetchedExercise.images,
          description: fetchedExercise.description,
        };
      });
    })).then(res => extendedExercises = res)

    const training = {
      id: existingTraining.id,
      name: existingTraining.name,
      duration: existingTraining.duration,
      break: existingTraining.break,
      exercises: extendedExercises,
    }

    if (!existingTraining) {
      return res.status(400).json({ message: 'Nie znaleziono treningu' })
    }

    return res.status(200).json(training)

  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const updateTraining = async (req, res) => {
  const id = req.params.training;
  const training = req.body;

  try {
    await Training.findOneAndUpdate({ _id: id }, {
      name: training.name,
      duration: training.duration,
      break: training.break,
      exercises: training.exercises.map(exercise => {
        return {
          sets: exercise.sets,
          _id: exercise.id
        }
      })
    })

    return res.status(200).json({ message: "updated" })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}


export const shareTraining = async (req, res) => {
  const trainingId = req.params.training
  const training = await Training.findOne({ _id: trainingId });
  const isShared = await SharedTraining.findOne({training: trainingId})
  if (!training) {
    return res.status(404).json({ message: 'Training does not exist' })
  }

  if(isShared){
    return res.status(404).json({ message: 'Trening został już udostępniony' })
  }

  try {
    await SharedTraining.create({
      training: trainingId,
      comments: [],
      likes: [],
      description: req.body.description,
    })
    return res.status(200).json({ message: "success" })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getSharedTrainings = async (req, res) => {
  const sharedTrainings = await SharedTraining.find()

  const extendedSharedTrainings = await Promise.all(sharedTrainings.map(async (sharedTraining) => {
    const comments = await Promise.all(
      sharedTraining.comments.map(async (comment) => {

        const user = await User.findOne(( { _id: comment.user } ))
        return {
          content: comment.content,
          user: user.username,
        }
      })
    )

    const training = await Training.findOne({ _id: sharedTraining.training })
    const user = await User.findOne(( { _id: training.user } ))
    return {
      _id: sharedTraining._id,
      training: {
        break: training.break,
        duration: training.duration,
        exercises: training.exercises,
        name: training.name,
        id: training._id
      },
      likes: sharedTraining.likes,
      author: user.username,
      description: sharedTraining.description,
      comments: comments,
      createdAt: sharedTraining.createdAt,
    }
  }))

  try {
    return res.status(200).json(extendedSharedTrainings.reverse())
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const likeTraining = async (req, res) => {
  const trainingId = req.params.training
  const userId = req.params.user
  const training = await SharedTraining.findOne({ training: trainingId })
  const user = await User.findOne({ _id: userId })

  if (!training) {
    res.status(404).json({ message: "Training not found" })
  }

  if (!user) {
    res.status(404).json({ message: "User not found" })
  }

  try {
    await SharedTraining.findOneAndUpdate({ training: trainingId }, {
      likes: [ userId, ...training.likes ]
    })
    return res.status(200).json({ message: "Training liked" })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const dislikeTraining = async (req, res) => {
  const trainingId = req.params.training
  const userId = req.params.user
  const training = await SharedTraining.findOne({ training: trainingId })
  const user = await User.findOne({ _id: userId })

  if (!training) {
    res.status(404).json({ message: "Training not found" })
  }

  if (!user) {
    res.status(404).json({ message: "User not found" })
  }

  try {
    await SharedTraining.findOneAndUpdate({ training: trainingId }, {
      likes: training.likes.filter(userId => userId !== user.id)
    })
    return res.status(200).json({ message: "Training unliked" })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const commentTraining = async (req, res) => {
  const trainingId = req.params.training
  const userId = req.params.user
  const comment = req.body;
  const training = await SharedTraining.findOne({ training: trainingId })

  if (!training) {
    res.status(404).json({ message: "Training does not exists" })
  }

  try {
    await SharedTraining.findOneAndUpdate({ training: trainingId }, {
      comments: [ {
        user: userId,
        content: comment.content
      }, ...training.comments ]
    })
    return res.status(200).json({ message: 'Comment added' })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const assignTrainingToUser = async (req, res) => {
  const trainingId = req.params.training
  const userId = req.params.user
  const user = await User.findOne({ _id: userId }).select("_id").lean();
  const training = await Training.findOne({ _id: trainingId })

  if (!user) {
    return res.status(404).json({ message: 'User does not exist' })
  }

  if (!training) {
    return res.status(404).json({ message: 'Training does not exist' })
  }

  const userTrainings = await Training.find({ user: userId })
  const hasAssignedTraining = userTrainings.some(userTraining => userTraining.name === training.name)

  if (hasAssignedTraining) {
    return res.status(404).json({ message: 'Posiadasz już ten trening na swoim konice' })
  }

  try {
    await Training.create({
      user: userId,
      parent: trainingId,
      name: training.name,
      duration: training.duration,
      break: training.break,
      exercises: training.exercises.map(exercise => {
        return {
          sets: exercise.sets,
          _id: exercise.id
        }
      })
    })
    return res.status(200).json({ message: req.body })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}