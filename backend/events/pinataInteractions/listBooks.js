const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const router = express.Router();

router.post('/', async (req, res) => {
    const { name, cid, group, mimeType, pageLimit, pageOffset, genre } = req.body;

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

        if (cid) {
            const fileByCid = files.rows.find(file => file.ipfs_pin_hash === cid);
            if (fileByCid) {
                return res.status(200).json([fileByCid]);
            } else {
                return res.status(200).send('No files found with the specified CID.');
            }
        }

        if (!name && !group && !mimeType && (!genre || genre.length === 0)) {
            return res.status(200).json(files.rows);
        }

        const genreArray = genre || [];

        const filteredFiles = files.rows.filter(file => {
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
            if (genreArray.length > 0 && file.metadata && file.metadata.keyvalues) {
                const fileGenres = file.metadata.keyvalues.genre ? file.metadata.keyvalues.genre.split(',').map(g => parseInt(g.trim(), 10)) : [];
                if (fileGenres.length === 0 || !fileGenres.some(fileGenre => genreArray.includes(fileGenre))) {
                    matches = false;
                }
            }

            return matches;
        });

        if (filteredFiles.length === 0) {
            return res.status(200).send('No files matching the search criteria.');
        }

        res.status(200).json(filteredFiles);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).send('Failed to fetch files.');
    }
});

module.exports = router;
