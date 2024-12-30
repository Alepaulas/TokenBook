require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/list-books', async (req, res) => {
    const { name, groupId, mimeType, pageLimit, pageOffset } = req.body;

    try {
        if (!process.env.PINATA_JWT) {
            throw new Error("PINATA_JWT environment variable is not set");
        }

        const queryParams = new URLSearchParams({ status: "pinned" });

        if (name) queryParams.append("metadata[name]", name);
        console.log(name);
        if (groupId) queryParams.append("groupId", groupId);
        if (mimeType) queryParams.append("mimeType", mimeType);
        if (pageLimit) queryParams.append("pageLimit", pageLimit);
        if (pageOffset) queryParams.append("pageOffset", pageOffset);

        const queryString = queryParams.toString();
        const url = `https://api.pinata.cloud/data/pinList${queryString ? `?${queryString}` : ""}`;

        const filesRequest = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        });

        if (!filesRequest.ok) {
            throw new Error(`Failed to fetch files: ${filesRequest.statusText}`);
        }

        const files = await filesRequest.json();

        if (!files.rows || files.rows.length === 0) {
            return res.status(200).send('No pinned files found.');
        }

        if (!name && !groupId && !mimeType && !pageLimit && !pageOffset) {
            return res.status(200).json(files.rows);
        }

        const filteredFiles = files.rows.filter(file => {
            let matches = true;

            if (name && file.metadata && file.metadata.name !== name) {
                matches = false;
            }
            if (groupId && file.groupId !== groupId) {
                matches = false;
            }
            if (mimeType && file.mimeType !== mimeType) {
                matches = false;
            }

            return matches;
        });

        if (filteredFiles.length === 0) {
            return res.status(200).send('No files matching the search criteria.');
        }

        res.status(200).json(filteredFiles);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
