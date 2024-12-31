require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/add-book-to-group', async (req, res) => {

    const { groupName, fileName } = req.body;

    try {
        const listGroupRequest = await fetch("https://api.pinata.cloud/groups", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        });
        const listGroups = await listGroupRequest.json();
     
        const group = listGroups.find(g => g.name === groupName);
        if (!group) {
            return res.status(404).send('Group not found.');
        }
        const groupId = group.id;

        const fileRequest = await fetch(
            "https://api.pinata.cloud/data/pinList?status=pinned",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.PINATA_JWT}`,
                },
            },
        );
        const files = await fileRequest.json();

        const file = files.rows.find(f => f.metadata.name === fileName);
        if (!file) {
            return res.status(404).send('File not found.');
        }
        const cid = file.ipfs_pin_hash;

        const data = JSON.stringify({
            cids: [cid],
        });

        const request = await fetch(
            `https://api.pinata.cloud/groups/${groupId}/cids`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.PINATA_JWT}`,
                },
                body: data,
            },
        );

        if (!request.ok) {
            console.error("Failed to add CID to group:", await request.text());
            return res.status(500).send('Failed to add CID to group.');
        }

        console.log("CID successfully added to group.");
        res.status(200).send('CID successfully added to group.');
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send('An internal error occurred.');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
