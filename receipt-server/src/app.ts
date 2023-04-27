import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import {Receipt, ReceiptDocument, ReceiptItem} from "./mongo/tables";
import {ShoppingCart, CartItem} from "./redis/redis";

const JWT_SECRET = "secretkey";

const app = express();
const cart = new ShoppingCart();

app.use(bodyParser.json());

app.post('/cart-buy', authenticateToken, authenticateUser, async (req: any, res: Response) => {
  const {userId} = req.user;
  const userCart = await cart.getCartItems(userId);
  if (userCart.length === 0) {
    return res.status(404).json({ message: 'No items in cart' });
  }

  //pay here

  try {

    const receipt = new Receipt({
      user: userId,
      date: Date.now(),
      items: userCart.map((x) => {
        const item: ReceiptItem = {
          price: x.price,
          quantity: x.quantity,
          product: x.productId
        }
        return item;
      })
    });

    await receipt.save();

    await cart.clearCart(userId);

    return res.json({ id: receipt._id });
  } catch (err){
    console.log(err)
    return res.status(500).json();
  }
});

app.get('/receipts', authenticateToken, authenticateUser, async (req: any, res: Response) => {
  const {userId} = req.user;
  const receipts: NonNullable<ReceiptDocument>[] = await Receipt.find({ user: userId });

  return res.json(receipts);
});

function authenticateUser(req: any, res: Response, next: NextFunction) {
  if (req.user.role !== 'user') return res.status(403).json({ message: 'Must be user' });
  next();
}

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

const port = 3020;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});