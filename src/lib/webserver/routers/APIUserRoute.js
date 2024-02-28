const express = require("express");
const ics = require("ics");
const { APIError } = require("../../Errors");
const APIResponse = require("../APIResponse");

module.exports = class APIUserRoute {
    /**
     * @param {import('../Webserver')} webserver 
     */
    constructor(webserver) {
        this.webserver = webserver;
        this.router = express.Router();

        this.loadRoutes();
    }

    loadRoutes = () => {
        this.router.get("/@me", this.webserver.middlewares["LecturerMiddleware"].fetchSession, async (req, res, next) => {
            try {
                const { user } = res.locals;
                if (!user) {
                    return APIResponse.UNAUTHORIZED.send(res);
                }

                return APIResponse.OK.send(res, {
                    user: user.toJSON()
                });
            } catch (error) {
                if (error == APIError.MISSING_REQUIRED_VALUES) {
                    return APIResponse.MISSING_REQUIRED_VALUES.send(res);
                }
                
                if (error == APIError.INVALID_DATES) {
                    return APIResponse.INVALID_DATES.send(res);
                }
                
                if (error == APIError.TIME_CONFLICT) {
                    return APIResponse.TIME_CONFLICT.send(res);
                }

                return next(error);
            }
        });

        this.router.patch("/@me", this.webserver.middlewares["LecturerMiddleware"].fetchSession, async (req, res, next) => {
            try {
                const { user } = res.locals;
                if (!user) {
                    return APIResponse.UNAUTHORIZED.send(res);
                }

                const data = req.body;
                if (!data) {
                    return APIResponse.MISSING_REQUIRED_VALUES.send(res);
                }

                if (data.reservations) {
                    user.addReservations(data.reservations);
                }

                return APIResponse.OK.send(res);
            } catch (error) {
                if (error == APIError.MISSING_REQUIRED_VALUES) {
                    return APIResponse.MISSING_REQUIRED_VALUES.send(res);
                }
                
                if (error == APIError.INVALID_DATES) {
                    return APIResponse.INVALID_DATES.send(res);
                }
                
                if (error == APIError.TIME_CONFLICT) {
                    return APIResponse.TIME_CONFLICT.send(res);
                }

                return next(error);
            }
        });
        
        this.router.get("/@me/appointments", this.webserver.middlewares["LecturerMiddleware"].fetchSession, async (req, res, next) => {
            try {
                const { user } = res.locals;
                if (!user) {
                    return APIResponse.UNAUTHORIZED.send(res);
                }

                const appointments = user.reservations.map(reservation => reservation.appointments).flat();
                if (!appointments || appointments.length == 0) {
                    return res.sendStatus(204);
                }

                ics.createEvents(appointments.map(appointment => appointment.toICS()), (error, value) => {
                    if (error) {
                        Logger.error(Logger.Type.LecturerManager, `Failed to generate ics file for lecturer ${uuid}`, error);
                        return next(error);
                    }
                
                    return res.status(200)
                        .set("Content-Type", "text/calendar")
                        .set("Content-Disposition", "attachment; filename=events.ics")
                        .send(value);
                });
            } catch (error) {
                if (error == APIError.MISSING_REQUIRED_VALUES) {
                    return APIResponse.MISSING_REQUIRED_VALUES.send(res);
                }
                
                if (error == APIError.INVALID_DATES) {
                    return APIResponse.INVALID_DATES.send(res);
                }
                
                if (error == APIError.TIME_CONFLICT) {
                    return APIResponse.TIME_CONFLICT.send(res);
                }

                return next(error);
            }
        });
    }
};