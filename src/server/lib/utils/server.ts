import type { Express } from "express";

export const runServer = (app: Express, port: number) =>
    new Promise<void>((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
        server.on("close", () => {
            console.log("Server stopped listening");
            resolve();
        });

        server.on("error", (err) => {
            reject(err);
        });

        process.on("SIGINT", () => {
            server.close();
        });
    });
