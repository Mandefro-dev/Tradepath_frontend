// frontend/src/entities/Trade/model/tradesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
 // Ensure this is correct
import { toast } from 'react-toastify';
import axiosInstance from '@/core/api/axiosInstance';
import { API_ENDPOINTS } from '@/shared/config/apiConfig';
/**
 * @typedef {Object} UserStubForTrade
 * @property {string} _id
 * @property {string} name
 * @property {string} [profilePicture]
 */

/**
 * @typedef {Object} ITrade
 * @property {string} [_id] - Unique identifier for the trade.
 * @property {string | UserStubForTrade} user - The ID or populated object of the user who owns the trade.
 * @property {string} symbol - Trading symbol (e.g., AAPL, BTC/USD).
 * @property {'LONG' | 'SHORT'} direction - The direction of the trade.
 * @property {string | Date} entryTime - ISO string or Date object for trade entry.
 * @property {string | Date} [exitTime] - ISO string or Date object for trade exit (optional).
 * @property {number} [durationMs] - Duration of the trade in milliseconds (calculated on close).
 * @property {number} entryPrice - The price at which the trade was entered.
 * @property {number} [exitPrice] - The price at which the trade was exited (optional).
 * @property {number} quantity - The quantity of the asset traded.
 * @property {'OPEN' | 'CLOSED'} status - The current status of the trade.
 * @property {number} [stopLossPrice] - Stop Loss price level (optional).
 * @property {number} [takeProfitPrice] - Take Profit price level (optional).
 * @property {number} [stopLossPips] - Stop Loss in pips (optional).
 * @property {number} [takeProfitPips] - Take Profit in pips (optional).
 * @property {number} [riskRewardRatio] - Calculated Risk/Reward ratio (optional).
 * @property {number} [pnl] - Profit and Loss for the trade (auto-calculated).
 * @property {number} [pnlPercent] - P&L as a percentage (auto-calculated).
 * @property {number} [commission] - Trading commission/fees (optional).
 * @property {Array<{value: string, label: string}> | string[]} setupTags - Array of setup tags. Store as objects for react-select if needed, convert for API.
 * @property {string} [entryConfirmation] - Notes on how entry was confirmed.
 * @property {string} [exitReason] - Reason for exiting the trade.
 * @property {{value: string, label: string} | string} [emotionEntry] - Emotion at trade entry.
 * @property {{value: string, label: string} | string} [emotionExit] - Emotion at trade exit.
 * @property {{value: number, label: string} | number} [confidenceLevelEntry] - Confidence level at entry (e.g., 1-10).
 * @property {{value: number, label: string} | number} [confidenceLevelExit] - Confidence level at exit.
 * @property {string} [newsImpact] - Description of any news impact.
 * @property {string} [mistakesMade] - Any mistakes made during the trade.
 * @property {string} [marketConditions] - Market conditions at the time of trade.
 * @property {{value: string, label: string} | string} [tradeType] - E.g., SWING, DAY, SCALP.
 * @property {{value: string, label: string} | string} [tradingSession] - E.g., LONDON, NEW_YORK.
 * @property {string} [notes] - General remarks or comments about the trade.
 * @property {string} [preTradeScreenshotUrl] - URL of the pre-trade screenshot.
 * @property {string} [postTradeScreenshotUrl] - URL of the post-trade screenshot.
 * @property {File | null} [preTradeScreenshotFile] - File object for new pre-trade screenshot upload (client-side only).
 * @property {File | null} [postTradeScreenshotFile] - File object for new post-trade screenshot upload (client-side only).
 * @property {boolean} [partialProfitTaken] - Whether partial profits were taken.
 * @property {string | Date} [createdAt] - Timestamp of creation.
 * @property {string | Date} [updatedAt] - Timestamp of last update.
 */

const defaultFilters = {
  symbol: '',
  dateRange: { start: null, end: null }, // Will be converted to startDate, endDate for API
  tags: [], // For filtering by setupTags (client might send as array, backend expects single `setupTag` or $in)
  winLoss: 'ALL', // 'ALL', 'WIN', 'LOSS', 'BREAKEVEN'
  direction: 'ALL', // 'ALL', 'LONG', 'SHORT'
  status: 'ALL', // 'ALL', 'OPEN', 'CLOSED'
  tradeType: 'ALL',
  // Add more as needed
};

const initialState = {
  /** @type {ITrade[]} */
  trades: [],
  /** @type {ITrade | null} */
  tradeDetails: null, // For viewing/editing a single selected trade
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 15, // Default limit for trade log display
    hasMore: true,
  },
  filters: defaultFilters,
  stats: {
    totalTrades: 0, wins: 0, losses: 0, breakEvens: 0, winRate: 0,
    totalPnl: 0, averagePnl: 0,
    averageRiskReward: 0, profitFactor: 0,
    grossProfit: 0, grossLoss: 0,
    // maxDrawdown: 0, // More complex, requires equity curve
  },
  tagSuggestions: [], // Array of { tag: string, count: number }
  status: 'idle', // 'idle' | 'loading' | 'submitting' | 'succeeded' | 'failed'
  error: null,
};

// Helper to prepare filter params for the API
const prepareApiFilters = (filtersState) => {
    const params = {};
    if (filtersState.symbol) params.symbol = filtersState.symbol;
    if (filtersState.direction && filtersState.direction !== 'ALL') params.direction = filtersState.direction;
    if (filtersState.status && filtersState.status !== 'ALL') params.status = filtersState.status;
    if (filtersState.tradeType && filtersState.tradeType !== 'ALL') params.tradeType = filtersState.tradeType;
    // Assuming backend takes single `setupTag` for simplicity, or modifies to accept $in for multiple tags
    if (filtersState.tags && filtersState.tags.length > 0) params.setupTag = filtersState.tags[0];
    if (filtersState.winLoss && filtersState.winLoss !== 'ALL') params.winLoss = filtersState.winLoss;

    if (filtersState.dateRange?.start) params.startDate = new Date(filtersState.dateRange.start).toISOString();
    if (filtersState.dateRange?.end) params.endDate = new Date(filtersState.dateRange.end).toISOString();

    // Remove undefined/null keys
    Object.keys(params).forEach(key => (params[key] === undefined || params[key] === null) && delete params[key]);
    return params;
};


// --- ASYNC THUNKS ---
export const reorderTrades = ({ newOrder, originalOrder }) => {
  return async (dispatch, getState) => {
    try {
      // First optimistically update the UI
      dispatch(tradesSlice.actions.reorderTrades({ newOrder, originalOrder }));
      
      // Then try to persist to backend
      const tradeIds = newOrder.map(trade => trade._id);
      const response = await axiosInstance.patch(API_ENDPOINTS.reorder, { tradeIds });
      
      if (!response.ok) {
        throw new Error('Failed to save new order');
      }
      
      // Optional: Refresh from server to ensure consistency
      // dispatch(fetchTrades({ page: 1, filters: getState().trades.filters }));
      
    } catch (error) {
      console.error('Reorder failed:', error);
      
      // Revert to original order if API call fails
      dispatch(tradesSlice.actions.reorderTrades({ 
        newOrder: originalOrder, 
        originalOrder: newOrder 
      }));
      
      // Optional: Show error notification
      // dispatch(showNotification({
      //   message: 'Failed to save new order. Reverting changes.',
      //   variant: 'error'
      // }));
    }
  };
};

export const fetchTrades = createAsyncThunk(
  'trades/fetchTrades',
  async ({ page = 1, limit = initialState.pagination.limit, applyCurrentFilters = true }, { getState, rejectWithValue }) => {
    try {
      const currentFilters = applyCurrentFilters ? getState().trades.filters : {};
      const apiParams = prepareApiFilters(currentFilters);
      const params = { page, limit, ...apiParams };

      const response = await axiosInstance.get(API_ENDPOINTS.TRADES_CRUD, { params });
      // Expected backend response: { results: ITrade[], page, limit, totalPages, totalResults }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch trades.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createTrade = createAsyncThunk(
  'trades/createTrade',
  async (tradeData, { rejectWithValue, dispatch }) => {
    try {
      // Convert react-select objects to simple values if needed
      const payload = {
        ...tradeData,
        direction: tradeData.direction?.value || tradeData.direction,
        setupTags: tradeData.setupTags?.map(tag => tag.value || tag),
        emotionEntry: tradeData.emotionEntry?.value || tradeData.emotionEntry,
        confidenceLevelEntry: tradeData.confidenceLevelEntry?.value || tradeData.confidenceLevelEntry,
        emotionExit: tradeData.emotionExit?.value || tradeData.emotionExit,
        confidenceLevelExit: tradeData.confidenceLevelExit?.value || tradeData.confidenceLevelExit,
        tradeType: tradeData.tradeType?.value || tradeData.tradeType,
        tradingSession: tradeData.tradingSession?.value || tradeData.tradingSession,
      };
      // Remove file objects from payload sent to this endpoint
      delete payload.preTradeScreenshotFile;
      delete payload.postTradeScreenshotFile;

      const response = await axiosInstance.post(API_ENDPOINTS.TRADES_CRUD, payload);
      toast.success('Trade logged successfully!');
      
      // After successful creation, if there were screenshot files, upload them
      const newTrade = response.data;
      if (tradeData.preTradeScreenshotFile) {
        await dispatch(uploadTradeScreenshot({ tradeId: newTrade._id, type: 'pre', file: tradeData.preTradeScreenshotFile })).unwrap();
      }
      if (tradeData.postTradeScreenshotFile) {
        await dispatch(uploadTradeScreenshot({ tradeId: newTrade._id, type: 'post', file: tradeData.postTradeScreenshotFile })).unwrap();
      }
      
      // Fetch the potentially updated trade (with screenshot URLs) or rely on individual screenshot thunks to update state
      // For simplicity, the screenshot thunk will update the trade.
      return newTrade; // Return the initially created trade
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to log trade.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateTrade = createAsyncThunk(
  'trades/updateTrade',
  async ({ tradeId, tradeData }, { rejectWithValue, dispatch }) => {
    try {
      const payload = {
        ...tradeData,
        direction: tradeData.direction?.value || tradeData.direction,
        setupTags: tradeData.setupTags?.map(tag => tag.value || tag),
        emotionEntry: tradeData.emotionEntry?.value || tradeData.emotionEntry,
        confidenceLevelEntry: tradeData.confidenceLevelEntry?.value || tradeData.confidenceLevelEntry,
        emotionExit: tradeData.emotionExit?.value || tradeData.emotionExit,
        confidenceLevelExit: tradeData.confidenceLevelExit?.value || tradeData.confidenceLevelExit,
        tradeType: tradeData.tradeType?.value || tradeData.tradeType,
        tradingSession: tradeData.tradingSession?.value || tradeData.tradingSession,
      };
      delete payload.preTradeScreenshotFile;
      delete payload.postTradeScreenshotFile;
      // Remove _id and user from payload if they exist, backend handles ownership
      delete payload._id; delete payload.user;

      const response = await axiosInstance.patch(API_ENDPOINTS.TRADE_BY_ID_CRUD(tradeId), payload);
      toast.success('Trade updated successfully!');

      const updatedTrade = response.data;
      if (tradeData.preTradeScreenshotFile) { // New pre-screenshot uploaded during edit
        await dispatch(uploadTradeScreenshot({ tradeId: updatedTrade._id, type: 'pre', file: tradeData.preTradeScreenshotFile })).unwrap();
      } else if (tradeData.preTradeScreenshotUrl === '') { // Screenshot was removed
         // Backend should handle clearing the URL if an empty string is passed, or add a specific API
      }
      if (tradeData.postTradeScreenshotFile) { // New post-screenshot
        await dispatch(uploadTradeScreenshot({ tradeId: updatedTrade._id, type: 'post', file: tradeData.postTradeScreenshotFile })).unwrap();
      } else if (tradeData.postTradeScreenshotUrl === '') {
         // Handle removal
      }

      return updatedTrade;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update trade.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteTrade = createAsyncThunk(
  'trades/deleteTrade',
  async (tradeId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.TRADE_BY_ID_CRUD(tradeId));
      toast.success('Trade deleted successfully!');
      return tradeId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete trade.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchTradeStats = createAsyncThunk(
  'trades/fetchTradeStats',
  async (filtersParam = {}, { getState, rejectWithValue }) => {
    try {
      const currentFilters = filtersParam || getState().trades.filters;
      const apiParams = prepareApiFilters(currentFilters);
      // Backend /trades/stats expects query parameters like dateRange (e.g. '30d'), symbol etc.
      // Let's ensure we send what the backend expects for stats.
      const statsApiParams = {
        dateRange: apiParams.startDate && apiParams.endDate ? 'custom' : (currentFilters.dateRangePreset || 'all'), // Example, backend may expect preset string
        symbol: apiParams.symbol,
        setupTag: apiParams.setupTag, // Assuming backend stats can filter by one tag
        direction: apiParams.direction,
      };
      if (statsApiParams.dateRange === 'custom') {
          statsApiParams.startDate = apiParams.startDate;
          statsApiParams.endDate = apiParams.endDate;
      }

      const response = await axiosInstance.get(API_ENDPOINTS.TRADES_STATS, { params: statsApiParams });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch trade statistics.');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchTagSuggestions = createAsyncThunk(
  'trades/fetchTagSuggestions',
  async (query = '', { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.TRADES_TAG_SUGGESTIONS, { params: { query, limit: 7 } });
      return response.data;
    } catch (error) {
      // Silently fail for suggestions or log to console
      console.error("Tag suggestion fetch error:", error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const uploadTradeScreenshot = createAsyncThunk(
  'trades/uploadTradeScreenshot',
  async ({ tradeId, type, file }, { rejectWithValue }) => { // type is 'pre' or 'post'
    try {
      const formData = new FormData();
      formData.append('tradeScreenshot', file); // Matches backend multer field name

      const response = await axiosInstance.post(
        API_ENDPOINTS.TRADE_SCREENSHOT_UPLOAD(tradeId, type),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success(`Screenshot (${type}-trade) uploaded successfully!`);
      return response.data; // Returns the updated ITrade with new screenshot URL
    } catch (error) {
      const message = error.response?.data?.message || `Failed to upload ${type}-trade screenshot.`;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);


const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    setTradeFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset page when filters change
      state.trades = []; // Clear trades to force refetch with new filters
      state.pagination.hasMore = true; // Assume there might be more
      state.status = 'idle'; // Allow refetch
    },
    resetTradeFilters: (state) => {
        state.filters = defaultFilters;
        state.pagination.currentPage = 1;
        state.trades = [];
        state.pagination.hasMore = true;
        state.status = 'idle';
    },
    resetTradeStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    setTradeDetails: (state, action) => { // For opening edit modal
        state.tradeDetails = action.payload;
        state.status = 'idle'; // Reset general status
    },
    clearTradeDetails: (state) => {
        state.tradeDetails = null;
    },
    // Optimistic updates can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trades
      .addCase(fetchTrades.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTrades.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.page === 1) {
          state.trades = action.payload.results;
        } else {
          const newTrades = action.payload.results.filter(
            nt => !state.trades.find(et => et._id === nt._id)
          );
          state.trades = [...state.trades, ...newTrades];
        }
        state.pagination = {
          currentPage: action.payload.page,
          totalPages: action.payload.totalPages,
          totalResults: action.payload.totalResults,
          limit: action.payload.limit,
          hasMore: action.payload.page < action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(fetchTrades.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      // Create Trade
      .addCase(createTrade.pending, (state) => { state.status = 'submitting'; })
      .addCase(createTrade.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trades.unshift(action.payload); // Add to top of the current list
        state.pagination.totalResults = (state.pagination.totalResults || 0) + 1;
        // Could refetch stats or update incrementally if simple enough
      })
      .addCase(createTrade.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      // Update Trade & Upload Screenshot (as upload updates the trade)
      .addCase(updateTrade.pending, (state) => { state.status = 'submitting'; })
      .addCase(updateTrade.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.trades.findIndex((trade) => trade._id === action.payload._id);
        if (index !== -1) {
          state.trades[index] = action.payload;
        }
        if (state.tradeDetails?._id === action.payload._id) {
            state.tradeDetails = action.payload;
        }
      })
      .addCase(updateTrade.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      .addCase(uploadTradeScreenshot.fulfilled, (state, action) => {
        // This thunk returns the *entire updated trade object* from the backend
        const updatedTradeWithScreenshot = action.payload;
        const index = state.trades.findIndex((trade) => trade._id === updatedTradeWithScreenshot._id);
        if (index !== -1) {
          state.trades[index] = updatedTradeWithScreenshot;
        }
        if (state.tradeDetails?._id === updatedTradeWithScreenshot._id) {
            state.tradeDetails = updatedTradeWithScreenshot;
        }
         // No status change here unless a specific 'uploadingScreenshot' status is needed
      })
      // Handle pending/rejected for uploadTradeScreenshot if specific UI feedback is needed

      // Delete Trade
      .addCase(deleteTrade.pending, (state) => { state.status = 'submitting'; })
      .addCase(deleteTrade.fulfilled, (state, action) => { // action.payload is tradeId
        state.status = 'succeeded';
        state.trades = state.trades.filter((trade) => trade._id !== action.payload);
        state.pagination.totalResults = Math.max(0, (state.pagination.totalResults || 1) - 1);
        // If current page becomes empty after delete, might need to fetch previous page
        if (state.trades.length === 0 && state.pagination.currentPage > 1) {
            state.pagination.currentPage -= 1; // This could trigger a new fetch if UI is set up for it
        }
      })
      .addCase(deleteTrade.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      // Fetch Stats
      .addCase(fetchTradeStats.pending, (state) => {
        // Can use a separate status for stats if needed, e.g., state.statsStatus = 'loading'
        state.status = 'loading'; // Or keep global status
      })
      .addCase(fetchTradeStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchTradeStats.rejected, (state, action) => {
        state.status = 'failed';
        // state.error = action.payload; // Can set specific statsError
      })

      // Fetch Tag Suggestions
      .addCase(fetchTagSuggestions.fulfilled, (state, action) => {
        state.tagSuggestions = action.payload;
      })
      .addCase(fetchTagSuggestions.rejected, (state, action) => {
        state.tagSuggestions = []; // Clear on error or keep stale
      });
  },
});

export const {
    setTradeFilters,
    resetTradeFilters,
    resetTradeStatus,
    setTradeDetails,
    clearTradeDetails
} = tradesSlice.actions;

export default tradesSlice.reducer;
