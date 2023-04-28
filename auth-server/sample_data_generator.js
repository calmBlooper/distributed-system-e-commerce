const axios = require('axios');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const roles = ['admin', 'user', 'seller'];

const users = [];
const amount=40;
// Register all users first
for (let i = 0; i < amount; i++) {
    const email = `user${i}@example.com`;
    const password = `password${i}`;
    const name = `User ${i}`;
    let role = 'user';
    if (i < amount/2) {
        role = 'seller';
    }

    if (!emailRegex.test(email)) {
        console.log(`Invalid email address: ${email}`);
        continue;
    }

    const body = {
        email: email,
        password: password,
        name: name,
        role: role
    };

    axios.post('http://localhost:3000/register', body)
        .then(response => {
            console.log(`User ${i} registered successfully`);
            users.push({
                email: email,
                password: password
            });
            if (users.length === amount) {
                // All users have been registered, proceed to logins
                performLogins();
            }
        })
        .catch(error => {
            console.log(`User ${i} registration failed: ${error.message}`);
        });
}

// Perform all logins after all registrations are complete
function performLogins() {
    for (let i = 0; i < amount; i++) {
        const body = {
            email: users[i].email,
            password: users[i].password
        };
        axios.post('http://localhost:3000/login', body)
            .then(response => {
                console.log(`User ${i} logged in successfully: ${JSON.stringify(response.data)}`);
            })
            .catch(error => {
                console.log(`User ${i} login failed: ${error.message}`);
            });
    }
}
