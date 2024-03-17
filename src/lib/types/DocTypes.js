/**
 * @typedef {object} UserData
 * @property {string} uuid
 * @property {import("./user/UserType")} type
 * @property {string} email
 * @property {string} username
 * @property {string} password
 * @property {Date} createdAt
*/

/**
 * @typedef {object} UserIdentification
 * @property {string} uuid
 * @property {string} username
 * @property {string} email
*/

/**
 * @typedef {object} LecturerData
 * @property {string} title_before
 * @property {string} first_name
 * @property {string} middle_name
 * @property {string} last_name
 * @property {string} title_after
 * @property {string} picture_url
 * @property {string} location
 * @property {string} claim
 * @property {string} bio
 * @property {number} price_per_hour
 * @property {TagData[]} tags
 * @property {object} contact
 * @property {string[]} contact.emails
 * @property {string[]} contact.telephone_numbers
 * @property {AppointmentData[]} appointments
 */

/**
 * @typedef {object} TagData
 * @property {string} uuid
 * @property {string} name
 */

/**
 * @typedef {object} AppointmentData
 * @property {string} uuid
 * @property {number} start
 * @property {number} end
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} location
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} message
 */

module.exports = {
    UserData,
    UserIdentification,
    LecturerData,
    TagData,
    AppointmentData
}