class Lecturer {
    constructor(data) {
        /** 
         * @type {string} 
         * @description The UUID of the lecturer.
         */
        this.uuid = data.uuid;

        /** 
         * @type {string} 
         * @description The title before the lecturer's name.
         */
        this.title_before = data.title_before;

        /** 
         * @type {string} 
         * @description The first name of the lecturer.
         */
        this.first_name = data.first_name;

        /** 
         * @type {string} 
         * @description The middle name of the lecturer.
         */
        this.middle_name = data.middle_name;

        /** 
         * @type {string} 
         * @description The last name of the lecturer.
         */
        this.last_name = data.last_name;

        /** 
         * @type {string} 
         * @description The title after the lecturer's name.
         */
        this.title_after = data.title_after;

        /** 
         * @type {string} 
         * @description The URL of the lecturer's picture.
         */
        this.picture_url = data.picture_url;

        /** 
         * @type {string} 
         * @description The location of the lecturer.
         */
        this.location = data.location;

        /** 
         * @type {string} 
         * @description The claim of the lecturer.
         */
        this.claim = data.claim;

        /** 
         * @type {string} 
         * @description The biography of the lecturer.
         */
        this.bio = data.bio;

        /** 
         * @type {number} 
         * @description The price per hour of the lecturer.
         */
        this.price_per_hour = data.price_per_hour;

        /** 
         * @type {Array<import("./Tag")>} 
         * @description The tags of the lecturer.
         */
        this.tags = data.tags;

        /** 
         * @type {Object} 
         * @description The contact information of the lecturer.
         */
        this.contact = data.contact;
    }
}

module.exports = Lecturer;