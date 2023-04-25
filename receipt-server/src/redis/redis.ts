import Redis from 'ioredis';

export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
}

export class ShoppingCart {
    private client: Redis;

    constructor() {
        this.client = new Redis({
            host: 'localhost',
            port: 6379,
        });
    }

    async addItemToCart(cartId: string, item: CartItem) {
        const cartItems = await this.getCartItems(cartId);

        const existingItem = cartItems.find((cartItem) => cartItem.productId === item.productId);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cartItems.push(item);
        }

        await this.client.hset(cartId, 'items', JSON.stringify(cartItems));
    }

    async removeItemFromCart(cartId: string, productId: string) {
        const cartItems = await this.getCartItems(cartId);

        const updatedItems = cartItems.filter((cartItem) => cartItem.productId !== productId);

        await this.client.hset(cartId, 'items', JSON.stringify(updatedItems));
    }

    async clearCart(cartId: string) {
        await this.client.del(cartId);
    }

    async getCartItems(cartId: string): Promise<CartItem[]> {
        const data = await this.client.hget(cartId, 'items');

        if (!data) {
            return [];
        }

        return JSON.parse(data);
    }
}
