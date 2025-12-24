import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CgClose } from 'react-icons/cg';
import { FaImage, FaUsers, FaLock, FaGlobe } from 'react-icons/fa';
import { createPost } from '@/entities/Post/model/postsSlice';
import { fetchTrades } from '@/entities/Trade/model/tradesSlice';
import { Button, Loader } from '@/shared/ui';
import { theme } from '@/styles/theme';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { FormGroup } from '@/shared/ui';
import { FormLabel } from '@/shared/ui';
const CreatePostModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { trades, status: tradesStatus } = useSelector((state) => state.trades);
  const { status: postStatus } = useSelector((state) => state.posts);
  
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [caption, setCaption] = useState('');
  const [chartImageFile, setChartImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [visibility, setVisibility] = useState({ value: 'PUBLIC', label: <><FaGlobe style={{ marginRight: '8px' }}/> Public</> });

  useEffect(() => {
    if (isOpen && (!trades || trades.length === 0) && tradesStatus !== 'loading') {
      dispatch(fetchTrades({ page: 1, limit: 100, filters: { status: 'CLOSED' }, applyCurrentFilters: false }));
    }
  }, [isOpen, dispatch, trades, tradesStatus]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error("Image size must be less than 5MB."); return; }
      setChartImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => { setChartImageFile(null); setImagePreview(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTrade) { toast.error('Please select a trade to share.'); return; }
    const formData = new FormData();
    formData.append('tradeId', selectedTrade.value);
    formData.append('caption', caption);
    formData.append('visibility', visibility.value);
    if (chartImageFile) formData.append('chartImage', chartImageFile);

    try {
      await dispatch(createPost(formData)).unwrap();
      onClose();
      setSelectedTrade(null); setCaption(''); setChartImageFile(null); setImagePreview('');
    } catch (error) { /* Error toast handled by slice */ }
  };
  
  const tradeOptions = trades
    .filter(t => t.status === 'CLOSED')
    .map(t => ({
      value: t._id,
      label: `${t.symbol} (${t.direction}) | P&L: ${t.pnl?.toFixed(2) || 'N/A'} | Date: ${new Date(t.entryTime).toLocaleDateString()}`
    }));
  
  const visibilityOptions = [
    { value: 'PUBLIC', label: <><FaGlobe style={{ marginRight: '8px' }}/> Public (Visible to everyone)</> },
    // { value: 'FOLLOWERS_ONLY', label: <><FaUsers style={{ marginRight: '8px' }}/> Followers Only</> },
    { value: 'PRIVATE', label: <><FaLock style={{ marginRight: '8px' }}/> Private (Only you)</> },
  ];

  // --- Styles ---
  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 32, 0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: theme.zIndexModalBackdrop };
  const modalStyle = { backgroundColor: theme.backgroundAlt, padding: theme.spacing.lg, borderRadius: theme.borderRadiusXl, boxShadow: theme.shadowModal, width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${theme.border}`, position: 'relative' };
  const titleStyle = { fontSize: '1.5rem', fontWeight: theme.fontWeightSemibold, color: theme.textPrimary, marginBottom: theme.spacing.lg, textAlign: 'center' };
  const selectStyles = { /* ... (same as InlineTradeEntry) ... */ };
  const formStyle = { display: 'flex', flexDirection: 'column', gap: theme.spacing.lg };
  const textareaStyle = { width: '100%', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusMd, padding: theme.spacing.md, color: theme.textPrimary, fontSize:'0.95rem', minHeight: '120px', resize: 'vertical' };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div style={overlayStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div style={modalStyle} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" onClick={onClose} style={{ position: 'absolute', top: theme.spacing.md, right: theme.spacing.md, padding: theme.spacing.sm, fontSize: '1.5rem', zIndex: 1 }}><CgClose /></Button>
            <h2 style={titleStyle}>Share a Trade</h2>
            {tradesStatus === 'loading' && !trades.length ? <Loader message="Loading your trades..."/> : (
              <form onSubmit={handleSubmit} style={formStyle}>
                <FormGroup>
                  <FormLabel>1. Select Trade to Share</FormLabel>
                  <Select options={tradeOptions} value={selectedTrade} onChange={setSelectedTrade} styles={selectStyles} placeholder="Choose a completed trade..." />
                </FormGroup>
                <FormGroup>
                  <FormLabel>2. Add a Caption (Optional)</FormLabel>
                  <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows="4" style={textareaStyle} placeholder="Add your thoughts, strategy, or insights..."/>
                </FormGroup>
                {/* ... Screenshot upload UI similar to InlineTradeEntry ... */}
                <FormGroup>
                  <FormLabel>3. Set Visibility</FormLabel>
                  <Select options={visibilityOptions} value={visibility} onChange={setVisibility} styles={selectStyles} />
                </FormGroup>
                <Button type="submit" variant="primary" isLoading={postStatus === 'submitting'} disabled={postStatus === 'submitting'} style={{width: '100%', marginTop: theme.spacing.sm}}>Share Post</Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default CreatePostModal;