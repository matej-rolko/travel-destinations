import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const ENV_SCHEMA = z.object({
    PORT: z.coerce.number().default(3000),
    MONGO_URL: z.string().nonempty(),
    NODE_ENV: z
        .enum(["development", "production"])
        .optional()
        .default("production"),
});

const parsed = ENV_SCHEMA.safeParse(process.env);

if (parsed.success === false) {
    console.error(
        "❌[build] Invalid environment variables:",
        parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
}

export const env = parsed.data;
