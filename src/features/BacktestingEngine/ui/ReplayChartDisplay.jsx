// File: frontend/src/features/BacktestingEngine/ui/ReplayChartDisplay.jsx (REWRITTEN & FINALIZED)
import React, { useMemo } from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  OHLCTooltip,
  SingleValueTooltip,
  LineSeries // For position lines
} from 'react-financial-charts';
import { theme } from '@/styles/theme';

export const ReplayChartDisplay = ({ initialCandles, candles, openPosition, executedTrades }) => {


  // Memoize data formatting to prevent re-computation on every render
  const { initialData, fullData, xAccessor, xExtents } = useMemo(() => {
    const combinedData = [...(initialCandles || []), ...(candles || [])]
      .map(d => ({
        ...d,
        date: new Date(d.time * 1000),
      }));
  
    // Remove duplicates
    const uniqueData = Array.from(new Map(combinedData.map(item => [item.time, item])).values());
    uniqueData.sort((a, b) => a.date - b.date);
  
    // ✅ Avoid crashing if data is empty
    if (uniqueData.length === 0) {
      return {
        initialData: [],
        fullData: [],
        xAccessor: () => null,
        xExtents: [0, 1],
      };
    }
  
    const accessor = d => d.date;
    const extents = [accessor(uniqueData[0]), accessor(uniqueData[uniqueData.length - 1])];
  
    return {
      initialData: uniqueData,
      fullData: uniqueData,
      xAccessor: accessor,
      xExtents: extents,
    };
  }, [initialCandles, candles]);
  
  if (!initialCandles || initialCandles.length === 0) {
    return <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color: theme.textMuted}}>Waiting for data...</div>;
  }
  const yGrid = {
    innerTickSize: -window.innerWidth, // Full width grid lines
    tickStrokeDasharray: 'ShortDash',
    tickStrokeOpacity: 0.2,
    tickStroke: theme.textMuted,
  };
  const xGrid = { ...yGrid };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartCanvas
        height={500} // This will be overridden by container height
        ratio={window.devicePixelRatio}
        width={1000} // This will be overridden by container width
        margin={{ left: 10, right: 70, top: 10, bottom: 30 }}
        data={fullData}
        xAccessor={xAccessor}
        xScaleProvider={(data) => data.map(d => d.date)}
        xExtents={xExtents}
        seriesName="BTC/USDT" // Example
      >
        <Chart id={1} yExtents={(d) => [d.high, d.low]}>
          <XAxis axisAt="bottom" orient="bottom" ticks={6} stroke={theme.border} tickStroke={theme.textMuted} />
          <YAxis axisAt="right" orient="right" ticks={5} stroke={theme.border} tickStroke={theme.textMuted} />
          
          <MouseCoordinateY at="right" orient="right" displayFormat={format(".4f")} />
          <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat("%Y-%m-%d %H:%M")} />

          <CandlestickSeries
            stroke={d => (d.close > d.open ? theme.success : theme.error)}
            wickStroke={d => (d.close > d.open ? theme.success : theme.error)}
            fill={d => (d.close > d.open ? theme.success : theme.error)}
          />
          
          {/* Draw Open Position Lines */}
          {openPosition && (
            <>
              <LineSeries yAccessor={() => openPosition.entryPrice} stroke={theme.primary} strokeDasharray="ShortDash" strokeWidth={1.5} />
              <EdgeIndicator itemType="last" orient="right" edgeAt="right" yAccessor={() => openPosition.entryPrice} fill={theme.primary} textFill="white" displayFormat={format(".4f")} />
              
              {openPosition.intendedSL && <>
                <LineSeries yAccessor={() => openPosition.intendedSL} stroke={theme.error} strokeDasharray="Dot" strokeWidth={2} />
                <EdgeIndicator itemType="last" orient="right" edgeAt="right" yAccessor={() => openPosition.intendedSL} fill={theme.error} textFill="white" displayFormat={format(".4f")} />
              </>}
              {openPosition.intendedTP && <>
                <LineSeries yAccessor={() => openPosition.intendedTP} stroke={theme.success} strokeDasharray="Dot" strokeWidth={2} />
                <EdgeIndicator itemType="last" orient="right" edgeAt="right" yAccessor={() => openPosition.intendedTP} fill={theme.success} textFill="white" displayFormat={format(".4f")} />
              </>}
            </>
          )}
          
          <OHLCTooltip origin={[-40, 0]} textFill={theme.textSecondary} labelFill={theme.surface}/>
        </Chart>
        <CrossHairCursor stroke={theme.textMuted} />
      </ChartCanvas>
    </div>
  );
};