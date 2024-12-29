async function main() {
	try {
		const queryParams = new URLSearchParams({ status: "pinned" });

		queryParams.append("metadata[name]", "hello.txt");

		queryParams.append("groupId", "18893556-de8e-4229-8a9a-27b95468dd3e");

		queryParams.append("mimeType", "application/pdf");
        //"mimetype" é o tipo de arquivo, application serve para PDF's, pkcs8 e zip's.
        // fonte: https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types
        

		queryParams.append("pageLimit", "50");

		// Add pagination
		 queryParams.append(
		 	"pageOffset",
		 	"50",
		);

		const queryString = queryParams.toString();

		const url = `https://api.pinata.cloud/data/pinList${queryString ? `?${queryString}` : ""}`;

		const filesRequest = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.PINATA_JWT}`,
			},
		});

		const files = await filesRequest.json();
		console.log(files.rows);
	} catch (error) {
		console.log(error);
	}
}

main();
