import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import {Product, ProductDocument} from "./mongo/tables";
import {ShoppingCart} from "./redis/redis";

const JWT_SECRET = "secretkey";

const app = express();
const cart = new ShoppingCart();
app.use(bodyParser.json());

app.get('/protected', authenticateToken, (req: Request, res: Response) => {
  return res.json({ message: 'This is a protected endpoint' });
});

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

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
