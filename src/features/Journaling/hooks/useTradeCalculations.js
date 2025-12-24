// frontend/src/features/Journaling/hooks/useTradeCalculations.js (NEW FILE)
import { useState, useEffect, useMemo } from 'react';

export const useTradeCalculations = (tradeData) => {
  const {
    direction,
    entryPrice: entryPriceStr,
    exitPrice: exitPriceStr,
    quantity: quantityStr,
    stopLossPrice: stopLossPriceStr,
    takeProfitPrice: takeProfitPriceStr,
    commission: commissionStr,
  } = tradeData;

  const calculatedValues = useMemo(() => {
    const entryPrice = parseFloat(entryPriceStr);
    const exitPrice = parseFloat(exitPriceStr);
    const quantity = parseFloat(quantityStr);
    const stopLossPrice = parseFloat(stopLossPriceStr);
    const takeProfitPrice = parseFloat(takeProfitPriceStr);
    const commission = parseFloat(commissionStr) || 0;

    let pnl = 0;
    let rr = 0;

    if (!isNaN(entryPrice) && !isNaN(exitPrice) && !isNaN(quantity) && quantity > 0) {
      const pnlValue = (direction === 'LONG')
        ? (exitPrice - entryPrice) * quantity
        : (entryPrice - exitPrice) * quantity;
      pnl = pnlValue - commission;
    }

    if (!isNaN(entryPrice) && !isNaN(stopLossPrice) && !isNaN(takeProfitPrice) && stopLossPrice !== entryPrice) {
      const potentialRisk = Math.abs(entryPrice - stopLossPrice);
      const potentialReward = Math.abs(takeProfitPrice - entryPrice);
      if (potentialRisk > 0) {
        rr = potentialReward / potentialRisk;
      }
    }
    return { pnl, rr };
  }, [direction, entryPriceStr, exitPriceStr, quantityStr, stopLossPriceStr, takeProfitPriceStr, commissionStr]);

  return calculatedValues;
};