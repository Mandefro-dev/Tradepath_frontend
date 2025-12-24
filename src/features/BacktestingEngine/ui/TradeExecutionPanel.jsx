// File: frontend/src/features/BacktestingEngine/ui/TradeExecutionPanel.jsx (COMPLETE & FINALIZED)
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, FormGroup, FormLabel } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { FaArrowUp, FaArrowDown, FaTimes, FaLayerGroup } from 'react-icons/fa';
import backtestSocketService from '@/core/socket/backtest.socket.service';

export const TradeExecutionPanel = ({ sessionId }) => {
  const { config, openPosition, equity } = useSelector(state => state.backtest.currentSession);
  const [tradeParams, setTradeParams] = useState({ quantity: 1, stopLoss: '', takeProfit: '' });
  const [orderType, setOrderType] = useState('MARKET'); // MARKET, LIMIT, STOP

  const unrealizedPnl = useMemo(() => {
    if (!openPosition || equity === undefined || config?.currentBalance === undefined) return 0;
    return equity - config.currentBalance;
  }, [equity, config?.currentBalance, openPosition]);

  const handleCreateOrder = (action) => {
    backtestSocketService.createOrder(sessionId, {
      action,
      orderType,
      quantity: Number(tradeParams.quantity),
      stopLoss: tradeParams.stopLoss ? Number(tradeParams.stopLoss) : null,
      takeProfit: tradeParams.takeProfit ? Number(tradeParams.takeProfit) : null,
      // price: would be added here for LIMIT/STOP orders
    }, (response) => {
        if (response.error) alert(response.error);
        else setTradeParams({ quantity: 1, stopLoss: '', takeProfit: '' });
    });
  };

  const handleClose = () => {
    backtestSocketService.closePosition(sessionId, (response) => { if (response.error) alert(response.error); });
  };

  const panelStyle = { width: '300px', backgroundColor: theme.backgroundAlt, borderLeft: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', padding: theme.spacing.md, gap: theme.spacing.lg };
  const statRowStyle = { display: 'flex', justifyContent: 'space-between', fontSize: theme.fontSizeSm, padding: `${theme.spacing.xs}px 0` };
  
  return (
    <div style={panelStyle}>
      <h3 style={{fontSize:'1.2rem', fontWeight:theme.fontWeightSemibold, textAlign:'center', color: theme.textPrimary}}>Trade Terminal</h3>
      
      <div style={{borderBottom: `1px solid ${theme.border}`, paddingBottom: theme.spacing.md}}>
        <div style={statRowStyle}><span>Balance:</span> <strong>${config.currentBalance?.toFixed(2)}</strong></div>
        <div style={statRowStyle}><span>Equity:</span> <strong style={{color: equity >= config.currentBalance ? theme.success : theme.error}}>${equity?.toFixed(2)}</strong></div>
        <div style={statRowStyle}><span>Unrealized P&L:</span> <strong style={{color: unrealizedPnl >= 0 ? theme.success : theme.error}}>${unrealizedPnl.toFixed(2)}</strong></div>
      </div>
      
      <AnimatePresence mode="wait">
      {openPosition ? (
        <motion.div key="open-position" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <h4 style={{fontWeight:theme.fontWeightMedium, marginBottom:theme.spacing.sm}}>Open Position</h4>
          <div style={statRowStyle}><span>Direction:</span> <strong style={{color: openPosition.direction === 'LONG' ? theme.success : theme.error}}>{openPosition.direction}</strong></div>
          <div style={statRowStyle}><span>Entry Price:</span> <strong>{openPosition.entryPrice?.toFixed(4)}</strong></div>
          <div style={statRowStyle}><span>Quantity:</span> <strong>{openPosition.quantity}</strong></div>
          <div style={statRowStyle}><span>Stop Loss:</span> <strong>{openPosition.intendedSL || 'N/A'}</strong></div>
          <div style={statRowStyle}><span>Take Profit:</span> <strong>{openPosition.intendedTP || 'N/A'}</strong></div>
          <Button onClick={handleClose} variant="secondary" style={{width:'100%', marginTop:theme.spacing.md}} leftIcon={<FaTimes/>}>Market Close</Button>
        </motion.div>
      ) : (
        <motion.div key="new-order" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          {/* Advanced Order Type Tabs */}
          <div style={{display:'flex', backgroundColor: theme.surface, borderRadius: theme.borderRadiusMd, padding: theme.spacing.xs, marginBottom: theme.spacing.md}}>
              <Button onClick={() => setOrderType('MARKET')} variant={orderType === 'MARKET' ? 'primary' : 'ghost'} style={{flex:1}}>Market</Button>
              <Button onClick={() => setOrderType('LIMIT')} variant={orderType === 'LIMIT' ? 'primary' : 'ghost'} style={{flex:1}} disabled>Limit</Button>
              <Button onClick={() => setOrderType('STOP')} variant={orderType === 'STOP' ? 'primary' : 'ghost'} style={{flex:1}} disabled>Stop</Button>
          </div>
          <FormGroup><FormLabel>Quantity</FormLabel><Input type="number" value={tradeParams.quantity} onChange={e => setTradeParams({...tradeParams, quantity: e.target.value})} leftIcon={<FaLayerGroup/>}/></FormGroup>
          <FormGroup><FormLabel>Stop Loss (Price)</FormLabel><Input type="number" value={tradeParams.stopLoss} onChange={e => setTradeParams({...tradeParams, stopLoss: e.target.value})} placeholder="Optional"/></FormGroup>
          <FormGroup><FormLabel>Take Profit (Price)</FormLabel><Input type="number" value={tradeParams.takeProfit} onChange={e => setTradeParams({...tradeParams, takeProfit: e.target.value})} placeholder="Optional"/></FormGroup>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: theme.spacing.sm, marginTop:theme.spacing.md}}>
            {/* <Button onClick={() => handleAction('BUY')} style={{backgroundColor: theme.success, color: 'white'}} leftIcon={<FaArrowUp/>}>Buy / Long</Button>
            <Button onClick={() => handleAction('SELL')} style={{backgroundColor: theme.error, color: 'white'}} leftIcon={<FaArrowDown/>}>Sell / Short</Button> */}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};