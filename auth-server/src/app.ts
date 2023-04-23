import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User, UserDocument} from "./mongo/tables";

const JWT_SECRET = "secretkey";


const app = express();

app.use(bodyParser.json());

app.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'admin') return res.status(403).json({ message: 'Forbidden' });

    const user = new User({
      name: name,
      role: role,
      email: email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    return res.json({ token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: NonNullable<UserDocument> = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    return res.json({ token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


// start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});