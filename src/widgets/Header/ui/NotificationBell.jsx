import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCircle } from 'react-icons/fa';
import { fetchNotifications, markNotificationsAsRead, addNotification } from '@/entities/Notification/model/notificationSlice';
import { Button, Loader } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { useClickOutside } from '@/core/hooks/useClickOutside';
import { useSocket } from '@/core/socket/socketContext';
import { formatDistanceToNowStrict } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const NotificationItem = ({ notification, onClick }) => {
  const itemStyle = { display: 'flex', gap: theme.spacing.md, padding: theme.spacing.md, borderBottom: `1px solid ${theme.border}`, cursor: 'pointer', transition: 'background-color 0.2s ease', position: 'relative' };
  const unreadIndicatorStyle = { position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)', color: theme.primary, fontSize: '0.5rem' };

  return (
    <motion.div style={itemStyle} whileHover={{backgroundColor: theme.surfaceLight}} onClick={onClick}>
      {!notification.read && <FaCircle style={unreadIndicatorStyle}/>}
      <img src={notification.sender.profilePicture || `https://i.pravatar.cc/40?u=${notification.sender._id}`} alt={notification.sender.name} style={{width:'40px', height:'40px', borderRadius:'50%'}}/>
      <div>
        <p style={{fontSize: theme.fontSizeSm, color: theme.textSecondary, lineHeight: 1.4}}>{notification.message}</p>
        <p style={{fontSize: '0.75rem', color: theme.textMuted, marginTop: '4px'}}>{formatDistanceToNowStrict(new Date(notification.createdAt), {addSuffix: true})}</p>
      </div>
    </motion.div>
  );
};

export const NotificationBell = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { notifications, unreadCount, status } = useSelector(state => state.notifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    // Fetch initial notifications when the component mounts
    dispatch(fetchNotifications({page: 1, limit: 10}));
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;
    socket.on('newNotification', (notification) => {
      dispatch(addNotification(notification));
      toast.info(<div><strong>{notification.sender.name}</strong><br/>{notification.message}</div>);
    });
    return () => { socket.off('newNotification'); };
  }, [socket, dispatch]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    if (!isOpen && unreadCount > 0) {
      // Mark first few as read or all visible ones
      const unreadIds = notifications.filter(n => !n.read).slice(0, 10).map(n => n._id);
      if (unreadIds.length > 0) {
        dispatch(markNotificationsAsRead(unreadIds));
      }
    }
  };

  const bellButtonStyle = { position: 'relative', background: 'none', border: 'none', color: theme.textSecondary, fontSize: '1.3rem', padding: theme.spacing.sm, borderRadius: '50%', cursor: 'pointer' };
  const badgeStyle = { position: 'absolute', top: '0px', right: '0px', backgroundColor: theme.error, color: 'white', fontSize: '0.65rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const dropdownStyle = { position: 'absolute', right: 0, top: `calc(100% + ${theme.spacing.sm}px)`, width: '380px', maxHeight: '450px', backgroundColor: theme.backgroundAlt, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusLg, boxShadow: theme.shadowModal, zIndex: theme.zIndexDropdown, display: 'flex', flexDirection: 'column' };
  
  return (
    <div ref={dropdownRef} style={{position: 'relative'}}>
      <motion.button style={bellButtonStyle} whileHover={{color: theme.textPrimary, backgroundColor: theme.surface}} onClick={handleToggle}>
        <FaBell />
        {unreadCount > 0 && <motion.span style={badgeStyle} initial={{scale:0}} animate={{scale:1}}>{unreadCount}</motion.span>}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div style={dropdownStyle} initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
            <div style={{padding: theme.spacing.md, borderBottom: `1px solid ${theme.border}`, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{fontWeight: theme.fontWeightSemibold}}>Notifications</h3>
              <Button variant="link" size="sm" onClick={() => dispatch(markNotificationsAsRead())}>Mark all as read</Button>
            </div>
            <div style={{flexGrow: 1, overflowY: 'auto'}}>
              {status === 'loading' && notifications.length === 0 && <Loader />}
              {notifications.length === 0 && <p style={{textAlign:'center', padding: theme.spacing.lg, color: theme.textMuted}}>No new notifications.</p>}
              {notifications.map(n => <NotificationItem key={n._id} notification={n} onClick={() => setIsOpen(false)}/>)}
            </div>
            <div style={{padding: theme.spacing.sm, borderTop: `1px solid ${theme.border}`, textAlign:'center'}}>
              <Link to="/notifications" onClick={() => setIsOpen(false)} style={{fontSize: theme.fontSizeSm, fontWeight: theme.fontWeightMedium, color: theme.primary}}>View all notifications</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};