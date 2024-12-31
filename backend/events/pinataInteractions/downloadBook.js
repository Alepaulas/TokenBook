require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/download', async (req, res) => {
    const { cid } = req.query; 
    console.log('Received request for CID:', cid); 
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch file from IPFS');
        }

        const metadataUrl = `https://api.pinata.cloud/data/pinList?hashContains=${cid}`;
        const metadataResponse = await fetch(metadataUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        });

        if (!metadataResponse.ok) {
            throw new Error('Failed to fetch metadata from Pinata');
        }

        const metadata = await metadataResponse.json();
        const fileMetadata = metadata.rows && metadata.rows[0] && metadata.rows[0].metadata;
        const fileName = fileMetadata && fileMetadata.name ? fileMetadata.name : cid;

        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        response.body.pipe(res);
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).send('Failed to download file.');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});