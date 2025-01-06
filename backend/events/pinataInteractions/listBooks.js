const express = require('express');
const bodyParser = require('body-parser');
const hasAccess  = require('../../blockchainEvents/hasAccess');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
    const { name, cid, group, mimeType, pageLimit, pageOffset, genre, user } = req.body;

    try {
        if (!process.env.PINATA_JWT) {
            throw new Error("PINATA_JWT environment variable is not set");
        }

        const queryParams = new URLSearchParams({ status: "pinned" });
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

        if (!name && !group && !mimeType && (!genre || genre.length === 0) && !user) {
            return res.status(200).json(
                files.rows.filter(file =>{
                    if (file.metadata.keyvalues.isPrivate === 'true'){
                        return false;
                    }
                    return true;
                })
            )
        }

        const genreArray = genre || [];

        const filteredFiles = await Promise.all(
            files.rows.map(async (file) => {
                let matches = true;
                
                if (name && file.metadata && !file.metadata.name.toLowerCase().includes(name.toLowerCase())) {
                    matches = false;
                }
                if (group && file.metadata && file.metadata.group !== group) {
                    matches = false;
                }
                if (mimeType && file.metadata && file.metadata.mimeType !== mimeType) {
                    matches = false;
                }
                if (cid && file.ipfs_pin_hash && file.ipfs_pin_hash !== cid) {
                    matches = false;
                }
                if (genreArray.length > 0 && file.metadata && file.metadata.keyvalues) {
                    const fileGenres = file.metadata.keyvalues.genre
                        ? file.metadata.keyvalues.genre.split(',').map((g) => parseInt(g.trim(), 10))
                        : [];
                    if (fileGenres.length === 0 || !fileGenres.some((fileGenre) => genreArray.includes(fileGenre))) {
                        matches = false;
                    }
                }
                if (file.metadata.keyvalues.isPrivate === 'true') {
                    const accessGranted = await hasAccess.checkAccess(file.ipfs_pin_hash, user);
                    if (!accessGranted) {
                        matches = false;
                    }
                }
        
                return matches ? file : null;
            })
        );
        
        
        const finalFilteredFiles = filteredFiles.filter((file) => file !== null);
        
        if (finalFilteredFiles.length === 0) {
            return res.status(200).send('No files matching the search criteria.');
        }
        
        res.status(200).json(finalFilteredFiles);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).send('Failed to fetch files.');
    }
});

module.exports = router;