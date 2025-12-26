import React, { useState, useEffect } from 'react';
import {
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import {
  getAboutUsContent,
  updateAboutHero,
  updateAboutStory,
  updateAboutLegacy,
  getAboutStats,
  createAboutStat,
  updateAboutStat,
  deleteAboutStat,
  toggleAboutStatVisibility,
  updateAboutTestimonialsSection,
  getAboutTestimonials,
  createAboutTestimonial,
  updateAboutTestimonial,
  deleteAboutTestimonial,
  toggleAboutTestimonialVisibility,
  getAboutRatings,
  createAboutRating,
  updateAboutRating,
  deleteAboutRating,
  toggleAboutRatingVisibility,
  updateAboutApproachSection,
  getAboutApproachItems,
  createAboutApproachItem,
  updateAboutApproachItem,
  deleteAboutApproachItem,
  toggleAboutApproachItemVisibility,
  toggleAboutHeroVisibility,
  toggleAboutStoryVisibility,
  toggleAboutLegacyVisibility,
  toggleAboutTestimonialsSectionVisibility,
  toggleAboutApproachSectionVisibility,
  updateAboutMissionVision,
  toggleAboutMissionVisionVisibility,
  updateAboutCoreValuesSection,
  toggleAboutCoreValuesSectionVisibility,
  getAboutCoreValues,
  createAboutCoreValue,
  updateAboutCoreValue,
  deleteAboutCoreValue,
  toggleAboutCoreValueVisibility
} from '../services/cmsApi';
import { uploadImage } from '../services/uploadApi';

const AboutUsAdmin = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hero Section
  const [editingHero, setEditingHero] = useState(false);
  const [heroForm, setHeroForm] = useState({
    badge_text: '',
    title: '',
    highlighted_text: '',
    title_after: '',
    description: '',
    button_text: '',
    button_link: '',
    image_url: '',
    stat_value: '',
    stat_label: ''
  });
  const [heroVisible, setHeroVisible] = useState(true);

  // Story Section
  const [editingStory, setEditingStory] = useState(false);
  const [storyForm, setStoryForm] = useState({
    header_title: '',
    header_description: '',
    founding_year: '',
    story_items: [],
    image_url: '',
    badge_value: '',
    badge_label: '',
    top_badge_value: '',
    top_badge_label: ''
  });
  const [storyVisible, setStoryVisible] = useState(true);

  // Legacy Section
  const [editingLegacy, setEditingLegacy] = useState(false);
  const [legacyForm, setLegacyForm] = useState({
    header_title: '',
    header_description: ''
  });
  const [legacyVisible, setLegacyVisible] = useState(true);
  const [stats, setStats] = useState([]);
  const [editingStat, setEditingStat] = useState(null);
  const [showStatModal, setShowStatModal] = useState(false);
  const [statForm, setStatForm] = useState({ label: '', value: '', order_index: 0, is_visible: 1 });

  // Testimonials Section
  const [editingTestimonialsSection, setEditingTestimonialsSection] = useState(false);
  const [testimonialsSectionForm, setTestimonialsSectionForm] = useState({
    header_title: '',
    header_description: ''
  });
  const [testimonialsSectionVisible, setTestimonialsSectionVisible] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editingRating, setEditingRating] = useState(null);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ quote: '', company: '', author: '', page_index: 0, order_index: 0, is_visible: 1 });
  const [ratingForm, setRatingForm] = useState({ platform: '', rating_value: '', platform_icon: 'G', order_index: 0, is_visible: 1 });

  // Approach Section
  const [editingApproachSection, setEditingApproachSection] = useState(false);
  const [approachSectionForm, setApproachSectionForm] = useState({
    header_title: '',
    header_description: '',
    cta_button_text: '',
    cta_button_url: ''
  });
  const [approachSectionVisible, setApproachSectionVisible] = useState(true);
  const [approachItems, setApproachItems] = useState([]);
  const [editingApproachItem, setEditingApproachItem] = useState(null);
  const [showApproachItemModal, setShowApproachItemModal] = useState(false);
  const [approachItemForm, setApproachItemForm] = useState({ title: '', description: '', icon_type: 'database', order_index: 0, is_visible: 1 });

  // Mission & Vision Section
  const [editingMissionVision, setEditingMissionVision] = useState(false);
  const [missionVisionForm, setMissionVisionForm] = useState({
    header_title: '',
    header_description: '',
    mission_title: '',
    mission_description: '',
    vision_title: '',
    vision_description: ''
  });
  const [missionVisionVisible, setMissionVisionVisible] = useState(true);

  // Core Values Section
  const [editingCoreValuesSection, setEditingCoreValuesSection] = useState(false);
  const [coreValuesSectionForm, setCoreValuesSectionForm] = useState({
    header_title: '',
    header_description: ''
  });
  const [coreValuesSectionVisible, setCoreValuesSectionVisible] = useState(true);
  const [coreValues, setCoreValues] = useState([]);
  const [editingCoreValue, setEditingCoreValue] = useState(null);
  const [showCoreValueModal, setShowCoreValueModal] = useState(false);
  const [coreValueForm, setCoreValueForm] = useState({ title: '', description: '', icon_type: 'lightbulb', order_index: 0, is_visible: 1 });

  // Fetch all About Us content
  const fetchAboutUsContent = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch with all=true to get hidden sections for admin
      const timestamp = new Date().getTime();
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/about?all=true&t=${timestamp}`);
      const data = await response.json();
      setAboutData(data);

      // Initialize hero form
      if (data.hero) {
        setHeroForm({
          badge_text: data.hero.badge_text || '',
          title: data.hero.title || '',
          highlighted_text: data.hero.highlighted_text || '',
          title_after: data.hero.title_after || 'Control',
          description: data.hero.description || '',
          button_text: data.hero.button_text || '',
          button_link: data.hero.button_link || '',
          image_url: data.hero.image_url || '',
          stat_value: data.hero.stat_value || '',
          stat_label: data.hero.stat_label || ''
        });
        setHeroVisible(data.hero.is_visible !== 0);
      }

      // Initialize story form
      if (data.story) {
        let storyItems = [];
        if (data.story.story_items) {
          try {
            storyItems = typeof data.story.story_items === 'string'
              ? JSON.parse(data.story.story_items)
              : data.story.story_items;
          } catch (e) {
            storyItems = Array.isArray(data.story.story_items) ? data.story.story_items : [];
          }
        }
        setStoryForm({
          header_title: data.story.header_title || '',
          header_description: data.story.header_description || '',
          founding_year: data.story.founding_year || '',
          story_items: storyItems,
          image_url: data.story.image_url || '',
          badge_value: data.story.badge_value || '',
          badge_label: data.story.badge_label || '',
          top_badge_value: data.story.top_badge_value || '',
          top_badge_label: data.story.top_badge_label || ''
        });
        setStoryVisible(data.story.is_visible !== 0);
      }

      // Initialize legacy form
      if (data.legacy) {
        setLegacyForm({
          header_title: data.legacy.header_title || '',
          header_description: data.legacy.header_description || ''
        });
        setLegacyVisible(data.legacy.is_visible !== 0);
      }

      // Initialize testimonials section form
      if (data.testimonialsSection) {
        setTestimonialsSectionForm({
          header_title: data.testimonialsSection.header_title || '',
          header_description: data.testimonialsSection.header_description || ''
        });
        setTestimonialsSectionVisible(data.testimonialsSection.is_visible !== 0);
      }

      // Initialize approach section form
      if (data.approachSection) {
        setApproachSectionForm({
          header_title: data.approachSection.header_title || '',
          header_description: data.approachSection.header_description || '',
          cta_button_text: data.approachSection.cta_button_text || '',
          cta_button_url: data.approachSection.cta_button_url || ''
        });
        setApproachSectionVisible(data.approachSection.is_visible !== 0);
      }

      // Initialize mission & vision form
      if (data.missionVision) {
        setMissionVisionForm({
          header_title: data.missionVision.header_title || '',
          header_description: data.missionVision.header_description || '',
          mission_title: data.missionVision.mission_title || '',
          mission_description: data.missionVision.mission_description || '',
          vision_title: data.missionVision.vision_title || '',
          vision_description: data.missionVision.vision_description || ''
        });
        setMissionVisionVisible(data.missionVision.is_visible !== 0);
      }

      // Initialize core values section form
      if (data.coreValuesSection) {
        setCoreValuesSectionForm({
          header_title: data.coreValuesSection.header_title || '',
          header_description: data.coreValuesSection.header_description || ''
        });
        setCoreValuesSectionVisible(data.coreValuesSection.is_visible !== 0);
      }

      // Fetch stats
      const statsData = await getAboutStats(true);
      setStats(statsData || []);

      // Fetch testimonials and ratings
      const testimonialsData = await getAboutTestimonials(true);
      setTestimonials(testimonialsData || []);

      const ratingsData = await getAboutRatings(true);
      setRatings(ratingsData || []);

      // Fetch approach items
      const approachItemsData = await getAboutApproachItems(true);
      setApproachItems(approachItemsData || []);

      // Fetch core values
      const coreValuesData = await getAboutCoreValues(true);
      setCoreValues(coreValuesData || []);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching About Us content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutUsContent();
  }, []);

  // Hero Section Handlers
  const handleHeroUpdate = async () => {
    try {
      await updateAboutHero(heroForm);
      await fetchAboutUsContent();
      setEditingHero(false);
      alert('Hero section updated successfully!');
    } catch (err) {
      alert('Error updating hero section: ' + err.message);
    }
  };

  const handleToggleHeroVisibility = async () => {
    try {
      await toggleAboutHeroVisibility();
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling hero visibility: ' + err.message);
    }
  };

  // Story Section Handlers
  const handleStoryUpdate = async () => {
    try {
      const updateData = {
        ...storyForm,
        story_items: JSON.stringify(storyForm.story_items)
      };
      await updateAboutStory(updateData);
      await fetchAboutUsContent();
      setEditingStory(false);
      alert('Story section updated successfully!');
    } catch (err) {
      alert('Error updating story section: ' + err.message);
    }
  };

  const handleStoryItemChange = (index, value) => {
    const newItems = [...storyForm.story_items];
    newItems[index] = value;
    setStoryForm({ ...storyForm, story_items: newItems });
  };

  const addStoryItem = () => {
    setStoryForm({ ...storyForm, story_items: [...storyForm.story_items, ''] });
  };

  const removeStoryItem = (index) => {
    const newItems = storyForm.story_items.filter((_, i) => i !== index);
    setStoryForm({ ...storyForm, story_items: newItems });
  };

  const handleStoryImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Image size should not exceed 5MB');
      return;
    }

    try {
      const response = await uploadImage(file);
      if (response.filePath) {
        // Update the story form with the uploaded image path
        setStoryForm({ ...storyForm, image_url: response.filePath });
        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + (error.response?.data?.error || error.message));
    }
  };


  // Legacy Section Handlers
  const handleLegacyUpdate = async () => {
    try {
      await updateAboutLegacy(legacyForm);
      await fetchAboutUsContent();
      setEditingLegacy(false);
      alert('Legacy section updated successfully!');
    } catch (err) {
      alert('Error updating legacy section: ' + err.message);
    }
  };

  const handleToggleStoryVisibility = async () => {
    try {
      await toggleAboutStoryVisibility();
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling story visibility: ' + err.message);
    }
  };

  const handleToggleLegacyVisibility = async () => {
    try {
      await toggleAboutLegacyVisibility();
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling legacy visibility: ' + err.message);
    }
  };

  // Stat Handlers
  const handleCreateStat = async () => {
    try {
      await createAboutStat(statForm);
      await fetchAboutUsContent();
      setShowStatModal(false);
      setStatForm({ label: '', value: '', order_index: stats.length, is_visible: 1 });
      alert('Stat created successfully!');
    } catch (err) {
      alert('Error creating stat: ' + err.message);
    }
  };

  const handleUpdateStat = async () => {
    try {
      await updateAboutStat(editingStat, statForm);
      await fetchAboutUsContent();
      setEditingStat(null);
      setShowStatModal(false);
      setStatForm({ label: '', value: '', order_index: 0, is_visible: 1 });
      alert('Stat updated successfully!');
    } catch (err) {
      alert('Error updating stat: ' + err.message);
    }
  };

  const handleDeleteStat = async (id) => {
    if (window.confirm('Are you sure you want to delete this stat?')) {
      try {
        await deleteAboutStat(id);
        await fetchAboutUsContent();
        alert('Stat deleted successfully!');
      } catch (err) {
        alert('Error deleting stat: ' + err.message);
      }
    }
  };

  const handleToggleStatVisibility = async (id) => {
    try {
      await toggleAboutStatVisibility(id);
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling stat visibility: ' + err.message);
    }
  };

  const startEditingStat = (stat) => {
    setEditingStat(stat.id);
    setStatForm({
      label: stat.label || '',
      value: stat.value || '',
      order_index: stat.order_index || 0,
      is_visible: stat.is_visible !== undefined ? stat.is_visible : 1
    });
    setShowStatModal(true);
  };

  // Testimonials Section Handlers
  const handleTestimonialsSectionUpdate = async () => {
    try {
      await updateAboutTestimonialsSection(testimonialsSectionForm);
      await fetchAboutUsContent();
      setEditingTestimonialsSection(false);
      alert('Testimonials section updated successfully!');
    } catch (err) {
      alert('Error updating testimonials section: ' + err.message);
    }
  };

  const handleToggleTestimonialsSectionVisibility = async () => {
    try {
      await toggleAboutTestimonialsSectionVisibility();
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling testimonials section visibility: ' + err.message);
    }
  };

  // Testimonial Handlers
  const handleCreateTestimonial = async () => {
    try {
      await createAboutTestimonial(testimonialForm);
      await fetchAboutUsContent();
      setShowTestimonialModal(false);
      setTestimonialForm({ quote: '', company: '', author: '', page_index: 0, order_index: testimonials.length, is_visible: 1 });
      alert('Testimonial created successfully!');
    } catch (err) {
      alert('Error creating testimonial: ' + err.message);
    }
  };

  const handleUpdateTestimonial = async () => {
    try {
      await updateAboutTestimonial(editingTestimonial, testimonialForm);
      await fetchAboutUsContent();
      setEditingTestimonial(null);
      setShowTestimonialModal(false);
      setTestimonialForm({ quote: '', company: '', author: '', page_index: 0, order_index: 0, is_visible: 1 });
      alert('Testimonial updated successfully!');
    } catch (err) {
      alert('Error updating testimonial: ' + err.message);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteAboutTestimonial(id);
        await fetchAboutUsContent();
        alert('Testimonial deleted successfully!');
      } catch (err) {
        alert('Error deleting testimonial: ' + err.message);
      }
    }
  };

  const handleToggleTestimonialVisibility = async (id) => {
    try {
      await toggleAboutTestimonialVisibility(id);
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling testimonial visibility: ' + err.message);
    }
  };

  const startEditingTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial.id);
    setTestimonialForm({
      quote: testimonial.quote || '',
      company: testimonial.company || '',
      author: testimonial.author || '',
      page_index: testimonial.page_index || 0,
      order_index: testimonial.order_index || 0,
      is_visible: testimonial.is_visible !== undefined ? testimonial.is_visible : 1
    });
    setShowTestimonialModal(true);
  };

  // Rating Handlers
  const handleCreateRating = async () => {
    try {
      await createAboutRating(ratingForm);
      await fetchAboutUsContent();
      setShowRatingModal(false);
      setRatingForm({ platform: '', rating_value: '', platform_icon: 'G', order_index: ratings.length, is_visible: 1 });
      alert('Rating created successfully!');
    } catch (err) {
      alert('Error creating rating: ' + err.message);
    }
  };

  const handleUpdateRating = async () => {
    try {
      await updateAboutRating(editingRating, ratingForm);
      await fetchAboutUsContent();
      setEditingRating(null);
      setShowRatingModal(false);
      setRatingForm({ platform: '', rating_value: '', platform_icon: 'G', order_index: 0, is_visible: 1 });
      alert('Rating updated successfully!');
    } catch (err) {
      alert('Error updating rating: ' + err.message);
    }
  };

  const handleDeleteRating = async (id) => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      try {
        await deleteAboutRating(id);
        await fetchAboutUsContent();
        alert('Rating deleted successfully!');
      } catch (err) {
        alert('Error deleting rating: ' + err.message);
      }
    }
  };

  const handleToggleRatingVisibility = async (id) => {
    try {
      await toggleAboutRatingVisibility(id);
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling rating visibility: ' + err.message);
    }
  };

  const startEditingRating = (rating) => {
    setEditingRating(rating.id);
    setRatingForm({
      platform: rating.platform || '',
      rating_value: rating.rating_value || '',
      platform_icon: rating.platform_icon || 'G',
      order_index: rating.order_index || 0,
      is_visible: rating.is_visible !== undefined ? rating.is_visible : 1
    });
    setShowRatingModal(true);
  };

  // Approach Section Handlers
  const handleApproachSectionUpdate = async () => {
    try {
      await updateAboutApproachSection(approachSectionForm);
      await fetchAboutUsContent();
      setEditingApproachSection(false);
      alert('Approach section updated successfully!');
    } catch (err) {
      alert('Error updating approach section: ' + err.message);
    }
  };

  const handleToggleApproachSectionVisibility = async () => {
    try {
      await toggleAboutApproachSectionVisibility();
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling approach section visibility: ' + err.message);
    }
  };

  // Approach Item Handlers
  const handleCreateApproachItem = async () => {
    try {
      await createAboutApproachItem(approachItemForm);
      await fetchAboutUsContent();
      setShowApproachItemModal(false);
      setApproachItemForm({ title: '', description: '', icon_type: 'database', order_index: approachItems.length, is_visible: 1 });
      alert('Approach item created successfully!');
    } catch (err) {
      alert('Error creating approach item: ' + err.message);
    }
  };

  const handleUpdateApproachItem = async () => {
    try {
      await updateAboutApproachItem(editingApproachItem, approachItemForm);
      await fetchAboutUsContent();
      setEditingApproachItem(null);
      setShowApproachItemModal(false);
      setApproachItemForm({ title: '', description: '', icon_type: 'database', order_index: 0, is_visible: 1 });
      alert('Approach item updated successfully!');
    } catch (err) {
      alert('Error updating approach item: ' + err.message);
    }
  };

  const handleDeleteApproachItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this approach item?')) {
      try {
        await deleteAboutApproachItem(id);
        await fetchAboutUsContent();
        alert('Approach item deleted successfully!');
      } catch (err) {
        alert('Error deleting approach item: ' + err.message);
      }
    }
  };

  const handleToggleApproachItemVisibility = async (id) => {
    try {
      await toggleAboutApproachItemVisibility(id);
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling approach item visibility: ' + err.message);
    }
  };

  const startEditingApproachItem = (item) => {
    setEditingApproachItem(item.id);
    setApproachItemForm({
      title: item.title || '',
      description: item.description || '',
      icon_type: item.icon_type || 'database',
      order_index: item.order_index || 0,
      is_visible: item.is_visible !== undefined ? item.is_visible : 1
    });
    setShowApproachItemModal(true);
  };

  // Mission & Vision Handlers
  const handleMissionVisionUpdate = async () => {
    try {
      await updateAboutMissionVision(missionVisionForm);
      await fetchAboutUsContent();
      setEditingMissionVision(false);
      alert('Mission & Vision updated successfully!');
    } catch (err) {
      alert('Error updating mission & vision: ' + err.message);
    }
  };

  const handleToggleMissionVisionVisibility = async () => {
    try {
      await toggleAboutMissionVisionVisibility();
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling mission & vision visibility: ' + err.message);
    }
  };

  // Core Values Section Handlers
  const handleCoreValuesSectionUpdate = async () => {
    try {
      await updateAboutCoreValuesSection(coreValuesSectionForm);
      await fetchAboutUsContent();
      setEditingCoreValuesSection(false);
      alert('Core Values section updated successfully!');
    } catch (err) {
      alert('Error updating core values section: ' + err.message);
    }
  };

  const handleToggleCoreValuesSectionVisibility = async () => {
    try {
      await toggleAboutCoreValuesSectionVisibility();
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling core values section visibility: ' + err.message);
    }
  };

  // Core Value Handlers
  const handleCreateCoreValue = async () => {
    try {
      await createAboutCoreValue(coreValueForm);
      await fetchAboutUsContent();
      setShowCoreValueModal(false);
      setCoreValueForm({ title: '', description: '', icon_type: 'lightbulb', order_index: coreValues.length, is_visible: 1 });
      alert('Core value created successfully!');
    } catch (err) {
      alert('Error creating core value: ' + err.message);
    }
  };

  const handleUpdateCoreValue = async () => {
    try {
      await updateAboutCoreValue(editingCoreValue, coreValueForm);
      await fetchAboutUsContent();
      setEditingCoreValue(null);
      setShowCoreValueModal(false);
      setCoreValueForm({ title: '', description: '', icon_type: 'lightbulb', order_index: 0, is_visible: 1 });
      alert('Core value updated successfully!');
    } catch (err) {
      alert('Error updating core value: ' + err.message);
    }
  };

  const handleDeleteCoreValue = async (id) => {
    if (window.confirm('Are you sure you want to delete this core value?')) {
      try {
        await deleteAboutCoreValue(id);
        await fetchAboutUsContent();
        alert('Core value deleted successfully!');
      } catch (err) {
        alert('Error deleting core value: ' + err.message);
      }
    }
  };

  const handleToggleCoreValueVisibility = async (id) => {
    try {
      await toggleAboutCoreValueVisibility(id);
      await fetchAboutUsContent();
    } catch (err) {
      alert('Error toggling core value visibility: ' + err.message);
    }
  };

  const startEditingCoreValue = (value) => {
    setEditingCoreValue(value.id);
    setCoreValueForm({
      title: value.title || '',
      description: value.description || '',
      icon_type: value.icon_type || 'lightbulb',
      order_index: value.order_index || 0,
      is_visible: value.is_visible !== undefined ? value.is_visible : 1
    });
    setShowCoreValueModal(true);
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Content</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button
            onClick={fetchAboutUsContent}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us Page Administration</h1>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${heroVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {heroVisible ? <><EyeIcon className="w-3 h-3 inline mr-1" />Visible</> : <><EyeSlashIcon className="w-3 h-3 inline mr-1" />Hidden</>}
            </span>
          </div>
          <div className="flex gap-2">
            {!editingHero ? (
              <>
                <button
                  onClick={handleToggleHeroVisibility}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${heroVisible ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {heroVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  {heroVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setEditingHero(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleHeroUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingHero(false)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {editingHero ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
              <input
                type="text"
                value={heroForm.badge_text}
                onChange={(e) => setHeroForm({ ...heroForm, badge_text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Highlighted Text</label>
              <input
                type="text"
                value={heroForm.highlighted_text}
                onChange={(e) => setHeroForm({ ...heroForm, highlighted_text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title After (e.g., "Control")</label>
              <input
                type="text"
                value={heroForm.title_after}
                onChange={(e) => setHeroForm({ ...heroForm, title_after: e.target.value })}
                placeholder="Control"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Text that appears after the highlighted text</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={heroForm.description}
                onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={heroForm.button_text}
                onChange={(e) => setHeroForm({ ...heroForm, button_text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
              <input
                type="text"
                value={heroForm.button_link}
                onChange={(e) => setHeroForm({ ...heroForm, button_link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={heroForm.image_url}
                onChange={(e) => setHeroForm({ ...heroForm, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg or /path/to/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {heroForm.image_url && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                  <div className="border border-gray-300 rounded-lg overflow-hidden max-w-md">
                    <img
                      src={heroForm.image_url}
                      alt="Hero preview"
                      className="w-full h-auto max-h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f3f4f6" width="400" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage failed to load%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Enter a valid image URL (jpg, png, gif, webp, etc.)</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stat Value</label>
                <input
                  type="text"
                  value={heroForm.stat_value}
                  onChange={(e) => setHeroForm({ ...heroForm, stat_value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stat Label</label>
                <input
                  type="text"
                  value={heroForm.stat_label}
                  onChange={(e) => setHeroForm({ ...heroForm, stat_label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Badge:</strong> {aboutData?.hero?.badge_text || 'N/A'}</p>
            <p><strong>Title:</strong> {aboutData?.hero?.title || 'N/A'}</p>
            <p><strong>Highlighted:</strong> {aboutData?.hero?.highlighted_text || 'N/A'}</p>
            <p><strong>Title After:</strong> {aboutData?.hero?.title_after || 'Control'}</p>
            <p><strong>Description:</strong> {aboutData?.hero?.description || 'N/A'}</p>
            <p><strong>Button:</strong> {aboutData?.hero?.button_text || 'N/A'}</p>
            <p><strong>Stat:</strong> {aboutData?.hero?.stat_value} {aboutData?.hero?.stat_label}</p>
          </div>
        )}
      </div>

      {/* Mission & Vision Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Mission & Vision Section</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${missionVisionVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {missionVisionVisible ? <><EyeIcon className="w-3 h-3 inline mr-1" />Visible</> : <><EyeSlashIcon className="w-3 h-3 inline mr-1" />Hidden</>}
            </span>
          </div>
          <div className="flex gap-2">
            {!editingMissionVision ? (
              <>
                <button
                  onClick={handleToggleMissionVisionVisibility}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${missionVisionVisible ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {missionVisionVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  {missionVisionVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setEditingMissionVision(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleMissionVisionUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingMissionVision(false)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {editingMissionVision ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900"><strong>ℹ️ Mission & Vision:</strong> Edit the mission and vision content displayed on the About Us page</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Header Title</label>
              <input
                type="text"
                value={missionVisionForm.header_title}
                onChange={(e) => setMissionVisionForm({ ...missionVisionForm, header_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Our Mission & Vision"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Header Description</label>
              <textarea
                value={missionVisionForm.header_description}
                onChange={(e) => setMissionVisionForm({ ...missionVisionForm, header_description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the section..."
              />
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mission & Vision Content</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Mission Title
              </label>
              <input
                type="text"
                value={missionVisionForm.mission_title}
                onChange={(e) => setMissionVisionForm({ ...missionVisionForm, mission_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Our Mission"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Mission Description
              </label>
              <textarea
                value={missionVisionForm.mission_description}
                onChange={(e) => setMissionVisionForm({ ...missionVisionForm, mission_description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your mission..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Vision Title
              </label>
              <input
                type="text"
                value={missionVisionForm.vision_title}
                onChange={(e) => setMissionVisionForm({ ...missionVisionForm, vision_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Our Vision"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Vision Description
              </label>
              <textarea
                value={missionVisionForm.vision_description}
                onChange={(e) => setMissionVisionForm({ ...missionVisionForm, vision_description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your vision..."
              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <span className="text-xs text-gray-600 uppercase">Section Header Title:</span>
              <p className="text-lg font-semibold text-gray-900">{aboutData?.missionVision?.header_title || 'Not Set'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-600 uppercase">Section Header Description:</span>
              <p className="text-sm text-gray-700">{aboutData?.missionVision?.header_description || 'Not Set'}</p>
            </div>
            <div className="border-t pt-3 mt-3">
              <span className="text-xs text-gray-600 uppercase">Mission Title:</span>
              <p className="text-lg font-semibold text-gray-900">{aboutData?.missionVision?.mission_title || 'Not Set'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-600 uppercase">Mission Description:</span>
              <p className="text-sm text-gray-700">{aboutData?.missionVision?.mission_description || 'Not Set'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-600 uppercase">Vision Title:</span>
              <p className="text-lg font-semibold text-gray-900">{aboutData?.missionVision?.vision_title || 'Not Set'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-600 uppercase">Vision Description:</span>
              <p className="text-sm text-gray-700">{aboutData?.missionVision?.vision_description || 'Not Set'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Story Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Story Section</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${storyVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {storyVisible ? <><EyeIcon className="w-3 h-3 inline mr-1" />Visible</> : <><EyeSlashIcon className="w-3 h-3 inline mr-1" />Hidden</>}
            </span>
          </div>
          <div className="flex gap-2">
            {!editingStory ? (
              <>
                <button
                  onClick={handleToggleStoryVisibility}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${storyVisible ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {storyVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  {storyVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setEditingStory(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleStoryUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingStory(false)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {editingStory ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Header Title</label>
              <input
                type="text"
                value={storyForm.header_title}
                onChange={(e) => setStoryForm({ ...storyForm, header_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Header Description</label>
              <textarea
                value={storyForm.header_description}
                onChange={(e) => setStoryForm({ ...storyForm, header_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founding Year</label>
              <input
                type="text"
                value={storyForm.founding_year}
                onChange={(e) => setStoryForm({ ...storyForm, founding_year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Items</label>
              {storyForm.story_items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <textarea
                    value={item}
                    onChange={(e) => handleStoryItemChange(index, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeStoryItem(index)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>

              {/* URL Input Option */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">Option 1: Enter Image URL</label>
                <input
                  type="text"
                  value={storyForm.image_url}
                  onChange={(e) => setStoryForm({ ...storyForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg or /path/to/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-xs text-gray-500 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* File Upload Option */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Option 2: Upload from Local</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleStoryImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Formats: JPEG, PNG, GIF, WebP</p>
              </div>

              {storyForm.image_url && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                  <div className="border border-gray-300 rounded-lg overflow-hidden max-w-md">
                    <img
                      src={storyForm.image_url}
                      alt="Story preview"
                      className="w-full h-auto max-h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f3f4f6" width="400" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage failed to load%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Value</label>
                <input
                  type="text"
                  value={storyForm.badge_value}
                  onChange={(e) => setStoryForm({ ...storyForm, badge_value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Label</label>
                <input
                  type="text"
                  value={storyForm.badge_label}
                  onChange={(e) => setStoryForm({ ...storyForm, badge_label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Top Badge Value</label>
                <input
                  type="text"
                  value={storyForm.top_badge_value}
                  onChange={(e) => setStoryForm({ ...storyForm, top_badge_value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Top Badge Label</label>
                <input
                  type="text"
                  value={storyForm.top_badge_label}
                  onChange={(e) => setStoryForm({ ...storyForm, top_badge_label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Header Title:</strong> {aboutData?.story?.header_title || 'N/A'}</p>
            <p><strong>Founding Year:</strong> {aboutData?.story?.founding_year || 'N/A'}</p>
            <p><strong>Story Items:</strong> {storyForm.story_items.length} items</p>
          </div>
        )}
      </div>

      {/* Core Values Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Core Values Section (Header + Values)</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${coreValuesSectionVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {coreValuesSectionVisible ? <><EyeIcon className="w-3 h-3 inline mr-1" />Visible</> : <><EyeSlashIcon className="w-3 h-3 inline mr-1" />Hidden</>}
            </span>
          </div>
          <div className="flex gap-2">
            {!editingCoreValuesSection ? (
              <>
                <button
                  onClick={handleToggleCoreValuesSectionVisibility}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${coreValuesSectionVisible ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {coreValuesSectionVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  {coreValuesSectionVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setEditingCoreValuesSection(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Header
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCoreValuesSectionUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingCoreValuesSection(false)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-900"><strong>ℹ️ Section Header:</strong> Edit the main title and description that appears at the top of the Core Values section</p>
        </div>

        {editingCoreValuesSection ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Header Title (Main Section Heading)
              </label>
              <input
                type="text"
                value={coreValuesSectionForm.header_title}
                onChange={(e) => setCoreValuesSectionForm({ ...coreValuesSectionForm, header_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Our Core Values"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Header Description (Below the heading)
              </label>
              <textarea
                value={coreValuesSectionForm.header_description}
                onChange={(e) => setCoreValuesSectionForm({ ...coreValuesSectionForm, header_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your core values..."
              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
            <div>
              <span className="text-xs text-gray-600 uppercase">Header Title:</span>
              <p className="text-lg font-semibold text-gray-900">{aboutData?.coreValuesSection?.header_title || 'Not Set'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-600 uppercase">Header Description:</span>
              <p className="text-sm text-gray-700">{aboutData?.coreValuesSection?.header_description || 'Not Set'}</p>
            </div>
          </div>
        )}

        {/* Core Values Management */}
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Core Values</h3>
          </div>
          <div className="space-y-2">
            {coreValues.map((value) => (
              <div key={value.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs ${value.is_visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {value.is_visible ? 'Visible' : 'Hidden'}
                  </span>
                  <span className="font-medium">{value.title}</span>
                  <span className="text-xs text-gray-500">({value.icon_type})</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditingCoreValue(value)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleCoreValueVisibility(value.id)}
                    className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                  >
                    {value.is_visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteCoreValue(value.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legacy Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Legacy Section</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${legacyVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {legacyVisible ? <><EyeIcon className="w-3 h-3 inline mr-1" />Visible</> : <><EyeSlashIcon className="w-3 h-3 inline mr-1" />Hidden</>}
            </span>
          </div>
          <div className="flex gap-2">
            {!editingLegacy ? (
              <>
                <button
                  onClick={handleToggleLegacyVisibility}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${legacyVisible ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {legacyVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  {legacyVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setEditingLegacy(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Header
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLegacyUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingLegacy(false)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {editingLegacy ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Header Title</label>
              <input
                type="text"
                value={legacyForm.header_title}
                onChange={(e) => setLegacyForm({ ...legacyForm, header_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Header Description</label>
              <textarea
                value={legacyForm.header_description}
                onChange={(e) => setLegacyForm({ ...legacyForm, header_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Header Title:</strong> {aboutData?.legacy?.header_title || 'N/A'}</p>
          </div>
        )}

        {/* Stats Management */}
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
          </div>
          <div className="space-y-2">
            {stats.map((stat) => (
              <div key={stat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs ${stat.is_visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {stat.is_visible ? 'Visible' : 'Hidden'}
                  </span>
                  <span className="font-medium">{stat.label}:</span>
                  <span>{stat.value}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditingStat(stat)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatVisibility(stat.id)}
                    className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                  >
                    {stat.is_visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteStat(stat.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Testimonials Section</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${testimonialsSectionVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {testimonialsSectionVisible ? <><EyeIcon className="w-3 h-3 inline mr-1" />Visible</> : <><EyeSlashIcon className="w-3 h-3 inline mr-1" />Hidden</>}
            </span>
          </div>
          <div className="flex gap-2">
            {!editingTestimonialsSection ? (
              <>
                <button
                  onClick={handleToggleTestimonialsSectionVisibility}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${testimonialsSectionVisible ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {testimonialsSectionVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  {testimonialsSectionVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setEditingTestimonialsSection(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Header
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleTestimonialsSectionUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingTestimonialsSection(false)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {editingTestimonialsSection ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Header Title</label>
              <input
                type="text"
                value={testimonialsSectionForm.header_title}
                onChange={(e) => setTestimonialsSectionForm({ ...testimonialsSectionForm, header_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Header Description</label>
              <textarea
                value={testimonialsSectionForm.header_description}
                onChange={(e) => setTestimonialsSectionForm({ ...testimonialsSectionForm, header_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Header Title:</strong> {aboutData?.testimonialsSection?.header_title || 'N/A'}</p>
          </div>
        )}

        {/* Testimonials Management */}
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Testimonials</h3>
          </div>
          <div className="space-y-2">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-1 rounded text-xs ${testimonial.is_visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {testimonial.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                    <span className="text-xs text-gray-500">Page: {testimonial.page_index || 0}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{testimonial.quote}</p>
                  {(testimonial.company || testimonial.author) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {testimonial.company && <span>{testimonial.company}</span>}
                      {testimonial.company && testimonial.author && ' - '}
                      {testimonial.author && <span>{testimonial.author}</span>}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEditingTestimonial(testimonial)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleTestimonialVisibility(testimonial.id)}
                    className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                  >
                    {testimonial.is_visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ratings Management */}
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ratings</h3>
            <button
              onClick={() => {
                setRatingForm({ platform: '', rating_value: '', platform_icon: 'G', order_index: ratings.length, is_visible: 1 });
                setEditingRating(null);
                setShowRatingModal(true);
              }}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <PlusIcon className="w-4 h-4" />
              Add Rating
            </button>
          </div>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <div key={rating.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs ${rating.is_visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {rating.is_visible ? 'Visible' : 'Hidden'}
                  </span>
                  <span className="font-medium">{rating.platform}:</span>
                  <span>{rating.rating_value}</span>
                  <span className="text-xs text-gray-500">({rating.platform_icon})</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditingRating(rating)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleRatingVisibility(rating.id)}
                    className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                  >
                    {rating.is_visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteRating(rating.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approach Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Approach Section (Header + Items)</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${approachSectionVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {approachSectionVisible ? <><EyeIcon className="w-3 h-3 inline mr-1" />Visible</> : <><EyeSlashIcon className="w-3 h-3 inline mr-1" />Hidden</>}
            </span>
          </div>
          <div className="flex gap-2">
            {!editingApproachSection ? (
              <>
                <button
                  onClick={handleToggleApproachSectionVisibility}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${approachSectionVisible ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {approachSectionVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  {approachSectionVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setEditingApproachSection(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Header
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleApproachSectionUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingApproachSection(false)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-900"><strong>ℹ️ Section Header:</strong> Edit the main title and description that appears at the top of the Approach section</p>
        </div>

        {editingApproachSection ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Header Title (Main Section Heading)
              </label>
              <input
                type="text"
                value={approachSectionForm.header_title}
                onChange={(e) => setApproachSectionForm({ ...approachSectionForm, header_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Our Approach"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Header Description (Below the heading)
              </label>
              <textarea
                value={approachSectionForm.header_description}
                onChange={(e) => setApproachSectionForm({ ...approachSectionForm, header_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your approach..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text (Call to Action)</label>
              <input
                type="text"
                value={approachSectionForm.cta_button_text}
                onChange={(e) => setApproachSectionForm({ ...approachSectionForm, cta_button_text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Talk to a Specialist"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button URL</label>
              <input
                type="text"
                value={approachSectionForm.cta_button_url}
                onChange={(e) => setApproachSectionForm({ ...approachSectionForm, cta_button_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/contact or /contact"












              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <span className="text-xs text-gray-600 uppercase">Header Title:</span>
              <p className="text-lg font-semibold text-gray-900">{aboutData?.approachSection?.header_title || 'Not Set'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-600 uppercase">Header Description:</span>
              <p className="text-sm text-gray-700">{aboutData?.approachSection?.header_description || 'Not Set'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-600 uppercase">CTA Button Text:</span>
              <p className="text-sm text-gray-700">{aboutData?.approachSection?.cta_button_text || 'Not Set'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-600 uppercase">CTA Button URL:</span>
              <p className="text-sm text-gray-700">{aboutData?.approachSection?.cta_button_url || 'Not Set'}</p>
            </div>
          </div>
        )}

        {/* Approach Items Management */}
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Approach Items</h3>
          </div>
          <div className="space-y-2">
            {approachItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs ${item.is_visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.is_visible ? 'Visible' : 'Hidden'}
                  </span>
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-gray-500">({item.icon_type})</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditingApproachItem(item)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleApproachItemVisibility(item.id)}
                    className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                  >
                    {item.is_visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteApproachItem(item.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Modal */}
      {showStatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{editingStat ? 'Edit Stat' : 'Add Stat'}</h3>
              <button onClick={() => { setShowStatModal(false); setEditingStat(null); }} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={statForm.label}
                  onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={statForm.value}
                  onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                <input
                  type="number"
                  value={statForm.order_index}
                  onChange={(e) => setStatForm({ ...statForm, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={statForm.is_visible === 1}
                  onChange={(e) => setStatForm({ ...statForm, is_visible: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">Visible</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingStat ? handleUpdateStat : handleCreateStat}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {editingStat ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => { setShowStatModal(false); setEditingStat(null); }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={() => { setShowTestimonialModal(false); setEditingTestimonial(null); }} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                <textarea
                  value={testimonialForm.quote}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={testimonialForm.company}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={testimonialForm.author}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Index</label>
                <input
                  type="number"
                  value={testimonialForm.page_index}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, page_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                <input
                  type="number"
                  value={testimonialForm.order_index}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={testimonialForm.is_visible === 1}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, is_visible: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">Visible</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingTestimonial ? handleUpdateTestimonial : handleCreateTestimonial}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {editingTestimonial ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => { setShowTestimonialModal(false); setEditingTestimonial(null); }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{editingRating ? 'Edit Rating' : 'Add Rating'}</h3>
              <button onClick={() => { setShowRatingModal(false); setEditingRating(null); }} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <input
                  type="text"
                  value={ratingForm.platform}
                  onChange={(e) => setRatingForm({ ...ratingForm, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating Value</label>
                <input
                  type="text"
                  value={ratingForm.rating_value}
                  onChange={(e) => setRatingForm({ ...ratingForm, rating_value: e.target.value })}
                  placeholder="4.7/5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Icon</label>
                <select
                  value={ratingForm.platform_icon}
                  onChange={(e) => setRatingForm({ ...ratingForm, platform_icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="G">G (Google)</option>
                  <option value="star">Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                <input
                  type="number"
                  value={ratingForm.order_index}
                  onChange={(e) => setRatingForm({ ...ratingForm, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ratingForm.is_visible === 1}
                  onChange={(e) => setRatingForm({ ...ratingForm, is_visible: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">Visible</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingRating ? handleUpdateRating : handleCreateRating}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {editingRating ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => { setShowRatingModal(false); setEditingRating(null); }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approach Item Modal */}
      {showApproachItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{editingApproachItem ? 'Edit Approach Item' : 'Add Approach Item'}</h3>
              <button onClick={() => { setShowApproachItemModal(false); setEditingApproachItem(null); }} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={approachItemForm.title}
                  onChange={(e) => setApproachItemForm({ ...approachItemForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={approachItemForm.description}
                  onChange={(e) => setApproachItemForm({ ...approachItemForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Type</label>
                <select
                  value={approachItemForm.icon_type}
                  onChange={(e) => setApproachItemForm({ ...approachItemForm, icon_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="database">Database</option>
                  <option value="clock">Clock</option>
                  <option value="sun">Sun</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                <input
                  type="number"
                  value={approachItemForm.order_index}
                  onChange={(e) => setApproachItemForm({ ...approachItemForm, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={approachItemForm.is_visible === 1}
                  onChange={(e) => setApproachItemForm({ ...approachItemForm, is_visible: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">Visible</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingApproachItem ? handleUpdateApproachItem : handleCreateApproachItem}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {editingApproachItem ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => { setShowApproachItemModal(false); setEditingApproachItem(null); }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Core Value Modal */}
      {showCoreValueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{editingCoreValue ? 'Edit Core Value' : 'Add Core Value'}</h3>
              <button onClick={() => { setShowCoreValueModal(false); setEditingCoreValue(null); }} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={coreValueForm.title}
                  onChange={(e) => setCoreValueForm({ ...coreValueForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={coreValueForm.description}
                  onChange={(e) => setCoreValueForm({ ...coreValueForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Type</label>
                <select
                  value={coreValueForm.icon_type}
                  onChange={(e) => setCoreValueForm({ ...coreValueForm, icon_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="lightbulb">Lightbulb</option>
                  <option value="shield">Shield</option>
                  <option value="heart">Heart</option>
                  <option value="check">Check</option>
                  <option value="star">Star</option>
                  <option value="lock">Lock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                <input
                  type="number"
                  value={coreValueForm.order_index}
                  onChange={(e) => setCoreValueForm({ ...coreValueForm, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={coreValueForm.is_visible === 1}
                  onChange={(e) => setCoreValueForm({ ...coreValueForm, is_visible: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">Visible</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingCoreValue ? handleUpdateCoreValue : handleCreateCoreValue}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {editingCoreValue ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => { setShowCoreValueModal(false); setEditingCoreValue(null); }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsAdmin;
