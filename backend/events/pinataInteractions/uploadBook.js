require('dotenv').config(); 
const fs = require('fs');
const FormData = require('form-data');

async function main() {
    try {
        const data = new FormData();
        data.append('file', fs.createReadStream('hello.txt'));

        const metadata = JSON.stringify({
            name: "Testezada",
            keyvalues: {
                title: "Sample Title",
                user: "Sample User",
                id: "12345",
                author: "Author Name",
                description: "A sample description",
                IsPrivate: "false",
            },
        });
        data.append('pinataMetadata', metadata);

        const options = JSON.stringify({
            cidVersion: 1,
            groupId: "our-Library",
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
        } else {
            const upload = await uploadRequest.json();
            console.log("Upload successful:", upload);
        }

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
