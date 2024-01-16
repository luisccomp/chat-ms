import { config } from "dotenv";

const environment = process.env.NODE_ENV ?? 'development'

if (environment !== 'production')
  config({ path: environment === 'test' ? '.env.test' : '.env' })