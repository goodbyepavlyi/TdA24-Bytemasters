// TODO: vylepsit to asi?

class UserAuthError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthError";
    }

    static MISSING_REQUIRED_PARAMETERS = new UserAuthError("MISSING_REQUIRED_PARAMETERS");
    static INVALID_PASSWORD = new UserAuthError("INVALID_PASSWORD");
    static INVALID_EMAIL = new UserAuthError("INVALID_EMAIL");
    static USERNAME_DOESNT_MEET_MINIMAL_REQUIREMENTS = new UserAuthError("USERNAME_DOESNT_MEET_MINIMAL_REQUIREMENTS");
    static USERNAME_DOESNT_MEET_MAXIMAL_REQUIREMENTS = new UserAuthError("USERNAME_DOESNT_MEET_MAXIMAL_REQUIREMENTS");
    static USER_ALREADY_EXISTS = new UserAuthError("USER_ALREADY_EXISTS");
}

class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = "APIError";
    }

    static MISSING_REQUIRED_VALUES = new APIError("MISSING_REQUIRED_VALUES");
}

module.exports = {
    UserAuthError,
    APIError
}