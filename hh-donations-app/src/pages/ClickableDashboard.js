import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Card,
  Stack,
  Group,
  Table,
  Modal,
  TextInput,
  Select,
  Textarea,
  NumberInput,
  Switch,
  Alert,
  Badge,
  ActionIcon,
  Loader,
  Tabs,
  Center,
  Menu,
  Pagination,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconMapPin,
  IconAlertCircle,
  IconTruck,
  IconCalendar,
  IconSearch,
  IconUser,
  IconPackage,
  IconDots,
  IconShieldCheck,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowUp,
  IconArrowDown,
  IconSelector,
  IconCheck,
  IconCircleCheck,
  IconArrowBackUp,
} from '@tabler/icons-react';
import { API_BASE } from '../utils/apiConfig';

const ClickableDashboard = () => {
  const [bins, setBins] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bins');
  const [loginTab, setLoginTab] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  
  // Search and filter states
  const [binSearchQuery, setBinSearchQuery] = useState('');

  // Sorting states
  const [binSort, setBinSort] = useState({ field: null, direction: 'asc' });
  const [driverSort, setDriverSort] = useState({ field: null, direction: 'asc' });
  const [pickupSort, setPickupSort] = useState({ field: null, direction: 'asc' });
  const [completedPickupSort, setCompletedPickupSort] = useState({ field: null, direction: 'asc' });

  // Pagination states
  const [binPage, setBinPage] = useState(1);
  const [driverPage, setDriverPage] = useState(1);
  const [pickupPage, setPickupPage] = useState(1);
  const [completedPickupPage, setCompletedPickupPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [modalOpened, setModalOpened] = useState(false);
  const [driverModalOpened, setDriverModalOpened] = useState(false);
  const [pickupModalOpened, setPickupModalOpened] = useState(false);
  const [editingBin, setEditingBin] = useState(null);
  const [editingDriver, setEditingDriver] = useState(null);
  const [editingPickup, setEditingPickup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    hours: '',
    type: 'Outdoor',
    driveUp: false,
    notes: '',
    distance: '',
    status: 'active'
  });
  const [driverFormData, setDriverFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license_number: '',
    status: 'active'
  });
  const [pickupFormData, setPickupFormData] = useState({
    bin_id: '',
    driver_id: '',
    pickup_date: '',
    pickup_time: '',
    load_type: 'mixed',
    load_weight: '',
    notes: '',
    status: 'scheduled'
  });

  // API endpoint is imported from apiConfig
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Reset bin pagination when search query changes
  useEffect(() => {
    setBinPage(1);
  }, [binSearchQuery]);

  // Fetch current user info
  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        fetchBins(token);
        fetchDrivers(token);
        fetchPickups(token);
      } else {
        localStorage.removeItem('admin_token');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      localStorage.removeItem('admin_token');
      setLoading(false);
    }
  };

  // Fetch all bins
  const fetchBins = async (token = localStorage.getItem('admin_token')) => {
    try {
      const response = await fetch(`${API_BASE}/bins/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBins(data);
      } else {
        setError('Failed to fetch donation bins');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Fetch drivers
  const fetchDrivers = async (token = localStorage.getItem('admin_token')) => {
    try {
      const response = await fetch(`${API_BASE}/drivers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      }
    } catch (err) {
      setError('Error fetching drivers');
    }
  };

  // Fetch pickups
  const fetchPickups = async (token = localStorage.getItem('admin_token')) => {
    try {
      const response = await fetch(`${API_BASE}/pickups`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPickups(data);
      }
    } catch (err) {
      setError('Error fetching pickups');
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        setIsLoggedIn(true);
        setLoginForm({ email: '', password: '' });
        fetchBins(data.token);
        fetchDrivers(data.token);
        fetchPickups(data.token);
        
        window.dispatchEvent(new Event('storage'));
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle create new bin
  const handleCreateBin = () => {
    setEditingBin(null);
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      hours: '',
      type: 'Outdoor',
      driveUp: false,
      notes: '',
      distance: '',
      status: 'active'
    });
    setModalOpened(true);
  };

  // Handle bin row click
  const handleBinRowClick = (bin) => {
    setEditingBin(bin);
    setFormData({
      name: bin.name,
      address: bin.address,
      latitude: bin.latitude || '',
      longitude: bin.longitude || '',
      hours: bin.hours,
      type: bin.type,
      driveUp: bin.driveUp,
      notes: bin.notes || '',
      distance: bin.distance || '',
      status: bin.status
    });
    setModalOpened(true);
  };

  // Handle delete bin
  const handleDeleteBin = async (binId, event) => {
    event.stopPropagation(); // Prevent row click
    if (!window.confirm('Are you sure you want to delete this donation bin?')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_BASE}/bins/${binId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchBins();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete bin');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  // Schedule pickup for a specific bin
  const handleSchedulePickup = (bin, event) => {
    event.stopPropagation(); // Prevent row click
    setEditingPickup(null);
    setPickupFormData({
      bin_id: bin.id.toString(),
      driver_id: '',
      pickup_date: '',
      pickup_time: '',
      load_type: 'mixed',
      load_weight: '',
      notes: ''
    });
    setPickupModalOpened(true);
  };

  // Save bin changes
  const handleSaveBin = async () => {
    const token = localStorage.getItem('admin_token');
    const url = editingBin 
      ? `${API_BASE}/bins/${editingBin.id}`
      : `${API_BASE}/bins`;
    const method = editingBin ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setModalOpened(false);
        fetchBins();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save bin');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  // Handle create new driver
  const handleCreateDriver = () => {
    setEditingDriver(null);
    setDriverFormData({
      name: '',
      email: '',
      phone: '',
      license_number: '',
      status: 'active'
    });
    setDriverModalOpened(true);
  };

  // Handle edit driver
  const handleEditDriver = (driver) => {
    setEditingDriver(driver);
    setDriverFormData({
      name: driver.name,
      email: driver.email,
      phone: driver.phone || '',
      license_number: driver.license_number || '',
      status: driver.status
    });
    setDriverModalOpened(true);
  };

  // Save driver changes
  const handleSaveDriver = async () => {
    const token = localStorage.getItem('admin_token');
    const url = editingDriver 
      ? `${API_BASE}/drivers/${editingDriver.id}`
      : `${API_BASE}/drivers`;
    const method = editingDriver ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(driverFormData)
      });

      if (response.ok) {
        setDriverModalOpened(false);
        fetchDrivers();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save driver');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  // Handle delete driver
  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_BASE}/drivers/${driverId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchDrivers();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete driver');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  // Handle create new pickup
  const handleCreatePickup = () => {
    setEditingPickup(null);
    setPickupFormData({
      bin_id: '',
      driver_id: '',
      pickup_date: '',
      pickup_time: '',
      load_type: 'mixed',
      load_weight: '',
      notes: ''
    });
    setPickupModalOpened(true);
  };

  // Handle edit pickup
  const handleEditPickup = (pickup) => {
    setEditingPickup(pickup);
    setPickupFormData({
      bin_id: pickup.bin_id || '',
      driver_id: pickup.driver_id || '',
      pickup_date: pickup.pickup_date ? pickup.pickup_date.split('T')[0] : '',
      pickup_time: pickup.pickup_time || '',
      load_type: pickup.load_type,
      load_weight: pickup.load_weight || '',
      notes: pickup.notes || ''
    });
    setPickupModalOpened(true);
  };

  // Save pickup changes
  const handleSavePickup = async () => {
    const token = localStorage.getItem('admin_token');
    const url = editingPickup 
      ? `${API_BASE}/pickups/${editingPickup.id}`
      : `${API_BASE}/pickups`;
    const method = editingPickup ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pickupFormData)
      });

      if (response.ok) {
        setPickupModalOpened(false);
        fetchPickups();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save pickup');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  // Handle delete pickup
  const handleDeletePickup = async (pickupId) => {
    if (!window.confirm('Are you sure you want to delete this pickup?')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_BASE}/pickups/${pickupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPickups();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete pickup');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  // Handle complete pickup
  const handleCompletePickup = async (pickup, event) => {
    event.stopPropagation();
    if (!window.confirm('Mark this pickup as completed?')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_BASE}/pickups/${pickup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...pickup,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        fetchPickups();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to complete pickup');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  // Handle mark pickup as incomplete (revert to scheduled)
  const handleIncompletePickup = async (pickup, event) => {
    event.stopPropagation();
    if (!window.confirm('Mark this pickup as incomplete and move back to scheduled?')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_BASE}/pickups/${pickup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...pickup,
          status: 'scheduled',
          completed_at: null
        })
      });

      if (response.ok) {
        fetchPickups();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to revert pickup status');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  // Sorting function
  const sortData = (data, sortConfig) => {
    if (!sortConfig.field) return data;
    
    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];
      
      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      
      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      // Compare values
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Handle column sort
  const handleSort = (field, currentSort, setSort) => {
    if (currentSort.field === field) {
      // Toggle direction if same field
      setSort({
        field,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // New field, default to ascending
      setSort({ field, direction: 'asc' });
    }
  };

  // Filter bins
  const filteredBins = bins.filter(bin =>
    bin.name.toLowerCase().includes(binSearchQuery.toLowerCase()) ||
    bin.address.toLowerCase().includes(binSearchQuery.toLowerCase()) ||
    (bin.bin_number && bin.bin_number.toLowerCase().includes(binSearchQuery.toLowerCase()))
  );

  // Filter pickups by status
  const scheduledPickups = pickups.filter(p => !p.status || p.status === 'scheduled' || p.status === 'pending');
  const completedPickups = pickups.filter(p => p.status === 'completed');

  // Sort filtered data
  const sortedBins = sortData(filteredBins, binSort);
  const sortedDrivers = sortData(drivers, driverSort);
  const sortedScheduledPickups = sortData(scheduledPickups, pickupSort);
  const sortedCompletedPickups = sortData(completedPickups, completedPickupSort);

  // Pagination logic
  const getPaginatedBins = () => {
    const startIndex = (binPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedBins.slice(startIndex, endIndex);
  };

  const getPaginatedDrivers = () => {
    const startIndex = (driverPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedDrivers.slice(startIndex, endIndex);
  };

  const getPaginatedPickups = () => {
    const startIndex = (pickupPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedScheduledPickups.slice(startIndex, endIndex);
  };

  const getPaginatedCompletedPickups = () => {
    const startIndex = (completedPickupPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedCompletedPickups.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalBinPages = Math.ceil(sortedBins.length / itemsPerPage);
  const totalDriverPages = Math.ceil(drivers.length / itemsPerPage);
  const totalPickupPages = Math.ceil(sortedScheduledPickups.length / itemsPerPage);
  const totalCompletedPickupPages = Math.ceil(sortedCompletedPickups.length / itemsPerPage);

  // Sortable header component
  const SortableHeader = ({ field, children, sortConfig, onSort }) => {
    const isActive = sortConfig.field === field;
    const icon = !isActive ? (
      <IconSelector size={14} style={{ opacity: 0.3 }} />
    ) : sortConfig.direction === 'asc' ? (
      <IconArrowUp size={14} style={{ color: 'var(--hh-primary-dark)' }} />
    ) : (
      <IconArrowDown size={14} style={{ color: 'var(--hh-primary-dark)' }} />
    );

    return (
      <div 
        onClick={() => onSort(field)}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { color: 'var(--hh-primary-dark)' }
        }}
      >
        {children}
        {icon}
      </div>
    );
  };

  // Login form
  if (!isLoggedIn) {
    return (
      <div style={{ 
        background: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background shapes */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-200px',
          right: '-200px',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-150px',
          left: '-150px',
          animation: 'float 8s ease-in-out infinite'
        }} />
        
        <div style={{ 
          position: 'relative', 
          zIndex: 1,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <Stack align="center" spacing="xl">
            <Card 
              shadow="xl" 
              padding="xl" 
              radius="lg" 
              style={{ 
                width: '100%', 
                maxWidth: 850,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Stack spacing="lg">
                <div style={{ textAlign: 'center' }}>
                  <Title order={2} style={{ 
                    color: 'var(--hh-primary-darkest)',
                    fontWeight: 700,
                    fontSize: '2rem',
                    marginBottom: '0.5rem'
                  }}>
                    Welcome Back
                  </Title>
                  <Text size="sm" style={{ color: '#666' }}>
                    Sign in to access your dashboard
                  </Text>
                </div>

                {error && (
                  <Alert 
                    icon={<IconAlertCircle size="1rem" />} 
                    color="red"
                    radius="md"
                    styles={{
                      root: { border: 'none' }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <div style={{ width: '100%' }}>
                  {/* Custom Tab Navigation */}
                  <div style={{ 
                    width: '100%', 
                    marginBottom: '1.5rem',
                    backgroundColor: '#f8f9fa',
                    padding: '4px',
                    borderRadius: '8px',
                    display: 'flex',
                    height: '48px',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Button
                      variant={loginTab === 'admin' ? 'filled' : 'subtle'}
                      onClick={() => setLoginTab('admin')}
                      style={{ 
                        flex: 1,
                        margin: '2px',
                        backgroundColor: loginTab === 'admin' ? 'white' : 'transparent',
                        color: loginTab === 'admin' ? 'var(--hh-primary-darkest)' : '#666',
                        border: 'none',
                        boxShadow: loginTab === 'admin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        fontWeight: 600
                      }}
                      leftIcon={<IconShieldCheck size="1rem" />}
                    >
                      Admin Login
                    </Button>
                    <Button
                      variant={loginTab === 'driver' ? 'filled' : 'subtle'}
                      onClick={() => setLoginTab('driver')}
                      style={{ 
                        flex: 1,
                        margin: '2px',
                        backgroundColor: loginTab === 'driver' ? 'white' : 'transparent',
                        color: loginTab === 'driver' ? 'var(--hh-primary-darkest)' : '#666',
                        border: 'none',
                        boxShadow: loginTab === 'driver' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        fontWeight: 600
                      }}
                      leftIcon={<IconTruck size="1rem" />}
                    >
                      Driver Login
                    </Button>
                  </div>
                  
                  {/* Admin Login Content */}
                  {loginTab === 'admin' && (
                    <div>
                      <form onSubmit={handleLogin}>
                        <Stack spacing="lg">
                          <TextInput
                            icon={<IconMail size="1.1rem" />}
                            placeholder="Enter your email"
                            label="Email Address"
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                            required
                            size="md"
                            radius="md"
                            styles={{
                              label: { 
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#333'
                              },
                              input: {
                                height: '48px',
                                fontSize: '15px',
                                border: '1.5px solid #e0e0e0',
                                transition: 'all 0.3s ease',
                                '&:focus': {
                                  borderColor: 'var(--hh-primary-dark)',
                                  boxShadow: '0 0 0 3px rgba(44, 179, 141, 0.1)'
                                }
                              }
                            }}
                          />
                          <div>
                            <TextInput
                              icon={<IconLock size="1.1rem" />}
                              placeholder="Enter your password"
                              label="Password"
                              type={showPassword ? 'text' : 'password'}
                              value={loginForm.password}
                              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                              rightSection={
                                <ActionIcon
                                  onClick={() => setShowPassword(!showPassword)}
                                  variant="transparent"
                                  size="lg"
                                  style={{ color: '#666' }}
                                >
                                  {showPassword ? <IconEyeOff size="1.2rem" /> : <IconEye size="1.2rem" />}
                                </ActionIcon>
                              }
                              required
                              size="md"
                              radius="md"
                              styles={{
                                label: { 
                                  marginBottom: '8px',
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: '#333'
                                },
                                input: {
                                  height: '48px',
                                  fontSize: '15px',
                                  paddingRight: '50px',
                                  border: '1.5px solid #e0e0e0',
                                  transition: 'all 0.3s ease',
                                  '&:focus': {
                                    borderColor: 'var(--hh-primary-dark)',
                                    boxShadow: '0 0 0 3px rgba(44, 179, 141, 0.1)'
                                  }
                                }
                              }}
                            />
                            <Text size="xs" color="dimmed" style={{ 
                              marginTop: '8px',
                              textAlign: 'right',
                              cursor: 'pointer',
                              '&:hover': { color: 'var(--hh-primary-dark)' }
                            }}>
                              Forgot password?
                            </Text>
                          </div>
                          
                          <Button
                            type="submit"
                            fullWidth
                            loading={loginLoading}
                            size="lg"
                            radius="md"
                            style={{ 
                              backgroundColor: 'var(--hh-primary-darkest)',
                              height: '50px',
                              fontSize: '16px',
                              fontWeight: 600,
                              marginTop: '0.5rem',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 12px rgba(44, 179, 141, 0.15)'
                            }}
                            styles={{
                              root: {
                                '&:hover': {
                                  backgroundColor: '#0A5C47',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 6px 20px rgba(44, 179, 141, 0.25)'
                                }
                              }
                            }}
                          >
                            Sign In to Admin Dashboard
                          </Button>
                        </Stack>
                      </form>

                      <div style={{
                        marginTop: '1.5rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid #e0e0e0'
                      }}>
                        <Text size="sm" color="dimmed" align="center" style={{ marginBottom: '0.5rem' }}>
                          Demo Admin Credentials
                        </Text>
                        <div style={{
                          background: '#f5f5f5',
                          padding: '12px',
                          borderRadius: '8px',
                          fontFamily: 'monospace'
                        }}>
                          <Text size="xs" style={{ color: '#666', marginBottom: '4px' }}>
                            📧 admin@hhdonations.com
                          </Text>
                          <Text size="xs" style={{ color: '#666' }}>
                            🔑 admin123
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Driver Login Content */}
                  {loginTab === 'driver' && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                      <Stack spacing="md" align="center">
                        <IconTruck size="3rem" color="#ccc" />
                        <Title order={4} style={{ color: '#666' }}>
                          Driver Portal Coming Soon
                        </Title>
                        <Text size="sm" color="dimmed" style={{ maxWidth: '400px', textAlign: 'center' }}>
                          The driver login portal is currently under development. 
                          Drivers will be able to access their pickup schedules and update delivery statuses here.
                        </Text>
                        <Button 
                          variant="outline" 
                          disabled
                          style={{ 
                            borderColor: '#e0e0e0',
                            color: '#999'
                          }}
                        >
                          Coming Soon
                        </Button>
                      </Stack>
                    </div>
                  )}
                </div>
              </Stack>
            </Card>

            <Text size="xs" style={{ color: '#666', marginTop: '1rem' }}>
              © 2025 H&H Donations. All rights reserved.
            </Text>
          </Stack>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center" spacing="md">
          <Loader size="lg" />
          <Text>Loading dashboard...</Text>
        </Stack>
      </Container>
    );
  }

  // Dashboard content
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Container size="lg" py="xl">
        <Stack spacing="xl">
          {/* Header */}
          <Title order={1} style={{ color: 'var(--hh-primary-darkest)' }}>
            Dashboard
          </Title>

          {/* Clickable Stats Cards - Button Style */}
          <Group grow>
            <div 
              onClick={() => setActiveTab('bins')}
              style={{ 
                cursor: 'pointer',
                padding: '16px 20px',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: activeTab === 'bins' ? 'var(--hh-primary-dark)' : 'var(--hh-primary-dark)',
                backgroundColor: activeTab === 'bins' ? 'var(--hh-primary-dark)' : 'transparent',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'bins') {
                  e.currentTarget.style.backgroundColor = 'var(--hh-primary-dark)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 179, 141, 0.3)';
                  // Update text colors on hover
                  e.currentTarget.querySelectorAll('.stat-label').forEach(el => el.style.color = 'rgba(255, 255, 255, 0.9)');
                  e.currentTarget.querySelectorAll('.stat-value').forEach(el => el.style.color = 'white');
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'bins') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  // Reset text colors
                  e.currentTarget.querySelectorAll('.stat-label').forEach(el => el.style.color = '#666');
                  e.currentTarget.querySelectorAll('.stat-value').forEach(el => el.style.color = 'var(--hh-primary-darkest)');
                }
              }}
            >
              <div>
                <Text 
                  size="sm" 
                  className="stat-label"
                  style={{ 
                    color: activeTab === 'bins' ? 'rgba(255, 255, 255, 0.9)' : '#666',
                    fontWeight: 500,
                    marginBottom: '4px',
                    transition: 'color 0.3s ease'
                  }}
                >
                  Total Bins
                </Text>
                <Text 
                  size="xl" 
                  weight={700} 
                  className="stat-value"
                  style={{ 
                    color: activeTab === 'bins' ? 'white' : 'var(--hh-primary-darkest)',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {bins.length}
                </Text>
              </div>
            </div>
            
            <div 
              onClick={() => setActiveTab('drivers')}
              style={{ 
                cursor: 'pointer',
                padding: '16px 20px',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: activeTab === 'drivers' ? 'var(--hh-primary-dark)' : 'var(--hh-primary-dark)',
                backgroundColor: activeTab === 'drivers' ? 'var(--hh-primary-dark)' : 'transparent',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'drivers') {
                  e.currentTarget.style.backgroundColor = 'var(--hh-primary-dark)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 179, 141, 0.3)';
                  // Update text colors on hover
                  e.currentTarget.querySelectorAll('.stat-label').forEach(el => el.style.color = 'rgba(255, 255, 255, 0.9)');
                  e.currentTarget.querySelectorAll('.stat-value').forEach(el => el.style.color = 'white');
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'drivers') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  // Reset text colors
                  e.currentTarget.querySelectorAll('.stat-label').forEach(el => el.style.color = '#666');
                  e.currentTarget.querySelectorAll('.stat-value').forEach(el => el.style.color = 'var(--hh-primary-darkest)');
                }
              }}
            >
              <div>
                <Text 
                  size="sm" 
                  className="stat-label"
                  style={{ 
                    color: activeTab === 'drivers' ? 'rgba(255, 255, 255, 0.9)' : '#666',
                    fontWeight: 500,
                    marginBottom: '4px',
                    transition: 'color 0.3s ease'
                  }}
                >
                  Active Drivers
                </Text>
                <Text 
                  size="xl" 
                  weight={700} 
                  className="stat-value"
                  style={{ 
                    color: activeTab === 'drivers' ? 'white' : 'var(--hh-primary-darkest)',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {drivers.filter(d => d.status === 'active').length}
                </Text>
              </div>
            </div>
            
            <div 
              onClick={() => setActiveTab('pickups')}
              style={{ 
                cursor: 'pointer',
                padding: '16px 20px',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: activeTab === 'pickups' ? 'var(--hh-primary-dark)' : 'var(--hh-primary-dark)',
                backgroundColor: activeTab === 'pickups' ? 'var(--hh-primary-dark)' : 'transparent',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'pickups') {
                  e.currentTarget.style.backgroundColor = 'var(--hh-primary-dark)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 179, 141, 0.3)';
                  // Update text colors on hover
                  e.currentTarget.querySelectorAll('.stat-label').forEach(el => el.style.color = 'rgba(255, 255, 255, 0.9)');
                  e.currentTarget.querySelectorAll('.stat-value').forEach(el => el.style.color = 'white');
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'pickups') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  // Reset text colors
                  e.currentTarget.querySelectorAll('.stat-label').forEach(el => el.style.color = '#666');
                  e.currentTarget.querySelectorAll('.stat-value').forEach(el => el.style.color = 'var(--hh-primary-darkest)');
                }
              }}
            >
              <div>
                <Text 
                  size="sm" 
                  className="stat-label"
                  style={{ 
                    color: activeTab === 'pickups' ? 'rgba(255, 255, 255, 0.9)' : '#666',
                    fontWeight: 500,
                    marginBottom: '4px',
                    transition: 'color 0.3s ease'
                  }}
                >
                  Scheduled Pickups
                </Text>
                <Text 
                  size="xl" 
                  weight={700} 
                  className="stat-value"
                  style={{ 
                    color: activeTab === 'pickups' ? 'white' : 'var(--hh-primary-darkest)',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {scheduledPickups.length}
                </Text>
              </div>
            </div>
            
            <div 
              onClick={() => setActiveTab('completed')}
              style={{ 
                cursor: 'pointer',
                padding: '16px 20px',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: activeTab === 'completed' ? 'var(--hh-primary-dark)' : 'var(--hh-primary-dark)',
                backgroundColor: activeTab === 'completed' ? 'var(--hh-primary-dark)' : 'transparent',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'completed') {
                  e.currentTarget.style.backgroundColor = 'var(--hh-primary-dark)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 179, 141, 0.3)';
                  // Update text colors on hover
                  e.currentTarget.querySelectorAll('.stat-label').forEach(el => el.style.color = 'rgba(255, 255, 255, 0.9)');
                  e.currentTarget.querySelectorAll('.stat-value').forEach(el => el.style.color = 'white');
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'completed') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  // Reset text colors
                  e.currentTarget.querySelectorAll('.stat-label').forEach(el => el.style.color = '#666');
                  e.currentTarget.querySelectorAll('.stat-value').forEach(el => el.style.color = 'var(--hh-primary-darkest)');
                }
              }}
            >
              <div>
                <Text 
                  size="sm" 
                  className="stat-label"
                  style={{ 
                    color: activeTab === 'completed' ? 'rgba(255, 255, 255, 0.9)' : '#666',
                    fontWeight: 500,
                    marginBottom: '4px',
                    transition: 'color 0.3s ease'
                  }}
                >
                  Completed Pickups
                </Text>
                <Text 
                  size="xl" 
                  weight={700} 
                  className="stat-value"
                  style={{ 
                    color: activeTab === 'completed' ? 'white' : 'var(--hh-primary-darkest)',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {completedPickups.length}
                </Text>
              </div>
            </div>
          </Group>

          {/* Main Content */}
          <Tabs value={activeTab} onChange={setActiveTab}>

            {/* Bins Tab */}
            <Tabs.Panel value="bins" pt="xs">
              <Card shadow="sm" padding="xl" radius="md">
                <Stack spacing="md">
                  <Group position="apart">
                    <Title order={3} style={{ color: 'var(--hh-primary-darkest)' }}>
                      Donation Bins
                    </Title>
                    <Button
                      leftIcon={<IconPlus size="1rem" />}
                      onClick={handleCreateBin}
                      style={{ backgroundColor: 'var(--hh-primary-darkest)' }}
                    >
                      Add New Bin
                    </Button>
                  </Group>

                  {/* Search */}
                  <TextInput
                    placeholder="Search bins by name, address, or bin number..."
                    value={binSearchQuery}
                    onChange={(e) => setBinSearchQuery(e.target.value)}
                    icon={<IconSearch size="1rem" />}
                  />

                  {error && (
                    <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                      {error}
                    </Alert>
                  )}

                  {/* Enhanced Table with separators and dropdown menu */}
                  <div style={{ 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px', 
                    backgroundColor: 'white',
                    overflow: 'hidden'
                  }}>
                    {/* Table Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr 1fr 100px 100px 40px',
                      padding: '16px 20px',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '1px solid #e9ecef',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#495057'
                    }}>
                      <SortableHeader 
                        field="bin_number" 
                        sortConfig={binSort} 
                        onSort={(field) => handleSort(field, binSort, setBinSort)}
                      >
                        Bin Number
                      </SortableHeader>
                      <SortableHeader 
                        field="name" 
                        sortConfig={binSort} 
                        onSort={(field) => handleSort(field, binSort, setBinSort)}
                      >
                        Location Name
                      </SortableHeader>
                      <SortableHeader 
                        field="address" 
                        sortConfig={binSort} 
                        onSort={(field) => handleSort(field, binSort, setBinSort)}
                      >
                        Address
                      </SortableHeader>
                      <SortableHeader 
                        field="type" 
                        sortConfig={binSort} 
                        onSort={(field) => handleSort(field, binSort, setBinSort)}
                      >
                        Type
                      </SortableHeader>
                      <SortableHeader 
                        field="status" 
                        sortConfig={binSort} 
                        onSort={(field) => handleSort(field, binSort, setBinSort)}
                      >
                        Status
                      </SortableHeader>
                      <div></div>
                    </div>

                    {/* Table Body */}
                    {getPaginatedBins().map((bin, index) => (
                      <div key={bin.id}>
                        <div 
                          onClick={() => handleBinRowClick(bin)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '120px 1fr 1fr 100px 100px 40px',
                            padding: '20px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <div>
                            <Badge style={{ backgroundColor: 'var(--hh-primary-dark)', color: 'white' }} size="sm">
                              {bin.bin_number || 'N/A'}
                            </Badge>
                          </div>
                          
                          <div>
                            <Text weight={500} size="sm">{bin.name}</Text>
                          </div>
                          
                          <div>
                            <Text size="sm" color="dimmed" lineClamp={2}>
                              {bin.address}
                            </Text>
                          </div>
                          
                          <div>
                            <Badge 
                              style={{ 
                                backgroundColor: bin.type === 'Indoor' ? '#3b82f6' : '#10b981', 
                                color: 'white',
                                fontWeight: '600'
                              }}
                              size="sm"
                            >
                              {bin.type}
                            </Badge>
                          </div>
                          
                          <div>
                            <Badge 
                              style={{
                                backgroundColor: 
                                  bin.status === 'active' ? '#22c55e' : 
                                  bin.status === 'maintenance' ? '#f59e0b' : '#ef4444',
                                color: 'white',
                                fontWeight: '600'
                              }}
                              size="sm"
                            >
                              {bin.status?.charAt(0).toUpperCase() + bin.status?.slice(1)}
                            </Badge>
                          </div>
                          
                          <div onClick={(e) => e.stopPropagation()}>
                            <Menu shadow="xl" width={180} position="bottom-end" withArrow>
                              <Menu.Target>
                                <ActionIcon
                                  variant="subtle"
                                  color="gray"
                                  size="md"
                                  radius="md"
                                  style={{
                                    '&:hover': {
                                      backgroundColor: '#f5f5f5'
                                    }
                                  }}
                                >
                                  <IconDots size="1.2rem" />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Label>Actions</Menu.Label>
                                <Menu.Item 
                                  icon={<IconEdit size={16} />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBinRowClick(bin);
                                  }}
                                  style={{ fontSize: '0.875rem' }}
                                >
                                  Edit Bin
                                </Menu.Item>
                                <Menu.Item 
                                  icon={<IconTruck size={16} />}
                                  color="blue"
                                  onClick={(e) => handleSchedulePickup(bin, e)}
                                  style={{ fontSize: '0.875rem', fontWeight: 500 }}
                                >
                                  Schedule Pickup
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item 
                                  icon={<IconTrash size={16} />}
                                  color="red"
                                  onClick={(e) => handleDeleteBin(bin.id, e)}
                                  style={{ fontSize: '0.875rem' }}
                                >
                                  Delete Bin
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </div>
                        </div>
                        
                        {/* Separator line (except for last item) */}
                        {index < getPaginatedBins().length - 1 && (
                          <div style={{
                            height: '1px',
                            backgroundColor: '#f1f3f4',
                            margin: '0 20px'
                          }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bins Pagination */}
                  {totalBinPages > 1 && (
                    <Center mt="xl">
                      <Pagination 
                        value={binPage} 
                        onChange={setBinPage} 
                        total={totalBinPages}
                        color="var(--hh-primary-darkest)"
                        size="sm"
                      />
                    </Center>
                  )}
                </Stack>
              </Card>
            </Tabs.Panel>

            {/* Drivers Tab */}
            <Tabs.Panel value="drivers" pt="xs">
              <Card shadow="sm" padding="xl" radius="md">
                <Stack spacing="md">
                  <Group position="apart">
                    <Title order={3} style={{ color: 'var(--hh-primary-darkest)' }}>
                      Drivers
                    </Title>
                    <Button
                      leftIcon={<IconPlus size="1rem" />}
                      onClick={handleCreateDriver}
                      style={{ backgroundColor: 'var(--hh-primary-darkest)' }}
                    >
                      Add New Driver
                    </Button>
                  </Group>

                  {error && (
                    <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                      {error}
                    </Alert>
                  )}

                  {/* Enhanced Drivers Table */}
                  <div style={{ 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px', 
                    backgroundColor: 'white',
                    overflow: 'hidden'
                  }}>
                    {/* Table Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 120px 100px 40px',
                      padding: '16px 20px',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '1px solid #e9ecef',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#495057'
                    }}>
                      <SortableHeader 
                        field="name" 
                        sortConfig={driverSort} 
                        onSort={(field) => handleSort(field, driverSort, setDriverSort)}
                      >
                        Name
                      </SortableHeader>
                      <SortableHeader 
                        field="email" 
                        sortConfig={driverSort} 
                        onSort={(field) => handleSort(field, driverSort, setDriverSort)}
                      >
                        Email
                      </SortableHeader>
                      <SortableHeader 
                        field="phone" 
                        sortConfig={driverSort} 
                        onSort={(field) => handleSort(field, driverSort, setDriverSort)}
                      >
                        Phone
                      </SortableHeader>
                      <SortableHeader 
                        field="status" 
                        sortConfig={driverSort} 
                        onSort={(field) => handleSort(field, driverSort, setDriverSort)}
                      >
                        Status
                      </SortableHeader>
                      <div></div>
                    </div>

                    {/* Table Body */}
                    {getPaginatedDrivers().map((driver, index) => (
                      <div key={driver.id}>
                        <div 
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 120px 100px 40px',
                            padding: '20px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          onClick={() => handleEditDriver(driver)}
                        >
                          <div>
                            <Text weight={500} size="sm">{driver.name}</Text>
                          </div>
                          
                          <div>
                            <Text size="sm" color="dimmed">{driver.email}</Text>
                          </div>
                          
                          <div>
                            <Text size="sm">{driver.phone || 'N/A'}</Text>
                          </div>
                          
                          <div>
                            <Badge 
                              color={driver.status === 'active' ? 'green' : 'red'}
                              variant="dot"
                              size="sm"
                            >
                              {driver.status?.charAt(0).toUpperCase() + driver.status?.slice(1)}
                            </Badge>
                          </div>
                          
                          <div onClick={(e) => e.stopPropagation()}>
                            <Menu shadow="xl" width={180} position="bottom-end" withArrow>
                              <Menu.Target>
                                <ActionIcon
                                  variant="subtle"
                                  color="gray"
                                  size="md"
                                  radius="md"
                                  style={{
                                    '&:hover': {
                                      backgroundColor: '#f5f5f5'
                                    }
                                  }}
                                >
                                  <IconDots size="1.2rem" />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Label>Actions</Menu.Label>
                                <Menu.Item 
                                  icon={<IconEdit size={16} />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditDriver(driver);
                                  }}
                                  style={{ fontSize: '0.875rem' }}
                                >
                                  Edit Driver
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item 
                                  icon={<IconTrash size={16} />}
                                  color="red"
                                  onClick={() => handleDeleteDriver(driver.id)}
                                  style={{ fontSize: '0.875rem' }}
                                >
                                  Delete Driver
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </div>
                        </div>
                        
                        {/* Separator line */}
                        {index < getPaginatedDrivers().length - 1 && (
                          <div style={{
                            height: '1px',
                            backgroundColor: '#f1f3f4',
                            margin: '0 20px'
                          }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Drivers Pagination */}
                  {totalDriverPages > 1 && (
                    <Center mt="xl">
                      <Pagination 
                        value={driverPage} 
                        onChange={setDriverPage} 
                        total={totalDriverPages}
                        color="var(--hh-primary-darkest)"
                        size="sm"
                      />
                    </Center>
                  )}
                </Stack>
              </Card>
            </Tabs.Panel>

            {/* Pickups Tab */}
            <Tabs.Panel value="pickups" pt="xs">
              <Card shadow="sm" padding="xl" radius="md">
                <Stack spacing="md">
                  <Group position="apart">
                    <Title order={3} style={{ color: 'var(--hh-primary-darkest)' }}>
                      Scheduled Pickups
                    </Title>
                    <Button
                      leftIcon={<IconPlus size="1rem" />}
                      onClick={handleCreatePickup}
                      style={{ backgroundColor: 'var(--hh-primary-darkest)' }}
                    >
                      Schedule Pickup
                    </Button>
                  </Group>

                  {error && (
                    <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                      {error}
                    </Alert>
                  )}

                  {/* Enhanced Pickups Table */}
                  <div style={{ 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px', 
                    backgroundColor: 'white',
                    overflow: 'hidden'
                  }}>
                    {/* Table Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 120px 100px 100px 40px',
                      padding: '16px 20px',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '1px solid #e9ecef',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#495057'
                    }}>
                      <SortableHeader 
                        field="bin_id" 
                        sortConfig={pickupSort} 
                        onSort={(field) => handleSort(field, pickupSort, setPickupSort)}
                      >
                        Bin Location
                      </SortableHeader>
                      <SortableHeader 
                        field="driver_id" 
                        sortConfig={pickupSort} 
                        onSort={(field) => handleSort(field, pickupSort, setPickupSort)}
                      >
                        Driver
                      </SortableHeader>
                      <SortableHeader 
                        field="pickup_date" 
                        sortConfig={pickupSort} 
                        onSort={(field) => handleSort(field, pickupSort, setPickupSort)}
                      >
                        Date
                      </SortableHeader>
                      <SortableHeader 
                        field="pickup_time" 
                        sortConfig={pickupSort} 
                        onSort={(field) => handleSort(field, pickupSort, setPickupSort)}
                      >
                        Time
                      </SortableHeader>
                      <SortableHeader 
                        field="load_type" 
                        sortConfig={pickupSort} 
                        onSort={(field) => handleSort(field, pickupSort, setPickupSort)}
                      >
                        Load Type
                      </SortableHeader>
                      <div></div>
                    </div>

                    {/* Table Body */}
                    {getPaginatedPickups().map((pickup, index) => {
                      const bin = bins.find(b => b.id === pickup.bin_id);
                      const driver = drivers.find(d => d.id === pickup.driver_id);
                      return (
                        <div key={pickup.id}>
                          <div 
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr 120px 100px 100px 40px',
                              padding: '20px',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease',
                              alignItems: 'center'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            onClick={() => handleEditPickup(pickup)}
                          >
                            <div>
                              <Text weight={500} size="sm">{bin?.name || 'Unknown Location'}</Text>
                            </div>
                            
                            <div>
                              <Text size="sm" color="dimmed">{driver?.name || 'Unassigned'}</Text>
                            </div>
                            
                            <div>
                              <Text size="sm">
                                {pickup.pickup_date ? new Date(pickup.pickup_date).toLocaleDateString() : 'TBD'}
                              </Text>
                            </div>
                            
                            <div>
                              <Text size="sm">{pickup.pickup_time || 'TBD'}</Text>
                            </div>
                            
                            <div>
                              <Badge 
                                color={
                                  pickup.load_type === 'textiles' ? 'blue' : 
                                  pickup.load_type === 'shoes' ? 'green' : 'gray'
                                }
                                variant="filled"
                                size="sm"
                              >
                                {pickup.load_type}
                              </Badge>
                            </div>
                            
                            <div onClick={(e) => e.stopPropagation()}>
                              <Menu shadow="xl" width={180} position="bottom-end" withArrow>
                                <Menu.Target>
                                  <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    size="md"
                                    radius="md"
                                    style={{
                                      '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                      }
                                    }}
                                  >
                                    <IconDots size="1.2rem" />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Label>Actions</Menu.Label>
                                  <Menu.Item 
                                    icon={<IconCircleCheck size={16} />}
                                    color="green"
                                    onClick={(e) => handleCompletePickup(pickup, e)}
                                    style={{ fontSize: '0.875rem', fontWeight: 500 }}
                                  >
                                    Complete Pickup
                                  </Menu.Item>
                                  <Menu.Item 
                                    icon={<IconEdit size={16} />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditPickup(pickup);
                                    }}
                                    style={{ fontSize: '0.875rem' }}
                                  >
                                    Edit Pickup
                                  </Menu.Item>
                                  <Menu.Divider />
                                  <Menu.Item 
                                    icon={<IconTrash size={16} />}
                                    color="red"
                                    onClick={() => handleDeletePickup(pickup.id)}
                                    style={{ fontSize: '0.875rem' }}
                                  >
                                    Delete Pickup
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </div>
                          </div>
                          
                          {/* Separator line */}
                          {index < getPaginatedPickups().length - 1 && (
                            <div style={{
                              height: '1px',
                              backgroundColor: '#f1f3f4',
                              margin: '0 20px'
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pickups Pagination */}
                  {totalPickupPages > 1 && (
                    <Center mt="xl">
                      <Pagination 
                        value={pickupPage} 
                        onChange={setPickupPage} 
                        total={totalPickupPages}
                        color="var(--hh-primary-darkest)"
                        size="sm"
                      />
                    </Center>
                  )}
                </Stack>
              </Card>
            </Tabs.Panel>

            {/* Completed Pickups Tab */}
            <Tabs.Panel value="completed" pt="xs">
              <Card shadow="sm" padding="xl" radius="md">
                <Stack spacing="md">
                  <Title order={3} style={{ color: 'var(--hh-primary-darkest)' }}>
                    Completed Pickups
                  </Title>

                  {error && (
                    <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                      {error}
                    </Alert>
                  )}

                  {/* Completed Pickups Table */}
                  <div style={{ 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px', 
                    backgroundColor: 'white',
                    overflow: 'hidden'
                  }}>
                    {/* Table Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 120px 100px 100px 100px 40px',
                      padding: '16px 20px',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '1px solid #e9ecef',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#495057'
                    }}>
                      <SortableHeader 
                        field="bin_id" 
                        sortConfig={completedPickupSort} 
                        onSort={(field) => handleSort(field, completedPickupSort, setCompletedPickupSort)}
                      >
                        Bin Location
                      </SortableHeader>
                      <SortableHeader 
                        field="driver_id" 
                        sortConfig={completedPickupSort} 
                        onSort={(field) => handleSort(field, completedPickupSort, setCompletedPickupSort)}
                      >
                        Driver
                      </SortableHeader>
                      <SortableHeader 
                        field="pickup_date" 
                        sortConfig={completedPickupSort} 
                        onSort={(field) => handleSort(field, completedPickupSort, setCompletedPickupSort)}
                      >
                        Date
                      </SortableHeader>
                      <SortableHeader 
                        field="pickup_time" 
                        sortConfig={completedPickupSort} 
                        onSort={(field) => handleSort(field, completedPickupSort, setCompletedPickupSort)}
                      >
                        Time
                      </SortableHeader>
                      <SortableHeader 
                        field="load_type" 
                        sortConfig={completedPickupSort} 
                        onSort={(field) => handleSort(field, completedPickupSort, setCompletedPickupSort)}
                      >
                        Load Type
                      </SortableHeader>
                      <div>Status</div>
                      <div></div>
                    </div>

                    {/* Table Body */}
                    {getPaginatedCompletedPickups().length === 0 ? (
                      <div style={{ 
                        padding: '40px',
                        textAlign: 'center',
                        color: '#999'
                      }}>
                        <IconCircleCheck size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                        <Text size="sm" color="dimmed">No completed pickups yet</Text>
                      </div>
                    ) : (
                      getPaginatedCompletedPickups().map((pickup, index) => {
                        const bin = bins.find(b => b.id === pickup.bin_id);
                        const driver = drivers.find(d => d.id === pickup.driver_id);
                        return (
                          <div key={pickup.id}>
                            <div 
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 120px 100px 100px 100px 40px',
                                padding: '20px',
                                transition: 'background-color 0.2s ease',
                                alignItems: 'center'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <div>
                                <Text weight={500} size="sm">{bin?.name || 'Unknown Location'}</Text>
                              </div>
                              
                              <div>
                                <Text size="sm" color="dimmed">{driver?.name || 'Unassigned'}</Text>
                              </div>
                              
                              <div>
                                <Text size="sm">
                                  {pickup.pickup_date ? new Date(pickup.pickup_date).toLocaleDateString() : 'N/A'}
                                </Text>
                              </div>
                              
                              <div>
                                <Text size="sm">{pickup.pickup_time || 'N/A'}</Text>
                              </div>
                              
                              <div>
                                <Badge 
                                  color={
                                    pickup.load_type === 'textiles' ? 'blue' : 
                                    pickup.load_type === 'shoes' ? 'green' : 'gray'
                                  }
                                  variant="filled"
                                  size="sm"
                                >
                                  {pickup.load_type}
                                </Badge>
                              </div>
                              
                              <div>
                                <Badge 
                                  color="green"
                                  variant="light"
                                  size="sm"
                                  leftSection={<IconCircleCheck size={14} />}
                                >
                                  Completed
                                </Badge>
                              </div>
                              
                              <div>
                                <Menu shadow="xl" width={200} position="bottom-end" withArrow>
                                  <Menu.Target>
                                    <ActionIcon
                                      variant="subtle"
                                      color="gray"
                                      size="md"
                                      radius="md"
                                      style={{
                                        '&:hover': {
                                          backgroundColor: '#f5f5f5'
                                        }
                                      }}
                                    >
                                      <IconDots size="1.2rem" />
                                    </ActionIcon>
                                  </Menu.Target>
                                  <Menu.Dropdown>
                                    <Menu.Label>Actions</Menu.Label>
                                    <Menu.Item 
                                      icon={<IconArrowBackUp size={16} />}
                                      color="orange"
                                      onClick={(e) => handleIncompletePickup(pickup, e)}
                                      style={{ fontSize: '0.875rem', fontWeight: 500 }}
                                    >
                                      Mark as Incomplete
                                    </Menu.Item>
                                    <Menu.Item 
                                      icon={<IconEdit size={16} />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditPickup(pickup);
                                      }}
                                      style={{ fontSize: '0.875rem' }}
                                    >
                                      Edit Pickup
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item 
                                      icon={<IconTrash size={16} />}
                                      color="red"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePickup(pickup.id);
                                      }}
                                      style={{ fontSize: '0.875rem' }}
                                    >
                                      Delete Pickup
                                    </Menu.Item>
                                  </Menu.Dropdown>
                                </Menu>
                              </div>
                            </div>
                            
                            {/* Separator line */}
                            {index < getPaginatedCompletedPickups().length - 1 && (
                              <div style={{
                                height: '1px',
                                backgroundColor: '#f1f3f4',
                                margin: '0 20px'
                              }} />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Completed Pickups Pagination */}
                  {totalCompletedPickupPages > 1 && (
                    <Center mt="xl">
                      <Pagination 
                        value={completedPickupPage} 
                        onChange={setCompletedPickupPage} 
                        total={totalCompletedPickupPages}
                        color="var(--hh-primary-darkest)"
                        size="sm"
                      />
                    </Center>
                  )}
                </Stack>
              </Card>
            </Tabs.Panel>
          </Tabs>

          {/* Edit Bin Modal */}
          <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title={editingBin ? 'Edit Bin' : 'Add New Bin'}
            size="lg"
          >
            <Stack spacing="md">
              <TextInput
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <TextInput
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
              <Group grow>
                <NumberInput
                  label="Latitude"
                  value={formData.latitude}
                  onChange={(val) => setFormData({...formData, latitude: val})}
                  precision={6}
                  placeholder="43.6532"
                />
                <NumberInput
                  label="Longitude"
                  value={formData.longitude}
                  onChange={(val) => setFormData({...formData, longitude: val})}
                  precision={6}
                  placeholder="-79.3832"
                />
              </Group>
              <TextInput
                label="Hours"
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
                placeholder="Open 24/7"
                required
              />
              <Group grow>
                <Select
                  label="Type"
                  value={formData.type}
                  onChange={(val) => setFormData({...formData, type: val})}
                  data={['Indoor', 'Outdoor']}
                  required
                />
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(val) => setFormData({...formData, status: val})}
                  data={['active', 'inactive', 'maintenance']}
                  required
                />
              </Group>
              <Switch
                label="Drive-up Access Available"
                checked={formData.driveUp}
                onChange={(e) => setFormData({...formData, driveUp: e.currentTarget.checked})}
              />
              <TextInput
                label="Distance"
                value={formData.distance}
                onChange={(e) => setFormData({...formData, distance: e.target.value})}
                placeholder="1.5 km"
              />
              <Textarea
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional information about this location..."
              />
              <Group position="right">
                <Button variant="outline" onClick={() => setModalOpened(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveBin}
                  style={{ backgroundColor: 'var(--hh-primary-darkest)' }}
                >
                  {editingBin ? 'Update' : 'Create'} Bin
                </Button>
              </Group>
            </Stack>
          </Modal>

          {/* Edit Driver Modal */}
          <Modal
            opened={driverModalOpened}
            onClose={() => setDriverModalOpened(false)}
            title={editingDriver ? 'Edit Driver' : 'Add New Driver'}
            size="lg"
          >
            <Stack spacing="md">
              <TextInput
                label="Name"
                value={driverFormData.name}
                onChange={(e) => setDriverFormData({...driverFormData, name: e.target.value})}
                required
              />
              <TextInput
                label="Email"
                value={driverFormData.email}
                onChange={(e) => setDriverFormData({...driverFormData, email: e.target.value})}
                type="email"
                required
              />
              <TextInput
                label="Phone"
                value={driverFormData.phone}
                onChange={(e) => setDriverFormData({...driverFormData, phone: e.target.value})}
              />
              <TextInput
                label="License Number"
                value={driverFormData.license_number}
                onChange={(e) => setDriverFormData({...driverFormData, license_number: e.target.value})}
              />
              <Select
                label="Status"
                value={driverFormData.status}
                onChange={(val) => setDriverFormData({...driverFormData, status: val})}
                data={['active', 'inactive']}
                required
              />
              <Group position="right">
                <Button variant="outline" onClick={() => setDriverModalOpened(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveDriver}
                  style={{ backgroundColor: 'var(--hh-primary-darkest)' }}
                >
                  {editingDriver ? 'Update' : 'Create'} Driver
                </Button>
              </Group>
            </Stack>
          </Modal>

          {/* Edit Pickup Modal */}
          <Modal
            opened={pickupModalOpened}
            onClose={() => setPickupModalOpened(false)}
            title={editingPickup ? 'Edit Pickup' : 'Schedule New Pickup'}
            size="lg"
          >
            <Stack spacing="md">
              <Select
                label="Bin Location"
                value={pickupFormData.bin_id}
                onChange={(val) => setPickupFormData({...pickupFormData, bin_id: val})}
                data={bins.map(bin => ({
                  value: bin.id.toString(),
                  label: bin.name
                }))}
                required
              />
              <Select
                label="Driver (Optional)"
                value={pickupFormData.driver_id}
                onChange={(val) => setPickupFormData({...pickupFormData, driver_id: val})}
                data={[
                  { value: '', label: 'Unassigned' },
                  ...drivers.filter(d => d.status === 'active').map(driver => ({
                    value: driver.id.toString(),
                    label: driver.name
                  }))
                ]}
                placeholder="Select a driver or leave unassigned"
              />
              <Group grow>
                <TextInput
                  label="Pickup Date"
                  value={pickupFormData.pickup_date}
                  onChange={(e) => setPickupFormData({...pickupFormData, pickup_date: e.target.value})}
                  type="date"
                  required
                />
                <TextInput
                  label="Pickup Time"
                  value={pickupFormData.pickup_time}
                  onChange={(e) => setPickupFormData({...pickupFormData, pickup_time: e.target.value})}
                  type="time"
                />
              </Group>
              <Group grow>
                <Select
                  label="Load Type"
                  value={pickupFormData.load_type}
                  onChange={(val) => setPickupFormData({...pickupFormData, load_type: val})}
                  data={['mixed', 'textiles', 'shoes', 'accessories']}
                  required
                />
                <NumberInput
                  label="Load Weight (kg)"
                  value={pickupFormData.load_weight}
                  onChange={(val) => setPickupFormData({...pickupFormData, load_weight: val})}
                  placeholder="Estimated weight"
                />
              </Group>
              <Textarea
                label="Notes"
                value={pickupFormData.notes}
                onChange={(e) => setPickupFormData({...pickupFormData, notes: e.target.value})}
                placeholder="Additional notes about this pickup..."
              />
              <Group position="right">
                <Button variant="outline" onClick={() => setPickupModalOpened(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSavePickup}
                  style={{ backgroundColor: 'var(--hh-primary-darkest)' }}
                >
                  {editingPickup ? 'Update' : 'Schedule'} Pickup
                </Button>
              </Group>
            </Stack>
          </Modal>
        </Stack>
      </Container>
    </div>
  );
};

export default ClickableDashboard;