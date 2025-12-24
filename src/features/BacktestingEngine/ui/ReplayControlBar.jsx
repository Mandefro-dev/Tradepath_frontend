// import React, { useState } from 'react';
// import { FaPlay, FaPause, FaForward, FaFastForward, FaTachometerAlt } from 'react-icons/fa';
// import { Button, Tooltip } from '@/shared/ui';
// import { theme } from '@/styles/theme';
// import backtestSocketService from '@/core/socket/backtest.socket.service';

// export const ReplayControlBar = ({ sessionId, currentStatus, currentSpeed }) => {
//   const handleControl = (command) => backtestSocketService.controlReplay(sessionId, command);
//   const speedOptions = [1, 2, 5, 10, 20, 50, 100];
//   const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);

//   const barStyle = { padding: theme.spacing.md, borderTop: `1px solid ${theme.border}`, backgroundColor: theme.backgroundAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md, flexShrink: 0 };
//   const speedMenuStyle = { position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', backgroundColor: theme.surface, borderRadius: theme.borderRadiusMd, boxShadow: theme.shadowModal, border: `1px solid ${theme.border}`, padding: theme.spacing.xs };

//   return (
//     <div style={barStyle}>
//       {currentStatus !== 'RUNNING' ? (
//         <Tooltip content="Play">
//           <Button onClick={() => handleControl({type: 'PLAY'})} variant="primary" style={{width:'50px', height:'50px', borderRadius:'50%'}}><FaPlay /></Button>
//         </Tooltip>
//       ) : (
//         <Tooltip content="Pause">
//           <Button onClick={() => handleControl({type: 'PAUSE'})} variant="secondary" style={{width:'50px', height:'50px', borderRadius:'50%'}}><FaPause /></Button>
//         </Tooltip>
//       )}

//       <div style={{ position: 'relative' }}>
//         <Tooltip content={`Set Speed (${currentSpeed}x)`}>
//           <Button onClick={() => setIsSpeedMenuOpen(p => !p)} variant="secondary" leftIcon={<FaTachometerAlt />}>
//             {currentSpeed}x
//           </Button>
//         </Tooltip>
//         {isSpeedMenuOpen && (
//           <div style={speedMenuStyle}>
//             {speedOptions.map(speed => (
//               <Button key={speed} variant="ghost" onClick={() => { handleControl({ type: 'SET_SPEED', speed }); setIsSpeedMenuOpen(false); }} style={{width:'100%', justifyContent:'center'}}>
//                 {speed}x
//               </Button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
import React, { useState } from 'react';
import { FaPlay, FaPause, FaForward, FaFastForward, FaTachometerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Tooltip } from '@/shared/ui';
import { theme } from '@/styles/theme';
import backtestSocketService from '@/core/socket/backtest.socket.service';
import { useClickOutside } from '@/core/hooks/useClickOutside';

export const ReplayControlBar = ({ sessionId, currentStatus, currentSpeed }) => {
  const handleControl = (command) => backtestSocketService.controlReplay(sessionId, command);
  const speedOptions = [1, 2, 5, 10, 20, 50, 100];
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const speedMenuRef = React.useRef();

  useClickOutside(speedMenuRef, () => setIsSpeedMenuOpen(false));

  const barStyle = { padding: theme.spacing.md, borderTop: `1px solid ${theme.border}`, backgroundColor: theme.backgroundAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md, flexShrink: 0, boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' };
  const speedMenuStyle = { position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)', backgroundColor: theme.surface, borderRadius: theme.borderRadiusMd, boxShadow: theme.shadowModal, border: `1px solid ${theme.border}`, padding: theme.spacing.xs, display: 'flex', flexDirection: 'column', gap: theme.spacing.xs };

  return (
    <div style={barStyle}>
      {currentStatus !== 'RUNNING' ? (
        <Tooltip content="Play">
          <Button onClick={() => handleControl({type: 'PLAY'})} variant="primary" style={{width:'50px', height:'50px', borderRadius:'50%'}}><FaPlay /></Button>
        </Tooltip>
      ) : (
        <Tooltip content="Pause">
          <Button onClick={() => handleControl({type: 'PAUSE'})} variant="secondary" style={{width:'50px', height:'50px', borderRadius:'50%'}}><FaPause /></Button>
        </Tooltip>
      )}

      <div ref={speedMenuRef} style={{ position: 'relative' }}>
        <Tooltip content={`Set Speed (${currentSpeed}x)`}>
          <Button onClick={() => setIsSpeedMenuOpen(p => !p)} variant="secondary" leftIcon={<FaTachometerAlt />}>
            {currentSpeed}x
          </Button>
        </Tooltip>
        <AnimatePresence>
        {isSpeedMenuOpen && (
          <motion.div style={speedMenuStyle} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}>
            {speedOptions.map(speed => (
              <Button key={speed} variant="ghost" onClick={() => { handleControl({ type: 'SET_SPEED', speed }); setIsSpeedMenuOpen(false); }} style={{width:'100%', justifyContent:'center'}}>
                {speed}x
              </Button>
            ))}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};