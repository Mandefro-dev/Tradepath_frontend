import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBacktestSession } from '@/entities/BacktestSession/model/backtestSlice';
import { Button, Input, Form, FormGroup, FormLabel,  } from '@/shared/ui';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { theme } from '@/styles/theme';
import { toast } from 'react-toastify';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/shared/ui/modal/Modal';

export const BacktestConfigurationForm = ({ isOpen, onClose, onSessionCreated }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.backtest.sessionsList);
  const [formData, setFormData] = useState({
    name: '',
    symbol: 'BTC/USDT',
    timeframe: '1h',
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate: new Date(),
    initialBalance: 10000,
    settings: {
        commissionPercent: 0.04,
        slippagePercent: 0.01,
    }
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'commissionPercent' || name === 'slippagePercent') {
      setFormData(prev => ({...prev, settings: { ...prev.settings, [name]: Number(value) }}));
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'initialBalance' ? Number(value) : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.symbol || !formData.timeframe || !formData.startDate || !formData.endDate || !formData.initialBalance) { toast.error("All required fields must be filled."); return; }
    if (formData.startDate >= formData.endDate) { toast.error("Start Date must be before End Date."); return; }
    try {
      const payload = { ...formData, symbol: formData.symbol.toUpperCase().replace(/[^A-Z0-9/]/g, '') };
      const resultAction = await dispatch(createBacktestSession(payload)).unwrap();
      onSessionCreated(resultAction);
    } catch (err) {
      console.log(err)
    }
  };

  const formStyle = { display: 'flex', flexDirection: 'column', gap: theme.spacing.lg };
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure New Backtest">
      <Form onSubmit={handleSubmit} style={formStyle}>
        <FormGroup><FormLabel>Session Name (Optional)</FormLabel><Input name="name" value={formData.name} onChange={handleChange} placeholder={`e.g., My ETH Scalping Strategy`} /></FormGroup>
        <div style={gridStyle}>
          <FormGroup><FormLabel>Symbol</FormLabel><Input name="symbol" value={formData.symbol} onChange={handleChange} /></FormGroup>
          <FormGroup><FormLabel>Timeframe</FormLabel><Input name="timeframe" value={formData.timeframe} onChange={handleChange} placeholder="e.g., 1m, 1h, 1d" /></FormGroup>
        </div>
        <div style={gridStyle}>
          <FormGroup><FormLabel>Start Date</FormLabel><DatePicker selected={formData.startDate} onChange={date => setFormData({...formData, startDate: date})} wrapperClassName="datepicker-wrapper-inline" dateFormat="yyyy-MM-dd" /></FormGroup>
          <FormGroup><FormLabel>End Date</FormLabel><DatePicker selected={formData.endDate} onChange={date => setFormData({...formData, endDate: date})} wrapperClassName="datepicker-wrapper-inline" dateFormat="yyyy-MM-dd" minDate={formData.startDate} /></FormGroup>
        </div>
        <FormGroup><FormLabel>Initial Balance ($)</FormLabel><Input type="number" name="initialBalance" value={formData.initialBalance} onChange={handleChange} /></FormGroup>
        
        <div style={{marginTop: theme.spacing.sm}}>
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} style={{background:'none', border:'none', color: theme.textSecondary, cursor:'pointer', display:'flex', alignItems:'center', gap: theme.spacing.sm, fontSize: theme.fontSizeSm}}>
                Advanced Settings <motion.span animate={{ rotate: showAdvanced ? 180 : 0 }}><FaChevronDown /></motion.span>
            </button>
        </div>

        <AnimatePresence>
        {showAdvanced && (
            <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} style={{overflow:'hidden'}}>
                <div style={{...gridStyle, paddingTop: theme.spacing.md}}>
                    <FormGroup><FormLabel>Commission (%)</FormLabel><Input type="number" name="commissionPercent" value={formData.settings.commissionPercent} onChange={handleChange} step="0.01"/></FormGroup>
                    <FormGroup><FormLabel>Slippage (%)</FormLabel><Input type="number" name="slippagePercent" value={formData.settings.slippagePercent} onChange={handleChange} step="0.01" /></FormGroup>
                </div>
            </motion.div>
        )}
        </AnimatePresence>

        <div style={{display:'flex', justifyContent:'flex-end', gap: theme.spacing.md, marginTop: theme.spacing.md, paddingTop: theme.spacing.md, borderTop: `1px solid ${theme.border}`}}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={status === 'loading'}>Create & Launch</Button>
        </div>
      </Form>
    </Modal>
  );
};