
// frontend/src/entities/Trade/model/types.js (NEW FILE or update existing)
/**
 * @typedef {Object} UserStubForTrade
 * @property {string} _id
 * @property {string} name
 */

/**
 * @typedef {Object} ITrade
 * @property {string} [_id]
 * @property {string | UserStubForTrade} user - User ID or populated user object
 * @property {string} symbol
 * @property {'LONG' | 'SHORT'} direction
 * @property {string | Date} entryTime
 * @property {string | Date} [exitTime]
 * @property {number} [durationMs]
 * @property {number} entryPrice
 * @property {number} [exitPrice]
 * @property {number} quantity
 * @property {'OPEN' | 'CLOSED'} status
 * @property {number} [stopLossPrice]
 * @property {number} [takeProfitPrice]
 * @property {number} [stopLossPips]
 * @property {number} [takeProfitPips]
 * @property {number} [riskRewardRatio]
 * @property {number} [pnl]
 * @property {number} [pnlPercent]
 * @property {number} [commission]
 * @property {Array<{value: string, label: string}> | string[]} setupTags - Store as objects for react-select, convert to string[] for API
 * @property {string} [entryConfirmation]
 * @property {string} [exitReason]
 * @property {{value: string, label: string} | string} [emotionEntry]
 * @property {{value: string, label: string} | string} [emotionExit]
 * @property {{value: number, label: string} | number} [confidenceLevelEntry]
 * @property {{value: number, label: string} | number} [confidenceLevelExit]
 * @property {string} [newsImpact]
 * @property {string} [mistakesMade]
 * @property {string} [marketConditions]
 * @property {{value: string, label: string} | string} [tradeType]
 * @property {{value: string, label: string} | string} [tradingSession]
 * @property {string} [notes]
 * @property {string} [preTradeScreenshotUrl]
 * @property {string} [postTradeScreenshotUrl]
 * @property {File} [preTradeScreenshotFile] - For upload
 * @property {File} [postTradeScreenshotFile] - For upload
 * @property {boolean} [partialProfitTaken]
 * @property {string | Date} [createdAt]
 * @property {string | Date} [updatedAt]
 */
export {}; // To make it a module