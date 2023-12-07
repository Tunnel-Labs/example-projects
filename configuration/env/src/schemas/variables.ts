import { z } from 'zod';

export const envVariablesSchema = z.object({
	TUNNEL_TEST_USER_API_KEY: z.string()
});
