// frontend/src/entities/Post/model/types.js

/**
 * @typedef {Object} UserStub
 * @property {string} _id
 * @property {string} name
 * @property {string} [profilePicture]
 */

/**
 * @typedef {Object} TradeStubForPost
 * @property {string} _id
 * @property {string} symbol
 * @property {'LONG' | 'SHORT'} direction
 * @property {number} [pnl]
 */

/**
 * @typedef {Object} IPost
 * @property {string} _id
 * @property {UserStub} user
 * @property {TradeStubForPost} trade
 * @property {string} [caption]
 * @property {string} [chartImageUrl]
 * @property {'PUBLIC' | 'PRIVATE' | 'FOLLOWERS_ONLY'} visibility
 * @property {number} likesCount
 * @property {number} commentsCount
 * @property {string | Date} createdAt
 * @property {string | Date} updatedAt
 * @property {boolean} [isLikedByCurrentUser] - Added client-side or from backend
 * @property {IComment[]} [actualComments] - Populated comments
 */

/**
 * @typedef {Object} IComment
 * @property {string} _id
 * @property {UserStub} user
 * @property {string} post - Post ID
 * @property {string} text
 * @property {string | Date} createdAt
 * @property {string | Date} updatedAt
 */
export {}; // To make it a module