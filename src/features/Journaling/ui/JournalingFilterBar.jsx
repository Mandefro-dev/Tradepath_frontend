// frontend/src/features/Journaling/ui/JournalFilterBar.jsx (NEW FILE)
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaFilter, FaSearch, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { setTradeFilters, fetchTrades, fetchTagSuggestions,fetchTradeStats } from '@/entities/Trade/model/tradesSlice';
import { Button, Input } from '@/shared/ui';
import { theme } from '@/styles/theme';
// import { useDebouncedValue } from '@/core/hooks/useDebouncedValue'; // Assume this hook exists
import useDebouncedValue from '@/core/hooks/useDebouncedValue';

const directionOptions = [ {value: '', label: 'All Directions'}, {value: 'LONG', label: 'Long'}, {value: 'SHORT', label: 'Short'} ];
const statusOptions = [ {value: '', label: 'All Statuses'}, {value: 'OPEN', label: 'Open'}, {value: 'CLOSED', label: 'Closed'} ];
const winLossOptions = [ {value: '', label: 'All Outcomes'}, {value: 'WIN', label: 'Win'}, {value: 'LOSS', label: 'Loss'}, {value: 'BREAKEVEN', label: 'Breakeven'} ];
const dateRangeOptions = [
    { value: 'all', label: 'All Time' }, { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }, { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }, { value: 'custom', label: 'Custom Range...' }
];


const JournalFilterBar = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector((state) => state.trades.filters);
  const { tagSuggestions } = useSelector((state) => state.trades);

  const [localFilters, setLocalFilters] = useState({
    symbol: currentFilters.symbol || '',
    dateRangeOption: dateRangeOptions[0], // Default to 'All Time'
    customStartDate: currentFilters.dateRange?.start ? new Date(currentFilters.dateRange.start) : null,
    customEndDate: currentFilters.dateRange?.end ? new Date(currentFilters.dateRange.end) : null,
    setupTag: currentFilters.tags?.length ? { value: currentFilters.tags[0], label: currentFilters.tags[0] } : null, // Simplified to one tag for filter bar
    winLoss: winLossOptions.find(o => o.value === currentFilters.winLoss) || winLossOptions[0],
    direction: directionOptions.find(o => o.value === currentFilters.direction) || directionOptions[0],
  });
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [tagSearchInput, setTagSearchInput] = useState('');

  const debouncedSymbol = useDebouncedValue(localFilters.symbol, 500);

  const handleFilterChange = (name, value) => {
    setLocalFilters(prev => ({ ...prev, [name]: value }));
    if (name === 'dateRangeOption' && value?.value === 'custom') {
      setShowCustomDateRange(true);
    } else if (name === 'dateRangeOption' && value?.value !== 'custom') {
      setShowCustomDateRange(false);
      // Apply date range immediately if not custom
      applyFilters({ ...localFilters, dateRangeOption: value, customStartDate: null, customEndDate: null });
    }
  };
  
  const handleTagSearchInputChange = (inputValue) => {
    setTagSearchInput(inputValue);
    if (inputValue.length > 1) dispatch(fetchTagSuggestions(inputValue));
  };

  const applyFilters = useCallback((filtersToApply = localFilters) => {
    const finalFilters = {
      symbol: filtersToApply.symbol.trim(),
      tags: filtersToApply.setupTag ? [filtersToApply.setupTag.value] : [],
      winLoss: filtersToApply.winLoss?.value || '',
      direction: filtersToApply.direction?.value || '',
      dateRange: { start: null, end: null },
    };

    if (filtersToApply.dateRangeOption?.value !== 'all' && filtersToApply.dateRangeOption?.value !== 'custom') {
        const now = new Date();
        let startDate = new Date();
        switch (filtersToApply.dateRangeOption.value) {
            case '7d': startDate.setDate(now.getDate() - 7); break;
            case '30d': startDate.setMonth(now.getMonth() - 1); break;
            case '90d': startDate.setMonth(now.getMonth() - 3); break;
            case '1y': startDate.setFullYear(now.getFullYear() - 1); break;
            default: startDate = null;
        }
        finalFilters.dateRange.start = startDate ? startDate.toISOString().split('T')[0] : null;
        finalFilters.dateRange.end = now.toISOString().split('T')[0];
    } else if (filtersToApply.dateRangeOption?.value === 'custom' && filtersToApply.customStartDate && filtersToApply.customEndDate) {
        finalFilters.dateRange.start = filtersToApply.customStartDate.toISOString().split('T')[0];
        finalFilters.dateRange.end = filtersToApply.customEndDate.toISOString().split('T')[0];
    }
    
    dispatch(setTradeFilters(finalFilters));
    dispatch(fetchTrades({ page: 1, filters: finalFilters }));
    dispatch(fetchTradeStats(finalFilters)); // Also update stats
  }, [dispatch, localFilters]); // Added localFilters to dependency array

  // Apply symbol filter when debounced value changes
  useEffect(() => {
    if (debouncedSymbol !== currentFilters.symbol) {
        applyFilters({...localFilters, symbol: debouncedSymbol});
    }
  }, [debouncedSymbol, applyFilters, currentFilters.symbol, localFilters]);


  const resetFilters = () => {
    const initialFilterState = {
        symbol: '', dateRangeOption: dateRangeOptions[0], customStartDate: null, customEndDate: null,
        setupTag: null, winLoss: winLossOptions[0], direction: directionOptions[0],
    };
    setLocalFilters(initialFilterState);
    setShowCustomDateRange(false);
    dispatch(setTradeFilters({ symbol: '', dateRange: {start: null, end: null}, tags: [], winLoss: '', direction: '' }));
    dispatch(fetchTrades({ page: 1, filters: {} }));
    dispatch(fetchTradeStats({}));
  };

  // Inline Styles
  const barStyle = { display: 'flex', flexWrap: 'wrap', gap: `${theme.spacing.md}px`, alignItems: 'center', padding: `${theme.spacing.md}px`, backgroundColor: theme.surfaceLight, borderRadius: theme.borderRadiusLg, marginBottom: theme.spacing.lg, boxShadow: theme.shadowSubtle };
  const filterGroupStyle = { display: 'flex', flexDirection: 'column', minWidth: '180px', flexGrow: 1 };
  const labelStyle = { fontSize: theme.fontSizeSm, color: theme.textMuted, marginBottom: `${theme.spacing.xs}px`, fontWeight: theme.fontWeightMedium };
  const selectCustomStyles = {
    control: (base, state) => ({ ...base, backgroundColor: theme.backgroundAlt, minHeight: '38px', height:'38px', borderColor: state.isFocused ? theme.primary : theme.border, boxShadow: state.isFocused ? theme.shadowFocus(theme.primaryRGB) : 'none', '&:hover': { borderColor: theme.primary }, fontSize: '0.9rem' }),
    menu: base => ({ ...base, backgroundColor: theme.backgroundAlt, zIndex: theme.zIndexDropdown }),
    option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? theme.primary : state.isFocused ? theme.surface : theme.backgroundAlt, color: state.isSelected ? theme.textOnPrimary : theme.textPrimary, '&:active': { backgroundColor: theme.primary }, fontSize: '0.9rem' }),
    singleValue: base => ({ ...base, color: theme.textPrimary }), input: base => ({ ...base, color: theme.textPrimary }),
    placeholder: base => ({...base, color: theme.textMuted, fontSize: '0.9rem'})
  };
  const datePickerInputStyle = { width: '100%', backgroundColor: theme.backgroundAlt, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusMd, padding: `${theme.spacing.sm -1}px ${theme.spacing.md}px`, color: theme.textPrimary, fontSize: '0.9rem', height: '38px' };


  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={barStyle}>
      <div style={filterGroupStyle}>
        <label style={labelStyle} htmlFor="symbol-filter">Symbol</label>
        <Input type="text" id="symbol-filter" placeholder="e.g., BTC/USDT" value={localFilters.symbol} onChange={(e) => handleFilterChange('symbol', e.target.value)} style={{height: '38px', fontSize: '0.9rem'}} leftIcon={<FaSearch style={{color: theme.textMuted}}/>}/>
      </div>
      <div style={filterGroupStyle}>
        <label style={labelStyle} htmlFor="dateRange-filter">Date Range</label>
        <Select id="dateRange-filter" options={dateRangeOptions} value={localFilters.dateRangeOption} onChange={(val) => handleFilterChange('dateRangeOption', val)} styles={selectCustomStyles} />
      </div>
      {showCustomDateRange && (
        <>
          <div style={filterGroupStyle}>
            <label style={labelStyle} htmlFor="startDate-filter">Start Date</label>
            <DatePicker selected={localFilters.customStartDate} onChange={(date) => handleFilterChange('customStartDate', date)} selectsStart startDate={localFilters.customStartDate} endDate={localFilters.customEndDate} wrapperClassName="w-full" popperPlacement="bottom-start" customInput={<Input style={datePickerInputStyle} leftIcon={<FaCalendarAlt/>}/>} />
          </div>
          <div style={filterGroupStyle}>
            <label style={labelStyle} htmlFor="endDate-filter">End Date</label>
            <DatePicker selected={localFilters.customEndDate} onChange={(date) => handleFilterChange('customEndDate', date)} selectsEnd startDate={localFilters.customStartDate} endDate={localFilters.customEndDate} minDate={localFilters.customStartDate} wrapperClassName="w-full" popperPlacement="bottom-start" customInput={<Input style={datePickerInputStyle} leftIcon={<FaCalendarAlt/>}/>} />
          </div>
        </>
      )}
      <div style={filterGroupStyle}>
        <label style={labelStyle} htmlFor="tag-filter">Setup Tag</label>
        <Select id="tag-filter" options={tagSuggestions.map(t => ({value: t.tag, label: t.tag}))} value={localFilters.setupTag} onChange={(val) => handleFilterChange('setupTag', val)} onInputChange={handleTagSearchInputChange} styles={selectCustomStyles} isClearable placeholder="Filter by tag..."/>
      </div>
      <div style={filterGroupStyle}>
        <label style={labelStyle} htmlFor="winLoss-filter">Outcome</label>
        <Select id="winLoss-filter" options={winLossOptions} value={localFilters.winLoss} onChange={(val) => handleFilterChange('winLoss', val)} styles={selectCustomStyles} />
      </div>
      <div style={filterGroupStyle}>
        <label style={labelStyle} htmlFor="direction-filter">Direction</label>
        <Select id="direction-filter" options={directionOptions} value={localFilters.direction} onChange={(val) => handleFilterChange('direction', val)} styles={selectCustomStyles} />
      </div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: theme.spacing.sm}}>
        <Button variant="primary" onClick={() => applyFilters()} size="md" style={{height: '38px'}}>
            <FaFilter style={{marginRight: theme.spacing.sm}}/> Apply
        </Button>
        <Button variant="secondary" onClick={resetFilters} size="md" style={{height: '38px'}}>
            <FaTimes style={{marginRight: theme.spacing.sm}}/> Reset
        </Button>
      </div>
      <style>{`.react-datepicker-wrapper { width: 100%; }`}</style>
    </motion.div>
  );
};
export default JournalFilterBar;
