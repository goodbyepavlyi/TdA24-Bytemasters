const Logger = require("../Logger");
const Utils = require("../Utils");
const APIError = require("../types/APIError");
const User = require("../types/user/User");
const UserType = require("../types/user/UserType");

module.exports = class UserManager {
    /**
     * @param {import("../Core")} core
     */
    constructor(core) {
        this.core = core;

        /**
         * @private
         * @type {import("../types/user/User")[]}
         */
        this._cache = [];

        this._createAdminUser();
    }

    async _createAdminUser() {
        if (await this.getUser({ username: "admin" })) {
            Logger.debug(Logger.Type.UserManager, "Admin user already exists, skipping creation...");
            return;
        }
        
        Logger.debug(Logger.Type.UserManager, "Creating admin user...");
        await this.createUser({
            uuid: Utils.newUUID(),
            type: UserType.Admin,
            username: "admin",
            password: "tda"
        });
    }

    /**
     * @private
     * @param {import("../types/user/User")} user
     */
    _addToCache(user) {
        if (!(user instanceof User)) {
            throw APIError.InvalidValueType("user", "User");
        }

        if (this._getFromCache({ uuid: user.uuid, username: user.username })) {
            Logger.debug(Logger.Type.UserManager, `&c${user.uuid}&r already exists in cache, updating...`);
            this._cache = this._cache.map(data => data.uuid == user.uuid ? user : data);
        } else {
            Logger.debug(Logger.Type.UserManager, `Caching user &c${user.uuid}&r...`);
            this._cache.push(user);
        }
    }

    /**
     * @private
     * @param {import("../types/DocTypes").UserIdentification} options
     */
    _removeFromCache(options) {
        this._cache = this._cache.filter(data => data.uuid != options.uuid && data.username != options.username);
    }

    /**
     * @private
     * @param {import("../types/DocTypes").UserIdentification} options 
     * @returns {import("../types/user/User") | null}
     */
    _getFromCache = (options) => this._cache.find(data => data.uuid == options.uuid || data.username == options.username)

    async getUsers() {
        const users = await this.core.getDatabase().query("SELECT * FROM `users`");
        Logger.debug(Logger.Type.UserManager, `Loaded &c${users.length}&r users from database`);

        return Promise.all(users.map(data => this.getUser({ uuid: data.uuid })));
    }

    /**
     * @param {import("../types/DocTypes").UserIdentification} options 
     * @returns {Promise<import("../types/user/User") | null>}
     */
    async getUser(options = {}) {
        const { uuid, username, email } = options;
        let user = this._getFromCache(options);

        if (!user) {
            const data = await this.core.getDatabase().query("SELECT * FROM `users` WHERE `uuid` = ? OR `username` = ? OR `email` = ?", [ uuid, username, email ]);
            if (!Array.isArray(data) || data.length == 0) {
                Logger.debug(Logger.Type.UserManager, `User &c${uuid || username || email}&r not found`);
                return null;
            }

            user = new User(data[0]);
            this._addToCache(user);
            Logger.debug(Logger.Type.UserManager, `Loaded user &c${user.uuid}&r from database, caching...`);
        } else {
            Logger.debug(Logger.Type.UserManager, `Found user &c${user.uuid}&r in cache`);
        }

        return user;
    }

    /**
     * @private
     * @param {import("../types/user/User")} user 
     * @param {boolean} edit
     */
    async _saveUser(user, edit = false) {
        if (!(user instanceof User)) {
            throw APIError.InvalidValueType("user", "User");
        }

        if (await this.getUser({ uuid: user.uuid, username: user.username, email: user.email }) && !edit) {
            Logger.debug(Logger.Type.UserManager, `Not saving user &c${user.uuid}&r because it &calready exists&r in database and it's not an &cedit operation&r...`);
            throw APIError.KeyAlreadyExists("user");
        }

        if (edit) {
            Logger.debug(Logger.Type.UserManager, `Updating user &c${user.uuid}&r in database...`);

            this.core.getDatabase().exec("UPDATE `users` SET `type` = ?, `email` = ?, `password` = ?, `username` = ?, `createdAt` = ? WHERE `uuid` = ?", [
                user.type,
                user.email,
                user.password,
                user.username,
                user.createdAt,
                user.uuid
            ]);
        } else {
            Logger.debug(Logger.Type.UserManager, `Creating user &c${user.uuid}&r in database...`);

            this.core.getDatabase().exec("INSERT INTO `users` (`uuid`, `type`, `email`, `password`, `username`, `createdAt`) VALUES (?, ?, ?, ?, ?, ?)", [
                user.uuid,
                user.type,
                user.email,
                user.password,
                user.username,
                user.createdAt
            ]);
        }

        this._addToCache(user);
    }
   

    /**
     * @param {import("../types/DocTypes").UserData} data 
     */
    async createUser(data) {
        if (!Utils.validateUUID(data.uuid)) {
            data.uuid = Utils.newUUID();
            while (await this.getUser({ uuid: data.uuid })) { data.uuid = Utils.newUUID() }
        }

        if (typeof data.password !== "string") {
            throw APIError.InvalidValueType("password", "string");
        }

        if (data.password.length > 128) {
            throw APIError.InvalidValueLength("password", null, 128);
        }

        data.createdAt = new Date().getTime();
        data.password = await User.hashPassword(data.password);

        const user = new User(data);
        await this._saveUser(user);
        return user;
    }

    /**
     * @param {import("../types/DocTypes").UserIdentification} options 
     * @returns {Promise<boolean>}
     */
    async deleteUser(options = {}) {
        if (!(await this.getUser(options))) {
            throw APIError.KeyNotFound("user");
        }
        
        const result = this.core.getDatabase().exec("DELETE FROM `users` WHERE `uuid` = ? OR `username` = ?", [ options.uuid, options.username ]);
        if (result.changes != 1) {
            throw APIError.KeyNotDeleted("user");
        }

        this._removeFromCache(options);
        return true;
    }

    /**
     * @param {import("../types/user/User")} user
     * @param {import("../types/DocTypes").UserData} data 
     * @returns {Promise<import("../types/user/User")>}
     */
    async editUser(user, data) {
        if (!(user instanceof User)) {
            throw APIError.InvalidValueType("user", "User");
        }

        user.edit(data);
        await this._saveUser(user, true);
        return user;
    }
    
    async shutdown() {
        Logger.debug(Logger.Type.UserManager, "Shutting down user manager...");

        for (const user of this._cache) {
            Logger.debug(Logger.Type.UserManager, `Saving user &c${user.uuid}&r from cache to database...`);
            await this._saveUser(user, true);
        }
    }
}