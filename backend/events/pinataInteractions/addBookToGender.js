async function main() {
	try {
		
		const listGroupRequest = await fetch("https://api.pinata.cloud/groups", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.PINATA_JWT}`,
			},
		});
		const listGroups = await listGroupRequest.json();

		const groupId = listGroups[0].id;

		const fileRequest = await fetch(
			"https://api.pinata.cloud/data/pinList?status=pinned",
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.PINATA_JWT}`,
				},
			},
		);
		const files = await fileRequest.json();


		const cid = files.rows[0].ipfs_pin_hash;

		const data = JSON.stringify({
			cids: [cid],
		});

		const request = await fetch(
			`https://api.pinata.cloud/groups/${groupId}/cids`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.PINATA_JWT}`,
				},
				body: data,
			},
		);
		console.log(request.statusText);
	} catch (error) {
		console.log(error);
	}
}

main();
