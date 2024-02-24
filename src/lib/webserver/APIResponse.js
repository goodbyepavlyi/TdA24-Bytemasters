module.exports = class APIResponse {
    constructor(data) {
        this.statusCode = data.statusCode;
        this.code = data.code;
        this.message = data.message;
        this.error = data.error;
    }

    send = (res, data) => res.status(this.statusCode).json({
        code: this.code,
        message: this.message,
        error: this.error,
        ...data
    })

    static OK = new APIResponse({ statusCode: 200, code: 200, message: "OK" });
    static ROUTE_NOT_FOUND = new APIResponse({ statusCode: 404, code: 404, error: "ROUTE_NOT_FOUND" });
    static INTERNAL_SERVER_ERROR = new APIResponse({ statusCode: 500, code: 500, error: "INTERNAL_SERVER_ERROR" });
    static UNAUTHORIZED = new APIResponse({ statusCode: 401, code: 401, error: "UNAUTHORIZED" });
    static MISSING_REQUIRED_VALUES = new APIResponse({ statusCode: 400, code: 400, error: "MISSING_REQUIRED_VALUES" });
    static INVALID_REQUEST_BODY = new APIResponse({ statusCode: 400, code: 400, error: "INVALID_REQUEST_BODY" });

    static LECTURER_NOT_FOUND = new APIResponse({ statusCode: 200, code: 404, error: "LECTURER_NOT_FOUND" });
    static LECTURER_ALREADY_EXISTS = new APIResponse({ statusCode: 400, code: 400, error: "LECTURER_ALREADY_EXISTS" });
    static INVALID_CREDENTIALS = new APIResponse({ statusCode: 400, code: 400, error: "INVALID_CREDENTIALS" });
    static INVALID_EMAIL = new APIResponse({ statusCode: 400, code: 400, error: "INVALID_EMAIL" });
    static INVALID_PHONE_NUMBER = new APIResponse({ statusCode: 400, code: 400, error: "INVALID_PHONE_NUMBER" });
    static USERNAME_DOESNT_MEET_MINIMAL_REQUIREMENTS = new APIResponse({ statusCode: 400, code: 400, error: "USERNAME_DOESNT_MEET_MINIMAL_REQUIREMENTS" });
    static USERNAME_DOESNT_MEET_MAXIMAL_REQUIREMENTS = new APIResponse({ statusCode: 400, code: 400, error: "USERNAME_DOESNT_MEET_MAXIMAL_REQUIREMENTS" });

    static INVALID_EVENT_FIRST_NAME = new APIResponse({ statusCode: 400, code: 400, error: "INVALID_EVENT_FIRST_NAME" });
    static INVALID_EVENT_LAST_NAME = new APIResponse({ statusCode: 400, code: 400, error: "INVALID_EVENT_LAST_NAME" });
    static INVALID_EVENT_START_DATE = new APIResponse({ statusCode: 400, code: 400, error: "INVALID_EVENT_START_DATE" });
    static INVALID_EVENT_END_DATE = new APIResponse({ statusCode: 400, code: 400, error: "INVALID_EVENT_END_DATE" });
    static INVALID_EVENT_DATES = new APIResponse({ statusCode: 400, code: 400, error: "INVALID_EVENT_DATES" });
    static EVENT_CONFLICTS_WITH_EXISTING_EVENT = new APIResponse({ statusCode: 400, code: 400, error: "EVENT_CONFLICTS_WITH_EXISTING_EVENT" });
}