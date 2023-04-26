import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import {Product, ProductDocument} from "./mongo/tables";
import {ShoppingCart, CartItem} from "./redis/redis";

const JWT_SECRET = "secretkey";

const app = express();
const cart = new ShoppingCart();
app.use(bodyParser.json());


app.post('/product', authenticateToken, authenticateSeller, async (req: any, res: Response) => {
  const {name, category, price, quantity} = req.body;
  try {
    const product = new Product({
      name: name,
      category: category,
      price: price,
      quantity: quantity,
      seller: req.user.userId
    });
    await product.save();


    return res.json({ id: product._id });
  } catch (err){
    console.log(err)
    return res.status(500).json();
  }
});

app.delete('/product/:id', authenticateToken, authenticateSeller, async (req: any, res: Response) => {
  const {userId} = req.user;
  await Product.findOneAndUpdate({ _id: req.params.id, seller: userId}, {archive: true});

  return res.status(200).json({msg: 'Product archived'});
});

app.get('/product/:id', async (req: Request, res: Response) => {
  console.log("REQUEST")
  const product: NonNullable<ProductDocument> = await Product.findOne({ _id: req.params.id });

  return res.json(
      {name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        seller: product.seller,
        archive: product.archive,
      });
});

app.post('/cart', authenticateToken, authenticateUser, async (req: any, res: Response) => {
  const {userId} = req.user;
  const {productId, quantity} = req.body;
  const product: NonNullable<ProductDocument> = await Product.findOne({ _id: productId });

  if (quantity > product.quantity) {
    return res.status(404).json({msg: 'Quantity too large'});
  }

  if (product.archive) {
    return res.status(404).json({msg: 'Product is archived'});
  }

  const cartItem: CartItem = {
    productId: productId,
    quantity: quantity,
    price: product.price
  }

  await cart.addItemToCart(userId, cartItem);
  return res.status(200).json();
});

app.get('/cart', authenticateToken, authenticateUser, async (req: any, res: Response) => {
  const {userId} = req.user;
  const userCart = await cart.getCartItems(userId);
  return res.status(200).json(userCart);
});

app.delete('/cart', authenticateToken, authenticateUser, async (req: any, res: Response) => {
  const {userId} = req.user;
  await cart.clearCart(userId);
  return res.status(200).json({msg: "Cart deleted"});
});


function authenticateSeller(req: any, res: Response, next: NextFunction) {
  if (req.user.role !== 'seller') return res.status(403).json({ message: 'Must be seller' });
  next();
}

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

const port = 3010;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
