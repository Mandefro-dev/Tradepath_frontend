// // frontend/src/features/Journaling/ui/TradeLogDisplay.jsx (NEW FILE or update)
// import React, { useEffect, useState, useCallback,useRef  } from 'react';

// import { useDispatch, useSelector } from 'react-redux';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaListUl, FaThLarge, FaPlus, FaExclamationCircle, FaRocket } from 'react-icons/fa';
// import { fetchTrades, setTradeDetails, clearTradeDetails, fetchTradeStats } from '@/entities/Trade/model/tradesSlice';
// // import { TradeCard } from '@/entities/Trade'; // Assuming TradeCard is in entities/Trade/ui/TradeCard.jsx
// import { TradeCard } from '@/entities/Trade';
// import JournalFilterBar from './JournalingFilterBar';
// import InlineTradeEntry from './InlineTradeEntry'; // For editing
// import { Button, Loader, ConfirmModal, Tooltip } from '@/shared/ui';
// import { theme } from '@/styles/theme';
// // import { useDebouncedValue } from '@/core/hooks/useDebouncedValue'; // Assumed to exist
// import useDebouncedValue from '@/core/hooks/useDebouncedValue';
// // Infinite scroll hook (basic version)
// const useInfiniteScroll = (callback, hasMore, isLoading) => {
//   const observer = useRef();
//   const lastElementRef = useCallback(node => {
//     if (isLoading) return;
//     if (observer.current) observer.current.disconnect();
//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) {
//         callback();
//       }
//     });
//     if (node) observer.current.observe(node);
//   }, [isLoading, hasMore, callback]);
//   return lastElementRef;
// };


// const TradeLogDisplay = () => {
//   const dispatch = useDispatch();
//   const {
//     trades,
//     pagination,
//     status,
//     error,
//     filters,
//     tradeDetails: tradeToEdit, // tradeDetails from slice is our tradeToEdit
//   } = useSelector((state) => state.trades);

//   const [viewMode, setViewMode] = useState('card'); // 'card' or 'list' (future)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   // No need for local tradeToEdit state if using Redux's tradeDetails

//   // Fetch initial trades and stats
//   useEffect(() => {
//     if (status === 'idle' || trades.length === 0) { // Fetch only if idle or empty
//         dispatch(fetchTrades({ page: 1, filters }));
//         dispatch(fetchTradeStats(filters));
//     }
//   }, [dispatch, status, filters, trades.length]);


//   const handleLoadMore = useCallback(() => {
//     if (pagination.hasMore && status !== 'loading') {
//       dispatch(fetchTrades({ page: pagination.currentPage + 1, filters }));
//     }
//   }, [dispatch, pagination, filters, status]);

//   const lastTradeElementRef = useInfiniteScroll(handleLoadMore, pagination.hasMore, status === 'loading');

//   const handleEditRequest = (trade) => {
//     dispatch(setTradeDetails(trade)); // Put trade data into Redux state for editing
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     dispatch(clearTradeDetails()); // Clear editing state
//   };

//   const handleTradeSavedOrUpdated = (updatedTrade) => {
//     handleCloseEditModal();
//     // Trades list will be updated by Redux thunk's fulfilled action.
//     // Optionally, refetch page 1 if sorting/filtering might change significantly.
//     // dispatch(fetchTrades({ page: 1, filters }));
//     // dispatch(fetchTradeStats(filters)); // Refresh stats
//   };


//   // Inline Styles
//   const containerStyle = {
//     padding: `${theme.spacing.sm}px 0`, // Less top padding as JournalPage has padding
//     minHeight: 'calc(100vh - 200px)', // Adjust based on header/tab height
//   };

//   const controlsHeaderStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: `${theme.spacing.lg}px`,
//   };

//   const viewToggleStyle = {
//     display: 'flex',
//     gap: `${theme.spacing.sm}px`,
//   };

//   const tradesGridStyle = {
//     display: 'grid',
//     // gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(350px, 1fr))' : '1fr',
//     // For now, always card view, which can be responsive with a single column on small screens
//     gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', // Responsive cards
//     gap: `${theme.spacing.lg}px`,
//   };

//   const emptyStateStyle = {
//     textAlign: 'center',
//     padding: `${theme.spacing.xxl}px ${theme.spacing.lg}px`,
//     backgroundColor: theme.backgroundAlt,
//     borderRadius: theme.borderRadiusXl,
//     border: `1px dashed ${theme.border}`,
//     color: theme.textMuted,
//     marginTop: theme.spacing.lg,
//   };
//   const emptyIconStyle = { fontSize: '3rem', marginBottom: theme.spacing.md, opacity: 0.7 };


//   // Modal style for Edit (could be a shared Modal component)
//   const editModalOverlayStyle = {
//     position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(5px)',
//     display: 'flex', alignItems: 'center', justifyContent: 'center',
//     zIndex: theme.zIndexModalBackdrop,
//   };
//   const editModalContentStyle = {
//     backgroundColor: theme.backgroundAlt,
//     borderRadius: theme.borderRadiusXl,
//     boxShadow: theme.shadowModal,
//     width: '100%',
//     maxWidth: '700px', // Wider for full form
//     maxHeight: '90vh',
//     overflowY: 'auto',
//     padding: 0, // InlineTradeEntry has its own padding
//     border: `1px solid ${theme.border}`,
//   };


//   return (
//     <div style={containerStyle}>
//       <JournalFilterBar /> {/* Filters trades via Redux state */}

//       {/* View Mode Toggle - Placeholder for future grid/list view switch */}
//       <div style={controlsHeaderStyle}>
//         <div></div> // Spacer
//         <div style={viewToggleStyle}>
//           <Tooltip content="Card View">
//             <Button variant={viewMode === 'card' ? 'primary' : 'ghost'} onClick={() => setViewMode('card')} size="sm" leftIcon={<FaThLarge />} />
//           </Tooltip>
//           <Tooltip content="List View (Soon)">
//             <Button variant={viewMode === 'list' ? 'primary' : 'ghost'} onClick={() => setViewMode('list')} size="sm" leftIcon={<FaListUl />} disabled />
//           </Tooltip>
//         </div>
//       </div>

//       {status === 'loading' && trades.length === 0 && (
//         <div style={{display: 'flex', justifyContent: 'center', padding: theme.spacing.xl}}>
//           <Loader size="lg" message="Loading your trades..." />
//         </div>
//       )}
//       {status === 'failed' && error && (
//         <div style={{...emptyStateStyle, borderColor: theme.error, color: theme.error}}>
//             <FaExclamationCircle style={{...emptyIconStyle, color: theme.error}}/>
//             <p style={{fontWeight: theme.fontWeightMedium}}>Error loading trades:</p>
//             <p style={{fontSize: theme.fontSizeSm}}>{typeof error === 'string' ? error : 'An unexpected error occurred.'}</p>
//         </div>
//       )}

//       <AnimatePresence>
//         {trades.length > 0 && (
//           <motion.div
//             style={tradesGridStyle} // Use grid for cards
//             variants={{ container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } } }}
//             initial="container"
//             animate="container"
//           >
//             {trades.map((trade, index) => (
//               <motion.div
//                 key={trade._id}
//                 ref={trades.length === index + 1 ? lastTradeElementRef : null} // For infinite scroll
//                 variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
//                 layout // Animate layout changes if list reorders
//               >
//                 <TradeCard trade={trade} onEditRequest={handleEditRequest} />
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {status === 'loading' && trades.length > 0 && (
//          <div style={{display: 'flex', justifyContent: 'center', padding: `${theme.spacing.lg}px 0`}}>
//             <Loader message="Loading more trades..." />
//          </div>
//       )}

//       {status !== 'loading' && trades.length === 0 && !error && (
//         <motion.div style={emptyStateStyle} initial={{opacity: 0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{delay:0.2}}>
//             <FaRocket style={{...emptyIconStyle, color: theme.primary}}/>
//             <h3 style={{fontSize: '1.2rem', fontWeight: theme.fontWeightSemibold, color: theme.textPrimary, marginBottom: theme.spacing.sm}}>Your Trade Log is Empty!</h3>
//             <p>Start journaling your trades to see them here and unlock powerful insights.</p>
//             <p style={{marginTop: theme.spacing.sm}}>Click the "Log Trade" tab to begin.</p>
//         </motion.div>
//       )}

//       {/* Edit Trade Modal */}
//       <AnimatePresence>
//         {isEditModalOpen && tradeToEdit && (
//           <motion.div
//             style={editModalOverlayStyle}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={handleCloseEditModal}
//           >
//             <motion.div
//               style={editModalContentStyle}
//               initial={{ y: 50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: 50, opacity: 0 }}
//               transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <InlineTradeEntry
//                 existingTradeData={tradeToEdit}
//                 onTradeLogged={handleTradeSavedOrUpdated} // Will trigger update
//                 onCancelEdit={handleCloseEditModal}
//               />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// };

// export default TradeLogDisplay;

// frontend/src/features/Journaling/ui/TradeLogDisplay.jsx
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion, AnimatePresence, Reorder } from 'framer-motion';
// import { FaListUl, FaThLarge, FaExclamationCircle, FaRocket } from 'react-icons/fa';
// import { fetchTrades, setTradeDetails, clearTradeDetails, fetchTradeStats, reorderTrades } from '@/entities/Trade/model/tradesSlice';
// import { TradeCard } from '@/entities/Trade';
// import JournalFilterBar from './JournalingFilterBar';
// import InlineTradeEntry from './InlineTradeEntry';
// import { Button, Loader, Tooltip } from '@/shared/ui';
// import { theme } from '@/styles/theme';
// import useDebouncedValue from '@/core/hooks/useDebouncedValue';

// const useInfiniteScroll = (callback, hasMore, isLoading) => {
//   const observer = useRef();
//   const lastElementRef = useCallback(node => {
//     if (isLoading) return;
//     if (observer.current) observer.current.disconnect();
//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) {
//         callback();
//       }
//     });
//     if (node) observer.current.observe(node);
//   }, [isLoading, hasMore, callback]);
//   return lastElementRef;
// };

// const TradeLogDisplay = () => {
//   const dispatch = useDispatch();
//   const {
//     trades,
//     pagination,
//     status,
//     error,
//     filters,
//     tradeDetails: tradeToEdit,
//   } = useSelector((state) => state.trades);

//   const [viewMode, setViewMode] = useState('card');
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [localTrades, setLocalTrades] = useState(trades);
//   const [isDragging, setIsDragging] = useState(false);
//   const constraintsRef = useRef(null);

//   useEffect(() => {
//     setLocalTrades(trades);
//   }, [trades]);

//   useEffect(() => {
//     if (status === 'idle' || trades.length === 0) {
//       dispatch(fetchTrades({ page: 1, filters }));
//       dispatch(fetchTradeStats(filters));
//     }
//   }, [dispatch, status, filters, trades.length]);

//   const handleLoadMore = useCallback(() => {
//     if (pagination.hasMore && status !== 'loading') {
//       dispatch(fetchTrades({ page: pagination.currentPage + 1, filters }));
//     }
//   }, [dispatch, pagination, filters, status]);

//   const lastTradeElementRef = useInfiniteScroll(handleLoadMore, pagination.hasMore, status === 'loading');

//   const handleEditRequest = (trade) => {
//     dispatch(setTradeDetails(trade));
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     dispatch(clearTradeDetails());
//   };

//   const handleTradeSavedOrUpdated = () => {
//     handleCloseEditModal();
//   };

//   const handleReorder = (newOrder) => {
//     setLocalTrades(newOrder);
//   };

//   const handleDragEnd = async () => {
//     setIsDragging(false);
//     if (JSON.stringify(localTrades.map(t => t._id)) !== JSON.stringify(trades.map(t => t._id))) {
//       try {
//         await dispatch(reorderTrades({
//           newOrder: localTrades,
//           originalOrder: trades
//         })).unwrap();
//       } catch (error) {
//         // Revert if the reorder fails
//         setLocalTrades(trades);
//       }
//     }
//   };

//   const containerStyle = {
//     padding: `${theme.spacing.sm}px 0`,
//     minHeight: 'calc(100vh - 200px)',
//   };

//   const controlsHeaderStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: theme.spacing.lg,
//   };

//   const tradesGridStyle = {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
//     gap: theme.spacing.lg,
//     position: 'relative',
//   };

//   const emptyStateStyle = {
//     textAlign: 'center',
//     padding: `${theme.spacing.xxl}px ${theme.spacing.lg}px`,
//     backgroundColor: theme.backgroundAlt,
//     borderRadius: theme.borderRadiusXl,
//     border: `1px dashed ${theme.border}`,
//     color: theme.textMuted,
//     marginTop: theme.spacing.lg,
//   };

//   return (
//     <div style={containerStyle} ref={constraintsRef}>
//       <JournalFilterBar />

//       <div style={controlsHeaderStyle}>
//         <div></div>
//         <div style={{ display: 'flex', gap: theme.spacing.sm }}>
//           <Tooltip content="Card View">
//             <Button 
//               variant={viewMode === 'card' ? 'primary' : 'ghost'} 
//               onClick={() => setViewMode('card')} 
//               size="sm" 
//               leftIcon={<FaThLarge />} 
//             />
//           </Tooltip>
//           <Tooltip content="List View (Soon)">
//             <Button 
//               variant={viewMode === 'list' ? 'primary' : 'ghost'} 
//               onClick={() => setViewMode('list')} 
//               size="sm" 
//               leftIcon={<FaListUl />} 
//               disabled 
//             />
//           </Tooltip>
//         </div>
//       </div>

//       {status === 'loading' && trades.length === 0 && (
//         <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing.xl }}>
//           <Loader size="lg" message="Loading your trades..." />
//         </div>
//       )}

//       {status === 'failed' && error && (
//         <div style={{ ...emptyStateStyle, borderColor: theme.error, color: theme.error }}>
//           <FaExclamationCircle style={{ fontSize: '3rem', marginBottom: theme.spacing.md, color: theme.error }} />
//           <p style={{ fontWeight: theme.fontWeightMedium }}>Error loading trades:</p>
//           <p style={{ fontSize: theme.fontSizeSm }}>{typeof error === 'string' ? error : 'An unexpected error occurred.'}</p>
//         </div>
//       )}

//       <AnimatePresence>
//         {localTrades.length > 0 && (
//           <Reorder.Group
//             axis="y"
//             values={localTrades}
//             onReorder={handleReorder}
//             style={tradesGridStyle}
//             layoutScroll
//           >
//             {localTrades.map((trade, index) => (
//               <Reorder.Item
//                 key={trade._id}
//                 value={trade}
//                 as="div"
//                 drag
//                 onDragStart={() => setIsDragging(true)}
//                 onDragEnd={handleDragEnd}
//                 dragConstraints={constraintsRef}
//                 dragElastic={0.2}
//                 whileDrag={{
//                   scale: 1.05,
//                   boxShadow: theme.shadowLg,
//                   zIndex: 10,
//                   cursor: 'grabbing',
//                 }}
//                 style={{
//                   position: 'relative',
//                   zIndex: isDragging ? 10 : 1,
//                 }}
//                 ref={localTrades.length === index + 1 ? lastTradeElementRef : null}
//               >
//                 <motion.div
//                   layout
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ 
//                     opacity: 1, 
//                     y: 0,
//                     transition: { type: 'spring', stiffness: 500, damping: 30 }
//                   }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//                   whileHover={{ scale: 1.02 }}
//                 >
//                   <TradeCard 
//                     trade={trade} 
//                     onEditRequest={handleEditRequest}
//                     isDragging={isDragging}
//                   />
//                 </motion.div>
//               </Reorder.Item>
//             ))}
//           </Reorder.Group>
//         )}
//       </AnimatePresence>

//       {status === 'loading' && trades.length > 0 && (
//         <div style={{ display: 'flex', justifyContent: 'center', padding: `${theme.spacing.lg}px 0` }}>
//           <Loader message="Loading more trades..." />
//         </div>
//       )}

//       {status !== 'loading' && trades.length === 0 && !error && (
//         <motion.div 
//           style={emptyStateStyle} 
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           <FaRocket style={{ fontSize: '3rem', marginBottom: theme.spacing.md, color: theme.primary }} />
//           <h3 style={{ fontSize: '1.2rem', fontWeight: theme.fontWeightSemibold, color: theme.textPrimary, marginBottom: theme.spacing.sm }}>
//             Your Trade Log is Empty!
//           </h3>
//           <p>Start journaling your trades to see them here and unlock powerful insights.</p>
//           <p style={{ marginTop: theme.spacing.sm }}>Click the "Log Trade" tab to begin.</p>
//         </motion.div>
//       )}

//       <AnimatePresence>
//         {isEditModalOpen && tradeToEdit && (
//           <motion.div
//             style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               backgroundColor: 'rgba(0, 0, 0, 0.65)',
//               backdropFilter: 'blur(5px)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               zIndex: theme.zIndexModalBackdrop,
//             }}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={handleCloseEditModal}
//           >
//             <motion.div
//               style={{
//                 backgroundColor: theme.backgroundAlt,
//                 borderRadius: theme.borderRadiusXl,
//                 boxShadow: theme.shadowModal,
//                 width: '100%',
//                 maxWidth: '700px',
//                 maxHeight: '90vh',
//                 overflowY: 'auto',
//                 padding: 0,
//                 border: `1px solid ${theme.border}`,
//               }}
//               initial={{ y: 50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: 50, opacity: 0 }}
//               transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <InlineTradeEntry
//                 existingTradeData={tradeToEdit}
//                 onTradeLogged={handleTradeSavedOrUpdated}
//                 onCancelEdit={handleCloseEditModal}
//               />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default TradeLogDisplay;
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  fetchTrades, 
  setTradeDetails, 
  clearTradeDetails, 
  fetchTradeStats, 
  reorderTrades 
} from '@/entities/Trade/model/tradesSlice';
import InlineTradeEntry from './InlineTradeEntry';
import { Loader } from '@/shared/ui';

/** * INTERNAL SVG ICONS 
 */
const Icons = {
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  List: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
  Rocket: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"></path><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"></path></svg>,
  TrendingUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
  TrendingDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
};

/**
 * HIGH-END INTERACTIVE TRADE CARD
 */
const ModernTradeCard = ({ trade, onEditRequest, isDragging }) => {
  const isWin = trade.pnl >= 0;
  
  return (
    <motion.div 
      onClick={() => onEditRequest(trade)}
      className="relative group h-full cursor-pointer"
    >
      <div className={`absolute -inset-0.5 rounded-[2rem] blur opacity-10 transition duration-500 group-hover:opacity-30 ${isWin ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      
      <div className={`relative h-full flex flex-col p-6 rounded-[1.8rem] border border-white/5 backdrop-blur-xl transition-all duration-300 ${isWin ? 'bg-emerald-950/10' : 'bg-rose-950/10'} ${isDragging ? 'shadow-2xl brightness-125' : 'hover:bg-white/[0.02]'}`}>
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${isWin ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/20 border-rose-500/30 text-rose-400'}`}>
              {trade.direction === 'LONG' ? <Icons.TrendingUp /> : <Icons.TrendingDown />}
            </div>
            <div>
              <h3 className="font-bold text-white tracking-tight">{trade.symbol}</h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                {new Date(trade.entryTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center my-2">
          <div className={`text-2xl font-mono font-black tracking-tighter ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isWin ? '+' : '-'}${Math.abs(trade.pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mt-1">
             <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
               {isWin ? 'PROFIT' : 'LOSS'}
             </span>
             <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
               SIZE: {trade.quantity}
             </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex flex-col">
            <span className="text-slate-500">Entry</span>
            <span className="text-slate-300 font-mono">${trade.entryPrice}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-500">Exit</span>
            <span className="text-slate-300 font-mono">${trade.exitPrice || '—'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * INTEGRATED INFINITE SCROLL HOOK
 */
const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        callback();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, callback]);
  return lastElementRef;
};

/**
 * MAIN COMPONENT
 */
const TradeLogDisplay = () => {
  const dispatch = useDispatch();
  const {
    trades,
    pagination,
    status,
    error,
    filters,
    tradeDetails: tradeToEdit,
  } = useSelector((state) => state.trades);

  const [viewMode, setViewMode] = useState('card');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localTrades, setLocalTrades] = useState(trades);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

  useEffect(() => {
    setLocalTrades(trades);
  }, [trades]);

  useEffect(() => {
    if (status === 'idle' || trades.length === 0) {
      dispatch(fetchTrades({ page: 1, filters }));
      dispatch(fetchTradeStats(filters));
    }
  }, [dispatch, status, filters, trades.length]);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && status !== 'loading') {
      dispatch(fetchTrades({ page: pagination.currentPage + 1, filters }));
    }
  }, [dispatch, pagination, filters, status]);

  const lastTradeElementRef = useInfiniteScroll(handleLoadMore, pagination.hasMore, status === 'loading');

  const handleEditRequest = (trade) => {
    dispatch(setTradeDetails(trade));
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    dispatch(clearTradeDetails());
  };

  const handleTradeSavedOrUpdated = () => {
    handleCloseEditModal();
  };

  const handleReorder = (newOrder) => {
    setLocalTrades(newOrder);
  };

  const handleDragEnd = async () => {
    setIsDragging(false);
    if (JSON.stringify(localTrades.map(t => t._id)) !== JSON.stringify(trades.map(t => t._id))) {
      try {
        await dispatch(reorderTrades({
          newOrder: localTrades,
          originalOrder: trades
        })).unwrap();
      } catch (error) {
        setLocalTrades(trades);
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-200" ref={constraintsRef}>
      
      {/* PROFESSIONAL FILTER AREA */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex p-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl relative">
          {['ALL', 'WIN', 'LOSS'].map((type) => (
            <button
              key={type}
              onClick={() => {/* Integration: Update Redux Filters */}}
              className={`relative px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all duration-300 z-10 ${
                (filters.status || 'ALL') === type ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {(filters.status || 'ALL') === type && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 uppercase">{type}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
              <Icons.Search />
            </div>
            <input 
              type="text" 
              placeholder="Filter by symbol..." 
              className="w-full h-12 bg-slate-900/40 border border-white/5 rounded-2xl pl-12 pr-4 text-sm outline-none focus:border-blue-500/40 transition-all placeholder:text-slate-600"
            />
          </div>
          
          <div className="h-12 flex items-center gap-1 bg-slate-900/40 border border-white/5 rounded-2xl p-1">
             <button 
                onClick={() => setViewMode('card')}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${viewMode === 'card' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}
             >
               <Icons.Grid />
             </button>
             <button 
                onClick={() => setViewMode('list')}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}
             >
               <Icons.List />
             </button>
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {status === 'loading' && trades.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader size="lg" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 animate-pulse">Syncing Journal Data...</span>
        </div>
      )}

      {/* ERROR STATE */}
      {status === 'failed' && (
        <div className="p-12 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/20 text-center">
          <p className="text-rose-400 font-bold mb-2 uppercase tracking-tighter">Connection Interrupted</p>
          <p className="text-slate-500 text-sm">{typeof error === 'string' ? error : 'Failed to retrieve trade log.'}</p>
        </div>
      )}

      {/* MAIN GRID */}
      <AnimatePresence mode="popLayout">
        {localTrades.length > 0 && (
          <Reorder.Group
            axis="y"
            values={localTrades}
            onReorder={handleReorder}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative"
            layoutScroll
          >
            {localTrades.map((trade, index) => (
              <Reorder.Item
                key={trade._id}
                value={trade}
                drag
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                className="relative z-10"
                ref={localTrades.length === index + 1 ? lastTradeElementRef : null}
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <ModernTradeCard 
                    trade={trade} 
                    onEditRequest={handleEditRequest}
                    isDragging={isDragging}
                  />
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </AnimatePresence>

      {/* EMPTY STATE */}
      {status !== 'loading' && trades.length === 0 && !error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-32 flex flex-col items-center text-center max-w-md mx-auto"
        >
          <div className="text-blue-500/20 mb-8">
            <Icons.Rocket />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Silence in the Archive</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
            Your trade log is currently empty. Every legendary trader starts with a single entry. 
            Log your first trade to unlock advanced analytics.
          </p>
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/20">
            Log First Trade
          </button>
        </motion.div>
      )}

      {/* EDIT MODAL INTEGRATION */}
      <AnimatePresence>
        {isEditModalOpen && tradeToEdit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseEditModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-white/10 bg-[#0b0f1a] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <InlineTradeEntry
                existingTradeData={tradeToEdit}
                onTradeLogged={handleTradeSavedOrUpdated}
                onCancelEdit={handleCloseEditModal}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TradeLogDisplay;