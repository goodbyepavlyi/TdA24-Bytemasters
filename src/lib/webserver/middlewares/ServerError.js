const Logger = require("../../Logger");

module.exports = class ServerError {
    constructor(core) {
        this.core = core;
    }

    run = (error, req, res, next) => {
        if (req.path.startsWith("/api")) {
            if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
                return res.status(400).send({ code: 400, message: "Invalid request body" });
            }

            Logger.error(Logger.Type.Webserver, error);
            return res.status(500).json({ code: 500, error: "Server error" });
        }
        
        Logger.error(Logger.Type.Webserver, error);
        return res.status(500).render("500");
    }
};