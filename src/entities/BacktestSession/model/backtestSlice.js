import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/core/api/axiosInstance';
import { API_ENDPOINTS } from '@/shared/config/apiConfig';
import { toast } from 'react-toastify';

const initialState = {
  sessionsList: {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    items: [],
    pagination: { hasMore: true, currentPage: 1, totalPages: 1 },
    error: null,
  },
  currentSession: {
    status: 'idle', 
    config: null,      // The session document from the DB
    replaySpeed: 1,
    candles: [],       // The array of candle data for the chart
    equityCurve: [],   // Array of { time, value } for equity chart
    openPosition: null,
    trades: [],    
    results: {
      status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
      data: null,
      error: null,
  },    // Log of executed trades for this session
    error: null,
  },
};

// --- REST API THUNKS ---
export const fetchBacktestSessions = createAsyncThunk(
  'backtest/fetchSessions',
  async ({ page = 1, limit = 9 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.BACKTESTS_BASE, { params: { page, limit } });
      return { data: response.data, page };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch backtest sessions.');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createBacktestSession = createAsyncThunk(
  'backtest/createSession',
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.BACKTESTS_BASE, sessionData);
      toast.success('Backtest session created successfully!');
      return response.data; // Returns the newly created session object
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create session.');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
export const fetchSessionTrades = createAsyncThunk('backtest/fetchSessionTrades', async (sessionId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.BACKTEST_TRADES(sessionId));
    return response.data.results;
  } catch (error) { toast.error("Failed to load trade journal."); return rejectWithValue(error.response?.data?.message); }
});
export const updateBacktestTradeNotes = createAsyncThunk(
  'backtest/updateTradeNotes',
  async ({ tradeId, notes }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(API_ENDPOINTS.BACKTEST_TRADE_BY_ID(tradeId), { notes });
      toast.success("Trade notes updated.");
      return response.data;
    } catch (error) { toast.error("Failed to update notes."); return rejectWithValue(error.response?.data?.message); }
  }
);

export const uploadBacktestSnapshot = createAsyncThunk(
    'backtest/uploadSnapshot',
    async ({ tradeId, file }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('snapshotImage', file);
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.BACKTEST_TRADE_SNAPSHOT(tradeId), formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success("Screenshot uploaded and linked to trade.");
            return response.data;
        } catch (error) { toast.error("Failed to upload screenshot."); return rejectWithValue(error.response?.data?.message); }
    }
);
export const fetchSessionResults = createAsyncThunk(
  'backtest/fetchSessionResults',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.BACKTEST_RESULTS(sessionId));
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch session results.');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


export const fetchSessionDetails = createAsyncThunk(
  'backtest/fetchSessionDetails',
  async (sessionId, { rejectWithValue }) => {
    try {
      return (await axiosInstance.get(API_ENDPOINTS.BACKTEST_BY_ID(sessionId))).data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load session details.');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// --- SLICE DEFINITION ---
const backtestSlice = createSlice({
  name: 'backtest',
  initialState,
  reducers: {
    resetSessionList: (state) => {
      state.sessionsList = initialState.sessionsList;
  },
    // --- WebSocket Event Reducers ---
    clearCurrentSession: (state) => {
      state.currentSession = initialState.currentSession;
    },
    setSessionReady: (state, action) => {
      state.currentSession.status = 'ready';
      state.currentSession.config = action.payload.sessionConfig;
      state.currentSession.candles = []; // Clear candles on new setup
      state.currentSession.equityCurve = [{ time: new Date(action.payload.sessionConfig.startDate).getTime() / 1000, value: action.payload.sessionConfig.initialBalance }];
    },
    setSessionStatus: (state, action) => {
      const { status, replaySpeed } = action.payload;
      if (status) state.currentSession.status = status;
      if (replaySpeed) state.currentSession.replaySpeed = replaySpeed;
    },
    appendCandleData: (state, action) => {
      const { candle, equity } = action.payload;
      const formattedCandle = { ...candle, time: new Date(candle.timestamp).getTime() / 1000 };
      state.currentSession.candles.push(formattedCandle);
      state.currentSession.equityCurve.push({ time: formattedCandle.time, value: equity });
    
    }, handleTradeOpened: (state, action) => {
      const { trade, session } = action.payload;
      state.currentSession.openPosition = session.openPosition;
      // Optionally add to trades list immediately as an 'open' trade
  },
    handleTradeExecution: (state, action) => {
      const { trade } = action.payload;
      if (trade) {
        state.currentSession.trades.push(trade);
      }
      // Session state like balance/position is updated via the sessionState event
    },
    handleTradeClosed: (state, action) => {
      const { trade, session } = action.payload;
      state.currentSession.openPosition = null;
      state.currentSession.config.currentBalance = session.currentBalance;
      state.currentSession.config.equity = session.equity;
      // Check if trade exists to update it, otherwise add it
      const existingTradeIndex = state.currentSession.trades.findIndex(t => t._id === trade._id);
      if (existingTradeIndex > -1) {
          state.currentSession.trades[existingTradeIndex] = trade;
      } else {
          state.currentSession.trades.push(trade);
      }
  },
   
    updateSessionState: (state, action) => {
        const { status, currentSimulatedTime, currentBalance, equity, currentPosition } = action.payload;
        if(status) state.currentSession.status = status;
        if(currentSimulatedTime) state.currentSession.config.currentSimulatedTime = currentSimulatedTime;
        if(currentBalance) state.currentSession.config.currentBalance = currentBalance;
        if(equity) state.currentSession.config.equity = equity;
        if(currentPosition !== undefined) state.currentSession.openPosition = currentPosition;
    },    updateSingleTradeInJournal: (state, action) => {
      const updatedTrade = action.payload;
      const index = state.currentSession.trades.findIndex(t => t._id === updatedTrade._id);
      if (index !== -1) state.currentSession.trades[index] = updatedTrade;
  }, setSessionError: (state, action) => {
    state.currentSession.status = 'error';
    state.currentSession.error = action.payload.message;
    toast.error(`Replay Error: ${action.payload.message}`);
  },
  },
  extraReducers: (builder) => {
    builder
      // List Sessions
      .addCase(fetchBacktestSessions.pending, (state, action) => {
        if (action.meta.arg.page === 1) state.sessionsList.status = 'loading';
      })
      .addCase(fetchBacktestSessions.fulfilled, (state, action) => {
        state.sessionsList.status = 'succeeded';
        if (action.payload.page === 1) {
          state.sessionsList.items = action.payload.data.results;
        } else {
          const existingIds = new Set(state.sessionsList.items.map(s => s._id));
          const newItems = action.payload.data.results.filter(s => !existingIds.has(s._id));
          state.sessionsList.items.push(...newItems);
        }
        state.sessionsList.pagination = {
          hasMore: action.payload.data.hasMore,
          currentPage: action.payload.data.page,
          totalPages: action.payload.data.totalPages,
        };
      })
      .addCase(fetchBacktestSessions.rejected, (state, action) => { state.sessionsList.status = 'failed'; state.sessionsList.error = action.payload; })
      
      // Create Session
      .addCase(createBacktestSession.pending, (state) => { state.sessionsList.status = 'loading'; })
      .addCase(createBacktestSession.fulfilled, (state, action) => {
        state.sessionsList.status = 'succeeded';
        // --- FIX for not seeing new session ---
        // Ensure the items array exists and prepend the new session.
        if (!state.sessionsList.items) state.sessionsList.items = [];
        state.sessionsList.items.unshift(action.payload);
        // --- END OF FIX ---
      })
      .addCase(createBacktestSession.rejected, (state, action) => { state.sessionsList.status = 'failed'; state.sessionsList.error = action.payload; })
      
      // Get Session Details
      .addCase(fetchSessionDetails.pending, (state) => { state.currentSession.status = 'loading'; })
      .addCase(fetchSessionDetails.fulfilled, (state, action) => {
        state.currentSession.status = 'configuring';
        state.currentSession.config = action.payload;
      })
      .addCase(fetchSessionDetails.rejected, (state, action) => {
        state.currentSession.status = 'error';
        state.currentSession.error = action.payload;
      })
      //session trades
      .addCase(fetchSessionTrades.fulfilled, (state, action) => { state.currentSession.trades = action.payload; })
      .addCase(updateBacktestTradeNotes.fulfilled, (state, action) => { backtestSlice.caseReducers.updateSingleTradeInJournal(state, action); }).addCase(uploadBacktestSnapshot.fulfilled, (state, action) => { backtestSlice.caseReducers.updateSingleTradeInJournal(state, action); }).addCase(fetchSessionResults.pending, (state) => {
        state.currentSession.results.status = 'loading';
      })
      .addCase(fetchSessionResults.fulfilled, (state, action) => {
        state.currentSession.results.status = 'succeeded';
        state.currentSession.results.data = action.payload;
      })
      .addCase(fetchSessionResults.rejected, (state, action) => {
        state.currentSession.results.status = 'failed';
        state.currentSession.results.error = action.payload;
      });
  },
});

export const {
  clearCurrentSession, setSessionReady, setSessionStatus, appendCandleData,
  handleTradeExecution, setSessionError, updateSessionState,handleTradeOpened,handleTradeClosed,resetSessionList
} = backtestSlice.actions;

export default backtestSlice.reducer;
