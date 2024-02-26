module.exports = class LecturerAuthMiddleware {
    /**
     * @param {import("../Webserver")} webserver 
     */
    constructor(webserver) {
        this.webserver = webserver;
    }

    /**
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     * @param {import("express").NextFunction} next 
     */
    run = async (req, res, next) => {
        const { token } = req.session;
        
        if (!token) {
            return res.redirect("/");
        }

        const result = this.webserver.getCore().getLecturerManager().verifyToken(token);
        if (!result.uuid) {
            return res.redirect("/");
        }

        const lecturer = await this.webserver.getCore().getLecturerManager().getLecturer({ uuid: result.uuid });
        if (!lecturer) {
            return res.redirect("/");
        }

        return next();
    }
}