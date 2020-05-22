const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json())
const users = [];

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', async (req, res) => {
    const { name, password } = req.body
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        users.push({ name, passwordHash });
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
})

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    const user = users.find(user => user.name === name);
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }
    try {
        if (await bcrypt.compare(password, user.passwordHash)){
            return res.status(200).send(user);
        } else {
            return res.status(401).send('Invalid username or password');
        }
    } catch {
        res.status(500).send();
    }
})

app.listen(3000);
