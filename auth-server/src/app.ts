import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User, UserDocument} from "./mongo/tables";

const JWT_SECRET = "secretkey";


const app = express();

// use bodyParser middleware to parse request body
app.use(bodyParser.json());

// handle user registration
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'admin') return res.status(403).json({ message: 'Forbidden' });

    // create new user
    const user = new User({
      name: name,
      role: role,
      email: email,
      password: hashedPassword,
    });

    // save user to database
    await user.save();

    // generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    // send token to client
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// handle user login
app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user: NonNullable<UserDocument> = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // compare password with hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    // send token to client
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// dummy protected endpoint
app.get('/protected', authenticateToken, (req: Request, res: Response) => {
  return res.json({ message: 'This is a protected endpoint' });
});

// middleware to authenticate JWT token
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req["user"] = user;
    next();
  });
}

// start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
