async function main() {
	try {
		const data = JSON.stringify({
			name: "{placeholder}", 
		});

		const createGroupRequest = await fetch("https://api.pinata.cloud/groups", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.PINATA_JWT}`,
			},
			body: data,
		});

		const group = await createGroupRequest.json();
		console.log(group);
	} catch (error) {
		console.log(error);
	}
}

main();
