const express = require('express');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const {addBook} = require("../../blockchainEvents/addBook.js");

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, user, author, description, genre, isPrivate } = req.body;

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        if (!process.env.PINATA_JWT) {
            throw new Error("PINATA_JWT environment variable is not set");
        }

        const customFileName = `${title || 'default'}.pdf`; 
        const newFilePath = `uploads/${customFileName}`;

        fs.renameSync(req.file.path, newFilePath);

        const data = new FormData();
        data.append('file', fs.createReadStream(newFilePath), customFileName);

        const metadata = JSON.stringify({
            title,
            keyvalues: {
                user,
                author,
                description,
                genre,
                isPrivate,
            },
        });
        data.append('pinataMetadata', metadata);

        const options = JSON.stringify({
            cidVersion: 1,
        });
        data.append('pinataOptions', options);

        const uploadRequest = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.PINATA_JWT}`,
                },
                body: data,
            },
        );

        if (!uploadRequest.ok) {
            console.error("Upload failed:", await uploadRequest.text());
            return res.status(500).send('Upload to IPFS failed.');
        }

        const uploadResponse = await uploadRequest.json();
        console.log("Upload successful:", uploadResponse);

   
        fs.unlinkSync(newFilePath);

        await addBook(uploadResponse.IpfsHash, user);

        res.status(200).json({ message: 'Upload and book registration successful!', ipfsHash: uploadResponse.IpfsHash });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send('An internal error occurred.');
    }
});

module.exports = router;
