export async function loginAsTestUser() {
	const tunnelTestUserApiKey = process.env.TUNNEL_TEST_USER_API_KEY;
	if (!tunnelTestUserApiKey) {
		throw new Error('Missing TUNNEL_TEST_USER_API_KEY environment variable');
	}
}
