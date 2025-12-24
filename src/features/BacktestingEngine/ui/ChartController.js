// File: frontend/src/features/BacktestingEngine/ui/ChartController.js (NEW FILE)
// This class encapsulates all direct interaction with the lightweight-charts library.
import { createChart, LineStyle } from 'lightweight-charts';

export class ChartController {
  constructor(container, theme) {
    if (!container) return;

    this.chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: { 
        backgroundColor: theme.backgroundAlt, 
        textColor: theme.textSecondary,
        fontFamily: theme.fontFamilySans,
      },
      grid: { vertLines: { color: theme.border }, horzLines: { color: theme.border } },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: theme.border },
      rightPriceScale: { borderColor: theme.border },
      crosshair: { mode: 0 },
    });

    this.series = this.chart.addCandlestickSeries({
      upColor: theme.success,
      downColor: theme.error,
      borderVisible: false,
      wickUpColor: theme.success,
      wickDownColor: theme.error,
    });

    this.positionLines = {}; // To keep track of entry/sl/tp lines
  }

  updateData(candles) {
    if (!this.series || !candles) return;
    this.series.setData(candles);
  }

  updateCandle(candle) {
    if (!this.series || !candle) return;
    this.series.update(candle);
  }

  updateMarkers(trades) {
    if (!this.series || !trades) return;
    const markers = trades.flatMap(trade => [
      { time: new Date(trade.entryTime).getTime() / 1000, position: 'belowBar', color: trade.direction === 'LONG' ? '#28a745' : '#dc3545', shape: 'arrowUp', text: `Entry @ ${trade.entryPrice.toFixed(4)}` },
      ...(trade.exitTime ? [{ time: new Date(trade.exitTime).getTime() / 1000, position: 'aboveBar', color: '#6c757d', shape: 'arrowDown', text: `Exit @ ${trade.exitPrice.toFixed(4)}` }] : [])
    ]);
    this.series.setMarkers(markers);
  }

  updatePositionLines(position, theme) {
    if (!this.series) return;
    
    // Clear previous lines
    Object.values(this.positionLines).forEach(line => this.series.removePriceLine(line));
    this.positionLines = {};

    if (position) {
      this.positionLines.entry = this.series.createPriceLine({ price: position.entryPrice, color: theme.primary, lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: 'ENTRY' });
      if (position.intendedSL) {
        this.positionLines.sl = this.series.createPriceLine({ price: position.intendedSL, color: theme.error, lineWidth: 1, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: 'SL' });
      }
      if (position.intendedTP) {
        this.positionLines.tp = this.series.createPriceLine({ price: position.intendedTP, color: theme.success, lineWidth: 1, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: 'TP' });
      }
    }
  }

  resize(width, height) {
    if (!this.chart) return;
    this.chart.resize(width, height);
  }

  destroy() {
    if (!this.chart) return;
    this.chart.remove();
    this.chart = null;
    this.series = null;
    this.positionLines = {};
  }
}