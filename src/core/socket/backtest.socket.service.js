import {
  setSessionReady, setSessionStatus, appendCandleData, handleTradeExecution, setSessionError, updateSessionState
} from '@/entities/BacktestSession/model/backtestSlice';
import { toast } from 'react-toastify';

class BacktestSocketService {
  socket = null;
  dispatchActions = {};

  connect(socketInstance, dispatchActions) {
    if (this.socket || !socketInstance) return;
    this.socket = socketInstance;
    this.dispatchActions = dispatchActions;
    this.registerListeners();
  }
  
  disconnect() {
    if (this.socket) {
      this.removeListeners();
      this.socket = null;
      this.dispatchActions = {};
    }
  }

  registerListeners() {
    this.socket.on('backtest:ready', this.onSessionReady);
    this.socket.on('backtest:statusUpdate', this.onStatusUpdate);
    this.socket.on('backtest:data', this.onDataReceived);
    this.socket.on('backtest:tradeOpened', this.onTradeOpened);
    this.socket.on('backtest:tradeClosed', this.onTradeClosed);
    this.socket.on('backtest:sessionUpdate', this.onSessionStateUpdate);
    this.socket.on('backtest:ended', this.onSessionEnded);
    this.socket.on('backtest:error', this.onSessionError);
  }

  removeListeners() {
    this.socket.off('backtest:ready');
    this.socket.off('backtest:statusUpdate');
    this.socket.off('backtest:data');
    this.socket.off('backtest:tradeOpened');
    this.socket.off('backtest:tradeClosed');
    this.socket.off('backtest:sessionUpdate');
    this.socket.off('backtest:ended');
    this.socket.off('backtest:error');
  }

  // Listener Methods
  onSessionReady = (data) => this.dispatchActions.setSessionReady(data);
  onStatusUpdate = (data) => this.dispatchActions.setSessionStatus(data);
  onDataReceived = (data) => this.dispatchActions.appendCandleData(data);
  onTradeOpened = (data) => this.dispatchActions.handleTradeOpened(data);
  onTradeClosed = (data) => this.dispatchActions.handleTradeClosed(data);
  onSessionStateUpdate = (data) => this.dispatchActions.updateSessionState(data);
  onSessionEnded = (data) => {
    this.dispatchActions.setSessionStatus({ sessionId: data.sessionId, status: 'completed' });
    toast.success("Backtest session completed! View your results.");
  };
  onSessionError = (data) => this.dispatchActions.setSessionError(data);

  // Emitter Methods
  setupSession = (sessionId) => this.socket?.emit('backtest:setup', { sessionId });
  controlReplay = (sessionId, command) => this.socket?.emit('backtest:control', { sessionId, command });
  createOrder = (sessionId, tradeAction, callback) => this.socket?.emit('backtest:createOrder', { sessionId, tradeAction }, callback);
  closePosition = (sessionId, callback) => this.socket?.emit('backtest:closePosition', { sessionId }, callback);
}

const backtestSocketService = new BacktestSocketService();
export default backtestSocketService;
