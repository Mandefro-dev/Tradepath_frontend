import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaGlobe, FaLock } from 'react-icons/fa';
import { theme } from '@/styles/theme';

export const GroupCard = ({ group }) => {
  const cardStyle = { backgroundColor: theme.backgroundAlt, borderRadius: theme.borderRadiusXl, boxShadow: theme.shadowCard, border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease', textDecoration: 'none' };
  const logoStyle = { height: '120px', backgroundColor: theme.surface, backgroundSize: 'cover', backgroundPosition: 'center' };
  const contentStyle = { padding: theme.spacing.md, flexGrow: 1, display: 'flex', flexDirection: 'column' };
  const titleStyle = { fontWeight: theme.fontWeightSemibold, color: theme.textPrimary, marginBottom: theme.spacing.xs, fontSize: '1.1rem' };
  const descriptionStyle = { color: theme.textSecondary, fontSize: theme.fontSizeSm, flexGrow: 1, marginBottom: theme.spacing.md, lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' };
  const footerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.textMuted, fontSize: theme.fontSizeSm, marginTop: 'auto', paddingTop: theme.spacing.sm };

  return (
    <motion.div whileHover={{ y: -5, boxShadow: theme.shadowModal }}>
      <Link to={`/groups/${group._id}`} style={cardStyle}>
        <div style={{...logoStyle, backgroundImage: group.logoUrl ? `url(${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${group.logoUrl})` : `linear-gradient(45deg, ${theme.surfaceLight}, ${theme.surface})`}}></div>
        <div style={contentStyle}>
          <h3 style={titleStyle}>{group.name}</h3>
          <p style={descriptionStyle}>{group.description || 'No description available.'}</p>
          <div style={footerStyle}>
            <span style={{display:'flex', alignItems: 'center', gap: '6px'}}><FaUsers style={{opacity: 0.7}}/> {group.memberCount} Members</span>
            <span style={{textTransform: 'capitalize', display:'flex', alignItems: 'center', gap: '6px'}}>{group.groupType === 'PUBLIC' ? <FaGlobe style={{opacity:0.7}}/> : <FaLock style={{opacity:0.7}}/>}{group.groupType.toLowerCase()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};