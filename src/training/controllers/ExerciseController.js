import Exercise from "../models/Exercise.js";

export const createExercise = async (req, res) => {
  const { ...body } = req.body;
  const user = req.params.user;
  try {
    await Exercise.create({ user, ...body })
    return res.status(200).json({ message: req.body })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const listExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({})
    const convertedExercises = exercises.map(exercise => {
      return {
        id: exercise.id,
        name: exercise.name,
        description: exercise.description,
        images: exercise.images
      }
    })
    return res.status(200).json({ exercises: convertedExercises })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}