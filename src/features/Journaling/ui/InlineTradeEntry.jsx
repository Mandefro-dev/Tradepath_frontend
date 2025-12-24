import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSave, FaTimesCircle, FaImage, FaCalendarAlt, FaDollarSign, FaHashtag,
  FaArrowUp, FaArrowDown, FaStickyNote, FaNewspaper, FaExclamationTriangle, FaQuestionCircle,
  FaPercentage, FaCog, FaBrain, FaSmile, FaMeh, FaFrown, FaHourglassHalf, FaBalanceScale, FaPlusCircle,
  FaChevronDown, FaChevronUp, FaInfoCircle, FaBolt, FaPenNib
} from 'react-icons/fa';
import { createTrade, updateTrade, fetchTagSuggestions, uploadTradeScreenshot, fetchTradeStats } from '@/entities/Trade/model/tradesSlice';
import { Button, Input, Form, FormGroup, FormLabel } from '@/shared/ui';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

// Functionality-preserving hooks and constants
import { useTradeCalculations } from '../hooks/useTradeCalculations';

const emotionOptions = [
  { value: 'Excited', label: <div className="flex items-center gap-2 text-emerald-400"><FaSmile /> Excited</div> },
  { value: 'Confident', label: <div className="flex items-center gap-2 text-blue-400"><FaSmile /> Confident</div> },
  { value: 'Focused', label: <div className="flex items-center gap-2 text-purple-400"><FaBrain /> Focused</div> },
  { value: 'Neutral', label: <div className="flex items-center gap-2 text-slate-400"><FaMeh /> Neutral</div> },
  { value: 'Anxious', label: <div className="flex items-center gap-2 text-amber-400"><FaFrown /> Anxious</div> },
  { value: 'Frustrated', label: <div className="flex items-center gap-2 text-rose-400"><FaFrown /> Frustrated</div> },
  { value: 'FOMO', label: <div className="flex items-center gap-2 text-orange-400"><FaExclamationTriangle /> FOMO</div> },
  { value: 'Tired', label: <div className="flex items-center gap-2 text-gray-500"><FaHourglassHalf /> Tired</div> },
];

const confidenceOptions = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `${i + 1}/10` }));

const tradeTypeOptions = [
  { value: 'SWING', label: 'Swing Trade' }, { value: 'DAY', label: 'Day Trade' },
  { value: 'SCALP', label: 'Scalp' }, { value: 'POSITION', label: 'Position Trade' }
];

const tradingSessionOptions = [
  { value: 'LONDON', label: 'London' }, { value: 'NEW_YORK', label: 'New York' },
  { value: 'TOKYO', label: 'Tokyo' }, { value: 'SYDNEY', label: 'Sydney' }, { value: 'OVERLAP', label: 'Overlap' }
];

const directionOptions = [
  { value: 'LONG', label: <div className="flex items-center gap-2 text-emerald-400"><FaArrowUp /> Long</div> },
  { value: 'SHORT', label: <div className="flex items-center gap-2 text-rose-400"><FaArrowDown /> Short</div> }
];

const initialTradeState = {
  symbol: '', direction: directionOptions[0], entryTime: new Date(), exitTime: null,
  entryPrice: '', exitPrice: '', quantity: '',
  stopLossPrice: '', takeProfitPrice: '', stopLossPips: null, takeProfitPips: null,
  commission: '0.0', setupTags: [], notes: '',
  emotionEntry: null, confidenceLevelEntry: null, emotionExit: null, confidenceLevelExit: null,
  preTradeScreenshotFile: null, postTradeScreenshotFile: null,
  preTradeScreenshotUrl: '', postTradeScreenshotUrl: '',
  entryConfirmation: '', exitReason: '', newsImpact: '', mistakesMade: '', marketConditions: '',
  tradeType: null, tradingSession: null, partialProfitTaken: false,
};

const InlineTradeEntry = ({ onTradeLogged, existingTradeData, onCancelEdit }) => {
  const dispatch = useDispatch();
  const [tradeData, setTradeData] = useState(initialTradeState);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');
  const { tagSuggestions, status: tradeOpStatus } = useSelector((state) => state.trades || { tagSuggestions: [], status: 'idle' });

  const { pnl: calculatedPnl, rr: calculatedRr } = useTradeCalculations(tradeData);

  const [prePreview, setPrePreview] = useState('');
  const [postPreview, setPostPreview] = useState('');
  const isEditing = !!existingTradeData?._id;

  // Sync state on edit
  useEffect(() => {
    if (isEditing && existingTradeData) {
      const populatedData = { ...initialTradeState };
      for (const key in existingTradeData) {
        if (Object.prototype.hasOwnProperty.call(existingTradeData, key) && key in populatedData) {
          if ((key === 'entryTime' || key === 'exitTime') && existingTradeData[key]) {
            populatedData[key] = new Date(existingTradeData[key]);
          } else if (key === 'setupTags' && existingTradeData[key]) {
            populatedData[key] = existingTradeData[key].map(tag => ({ label: tag, value: tag }));
          } else if (key === 'direction' && existingTradeData[key]) {
            populatedData[key] = directionOptions.find(opt => opt.value === existingTradeData[key]) || null;
          } else if (key === 'emotionEntry' || key === 'emotionExit') {
            populatedData[key] = emotionOptions.find(opt => opt.value === existingTradeData[key]) || null;
          } else if (key === 'confidenceLevelEntry' || key === 'confidenceLevelExit') {
            populatedData[key] = confidenceOptions.find(opt => opt.value === existingTradeData[key]) || null;
          } else if (key === 'tradeType') {
            populatedData[key] = tradeTypeOptions.find(opt => opt.value === existingTradeData[key]) || null;
          } else if (key === 'tradingSession') {
            populatedData[key] = tradingSessionOptions.find(opt => opt.value === existingTradeData[key]) || null;
          } else {
            populatedData[key] = existingTradeData[key] ?? initialTradeState[key];
          }
        }
      }
      setTradeData(populatedData);
      setPrePreview(existingTradeData.preTradeScreenshotUrl || '');
      setPostPreview(existingTradeData.postTradeScreenshotUrl || '');
      setIsExpanded(true);
    } else {
      setTradeData(initialTradeState);
      setPrePreview(''); setPostPreview('');
      setIsExpanded(false);
    }
  }, [existingTradeData, isEditing]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
     const numericFields = [
    'entryPrice',
    'exitPrice',
    'quantity',
    'commission',
    'stopLossPips',
    'takeProfitPips',
  ];
  setTradeData(prev => ({
    ...prev,
    [name]:
      type === 'checkbox'
        ? checked
        : numericFields.includes(name)
        ? value === '' ? null : Number(value)
        : value
  }));
  };


  const handleSelectChange = (name, selectedOption) => setTradeData(prev => ({ ...prev, [name]: selectedOption }));
  const handleDateChange = (name, date) => setTradeData(prev => ({ ...prev, [name]: date }));
  const handleTagInputChange = (inputValue) => {
    setTagInputValue(inputValue);
    if (inputValue.length > 1) dispatch(fetchTagSuggestions(inputValue));
  };

  const handleScreenshotChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error("File exceeds 5MB."); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTradeData(prev => ({ ...prev, [type === 'pre' ? 'preTradeScreenshotFile' : 'postTradeScreenshotFile']: file }));
        if (type === 'pre') setPrePreview(reader.result); else setPostPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tradeData.symbol || !tradeData.entryPrice || !tradeData.quantity) {
      toast.error('Required fields missing.');
      return;
    }
    const payload = {
      ...tradeData,
      direction: tradeData.direction?.value,
      setupTags: tradeData.setupTags.map(tag => tag.value),
      emotionEntry: tradeData.emotionEntry?.value,
      confidenceLevelEntry: tradeData.confidenceLevelEntry?.value,
      emotionExit: tradeData.emotionExit?.value,
      confidenceLevelExit: tradeData.confidenceLevelExit?.value,
      tradeType: tradeData.tradeType?.value,
      tradingSession: tradeData.tradingSession?.value,
      entryPrice: parseFloat(tradeData.entryPrice),
      exitPrice: tradeData.exitPrice ? parseFloat(tradeData.exitPrice) : null,
      quantity: parseFloat(tradeData.quantity),
      commission: parseFloat(tradeData.commission) || 0,
    };
    
    try {
      const action = isEditing ? updateTrade({ tradeId: existingTradeData._id, tradeData: payload }) : createTrade(payload);
      const savedTrade = await dispatch(action).unwrap();
      
      if (tradeData.preTradeScreenshotFile) await dispatch(uploadTradeScreenshot({ tradeId: savedTrade._id, type: 'pre', file: tradeData.preTradeScreenshotFile })).unwrap();
      if (tradeData.postTradeScreenshotFile) await dispatch(uploadTradeScreenshot({ tradeId: savedTrade._id, type: 'post', file: tradeData.postTradeScreenshotFile })).unwrap();
      
      toast.success(isEditing ? 'Journal entry updated' : 'Trade journey started!');
      if (!isEditing) setTradeData(initialTradeState);
      if (onTradeLogged) onTradeLogged(savedTrade);
      if (onCancelEdit && isEditing) onCancelEdit();
    } catch (err) { console.error(err); }
  };

  // Modern Select Styles
  const selectStyles = useMemo(() => ({
    control: (base, state) => ({
      ...base,
      backgroundColor: 'rgba(30, 41, 59, 0.4)',
      borderColor: state.isFocused ? '#3b82f6' : 'rgba(71, 85, 105, 0.4)',
      backdropFilter: 'blur(12px)',
      borderRadius: '0.75rem',
      padding: '2px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
      '&:hover': { borderColor: '#475569' }
    }),
    menu: base => ({ ...base, backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem' }),
    option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#1e293b' : 'transparent', color: '#f8fafc' }),
    singleValue: base => ({ ...base, color: '#f8fafc' }),
    multiValue: base => ({ ...base, backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '4px' }),
    multiValueLabel: base => ({ ...base, color: '#60a5fa' }),
    multiValueRemove: base => ({ ...base, color: '#60a5fa', '&:hover': { backgroundColor: '#3b82f6', color: 'white' } }),
  }), []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20"
    >
      <div className="bg-[#0b0f1a]/80 backdrop-blur-3xl rounded-[23px] p-6 lg:p-8 border border-white/5">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              {isEditing ? <FaPenNib className="text-xl" /> : <FaBolt className="text-xl" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isEditing ? 'Refine Entry' : 'Log New Insight'}
              </h2>
              <p className="text-slate-400 text-sm font-medium">Turn data into storytelling.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Projected Impact</span>
              <div className={`text-lg font-mono font-bold ${calculatedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calculatedPnl >= 0 ? '+' : ''}{calculatedPnl.toFixed(2)} USD
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800 mx-2" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">R:R Ratio</span>
              <div className="text-lg font-mono font-bold text-blue-400">
                {calculatedRr > 0 ? `${calculatedRr.toFixed(2)}:1` : '—'}
              </div>
            </div>
          </div>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormGroup className="group">
              <FormLabel className="text-xs text-slate-500 group-focus-within:text-blue-400 transition-colors uppercase tracking-wider">Symbol</FormLabel>
              <div className="relative">
                <Input name="symbol" value={tradeData.symbol} onChange={handleInputChange} placeholder="BTC/USDT" className="bg-slate-900/40 border-slate-800 focus:border-blue-500/50 rounded-xl h-12" required />
                <FaHashtag className="absolute right-4 top-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </FormGroup>

            <FormGroup>
              <FormLabel className="text-xs text-slate-500 uppercase tracking-wider">Direction</FormLabel>
              <Select options={directionOptions} styles={selectStyles} value={tradeData.direction} onChange={(opt) => handleSelectChange('direction', opt)} isSearchable={false} />
            </FormGroup>

            <FormGroup>
              <FormLabel className="text-xs text-slate-500 uppercase tracking-wider">Execution Time</FormLabel>
              <div className="relative">
                <DatePicker 
                  selected={tradeData.entryTime} 
                  onChange={(date) => handleDateChange('entryTime', date)} 
                  showTimeSelect 
                  dateFormat="MMM d, HH:mm"
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-xl h-12 px-4 text-slate-200 outline-none focus:border-blue-500/50 transition-all"
                />
                <FaCalendarAlt className="absolute right-4 top-4 text-slate-600 pointer-events-none" />
              </div>
            </FormGroup>

            <FormGroup>
              <FormLabel className="text-xs text-slate-500 uppercase tracking-wider">Position Size</FormLabel>
              <div className="relative">
                <Input type="number" name="quantity" value={tradeData.quantity} onChange={handleInputChange} placeholder="1.0" step="any" className="bg-slate-900/40 border-slate-800 focus:border-blue-500/50 rounded-xl h-12" required />
                <FaBalanceScale className="absolute right-4 top-4 text-slate-600" />
              </div>
            </FormGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <FormGroup>
              <FormLabel className="text-xs text-slate-500 uppercase tracking-wider">Entry Price</FormLabel>
              <Input type="number" name="entryPrice" value={tradeData.entryPrice} onChange={handleInputChange} placeholder="0.00" step="any" className="bg-slate-900/40 border-slate-800 focus:border-blue-500/50 rounded-xl h-12" required />
            </FormGroup>
            
            <FormGroup>
              <FormLabel className="text-xs text-slate-500 uppercase tracking-wider">Stop Loss</FormLabel>
              <Input type="number" name="stopLossPrice" value={tradeData.stopLossPrice} onChange={handleInputChange} placeholder="Safety net" step="any" className="bg-slate-900/40 border-slate-800 focus:border-rose-500/30 rounded-xl h-12" />
            </FormGroup>

            <FormGroup>
              <FormLabel className="text-xs text-slate-500 uppercase tracking-wider">Take Profit</FormLabel>
              <Input type="number" name="takeProfitPrice" value={tradeData.takeProfitPrice} onChange={handleInputChange} placeholder="Target" step="any" className="bg-slate-900/40 border-slate-800 focus:border-emerald-500/30 rounded-xl h-12" />
            </FormGroup>

            <FormGroup>
              <FormLabel className="text-xs text-slate-500 uppercase tracking-wider">Commission</FormLabel>
              <Input type="number" name="commission" value={tradeData.commission} onChange={handleInputChange} step="any" className="bg-slate-900/40 border-slate-800 focus:border-blue-500/50 rounded-xl h-12" />
            </FormGroup>
          </div>

          {/* Toggle Advanced */}
          <div className="flex justify-center py-2">
            <button 
              type="button" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:text-blue-400 transition-all text-sm font-semibold text-slate-400"
            >
              {isExpanded ? <><FaChevronUp /> Focus Mode</> : <><FaChevronDown /> Enrich Entry</>}
            </button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }}
                className="space-y-8 pt-6 border-t border-slate-800/50"
              >
                {/* Exit Details Section */}
                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-500 rounded-full" /> Closing & Exit
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormGroup>
                       <FormLabel className="text-xs text-slate-500 uppercase">Exit Time</FormLabel>
                       <DatePicker selected={tradeData.exitTime} onChange={(date) => handleDateChange('exitTime', date)} showTimeSelect dateFormat="Pp" className="w-full bg-slate-900/40 border border-slate-800 rounded-xl h-12 px-4" isClearable />
                    </FormGroup>
                    <FormGroup>
                       <FormLabel className="text-xs text-slate-500 uppercase">Exit Price</FormLabel>
                       <Input type="number" name="exitPrice" value={tradeData.exitPrice} onChange={handleInputChange} placeholder="Close price" step="any" className="bg-slate-900/40 border-slate-800 rounded-xl h-12" />
                    </FormGroup>
                    <FormGroup>
                       <FormLabel className="text-xs text-slate-500 uppercase">Exit Catalyst</FormLabel>
                       <Input name="exitReason" value={tradeData.exitReason} onChange={handleInputChange} placeholder="TP/SL/Manual" className="bg-slate-900/40 border-slate-800 rounded-xl h-12" />
                    </FormGroup>
                  </div>
                </section>

                {/* Psychology & Context */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-purple-500 rounded-full" /> Psychological State
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormGroup>
                        <FormLabel className="text-xs text-slate-500">Emotion @ Entry</FormLabel>
                        <Select options={emotionOptions} styles={selectStyles} value={tradeData.emotionEntry} onChange={(o) => handleSelectChange('emotionEntry', o)} />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel className="text-xs text-slate-500">Confidence</FormLabel>
                        <Select options={confidenceOptions} styles={selectStyles} value={tradeData.confidenceLevelEntry} onChange={(o) => handleSelectChange('confidenceLevelEntry', o)} placeholder="Rate 1-10" />
                      </FormGroup>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-emerald-500 rounded-full" /> Taxonomy
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormGroup>
                        <FormLabel className="text-xs text-slate-500">Trade Strategy</FormLabel>
                        <Select options={tradeTypeOptions} styles={selectStyles} value={tradeData.tradeType} onChange={(o) => handleSelectChange('tradeType', o)} />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel className="text-xs text-slate-500">Session</FormLabel>
                        <Select options={tradingSessionOptions} styles={selectStyles} value={tradeData.tradingSession} onChange={(o) => handleSelectChange('tradingSession', o)} />
                      </FormGroup>
                    </div>
                  </div>
                </section>

                {/* Text Analysis */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-orange-500 rounded-full" /> Narrative & Reflection
                  </h3>
                  <FormGroup>
                    <FormLabel className="text-xs text-slate-500">Setup Identifiers (Tags)</FormLabel>
                    <CreatableSelect isMulti styles={selectStyles} options={tagSuggestions.map(t => ({label: t.tag, value: t.tag}))} value={tradeData.setupTags} onChange={(v) => handleSelectChange('setupTags', v)} onInputChange={handleTagInputChange} placeholder="Trendline, RSI Divergence..." />
                  </FormGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea 
                      name="notes" value={tradeData.notes} onChange={handleInputChange} rows="4" 
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500/40 rounded-2xl p-4 text-slate-300 placeholder:text-slate-600 outline-none resize-none transition-all"
                      placeholder="Tell the story of this trade..."
                    />
                    <textarea 
                      name="mistakesMade" value={tradeData.mistakesMade} onChange={handleInputChange} rows="4" 
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-rose-500/40 rounded-2xl p-4 text-slate-300 placeholder:text-slate-600 outline-none resize-none transition-all"
                      placeholder="Execution errors or slips..."
                    />
                  </div>
                </section>

                {/* Visual Evidence */}
                <section>
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-400 rounded-full" /> Visual Proof
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group p-4 border-2 border-dashed border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer">
                      <input type="file" id="pre-up" className="hidden" onChange={(e) => handleScreenshotChange(e, 'pre')} />
                      <label htmlFor="pre-up" className="flex flex-col items-center justify-center gap-2 text-slate-500 group-hover:text-blue-400 transition-colors">
                        <FaImage className="text-2xl" />
                        <span className="text-xs font-bold uppercase tracking-wider">Before Execution</span>
                      </label>
                      {prePreview && (
                        <div className="mt-4 relative rounded-lg overflow-hidden border border-slate-700">
                          <img src={prePreview} className="w-full h-32 object-cover" />
                          <button type="button" onClick={() => setPrePreview('')} className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full"><FaTimesCircle /></button>
                        </div>
                      )}
                    </div>
                    <div className="relative group p-4 border-2 border-dashed border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all cursor-pointer">
                      <input type="file" id="post-up" className="hidden" onChange={(e) => handleScreenshotChange(e, 'post')} />
                      <label htmlFor="post-up" className="flex flex-col items-center justify-center gap-2 text-slate-500 group-hover:text-emerald-400 transition-colors">
                        <FaImage className="text-2xl" />
                        <span className="text-xs font-bold uppercase tracking-wider">Result Analysis</span>
                      </label>
                      {postPreview && (
                        <div className="mt-4 relative rounded-lg overflow-hidden border border-slate-700">
                          <img src={postPreview} className="w-full h-32 object-cover" />
                          <button type="button" onClick={() => setPostPreview('')} className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full"><FaTimesCircle /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800/50">
            {isEditing && (
              <Button type="button" variant="ghost" onClick={onCancelEdit} className="text-slate-400 hover:text-white px-6">
                Discard Edits
              </Button>
            )}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={tradeOpStatus === 'submitting'}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {tradeOpStatus === 'submitting' ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <FaSave />}
              {isEditing ? 'Sync Journal' : 'Commit to Journal'}
            </motion.button>
          </div>
        </Form>
      </div>

      <style>{`
        .react-datepicker-popper { z-index: 100 !important; }
        .react-datepicker { 
          background-color: #0f172a !important; 
          border: 1px solid #1e293b !important; 
          border-radius: 1rem !important; 
          color: white !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        .react-datepicker__header { background-color: #1e293b !important; border-bottom: 1px solid #334155 !important; }
        .react-datepicker__current-month, .react-datepicker__day-name { color: #94a3b8 !important; }
        .react-datepicker__day { color: #f1f5f9 !important; }
        .react-datepicker__day:hover { background-color: #334155 !important; }
        .react-datepicker__day--selected { background-color: #3b82f6 !important; }
        .react-datepicker__time-container { border-left: 1px solid #1e293b !important; background-color: #0f172a !important; }
        .react-datepicker__time { background-color: #0f172a !important; }
        .react-datepicker__time-list-item:hover { background-color: #334155 !important; }
        .react-datepicker__time-list-item--selected { background-color: #3b82f6 !important; }
      `}</style>
    </motion.div>
  );
};

export default InlineTradeEntry;