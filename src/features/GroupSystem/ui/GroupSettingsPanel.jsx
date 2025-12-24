// frontend/src/features/GroupSystem/ui/GroupSettingsPanel.jsx (COMPLETE)
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroupDetails } from '@/entities/Group/model/groupSlice';
import { Button, Input, Form, FormGroup, FormLabel } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { FaGlobe, FaLock } from 'react-icons/fa';

export const GroupSettingsPanel = ({ group }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.groups);
  const [formData, setFormData] = useState({ name: '', description: '', rules: '', groupType: 'PUBLIC' });
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        description: group.description || '',
        rules: group.rules || '',
        groupType: group.groupType || 'PUBLIC',
      });
      setPreview(group.logoUrl ? `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${group.logoUrl}` : '');
    }
  }, [group]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('rules', formData.rules);
    data.append('groupType', formData.groupType);
    if (logoFile) data.append('groupLogo', logoFile);
    
    dispatch(updateGroupDetails({ groupId: group._id, formData: data }));
  };

  const containerStyle = { padding: theme.spacing.lg };
  const formStyle = { display: 'flex', flexDirection: 'column', gap: theme.spacing.lg };

  return (
    <div style={containerStyle}>
      <h3 style={{fontSize:'1.2rem', fontWeight:theme.fontWeightSemibold, marginBottom: theme.spacing.md}}>Group Settings</h3>
      <Form onSubmit={handleSubmit} style={formStyle}>
        <FormGroup>
          <FormLabel>Group Logo</FormLabel>
          <div style={{display:'flex', alignItems:'center', gap: theme.spacing.md}}>
            <img src={preview || `https://i.pravatar.cc/80?u=${group._id}`} alt="Logo preview" style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${theme.border}`}}/>
            <input type="file" id="group-logo-upload" accept="image/*" onChange={handleFileChange} style={{display:'none'}}/>
            <label htmlFor="group-logo-upload"><Button type="button" variant="secondary" as="span">Change Logo</Button></label>
          </div>
        </FormGroup>
        <FormGroup><FormLabel>Group Name</FormLabel><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></FormGroup>
        <FormGroup><FormLabel>Description</FormLabel><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" style={{width: '100%', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusMd, padding: theme.spacing.md}}/></FormGroup>
        <FormGroup><FormLabel>Rules</FormLabel><textarea value={formData.rules} onChange={(e) => setFormData({...formData, rules: e.target.value})} rows="4" style={{width: '100%', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusMd, padding: theme.spacing.md}}/></FormGroup>
        <FormGroup>
          <FormLabel>Group Type</FormLabel>
          <div style={{display:'flex', gap: theme.spacing.md}}>
            <Button type="button" variant={formData.groupType === 'PUBLIC' ? 'primary' : 'secondary'} onClick={() => setFormData({...formData, groupType: 'PUBLIC'})} leftIcon={<FaGlobe/>}>Public</Button>
            <Button type="button" variant={formData.groupType === 'PRIVATE' ? 'primary' : 'secondary'} onClick={() => setFormData({...formData, groupType: 'PRIVATE'})} leftIcon={<FaLock/>}>Private</Button>
          </div>
        </FormGroup>
        <div style={{display:'flex', justifyContent:'flex-end', marginTop: theme.spacing.md}}>
          <Button type="submit" variant="primary" isLoading={status === 'submitting'}>Save Changes</Button>
        </div>
      </Form>
    </div>
  );
};