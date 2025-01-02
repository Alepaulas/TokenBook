require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.post('/list-books', async (req, res) => {
    const { name, cid, group, mimeType, pageLimit, pageOffset, genre } = req.body;

    try {
        if (!process.env.PINATA_JWT) {
            throw new Error("PINATA_JWT environment variable is not set");
        }

        const queryParams = new URLSearchParams({ status: "pinned" });

        if (name) queryParams.append("metadata[name]", name);
        console.log('Name:', name);
        if (group) queryParams.append("metadata[group]", group); 
        console.log('Group:', group);
        if (genre) queryParams.append("metadata[genre]", genre.toLowerCase());  // Gênero passa como string
        console.log('Genre:', genre);
        if (cid) queryParams.append("cid", cid);
        console.log('CID:', cid);
        if (mimeType) queryParams.append("metadata[mimeType]", mimeType); 
        console.log('MimeType:', mimeType);
        if (pageLimit) queryParams.append("pageLimit", pageLimit);
        console.log('PageLimit:', pageLimit);
        if (pageOffset) queryParams.append("pageOffset", pageOffset);
        console.log('PageOffset:', pageOffset);

        const queryString = queryParams.toString();
        const url = `https://api.pinata.cloud/data/pinList${queryString ? `?${queryString}` : ""}`;
        console.log('URL:', url);

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
        console.log('Files Response:', files);

        if (!files.rows || files.rows.length === 0) {
            return res.status(200).send('No pinned files found.');
        }

        const genreArray = genre ? genre.toLowerCase().split(',').map(g => g.trim()) : [];
        console.log('Genre Array:', genreArray);

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
                const fileGenres = file.metadata.keyvalues.genre ? file.metadata.keyvalues.genre.toLowerCase().split(',').map(g => g.trim()) : [];
                if (fileGenres.length === 0 || !fileGenres.some(fileGenre => genreArray.some(g => fileGenre.startsWith(g)))) {
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


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});