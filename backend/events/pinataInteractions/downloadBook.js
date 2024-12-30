require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();

app.get('/download/:cid', async (req, res) => {
    const { cid } = req.params;
    console.log('Received request for CID:', cid); // Add this line for logging
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch file from IPFS');
        }
        
        res.setHeader('Content-Disposition', `attachment; filename=${cid}`);
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
