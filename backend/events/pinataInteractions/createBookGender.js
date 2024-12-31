require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/create-group', async (req, res) => {
    const { groupName } = req.body;

    try {
        const data = JSON.stringify({
            name: groupName, 
        });

        const createGroupRequest = await fetch("https://api.pinata.cloud/groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: data,
        });

        if (!createGroupRequest.ok) {
            console.error("Failed to create group:", await createGroupRequest.text());
            return res.status(500).send('Failed to create group.');
        }

        const group = await createGroupRequest.json();
        console.log("Group created successfully:", group);

        res.status(200).json({ message: 'Group created successfully!', group });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send('An internal error occurred.');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
