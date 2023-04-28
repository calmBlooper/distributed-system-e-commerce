const axios = require('axios');

const categories = [
    'House',
    'Food',
    'Sport',
    'Jewelry',
    'Electronics',
    'Clothing',
    'Books'
];

function createProducts(userNumber,amount) {
    const body = {
        email: `user${userNumber}@example.com`,
        password: `password${userNumber}`
    };

    // First login to get the token
    axios.post('http://localhost:3000/login', body)
        .then(response => {
            console.log(`User ${userNumber} logged in successfully: ${JSON.stringify(response.data)}`);
            const token = response.data.token;

            // Create 10 products
            for (let i = 0; i < amount; i++) {
                const name = `Product ${i}`;
                const category = categories[Math.floor(Math.random() * categories.length)];
                const price = Math.floor(Math.random() * 100) + 1;
                const quantity = Math.floor(Math.random() * 999999999) + 1;

                const body = {
                    name: name,
                    category: category,
                    price: price,
                    quantity: quantity
                };

                const headers = {
                    'authorization': `Bearer ${token}`
                };
                 axios.post('http://localhost:80/product', body, { headers: headers })
                    .then(response => {
                        console.log(`Product ${i} created successfully`);
                    })
                    .catch(error => {
                        console.log(`Product ${i} creation failed: ${error.message}`);
                    });
            }
        })
        .catch(error => {
            console.log(`User ${userNumber} login failed: ${error.message}`);
        });
}

function deleteProduct(id) {
    const userNumber = 0;
    const body = {
        email: `user${userNumber}@example.com`,
        password: `password${userNumber}`
    };

    // First login to get the token
    axios.post('http://localhost:3000/login', body)
        .then(response => {
            console.log(`User ${userNumber} logged in successfully: ${JSON.stringify(response.data)}`);
            const token = response.data.token;


                const headers = {
                    'authorization': `Bearer ${token}`
                };
                 axios.delete(`http://localhost:80/product/${id}`, { headers: headers })
                    .then(response => {
                        console.log(`Product ${id} deleted successfully`);
                    })
                    .catch(error => {
                        console.log(`Product ${id} deletion failed: ${error.message}`);
                    });

        })
        .catch(error => {
            console.log(`User ${userNumber} login failed: ${error.message}`);
        });
}


function addProductToCart(id) {
    const userNumber = 20;
    const body = {
        email: `user${userNumber}@example.com`,
        password: `password${userNumber}`
    };

    // First login to get the token
    axios.post('http://localhost:3000/login', body)
        .then(response => {
            console.log(`User ${userNumber} logged in successfully: ${JSON.stringify(response.data)}`);
            const token = response.data.token;


            const quantity = Math.floor(Math.random() * 10) + 1;

            const body = {
                productId: id,
                quantity: quantity
            };
            const headers = {
                'authorization': `Bearer ${token}`
            };
            axios.post(`http://localhost:80/cart`,body, { headers: headers })
                .then(response => {
                    console.log(`${quantity} Products ${id} added to cart successfully`);
                })
                .catch(error => {
                    console.log(`Product ${id} add to cart failed: ${error.message}`);
                });

        })
        .catch(error => {
            console.log(`User ${userNumber} login failed: ${error.message}`);
        });
}

function getProduct(id) {
    axios.get(`http://localhost:80/product/${id}` )
        .then(response => {
            console.log(`Product ${id} received as ${JSON.stringify(response.data)}`);
        })
        .catch(error => {
            console.log(`Product ${id} failed to receive: ${error.message}`);
        });
}


function getCart() {
    const userNumber = 20;
    const body = {
        email: `user${userNumber}@example.com`,
        password: `password${userNumber}`
    };

    // First login to get the token
    axios.post('http://localhost:3000/login', body)
        .then(response => {
            console.log(`User ${userNumber} logged in successfully: ${JSON.stringify(response.data)}`);
            const token = response.data.token;



            const headers = {
                'authorization': `Bearer ${token}`
            };
            axios.get(`http://localhost:80/cart`, { headers: headers })
                .then(response => {
                    console.log(`Cart for user ${userNumber} received successfully: ${JSON.stringify( response.data)}`);
                })
                .catch(error => {
                    console.log(`Cart for user ${userNumber} get failed: ${error.message}`);
                });

        })
        .catch(error => {
            console.log(`User ${userNumber} login failed: ${error.message}`);
        });
}

function deleteCart() {
    const userNumber = 20;
    const body = {
        email: `user${userNumber}@example.com`,
        password: `password${userNumber}`
    };

    // First login to get the token
    axios.post('http://localhost:3000/login', body)
        .then(response => {
            console.log(`User ${userNumber} logged in successfully: ${JSON.stringify(response.data)}`);
            const token = response.data.token;



            const headers = {
                'authorization': `Bearer ${token}`
            };
            axios.delete(`http://localhost:80/cart`, { headers: headers })
                .then(response => {
                    console.log(`Cart for user ${userNumber} deleted successfully: ${JSON.stringify( response.data)}`);
                })
                .catch(error => {
                    console.log(`Cart for user ${userNumber} deletion failed: ${error.message}`);
                });

        })
        .catch(error => {
            console.log(`User ${userNumber} login failed: ${error.message}`);
        });
}

//createProducts();
//deleteProduct("644af1db340247f04aa24524")
// getProduct("644af1db25180836c4da3833")
// addProductToCart("644af1db25180836c4da3833")
// getCart()
// deleteCart()

createProducts(0,10)