import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { theme } from '@/styles/theme';
import { format } from 'date-fns';

const CustomRechartsTooltip = ({ active, payload, label }) => { /* ... from previous response ... */ };

const PIE_COLORS = [theme.success, theme.error, theme.textMuted];

export const EquityCurveChart = ({ data, initialBalance }) => {
  const chartContainerStyle = { backgroundColor: theme.backgroundAlt, padding: theme.spacing.lg, borderRadius: theme.borderRadiusXl, boxShadow: theme.shadowCard, border: `1px solid ${theme.border}`, minHeight: '400px' };
  const chartTitleStyle = { fontSize: '1.2rem', fontWeight: theme.fontWeightSemibold, color: theme.textPrimary, marginBottom: theme.spacing.lg };
  const isPositiveGrowth = data.length > 1 ? data[data.length - 1].equity >= initialBalance : true;
  const strokeColor = isPositiveGrowth ? theme.success : theme.error;

  return (
    <div style={chartContainerStyle}>
      <h3 style={chartTitleStyle}>Equity Curve</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <defs><linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.05}/>
            </linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
            <XAxis dataKey="timestamp" stroke={theme.textMuted} fontSize={theme.fontSizeSm} tick={{fill: theme.textMuted}} tickFormatter={(ts) => format(new Date(ts), 'MMM dd')} />
            <YAxis stroke={theme.textMuted} fontSize={theme.fontSizeSm} tickFormatter={(value) => `$${Math.round(value)}`} tick={{fill: theme.textMuted}} domain={['dataMin', 'dataMax']}/>
            <RechartsTooltip content={<CustomRechartsTooltip />} />
            <Area type="monotone" dataKey="equity" stroke={strokeColor} fill="url(#equityGradient)" strokeWidth={2} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const WinLossPieChart = ({ wins, losses, breakevens }) => {
    const data = [
      { name: 'Wins', value: wins || 0 },
      { name: 'Losses', value: losses || 0 },
      { name: 'Breakeven', value: breakevens || 0 },
    ].filter(item => item.value > 0);
  
    if (data.length === 0) return null;

    const chartContainerStyle = { /* ... similar to EquityCurveChart ... */ };
    const chartTitleStyle = { /* ... */ };

    return (
        <div style={chartContainerStyle}>
            <h3 style={chartTitleStyle}>Trade Outcomes</h3>
            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke={theme.backgroundAlt} />))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => [`${value} trades`]} />
                    <Legend wrapperStyle={{fontSize: theme.fontSizeSm, paddingTop: '15px'}}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};