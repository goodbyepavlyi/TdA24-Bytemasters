const express = require("express");
const { APIError } = require("../../Errors");

module.exports = class APIAuthRoute {
    /**
     * @param {import('../../Core')} core 
     */
    constructor(core) {
        this.core = core;
        this.router = express.Router();

        this.loadRoutes();
    }

    loadRoutes = () => {
        this.router.post("/login", async (req, res, next) => {
            try {
                const { username, password } = req.body;
                if (!(username && password)) {
                    throw APIError.MISSING_REQUIRED_VALUES;
                }

                const lecturer = await this.core.getLecturerManager().getLecturer({ username });
                if (!lecturer) {
                    throw APIError.INVALID_CREDENTIALS;
                }

                if (!await this.core.getLecturerManager()._comparePassword(lecturer.password, password)) {
                    throw APIError.INVALID_CREDENTIALS;
                }

                req.session.token = this.core.getLecturerManager().generateJWTToken(lecturer);
                
                // TODO: udelat nejakou ApiResponse classu
                return res.status(200).json({ code: 200 });
            } catch (error) {
                if (error instanceof APIError) {
                    if (error == APIError.MISSING_REQUIRED_VALUES) {
                        return res.status(400).json({ error: "Missing required values" });
                    }
    
                    if (error == APIError.INVALID_CREDENTIALS) {
                        return res.status(400).json({ error: "Invalid credentials" });
                    }
                }

                return next(error);
            }
        });
    }
};