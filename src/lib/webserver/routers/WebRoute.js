const express = require("express");

module.exports = class WebRoute {
    /**
     * @param {import("../Webserver")} webserver 
     */
    constructor(webserver) {
        this.webserver = webserver;
        this.router = express.Router();

        this.loadRoutes();
    }
    
    loadRoutes = () => {
        this.router.get("/", this.webserver.middlewares["AuthMiddleware"].fetchSession, async (req, res) => res.render("index"));
        this.router.get("/gdpr", this.webserver.middlewares["AuthMiddleware"].fetchSession, (req, res) => res.render("gdpr"));
        this.router.get("/contact", this.webserver.middlewares["AuthMiddleware"].fetchSession, (req, res) => res.render("contact"));

        this.router.get("/login", this.webserver.middlewares["AuthMiddleware"].fetchSession, (req, res) => {
            if (res.locals.user) {
                return res.redirect("/dashboard");
            }

            res.render("login");
        });

        this.router.get("/lecturer/:lecturerUUID", this.webserver.middlewares["AuthMiddleware"].fetchSession, async (req, res) => {
            const lecturerUUID = req.params.lecturerUUID;

            const lecturer = await this.webserver.getCore().getUserManager().getLecturer({ uuid: lecturerUUID });
            if (!lecturer) {
                return res.redirect("/");
            }

            res.render("lecturer", { lecturer });
        });

        this.router.get("/dashboard", this.webserver.middlewares["AuthMiddleware"].forceAuth, (req, res) => res.render("dashboard"));
    }
};