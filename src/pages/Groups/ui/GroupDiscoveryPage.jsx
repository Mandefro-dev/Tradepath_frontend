// frontend/src/pages/Groups/ui/GroupDiscoveryPage.jsx (COMPLETE)
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchPublicGroups } from '@/entities/Group/model/groupSlice';
import { Loader, Button, Input } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { GroupCard } from '@/entities/Group/ui/GroupCard';
import { CreateGroupModal } from '@/features/GroupSystem/ui/CreateGroupModal';

export const GroupDiscoveryPage = () => {
  const dispatch = useDispatch();
  const { items: groups, pagination, status } = useSelector((state) => state.groups.publicGroups);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchPublicGroups({ page: 1 }));
  }, [dispatch]);
  
  const pageStyle = { maxWidth: '1200px', margin: '0 auto', padding: theme.spacing.lg };

  return (
    <motion.div style={pageStyle} initial={{opacity:0}} animate={{opacity:1}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: theme.spacing.lg}}>
        <h1 style={{fontSize:'2rem', fontWeight:theme.fontWeightBold}}>Discover Groups</h1>
        <Button variant="primary" leftIcon={<FaPlus/>} onClick={() => setIsCreateModalOpen(true)}>Create Group</Button>
      </div>
      <CreateGroupModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      
      {status === 'loading' && groups.length === 0 && <div style={{padding: '40px', display:'flex', justifyContent:'center'}}><Loader message="Finding communities..."/></div>}
      {groups.length === 0 && status !== 'loading' && <p style={{textAlign:'center', color:theme.textMuted, padding:'40px'}}>No public groups found. Why not create the first one?</p>}
      
      <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: theme.spacing.lg}}>
        {groups.map(group => <GroupCard key={group._id} group={group} />)}
      </div>

      {pagination.hasMore && status !== 'loading' && 
        <div style={{textAlign:'center', marginTop: theme.spacing.lg}}>
            <Button onClick={() => dispatch(fetchPublicGroups({page: pagination.currentPage + 1}))}>Load More</Button>
        </div>
      }
    </motion.div>
  );
};
export default GroupDiscoveryPage;