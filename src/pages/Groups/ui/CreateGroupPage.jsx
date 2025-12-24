import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGroup, } from '@/entities/Group/model/groupSlice';
import { Button, Input, Textarea } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { motion } from 'framer-motion';

export const CreateGroupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { creationStatus } = useSelector((state) => state.groups);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupType, setGroupType] = useState('PUBLIC'); // or 'PRIVATE'
  const [logo, setLogo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (creationStatus === 'submitting') return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('groupType', groupType);
    if (logo) {
      formData.append('logo', logo); // 'logo' should match your backend's multer field name
    }

    dispatch(createGroup(formData));
  };

  useEffect(() => {
    // When creation is successful, redirect to the discovery page
    if (creationStatus === 'succeeded') {
      dispatch(); // Reset status for next time
      navigate('/groups');
    }
    // You could also handle the 'failed' state here, though the toast in the slice does this already
  }, [creationStatus, dispatch, navigate]);

  const pageStyle = { maxWidth: '700px', margin: '40px auto', padding: theme.spacing.lg, backgroundColor: theme.backgroundAlt, borderRadius: theme.borderRadiusXl };
  const formStyle = { display: 'flex', flexDirection: 'column', gap: theme.spacing.md };

  return (
    <motion.div style={pageStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: theme.fontWeightBold, marginBottom: theme.spacing.lg }}>Create a New Group</h1>
      <form style={formStyle} onSubmit={handleSubmit}>
        <Input
          label="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Pro Day Traders"
          required
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is the purpose of your group?"
          rows={4}
        />
        {/* You can add a file input for the logo here */}
        {/* <Input type="file" label="Group Logo" onChange={(e) => setLogo(e.target.files[0])} /> */}

        <Button
          type="submit"
          variant="primary"
          isLoading={creationStatus === 'submitting'}
          disabled={creationStatus === 'submitting'}
        >
          {creationStatus === 'submitting' ? 'Creating...' : 'Create Group'}
        </Button>
      </form>
    </motion.div>
  );
};

export default CreateGroupPage;