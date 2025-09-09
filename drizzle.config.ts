import { defineConfig } from 'drizzle-kit';
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL hiện đang trống trong biến môi trường.")
}
export default defineConfig({
    out: './drizzle/migrations',
    schema: './drizzle/schema.ts',
    dialect: 'postgresql',
    strict: true,
    verbose: true,
    dbCredentials: {
        url: databaseUrl,
    },
});
