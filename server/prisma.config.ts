import 'dotenv/config'; // Loads your DATABASE_URL string right away
// Import process to ensure TypeScript recognizes the global process type in projects
import process from 'process';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // This tells Prisma to look for the environment variable we just loaded
    url: process.env.DATABASE_URL,
  },
});