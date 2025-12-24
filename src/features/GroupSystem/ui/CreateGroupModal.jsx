// frontend/src/features/GroupSystem/ui/CreateGroupModal.jsx (COMPLETE)
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaLock } from 'react-icons/fa';

import { createGroup } from '@/entities/Group/model/groupSlice';
import { Button, Input, Form, FormGroup, FormLabel, } from '@/shared/ui';
import { theme } from '@/styles/theme'
import { Modal } from '@/shared/ui/modal/Modal';
export const CreateGroupModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector(state => state.groups);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupType, setGroupType] = useState('PUBLIC');
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("Logo size must be < 2MB"); return; }
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => { setName(''); setDescription(''); setGroupType('PUBLIC'); setLogoFile(null); setPreview(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { alert('Group name is required.'); return; }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('groupType', groupType);
    if (logoFile) formData.append('groupLogo', logoFile);
    
    try {
      const resultAction = await dispatch(createGroup(formData)).unwrap();
      resetForm();
      onClose();
      navigate(`/groups/${resultAction._id}`);
    } catch (err) {
      console.log(err)
    }
  };
  
  const formStyle = { display: 'flex', flexDirection: 'column', gap: theme.spacing.lg };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a New Community Group">
    <Form onSubmit={handleSubmit} style={formStyle}>
      <FormGroup><FormLabel>Group Name</FormLabel><Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Ethereum Day Traders"/></FormGroup>
      <FormGroup><FormLabel>Description</FormLabel><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" style={{width: '100%', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusMd, padding: theme.spacing.md, color: theme.textPrimary}}/></FormGroup>
      <FormGroup>
        <FormLabel>Group Type</FormLabel>
        <div style={{display:'flex', gap: theme.spacing.md}}>
          <Button type="button" variant={groupType === 'PUBLIC' ? 'primary' : 'secondary'} onClick={() => setGroupType('PUBLIC')} leftIcon={<FaGlobe/>}>Public</Button>
          <Button type="button" variant={groupType === 'PRIVATE' ? 'primary' : 'secondary'} onClick={() => setGroupType('PRIVATE')} leftIcon={<FaLock/>}>Private</Button>
        </div>
      </FormGroup>
      <div style={{display:'flex', justifyContent:'flex-end', gap: theme.spacing.md, borderTop: `1px solid ${theme.border}`, paddingTop: theme.spacing.md, marginTop: theme.spacing.md}}>
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={status === 'submitting'}>Create Group</Button>
      </div>
    </Form>
  </Modal>
  );
};