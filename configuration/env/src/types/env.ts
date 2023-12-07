import type { z } from 'zod';
import { envVariablesSchema } from '../schemas/variables.ts';

export type EnvVariables = z.infer<typeof envVariablesSchema>;
