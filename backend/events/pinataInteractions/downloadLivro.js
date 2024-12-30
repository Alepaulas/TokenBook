
app.get('/download/:cid', async (req, res) => {
    const { cid } = req.params;
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch file from IPFS');
        }

        res.setHeader('Content-Disposition', `attachment; filename="${cid}"`);
        response.body.pipe(res);
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).send('Failed to download file.');
    }
});
