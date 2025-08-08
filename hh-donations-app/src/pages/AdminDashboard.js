import React, { useState, useEffect } from 'react';
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
  Pagination,
  Center,
  Menu,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconMapPin,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
  IconTruck,
  IconCalendar,
  IconWeight,
  IconUser,
  IconFileText,
  IconPackage,
  IconLock,
  IconMail,
  IconShieldCheck,
  IconDots,
  IconPrinter,
  IconFilter,
  IconDownload
} from '@tabler/icons-react';
// Removed import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { API_BASE } from '../utils/apiConfig';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [bins, setBins] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bins');
  const [loginTab, setLoginTab] = useState('admin');
  const [pickupSubTab, setPickupSubTab] = useState('scheduled'); // 'scheduled' or 'completed'
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Search and filter states for bins
  const [binSearchQuery, setBinSearchQuery] = useState('');
  const [binTypeFilter, setBinTypeFilter] = useState('all');
  const [binStatusFilter, setBinStatusFilter] = useState('all');
  
  // Pagination states
  const [binPage, setBinPage] = useState(1);
  const [driverPage, setDriverPage] = useState(1);
  const [pickupPage, setPickupPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal states
  const [modalOpened, setModalOpened] = useState(false);
  const [pickupModalOpened, setPickupModalOpened] = useState(false);
  const [driverModalOpened, setDriverModalOpened] = useState(false);
  const [editingBin, setEditingBin] = useState(null);
  const [editingPickup, setEditingPickup] = useState(null);
  const [editingDriver, setEditingDriver] = useState(null);
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
  const [pickupFormData, setPickupFormData] = useState({
    bin_id: '',
    driver_id: '',
    pickup_date: '',
    pickup_time: '',
    load_type: 'mixed',
    load_weight: '',
    notes: ''
  });
  const [driverFormData, setDriverFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license_number: '',
    status: 'active'
  });


  // Filter bins based on search and filters
  const filteredBins = bins.filter(bin => {
    const matchesSearch = bin.name.toLowerCase().includes(binSearchQuery.toLowerCase()) ||
                          bin.address.toLowerCase().includes(binSearchQuery.toLowerCase()) ||
                          (bin.bin_number && bin.bin_number.toLowerCase().includes(binSearchQuery.toLowerCase()));
    const matchesType = binTypeFilter === 'all' || bin.type === binTypeFilter;
    const matchesStatus = binStatusFilter === 'all' || bin.status === binStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setBinPage(1);
  }, [binSearchQuery, binTypeFilter, binStatusFilter]);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        setUser(data.user);
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

  // Fetch all drivers
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
      } else {
        setError('Failed to fetch drivers');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  // Fetch all pickups
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
      } else {
        setError('Failed to fetch pickups');
      }
    } catch (err) {
      setError('Error connecting to server');
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
        setUser(data.user);
        setIsLoggedIn(true);
        setLoginForm({ email: '', password: '' });
        fetchBins(data.token);
        fetchDrivers(data.token);
        fetchPickups(data.token);
        
        // Trigger storage event for nav update
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


  // Open create modal
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

  // Open edit modal
  const handleEditBin = (bin) => {
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

  // Save bin (create or update)
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

  // Delete bin
  const handleDeleteBin = async (binId) => {
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
  const handleSchedulePickup = (bin) => {
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

  // Driver management functions
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

  const handleEditDriver = (driver) => {
    setEditingDriver(driver);
    setDriverFormData({
      name: driver.name,
      email: driver.email || '',
      phone: driver.phone || '',
      license_number: driver.license_number || '',
      status: driver.status
    });
    setDriverModalOpened(true);
  };

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

  // Pickup management functions
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

  const handleEditPickup = (pickup) => {
    setEditingPickup(pickup);
    setPickupFormData({
      bin_id: pickup.bin_id,
      driver_id: pickup.driver_id || '',
      pickup_date: pickup.pickup_date,
      pickup_time: pickup.pickup_time || '',
      load_type: pickup.load_type || 'mixed',
      load_weight: pickup.load_weight || '',
      notes: pickup.notes || ''
    });
    setPickupModalOpened(true);
  };

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

  // Helper function to filter completed pickups by date range
  const getFilteredCompletedPickups = () => {
    let completedPickups = pickups.filter(p => p.status === 'completed');
    
    if (dateRange.start || dateRange.end) {
      completedPickups = completedPickups.filter(pickup => {
        const pickupDate = new Date(pickup.pickup_date);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        
        if (startDate && pickupDate < startDate) return false;
        if (endDate && pickupDate > endDate) return false;
        return true;
      });
    }
    
    return completedPickups.sort((a, b) => new Date(b.pickup_date) - new Date(a.pickup_date));
  };

  // Function to print completed pickups to PDF
  const printToPDF = (data) => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString();
    const startDateStr = dateRange.start ? new Date(dateRange.start).toLocaleDateString() : 'All';
    const endDateStr = dateRange.end ? new Date(dateRange.end).toLocaleDateString() : 'All';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Completed Pickups Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .date-range { text-align: center; color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .bin-number { font-family: monospace; font-weight: bold; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>H&H Donations - Completed Pickups Report</h1>
            <p>Generated on: ${currentDate}</p>
          </div>
          <div class="date-range">
            <p>Date Range: ${startDateStr} to ${endDateStr}</p>
            <p>Total Records: ${data.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Bin ID</th>
                <th>Location</th>
                <th>Address</th>
                <th>Driver</th>
                <th>Pickup Date</th>
                <th>Load Type</th>
                <th>Weight (kg)</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(pickup => {
                const bin = bins.find(b => b.id === pickup.bin_id);
                const driver = drivers.find(d => d.id === pickup.driver_id);
                return `
                  <tr>
                    <td class="bin-number">${bin && bin.bin_number ? bin.bin_number : 'N/A'}</td>
                    <td>${bin && bin.name ? bin.name : 'Unknown Location'}</td>
                    <td>${bin && bin.address ? bin.address : 'Address not available'}</td>
                    <td>${driver && driver.name ? driver.name : 'Unassigned'}</td>
                    <td>${pickup.pickup_date}</td>
                    <td>${pickup.load_type && pickup.load_type.replace ? pickup.load_type.replace('_', ' ') : 'mixed'}</td>
                    <td>${pickup.load_weight || 'Not recorded'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
                    color: 'var(--hh-primary-dark)',
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
                        color: loginTab === 'admin' ? 'var(--hh-primary-dark)' : '#666',
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
                        color: loginTab === 'driver' ? 'var(--hh-primary-dark)' : '#666',
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
                                borderColor: 'var(--hh-primary)',
                                boxShadow: '0 0 0 3px rgba(9, 76, 59, 0.1)'
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
                                  borderColor: 'var(--hh-primary)',
                                  boxShadow: '0 0 0 3px rgba(9, 76, 59, 0.1)'
                                }
                              }
                            }}
                          />
                          <Text size="xs" color="dimmed" style={{ 
                            marginTop: '8px',
                            textAlign: 'right',
                            cursor: 'pointer',
                            '&:hover': { color: 'var(--hh-primary)' }
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
                            backgroundColor: 'var(--hh-primary-dark)',
                            height: '50px',
                            fontSize: '16px',
                            fontWeight: 600,
                            marginTop: '0.5rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(9, 76, 59, 0.15)'
                          }}
                          styles={{
                            root: {
                              '&:hover': {
                                backgroundColor: '#0A5C47',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(9, 76, 59, 0.25)'
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

  // Admin dashboard
  // Calculate pickup counts outside JSX to avoid arrow function parsing issues
  const scheduledPickupsCount = pickups.filter((p) => p.status !== 'completed').length;
  const completedPickupsCount = pickups.filter((p) => p.status === 'completed').length;
  
  return (
    <div style={{ backgroundColor: 'var(--hh-light)', minHeight: '100vh' }}>
      <Container size="lg" py="xl">
        <Stack spacing="xl">
          {/* Header */}
          <Title order={1} style={{ color: 'var(--hh-primary-dark)' }}>
            Dashboard
          </Title>

          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red">
              {error}
            </Alert>
          )}

          {/* Tab Navigation */}
          <Group spacing="md" mb="xl">
            <Button
              variant={activeTab === 'bins' ? 'filled' : 'outline'}
              leftIcon={<IconMapPin size="1rem" />}
              onClick={() => setActiveTab('bins')}
              style={{ backgroundColor: activeTab === 'bins' ? 'var(--hh-primary-dark)' : undefined }}
            >
              Bins ({bins.length})
            </Button>
            <Button
              variant={activeTab === 'drivers' ? 'filled' : 'outline'}
              leftIcon={<IconTruck size="1rem" />}
              onClick={() => setActiveTab('drivers')}
              style={{ backgroundColor: activeTab === 'drivers' ? 'var(--hh-primary-dark)' : undefined }}
            >
              Drivers ({drivers.length})
            </Button>
            <Button
              variant={activeTab === 'pickups' ? 'filled' : 'outline'}
              leftIcon={<IconCalendar size="1rem" />}
              onClick={() => setActiveTab('pickups')}
              style={{ backgroundColor: activeTab === 'pickups' ? 'var(--hh-primary-dark)' : undefined }}
            >
              Upcoming Pickups ({pickups.length})
            </Button>
          </Group>

          {/* Bins Management */}
          {activeTab === 'bins' && (
            <Card shadow="sm" padding="xl" radius="md">
              <Group position="apart" mb="md">
                <Title order={3} style={{ color: 'red', fontSize: '24px' }}>
                  🔥 ALL DONATION BINS - UPDATED! ({filteredBins.length} of {bins.length})
                </Title>
                <Group>
                  <Button
                    leftIcon={<IconCalendar size="1rem" />}
                    onClick={handleCreatePickup}
                    style={{ backgroundColor: '#22c55e' }}
                  >
                    Schedule a Pickup
                  </Button>
                  <Button
                    leftIcon={<IconPlus size="1rem" />}
                    onClick={handleCreateBin}
                    style={{ backgroundColor: 'var(--hh-primary-dark)' }}
                  >
                    Add New Bin
                  </Button>
                </Group>
              </Group>

              {/* Info Alert */}
              <Alert 
                icon={<IconCalendar size="1rem" />} 
                color="green"
                style={{ marginBottom: '1rem' }}
              >
                <Text weight={500}>Schedule Pickups for Individual Bins</Text>
                <Text size="sm" color="dimmed">
                  Click the green "Schedule Pickup" button in the Actions column of any bin row to schedule a pickup for that specific bin.
                </Text>
              </Alert>

              {/* Search and Filters */}
              <Group mb="md" grow>
                <TextInput
                  placeholder="Search by name, address, or bin number..."
                  value={binSearchQuery}
                  onChange={(e) => setBinSearchQuery(e.target.value)}
                  icon={<IconMapPin size="1rem" />}
                />
                <Select
                  placeholder="Filter by type"
                  value={binTypeFilter}
                  onChange={setBinTypeFilter}
                  data={[
                    { value: 'all', label: 'All Types' },
                    { value: 'Indoor', label: 'Indoor' },
                    { value: 'Outdoor', label: 'Outdoor' }
                  ]}
                />
                <Select
                  placeholder="Filter by status"
                  value={binStatusFilter}
                  onChange={setBinStatusFilter}
                  data={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'maintenance', label: 'Maintenance' }
                  ]}
                />
              </Group>

              <Table 
                striped 
                highlightOnHover 
                verticalSpacing="md"
                horizontalSpacing="lg"
                fontSize="md"
                styles={{
                  th: {
                    backgroundColor: '#f8f9fa',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#495057',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '16px 20px',
                    borderBottom: '2px solid #dee2e6'
                  },
                  td: {
                    padding: '16px 20px',
                    fontSize: '14px',
                    borderBottom: '1px solid #f1f3f4'
                  },
                  tbody: {
                    '& tr:hover': {
                      backgroundColor: '#f8f9fa !important'
                    },
                    '& tr:hover .mantine-Badge-root': {
                      opacity: '1 !important'
                    }
                  }
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Bin Number</th>
                    <th style={{ width: '200px' }}>Location Name</th>
                    <th>Address</th>
                    <th style={{ width: '100px' }}>Type</th>
                    <th style={{ width: '100px' }}>Status</th>
                    <th style={{ width: '120px' }}>Pickup Status</th>
                    <th style={{ width: '250px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBins
                    .slice((binPage - 1) * itemsPerPage, binPage * itemsPerPage)
                    .map((bin) => (
                    <tr key={bin.id}>
                      <td>
                        <Badge 
                          color="blue" 
                          variant="light" 
                          size="md"
                          style={{ 
                            fontFamily: 'monospace',
                            fontWeight: 600
                          }}
                        >
                          {bin.bin_number || 'N/A'}
                        </Badge>
                      </td>
                      <td>
                        <Group spacing="sm">
                          <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: 'var(--hh-primary)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <IconMapPin size="16px" color="white" />
                          </div>
                          <div>
                            <Text weight={500} size="sm" style={{ color: '#212529' }}>
                              {bin.name}
                            </Text>
                          </div>
                        </Group>
                      </td>
                      <td>
                        <Text size="sm" color="dimmed" lineClamp={2}>
                          {bin.address}
                        </Text>
                      </td>
                      <td>
                        <Badge 
                          color={bin.type === 'Indoor' ? 'blue' : 'green'} 
                          variant="filled"
                          size="sm"
                          radius="sm"
                        >
                          {bin.type}
                        </Badge>
                      </td>
                      <td>
                        <Badge 
                          color={bin.status === 'active' ? 'green' : bin.status === 'maintenance' ? 'yellow' : 'red'} 
                          variant="dot"
                          size="sm"
                        >
                          {bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                        </Badge>
                      </td>
                      <td>
                        {(() => {
                          const latestPickup = pickups
                            .filter(pickup => pickup.bin_id === bin.id)
                            .sort((a, b) => new Date(b.pickup_date) - new Date(a.pickup_date))[0];
                          
                          if (!latestPickup) {
                            return (
                              <Badge color="gray" variant="light" size="sm">
                                No Pickups
                              </Badge>
                            );
                          }
                          
                          const statusColors = {
                            'scheduled': 'blue',
                            'in_progress': 'yellow', 
                            'completed': 'green',
                            'cancelled': 'red'
                          };
                          
                          return (
                            <Badge 
                              color={statusColors[latestPickup.status] || 'gray'} 
                              variant="light" 
                              size="sm"
                            >
                              {latestPickup.status === 'completed' ? 'Completed' :
                               latestPickup.status === 'scheduled' ? 'Scheduled' :
                               latestPickup.status === 'in_progress' ? 'In Progress' : 
                               'Cancelled'}
                            </Badge>
                          );
                        })()
                      }
                      </td>
                      <td>
                        <Group spacing="xs" position="center">
                          <Button
                            size="xs"
                            variant="filled"
                            color="green"
                            onClick={() => handleSchedulePickup(bin)}
                            leftIcon={<IconCalendar size="14px" />}
                            styles={{
                              root: {
                                backgroundColor: '#22c55e',
                                '&:hover': {
                                  backgroundColor: '#16a34a'
                                }
                              }
                            }}
                          >
                            Schedule Pickup
                          </Button>
                          <ActionIcon
                            color="blue"
                            variant="light"
                            size="md"
                            radius="md"
                            onClick={() => handleEditBin(bin)}
                            title="Edit Bin"
                          >
                            <IconEdit size="16px" />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            variant="light"
                            size="md"
                            radius="md"
                            onClick={() => handleDeleteBin(bin.id)}
                            title="Delete Bin"
                          >
                            <IconTrash size="16px" />
                          </ActionIcon>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {/* Pagination for Bins */}
              {filteredBins.length > itemsPerPage && (
                <Center mt="md">
                  <Pagination
                    page={binPage}
                    onChange={setBinPage}
                    total={Math.ceil(filteredBins.length / itemsPerPage)}
                    size="md"
                    radius="md"
                    withEdges
                  />
                </Center>
              )}
              
              {/* Pagination Info */}
              {filteredBins.length > 0 && (
                <Center mt="xs">
                  <Text size="sm" color="dimmed">
                    Showing {((binPage - 1) * itemsPerPage) + 1}-{Math.min(binPage * itemsPerPage, filteredBins.length)} of {filteredBins.length} bins
                  </Text>
                </Center>
              )}
            </Card>
          )}

          {/* Drivers Management */}
          {activeTab === 'drivers' && (
            <Card shadow="sm" padding="xl" radius="md">
              <Group position="apart" mb="md">
                <Title order={3} style={{ color: 'var(--hh-primary-dark)' }}>
                  Drivers ({drivers.length})
                </Title>
                <Button
                  leftIcon={<IconPlus size="1rem" />}
                  onClick={handleCreateDriver}
                  style={{ backgroundColor: 'var(--hh-primary-dark)' }}
                >
                  Add New Driver
                </Button>
              </Group>

              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>License</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers
                    .slice((driverPage - 1) * itemsPerPage, driverPage * itemsPerPage)
                    .map((driver) => (
                    <tr key={driver.id}>
                      <td>
                        <Group spacing="xs">
                          <IconUser size="1rem" color="var(--hh-primary)" />
                          {driver.name}
                        </Group>
                      </td>
                      <td>{driver.email || 'N/A'}</td>
                      <td>{driver.phone || 'N/A'}</td>
                      <td>{driver.license_number || 'N/A'}</td>
                      <td>
                        <Badge 
                          color={driver.status === 'active' ? 'green' : 'red'} 
                          variant="light"
                        >
                          {driver.status}
                        </Badge>
                      </td>
                      <td>
                        <Group spacing="xs">
                          <ActionIcon
                            color="blue"
                            variant="light"
                            onClick={() => handleEditDriver(driver)}
                          >
                            <IconEdit size="1rem" />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => handleDeleteDriver(driver.id)}
                          >
                            <IconTrash size="1rem" />
                          </ActionIcon>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {/* Pagination for Drivers */}
              {drivers.length > itemsPerPage && (
                <Center mt="md">
                  <Pagination
                    page={driverPage}
                    onChange={setDriverPage}
                    total={Math.ceil(drivers.length / itemsPerPage)}
                    size="md"
                    radius="md"
                    withEdges
                  />
                </Center>
              )}
              
              {/* Pagination Info */}
              {drivers.length > 0 && (
                <Center mt="xs">
                  <Text size="sm" color="dimmed">
                    Showing {((driverPage - 1) * itemsPerPage) + 1}-{Math.min(driverPage * itemsPerPage, drivers.length)} of {drivers.length} drivers
                  </Text>
                </Center>
              )}
            </Card>
          )}

          {/* Pickups Management */}
          {activeTab === 'pickups' && (
            <Card shadow="sm" padding="xl" radius="md">
              {/* Sub-tabs for pickups */}
              <Group mb="md">
                <Button
                  variant={pickupSubTab === 'scheduled' ? 'filled' : 'outline'}
                  onClick={() => setPickupSubTab('scheduled')}
                  style={{ 
                    backgroundColor: pickupSubTab === 'scheduled' ? 'var(--hh-primary-dark)' : undefined
                  }}
                >
                  Scheduled Pickups ({scheduledPickupsCount})
                </Button>
                <Button
                  variant={pickupSubTab === 'completed' ? 'filled' : 'outline'}
                  onClick={() => setPickupSubTab('completed')}
                  style={{ 
                    backgroundColor: pickupSubTab === 'completed' ? 'var(--hh-primary-dark)' : undefined
                  }}
                >
                  Completed Pickups ({completedPickupsCount})
                </Button>
              </Group>

              {pickupSubTab === 'scheduled' && (
                <>
                  <Group position="apart" mb="md">
                    <Title order={3} style={{ color: 'var(--hh-primary-dark)' }}>
                      Scheduled Pickups ({scheduledPickupsCount})
                    </Title>
                    <Button
                      leftIcon={<IconPlus size="1rem" />}
                      onClick={handleCreatePickup}
                      style={{ backgroundColor: 'var(--hh-primary-dark)' }}
                    >
                      Schedule New Pickup
                    </Button>
                  </Group>
                </>
              )}

              {pickupSubTab === 'completed' && (
                <>
                  <Group position="apart" mb="md">
                    <Title order={3} style={{ color: 'var(--hh-primary-dark)' }}>
                      Completed Pickups ({completedPickupsCount})
                    </Title>
                    <Group>
                      <Group spacing="sm">
                        <TextInput
                          placeholder="Start date"
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                          icon={<IconCalendar size="1rem" />}
                          style={{ width: '160px' }}
                        />
                        <TextInput
                          placeholder="End date"
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                          icon={<IconCalendar size="1rem" />}
                          style={{ width: '160px' }}
                        />
                        <Button
                          variant="outline"
                          leftIcon={<IconFilter size="1rem" />}
                          onClick={() => setDateRange({ start: '', end: '' })}
                          disabled={!dateRange.start && !dateRange.end}
                        >
                          Clear Filter
                        </Button>
                      </Group>
                      <Button
                        leftIcon={<IconPrinter size="1rem" />}
                        variant="outline"
                        color="blue"
                        onClick={() => {
                          const filteredData = getFilteredCompletedPickups();
                          printToPDF(filteredData);
                        }}
                      >
                        Print PDF
                      </Button>
                    </Group>
                  </Group>
                </>
              )}

              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Bin ID</th>
                    <th>Location</th>
                    <th>Address</th>
                    <th>Driver</th>
                    <th>Date & Time</th>
                    <th>Load Type</th>
                    <th>Status</th>
                    {pickupSubTab === 'scheduled' && <th>Actions</th>}
                    {pickupSubTab === 'completed' && <th>Weight (kg)</th>}
                  </tr>
                </thead>
                <tbody>
                  {(pickupSubTab === 'scheduled' ? 
                      pickups.filter((p) => p.status !== 'completed') :
                      getFilteredCompletedPickups()
                    )
                    .slice((pickupPage - 1) * itemsPerPage, pickupPage * itemsPerPage)
                    .map((pickup) => {
                    const bin = bins.find(b => b.id === pickup.bin_id);
                    const driver = drivers.find(d => d.id === pickup.driver_id);
                    return (
                      <tr key={pickup.id}>
                        <td>
                          <Badge 
                            color="blue" 
                            variant="light" 
                            size="md"
                            style={{ 
                              fontFamily: 'monospace',
                              fontWeight: 600
                            }}
                          >
                            {bin?.bin_number || 'N/A'}
                          </Badge>
                        </td>
                        <td>
                          <Group spacing="xs">
                            <IconMapPin size="1rem" color="var(--hh-primary)" />
                            <Text weight={500} size="sm">
                              {bin?.name || `Bin ID: ${pickup.bin_id}`}
                            </Text>
                          </Group>
                        </td>
                        <td>
                          <Text size="sm" color="dimmed" lineClamp={2}>
                            {bin?.address || 'Address not available'}
                          </Text>
                        </td>
                        <td>{driver?.name || 'Unassigned'}</td>
                        <td>
                          <Stack spacing={2}>
                            <Text size="sm">{pickup.pickup_date}</Text>
                            {pickup.pickup_time && (
                              <Text size="xs" color="dimmed">{pickup.pickup_time}</Text>
                            )}
                          </Stack>
                        </td>
                        <td>
                          <Badge 
                            color={pickup.load_type === 'high_quality' ? 'green' : 
                                   pickup.load_type === 'medium_quality' ? 'blue' : 
                                   pickup.load_type === 'low_quality' ? 'orange' : 'gray'} 
                            variant="light"
                          >
                            {pickup.load_type?.replace('_', ' ') || 'mixed'}
                          </Badge>
                        </td>
                        <td>
                          <Badge 
                            color={pickup.status === 'scheduled' ? 'blue' : 
                                   pickup.status === 'in_progress' ? 'yellow' : 
                                   pickup.status === 'completed' ? 'green' : 'red'} 
                            variant="light"
                          >
                            {pickup.status}
                          </Badge>
                        </td>
                        {pickupSubTab === 'scheduled' && (
                          <td>
                            <Group spacing="xs">
                              <ActionIcon
                                color="blue"
                                variant="light"
                                onClick={() => handleEditPickup(pickup)}
                              >
                                <IconEdit size="1rem" />
                              </ActionIcon>
                              <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() => handleDeletePickup(pickup.id)}
                              >
                                <IconTrash size="1rem" />
                              </ActionIcon>
                            </Group>
                          </td>
                        )}
                        {pickupSubTab === 'completed' && (
                          <td>
                            <Group spacing="xs">
                              <IconWeight size="1rem" color="var(--hh-primary)" />
                              <Text size="sm" weight={500}>
                                {pickup.load_weight ? `${pickup.load_weight} kg` : 'Not recorded'}
                              </Text>
                            </Group>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              
              {/* Pagination for Pickups */}
              {(() => {
                const currentPickups = pickupSubTab === 'scheduled' ? 
                  pickups.filter(p => p.status !== 'completed') :
                  getFilteredCompletedPickups();
                return currentPickups.length > itemsPerPage && (
                  <Center mt="md">
                    <Pagination
                      page={pickupPage}
                      onChange={setPickupPage}
                      total={Math.ceil(currentPickups.length / itemsPerPage)}
                      size="md"
                      radius="md"
                      withEdges
                    />
                </Center>
                );
              })()}
              
              {/* Pagination Info */}
              {pickups.length > 0 && (
                <Center mt="xs">
                  <Text size="sm" color="dimmed">
                    Showing {((pickupPage - 1) * itemsPerPage) + 1}-{Math.min(pickupPage * itemsPerPage, pickups.length)} of {pickups.length} pickups
                  </Text>
                </Center>
              )}
            </Card>
          )}
        </Stack>
      </Container>

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingBin ? 'Edit Donation Bin' : 'Add New Donation Bin'}
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
              style={{ backgroundColor: 'var(--hh-primary-dark)' }}
            >
              {editingBin ? 'Update' : 'Create'} Bin
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Driver Create/Edit Modal */}
      <Modal
        opened={driverModalOpened}
        onClose={() => setDriverModalOpened(false)}
        title={editingDriver ? 'Edit Driver' : 'Add New Driver'}
        size="md"
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
            type="email"
            value={driverFormData.email}
            onChange={(e) => setDriverFormData({...driverFormData, email: e.target.value})}
            placeholder="driver@hh-donations.com"
          />
          <TextInput
            label="Phone"
            value={driverFormData.phone}
            onChange={(e) => setDriverFormData({...driverFormData, phone: e.target.value})}
            placeholder="(416) 555-0123"
          />
          <TextInput
            label="License Number"
            value={driverFormData.license_number}
            onChange={(e) => setDriverFormData({...driverFormData, license_number: e.target.value})}
            placeholder="D1234567"
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
              style={{ backgroundColor: 'var(--hh-primary-dark)' }}
            >
              {editingDriver ? 'Update' : 'Create'} Driver
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Pickup Create/Edit Modal */}
      <Modal
        opened={pickupModalOpened}
        onClose={() => setPickupModalOpened(false)}
        title={editingPickup ? 'Edit Pickup' : 'Schedule New Pickup'}
        size="lg"
      >
        <Stack spacing="md">
          <Select
            label="Donation Bin"
            value={pickupFormData.bin_id}
            onChange={(val) => setPickupFormData({...pickupFormData, bin_id: val})}
            data={bins.map(bin => ({
              value: bin.id.toString(),
              label: `${bin.bin_number} - ${bin.name}`
            }))}
            placeholder="Select a bin"
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
              type="date"
              value={pickupFormData.pickup_date}
              onChange={(e) => setPickupFormData({...pickupFormData, pickup_date: e.target.value})}
              required
            />
            <TextInput
              label="Pickup Time (Optional)"
              type="time"
              value={pickupFormData.pickup_time}
              onChange={(e) => setPickupFormData({...pickupFormData, pickup_time: e.target.value})}
            />
          </Group>
          <Group grow>
            <Select
              label="Load Type"
              value={pickupFormData.load_type}
              onChange={(val) => setPickupFormData({...pickupFormData, load_type: val})}
              data={[
                { value: 'high_quality', label: 'High Quality' },
                { value: 'medium_quality', label: 'Medium Quality' },
                { value: 'low_quality', label: 'Low Quality' },
                { value: 'mixed', label: 'Mixed' }
              ]}
              required
            />
            <NumberInput
              label="Estimated Weight (kg)"
              value={pickupFormData.load_weight}
              onChange={(val) => setPickupFormData({...pickupFormData, load_weight: val})}
              placeholder="Optional"
              min={0}
              precision={2}
            />
          </Group>
          <Textarea
            label="Notes"
            value={pickupFormData.notes}
            onChange={(e) => setPickupFormData({...pickupFormData, notes: e.target.value})}
            placeholder="Any additional notes for the pickup..."
            minRows={3}
          />
          <Group position="right">
            <Button variant="outline" onClick={() => setPickupModalOpened(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSavePickup}
              style={{ backgroundColor: 'var(--hh-primary-dark)' }}
            >
              {editingPickup ? 'Update' : 'Schedule'} Pickup
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default AdminDashboard;