import Training from "../models/Training.js";
import User from '../../aai/models/User.js';
import Exercise from "../models/Exercise.js";

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

