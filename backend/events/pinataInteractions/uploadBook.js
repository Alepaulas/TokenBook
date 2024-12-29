try {
    //arquivo de texto para teste
    const file = new File(["Hello World!"], "hello.txt");

    const data = new FormData();
    data.append("file", file);

    const metadata = JSON.stringify({
        name: "Testezada",
        keyvalues: {
           title: "",
           user: "",
            id: "",
           author: "",
           description: "",
           IsPrivate: "false"
        },
    });
    data.append("pinataMetadata", metadata);

    const options = JSON.stringify({
        cidVersion: 1,
        groupId: "our-Library",
    });
    data.append("pinataOptions", options);

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

    const upload = await uploadRequest.json();
    console.log(upload);
    
} catch (error) {
    console.log(error);
}