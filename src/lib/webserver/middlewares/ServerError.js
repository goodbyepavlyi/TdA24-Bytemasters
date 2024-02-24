const Logger = require("../../Logger");
const APIResponse = require("../APIResponse");

module.exports = class ServerError {
    /**
     * @param {*} error 
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     * @param {import("express").NextFunction} next 
     */
    run = (error, req, res, next) => {
        if (req.path.startsWith("/api")) {
            if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
                return APIResponse.INVALID_REQUEST_BODY.send(res);
            }

            Logger.error(Logger.Type.Webserver, "An error occured while processing the request:", error);
            return APIResponse.INTERNAL_SERVER_ERROR.send(res, {
                stack: (process.env.NODE_ENV != "production" || process.argv.includes("--dev") ? error.stack.split("\n").map(line => line.trim()) : undefined)
            });
        }
        
        Logger.error(Logger.Type.Webserver, "An error occured while processing the request:", error);
        return res.status(500).render("500");
    }
};