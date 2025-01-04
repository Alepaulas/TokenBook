const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const router = express.Router();
import web3 from "../config/blockchainConfig.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { abi } = require("../../artifacts/contracts/LibAccess.sol/LibAccess.json");
const { contractAddress } = require("../config/info.js");
const { checkAccess } = require("../../blockchainEvents/hasAccess.js");

const contract = new web3.eth.Contract(abi, contractAddress);



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

        const genreArray = genre || [];
        const filteredFiles = [];

        for (const file of files.rows) {
            let matches = true;

            if (cid && file.ipfs_pin_hash !== cid) {
                matches = false;
            }
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

            if (matches) {
                const bookHash = file.ipfs_pin_hash;
                const hasAccessToFile = !(await checkAccess(bookHash, user));
                if (hasAccessToFile) {
                    filteredFiles.push(file);
                }
            }
        }

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
