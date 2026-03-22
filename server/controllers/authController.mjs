import { authenticateUser } from '../models/authModel.mjs';

//認証
export const auth = async (req, res) => {

  try {
    const { email, password } = req.body;
    //バリデーション
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and Password must be strings' });
    }
    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ message: 'Email and Password are required' });
    }
    if (email.length > 255 || password.length > 255) {
      return res.status(400).json({ message: 'Email and Password must be less than 255 characters' });
    } 
    const { token, user } = await authenticateUser(email, password);
    return res.status(201).json({ token: token , user: user});
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};