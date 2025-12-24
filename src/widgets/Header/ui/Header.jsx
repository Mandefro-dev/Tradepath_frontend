

// import React, { useState, useRef } from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FaChartPie, FaSignOutAlt, FaCog, FaUserCircle, FaBell,
//   FaBookOpen, FaMicroscope, FaUsers, FaAngleDown,FaBars,FaTimes,FaLayerGroup,FaFacebookMessenger
// } from 'react-icons/fa';
// import { CgMenuRight, CgClose, } from 'react-icons/cg';
// import { PATHS } from '@/app/routing/paths';
// import { logout } from '@/features/Auth/model/authSlice';
// import { useClickOutside } from '@/core/hooks/useClickOutside';
// import { theme } from '@/styles/theme';
// import { Button } from '@/shared/ui';
// import { NotificationBell } from './NotificationBell';

// const Header = () => {
//   const dispatch = useDispatch();
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const userMenuRef = useRef(null);

//   useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

//   const handleLogout = async () => {
//     dispatch(logout());
//     setIsUserMenuOpen(false);
//     setIsMobileMenuOpen(false);
//   };

//   const navLinks = [
//     { path: PATHS.JOURNAL || '/journal', label: 'Journal', icon: <FaBookOpen /> },
//     { path: PATHS.BACKTEST_DASHBOARD || '/backtesting', label: 'Backtest', icon: <FaMicroscope /> },
//     { path: PATHS.COMMUNITY_FEED || '/community', label: 'Community', icon: <FaUsers /> },
//     { path: PATHS.GROUP_DISCOVERY || '/groups', label: 'Groups', icon: <FaLayerGroup /> },
//     { path: PATHS.MESSAGEING || '/messages', label: 'Messages', icon: <FaFacebookMessenger /> },
//   ];

//   // Style Objects (many more would be needed for full conversion)
//   const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`, backgroundColor: theme.backgroundAlt, borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: theme.zIndexSticky, height: '65px' };
//   const logoStyle = { fontSize: '1.5rem', fontWeight: theme.fontWeightBold, color: theme.primary, display: 'flex', alignItems: 'center', gap: theme.spacing.sm, textDecoration: 'none' };
//   const mainNavDesktopStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginLeft: theme.spacing.lg, flexGrow: 1 };
//   const navLinkBaseStyle = { color: theme.textSecondary, fontWeight: theme.fontWeightMedium, fontSize: '0.9rem', padding: `${theme.spacing.sm}px ${theme.spacing.md}px`, borderRadius: theme.borderRadiusMd, display: 'flex', alignItems: 'center', gap: theme.spacing.sm, transition: 'color 0.2s ease, background-color 0.2s ease', textDecoration:'none' };
//   const navLinkActiveStyle = { color: theme.primary, backgroundColor: theme.primaryLight, fontWeight: theme.fontWeightSemibold };
//   const userActionsStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.md };
//   const userMenuStyle = { position: 'relative' };
//   const userButtonStyle = { background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: theme.spacing.sm, cursor: 'pointer', padding: theme.spacing.xs, borderRadius: theme.borderRadiusMd, transition: 'background-color 0.2s ease' };
//   const userAvatarStyle = { width: '36px', height: '36px', borderRadius: theme.borderRadiusFull, objectFit: 'cover', border: `2px solid ${theme.border}` };
//   const userAvatarPlaceholderStyle = { ...userAvatarStyle, backgroundColor: theme.primary, color: theme.textOnPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: theme.fontWeightBold, fontSize: '1.1rem' };
//   const userNameStyle = { fontWeight: theme.fontWeightMedium, color: theme.textPrimary, fontSize: '0.9rem' };
//   const dropdownContentStyle = { position: 'absolute', right: 0, top: `calc(100% + ${theme.spacing.sm}px)`, backgroundColor: theme.backgroundAlt, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusLg, minWidth: '220px', boxShadow: theme.shadowModal, zIndex: theme.zIndexDropdown, overflow: 'hidden' };
//   const dropdownHeaderStyle = { padding: theme.spacing.md, borderBottom: `1px solid ${theme.border}`};
//   const dropdownItemStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, padding: `${theme.spacing.sm}px ${theme.spacing.md}px`, color: theme.textSecondary, fontSize: '0.9rem', textDecoration: 'none', transition: 'background-color 0.15s ease, color 0.15s ease' };
//   const mobileMenuButtonStyle = { background: 'none', border: 'none', color: theme.textPrimary, fontSize: '1.75rem', padding: theme.spacing.xs, cursor: 'pointer' };
//   const mobileNavStyle = { position: 'fixed', top: '65px', right: 0, bottom: 0, width: '280px', backgroundColor: theme.backgroundAlt, borderLeft: `1px solid ${theme.border}`, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', zIndex: theme.zIndexSticky -1, padding: `${theme.spacing.lg}px ${theme.spacing.md}px`, display: 'flex', flexDirection: 'column', gap: `${theme.spacing.sm}px`};


//   const UserMenuContent = () => (
//     <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={dropdownContentStyle} >
//       <div style={dropdownHeaderStyle}>
//         <span style={{ fontWeight: theme.fontWeightSemibold, display:'block' }}>{user?.name}</span>
//         <span style={{ fontSize: theme.fontSizeSm, color: theme.textMuted, display:'block' }}>{user?.email}</span>
//       </div>
//       <Link to={PATHS.USER_PROFILE.replace(':userId', user?._id || 'me')} style={dropdownItemStyle} onClick={() => setIsUserMenuOpen(false)}>
//         <FaUserCircle style={{opacity: 0.7}} /> Profile
//       </Link>
//       <Link to={PATHS.SETTINGS || '/settings'} style={dropdownItemStyle} onClick={() => setIsUserMenuOpen(false)}>
//         <FaCog style={{opacity: 0.7}}/> Settings
//       </Link>
//       <button onClick={handleLogout} style={{...dropdownItemStyle, width: '100%', textAlign: 'left', color: theme.error}}>
//         <FaSignOutAlt style={{opacity: 0.7}}/> Logout
//       </button>
//     </motion.div>
//   );
  
//   return (
//     <header style={headerStyle}>
//       <Link to={isAuthenticated ? PATHS.HOME : PATHS.LANDING} style={logoStyle}>
//         <FaChartPie style={{ fontSize: '1.3em' }} /> TradePath X
//       </Link>

//       {/* {isAuthenticated && (
//         <nav style={mainNavDesktopStyle} className="hidden md:flex"> {/* Hide on mobile */}
//           {/* {navLinks.map(link => (
//             <NavLink key={link.path} to={link.path}
//               style={({ isActive }) => ({ ...navLinkBaseStyle, ...(isActive ? navLinkActiveStyle : {}) })}
//             >
//               {link.icon && <span style={{ fontSize: '1.1em', opacity: isActive ? 1 : 0.7 }}>{link.icon}</span>}
//               {link.label}
//             </NavLink>
//           ))}
//         </nav> */}
      

// {isAuthenticated && (
//   <nav style={mainNavDesktopStyle} className="hidden md:flex">
//     {navLinks.map(link => (
//       <NavLink
//         key={link.path}
//         to={link.path}
//         className="flex items-center gap-2"
//         style={({ isActive }) => {
//           return {
//             ...navLinkBaseStyle,
//             ...(isActive ? navLinkActiveStyle : {}),
//           };
//         }}
//       >
//         {({ isActive }) => (
//           <>
//             {link.icon && (
//               <span style={{ fontSize: '1.1em', opacity: isActive ? 1 : 0.7 }}>
//                 {link.icon}
//               </span>
//             )}
//             {link.label}
//           </>
//         )}
//       </NavLink>
//     ))}
//   </nav>
// )}

//       <div style={userActionsStyle}>
//         {isAuthenticated && user ? (
//           <>
//             <motion.button style={{...userButtonStyle, padding: theme.spacing.sm, fontSize: '1.2rem', color: theme.textSecondary}} whileHover={{color: theme.textPrimary, backgroundColor: theme.surface}} aria-label="Notifications">
//               {/* <NotificationBell /> */}
//             </motion.button>
//             <div style={userMenuStyle} ref={userMenuRef}>
//               <motion.button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} style={userButtonStyle} whileHover={{backgroundColor: theme.surface}} aria-expanded={isUserMenuOpen} aria-label="User menu">
//                 {user.profilePicture ? (
//                   <img src={user.profilePicture} alt={user.name} style={userAvatarStyle} />
//                 ) : (
//                   <div style={userAvatarPlaceholderStyle}>
//                     {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle style={{fontSize: '1.5rem'}}/>}
//                   </div>
//                 )}
//                 <span style={{...userNameStyle, display: 'none'}} className="lg:inline">{user.name}</span> {/* Hide on small screens */}
//                 <FaAngleDown style={{color: theme.textMuted, transition: 'transform 0.2s', transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}/>
//               </motion.button>
//               <AnimatePresence>{isUserMenuOpen && <UserMenuContent />}</AnimatePresence>
//             </div>
//           </>
//         ) : (
//           <div style={{display: 'flex', alignItems: 'center', gap: theme.spacing.sm}} className="hidden md:flex">
//             <Link to={PATHS.LOGIN}><Button variant="ghost" size="sm">Login</Button></Link>
//             <Link to={PATHS.SIGNUP}><Button variant="primary" size="sm">Sign Up</Button></Link>
//           </div>
//         )}
//         <button style={{...mobileMenuButtonStyle, display: 'block'}} className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
//           {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
//         </button>
//       </div>

//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.nav initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: 'tween', ease: 'easeInOut' }} style={mobileNavStyle} className="md:hidden" >
//             {isAuthenticated && navLinks.map(link => (
//               <NavLink key={link.path} to={link.path} style={({ isActive }) => ({ ...navLinkBaseStyle, ...(isActive ? navLinkActiveStyle : {}), padding: theme.spacing.md, fontSize: '1rem' })} onClick={() => setIsMobileMenuOpen(false)}>
//                 {link.icon} {link.label}
//               </NavLink>
//             ))}
//             <div style={{marginTop: 'auto', paddingTop: theme.spacing.lg, borderTop: `1px solid ${theme.border}`}}>
//                 {isAuthenticated && user ? (
//                     <>
//                         <Link to={PATHS.USER_PROFILE.replace(':userId', user._id || 'me')} style={{...navLinkBaseStyle, padding: theme.spacing.md, fontSize: '1rem'}} onClick={() => setIsMobileMenuOpen(false)}><FaUserCircle/> Profile</Link>
//                         <Link to={PATHS.SETTINGS || '/settings'} style={{...navLinkBaseStyle, padding: theme.spacing.md, fontSize: '1rem'}} onClick={() => setIsMobileMenuOpen(false)}><FaCog/> Settings</Link>
//                         <button onClick={handleLogout} style={{...navLinkBaseStyle, width: '100%', justifyContent:'flex-start', padding: theme.spacing.md, fontSize: '1rem', color: theme.error}}><FaSignOutAlt/> Logout</button>
//                     </>
//                 ) : (
//                     <>
//                         <Link to={PATHS.LOGIN} style={{...navLinkBaseStyle, padding: theme.spacing.md, fontSize: '1rem'}} onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
//                         <Link to={PATHS.SIGNUP} style={{...navLinkBaseStyle, padding: theme.spacing.md, fontSize: '1rem', backgroundColor: theme.primary, color: theme.textOnPrimary}} onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
//                     </>
//                 )}
//             </div>
//           </motion.nav>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// };
// export default Header;
import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChartPie,
  FaSignOutAlt,
  FaCog,
  FaUserCircle,
  FaAngleDown,
  FaBars,
  FaTimes,
  FaBookOpen,
  FaMicroscope,
  FaUsers,
  FaLayerGroup,
  FaFacebookMessenger,
} from 'react-icons/fa';

import { PATHS } from '@/app/routing/paths';
import { logout } from '@/features/Auth/model/authSlice';
import { useClickOutside } from '@/core/hooks/useClickOutside';
import { Button } from '@/shared/ui';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: PATHS.JOURNAL || '/journal', label: 'Journal', icon: <FaBookOpen /> },
    { path: PATHS.BACKTEST_DASHBOARD || '/backtesting', label: 'Backtest', icon: <FaMicroscope /> },
    { path: PATHS.COMMUNITY_FEED || '/community', label: 'Community', icon: <FaUsers /> },
    { path: PATHS.GROUP_DISCOVERY || '/groups', label: 'Groups', icon: <FaLayerGroup /> },
    { path: PATHS.MESSAGEING || '/messages', label: 'Messages', icon: <FaFacebookMessenger /> },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-xl border-b border-white/10" />

      <div className="relative max-w-7xl mx-auto px-4 h-[68px] flex items-center justify-between">
        {/* LOGO */}
        <Link
          to={isAuthenticated ? PATHS.HOME : PATHS.LANDING}
          className="flex items-center gap-2 text-lg font-semibold text-white tracking-wide"
        >
          <span className="p-2 rounded-xl bg-primary/20 text-primary backdrop-blur">
            <FaChartPie />
          </span>
          <span className="hidden sm:block">TradePath X</span>
        </Link>

        {/* DESKTOP NAV */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 ml-10">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path}>
                {({ isActive }) => (
                  <motion.div
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
                      ${
                        isActive
                          ? 'text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {link.icon}
                    {link.label}

                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl bg-white/10 border border-white/10"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </nav>
        )}

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          {/* AUTH USER */}
          {isAuthenticated && user ? (
            <div ref={userMenuRef} className="relative">
              <motion.button
                onClick={() => setIsUserMenuOpen((v) => !v)}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-white/10 transition"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || <FaUserCircle />}
                  </div>
                )}
                <FaAngleDown
                  className={`text-white/60 transition ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </motion.button>

              {/* USER DROPDOWN */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-64 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-white/50 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to={PATHS.USER_PROFILE.replace(':userId', user._id || 'me')}
                      className="dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUserCircle /> Profile
                    </Link>

                    <Link
                      to={PATHS.SETTINGS || '/settings'}
                      className="dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaCog /> Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-red-400 hover:text-red-300"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to={PATHS.LOGIN}>
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to={PATHS.SIGNUP}>
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="md:hidden text-white text-xl"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-72 bg-black/70 backdrop-blur-xl border-l border-white/10 z-50 p-5 flex flex-col gap-2"
          >
            {isAuthenticated &&
              navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white"
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}

            <div className="mt-auto pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
                >
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <>
                  <Link to={PATHS.LOGIN} className="dropdown-item">
                    Login
                  </Link>
                  <Link
                    to={PATHS.SIGNUP}
                    className="dropdown-item bg-primary/20 text-primary"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
