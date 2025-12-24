import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CgClose } from 'react-icons/cg';
import { FaUser, FaInfoCircle, FaLink, FaTwitter, FaLinkedin, FaUpload } from 'react-icons/fa';
import { updateUserProfile } from '@/features/Social/model/socialSlice';
import { Button, Input, Form, FormGroup, FormLabel } from '@/shared/ui';
import { theme } from '@/styles/theme';

export const EditProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const { status: socialStatus } = useSelector(state => state.social);
  const [formData, setFormData] = useState({ name: '', bio: '', socialLinks: { website: '', twitter: '', linkedin: '' } });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profileBannerFile, setProfileBannerFile] = useState(null);
  const [picPreview, setPicPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        socialLinks: {
          website: user.socialLinks?.website || '',
          twitter: user.socialLinks?.twitter || '',
          linkedin: user.socialLinks?.linkedin || '',
        },
      });
      setPicPreview(user.profilePicture ? `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${user.profilePicture}` : '');
      setBannerPreview(user.profileBannerUrl ? `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${user.profileBannerUrl}` : '');
      setProfilePicFile(null);
      setProfileBannerFile(null);
    }
  }, [user, isOpen]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === 'avatar' && file.size > 2 * 1024 * 1024) { alert("Avatar size must be < 2MB"); return; }
    if (type === 'banner' && file.size > 5 * 1024 * 1024) { alert("Banner size must be < 5MB"); return; }
    
    if (type === 'avatar') {
      setProfilePicFile(file);
      setPicPreview(URL.createObjectURL(file));
    } else {
      setProfileBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSocialChange = (e) => {
    setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [e.target.name]: e.target.value }}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio);
    data.append('socialLinks', JSON.stringify(formData.socialLinks));
    if (profilePicFile) data.append('profilePicture', profilePicFile);
    if (profileBannerFile) data.append('profileBanner', profileBannerFile);
    
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      onClose();
    } catch (err) { /* Toast handled in slice */ }
  };
  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 32, 0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: theme.zIndexModalBackdrop };
  const modalStyle = { backgroundColor: theme.backgroundAlt, padding: theme.spacing.lg, borderRadius: theme.borderRadiusXl, boxShadow: theme.shadowModal, width: '100%', maxWidth: '650px', height: '70vh', border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column' };

  const titleStyle = { fontSize: '1.25rem', fontWeight: theme.fontWeightSemibold };




  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div style={overlayStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div style={modalStyle} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: theme.spacing.lg}}>
                <h2 style={{...titleStyle, marginBottom: 0}}>Edit Your Profile</h2>
                <Button variant="ghost" onClick={onClose} style={{ fontSize: '1.5rem', padding: theme.spacing.sm }}><CgClose /></Button>
            </div>
            <Form onSubmit={handleSubmit} style={{gap: theme.spacing.lg}}>
              <FormGroup>
                <FormLabel>Profile Picture & Banner</FormLabel>
                <div style={{display:'flex', alignItems:'center', gap: theme.spacing.md}}>
                  <div style={{position:'relative'}}>
                    <img src={picPreview || `https://i.pravatar.cc/80?u=${user._id}`} alt="Profile preview" style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover'}}/>
                    <label htmlFor="profile-pic-upload" style={{position:'absolute', bottom:0, right:0, backgroundColor: theme.surface, padding: theme.spacing.xs, borderRadius:'50%', cursor:'pointer', border: `1px solid ${theme.border}`}}><FaUpload /></label>
                    <input type="file" id="profile-pic-upload" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} style={{display:'none'}}/>
                  </div>
                  <div style={{flexGrow:1}}>
                     <label htmlFor="profile-banner-upload">
                        <div style={{border: `2px dashed ${theme.border}`, borderRadius: theme.borderRadiusMd, height: '80px', display:'flex', alignItems:'center', justifyContent:'center', color: theme.textMuted, background: bannerPreview ? `url(${bannerPreview}) center/cover` : theme.surfaceLight, cursor:'pointer'}}>
                          {!bannerPreview && <span>Upload Banner</span>}
                        </div>
                    </label>
                     <input type="file" id="profile-banner-upload" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} style={{display:'none'}}/>
                  </div>
                </div>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} leftIcon={<FaUser/>}/>
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="bio">Bio</FormLabel>
                <textarea id="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} maxLength="160" rows="3" style={{width: '100%', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusMd, padding: theme.spacing.md, color: theme.textPrimary, resize: 'none'}}/>
              </FormGroup>
              
              <h3 style={{fontSize: '1rem', fontWeight: theme.fontWeightSemibold, borderTop: `1px solid ${theme.border}`, paddingTop: theme.spacing.md}}>Social Links</h3>
              <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md}}>
                <FormGroup><FormLabel>Website</FormLabel><Input name="website" value={formData.socialLinks.website} onChange={handleSocialChange} leftIcon={<FaLink/>}/></FormGroup>
                <FormGroup><FormLabel>Twitter</FormLabel><Input name="twitter" value={formData.socialLinks.twitter} onChange={handleSocialChange} leftIcon={<FaTwitter/>} placeholder="username"/></FormGroup>
              </div>

              <div style={{display:'flex', justifyContent:'flex-end', marginTop: theme.spacing.md, gap: theme.spacing.md}}>
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary" isLoading={socialStatus === 'loading'} disabled={socialStatus === 'loading'}>Save Changes</Button>
              </div>
            </Form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};