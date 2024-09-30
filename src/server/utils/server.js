export const runServer = (app, port) =>
    new Promise((resolve, reject) => {
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
