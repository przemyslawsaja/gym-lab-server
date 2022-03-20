import User from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username })

  try {
    if (!existingUser) {
      return res.status(400).json({ message: "Wprowadzone dane są nieprawidłowe" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Wprowadzone dane są błędne' })
    }

    const token = jwt.sign({ username: existingUser.username, id: existingUser._id }, process.env.AUTH_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ user: { value: existingUser._id.toString() }, token: { value: token } })
  } catch (error) {
    res.status(404).json({ message: 'Coś poszło nie tak...' })
  }

}

export const register = async (req, res) => {
  const { username, password, repeatPassword } = req.body;

  //ADD CONFFIRM PASSWORD
  try {

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik o takiej nazwie już istnieje" })
    }

    if(repeatPassword !== password){
      return res.status(400).json({ message: "Wprowadzone hasła są od siebie różne" })
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ username:username, password: hashedPassword})

    const token = jwt.sign({ username: result.username, id: result._id }, 'TotallyHiddenSecretXD', { expiresIn: "1h" });
    return res.status(200).json({ user: { value: result._id.toString() }, token: { value: token } })
  } catch (error) {
    res.status(404).json({ message: 'Coś poszło nie tak...' })
  }

}
