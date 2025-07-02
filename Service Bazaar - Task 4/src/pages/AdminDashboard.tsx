import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  rate: number;
  currency: string;
  iconUrl: string;
}

const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rate: '',
    iconUrl: '🔧'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Get services from localStorage (mock data)
      const savedServices = localStorage.getItem('services');
      if (savedServices) {
        setServices(JSON.parse(savedServices));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveServicesToStorage = (updatedServices: Service[]) => {
    localStorage.setItem('services', JSON.stringify(updatedServices));
    setServices(updatedServices);
  };

  const handleAddService = async () => {
    if (!token || !formData.name || !formData.description || !formData.rate) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newService: Service = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        rate: Number(formData.rate),
        currency: 'INR',
        iconUrl: formData.iconUrl
      };

      const updatedServices = [...services, newService];
      saveServicesToStorage(updatedServices);
      resetForm();
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleUpdateService = async (serviceId: string) => {
    if (!token || !formData.name || !formData.description || !formData.rate) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedServices = services.map(service => 
        service.id === serviceId 
          ? {
              ...service,
              name: formData.name,
              description: formData.description,
              rate: Number(formData.rate),
              iconUrl: formData.iconUrl
            }
          : service
      );

      saveServicesToStorage(updatedServices);
      resetForm();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!token || !confirm('Are you sure you want to delete this service?')) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedServices = services.filter(service => service.id !== serviceId);
      saveServicesToStorage(updatedServices);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const startEditing = (service: Service) => {
    setEditingService(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      rate: service.rate.toString(),
      iconUrl: service.iconUrl
    });
  };

  const resetForm = () => {
    setEditingService(null);
    setIsAddingService(false);
    setFormData({
      name: '',
      description: '',
      rate: '',
      iconUrl: '🔧'
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Management</h1>
          <p className="text-gray-600">Manage your service offerings</p>
        </div>
        <button
          onClick={() => setIsAddingService(true)}
          className="bg-saffron text-white px-4 py-2 rounded-md hover:bg-saffron/90 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Service
        </button>
      </div>

      {(isAddingService || editingService) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isAddingService ? 'Add New Service' : 'Edit Service'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
                placeholder="Enter service name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate (₹)</label>
              <input
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
                placeholder="Enter rate"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
              rows={3}
              placeholder="Enter service description"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <input
              type="text"
              value={formData.iconUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, iconUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
              placeholder="Enter emoji or icon"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={isAddingService ? handleAddService : () => handleUpdateService(editingService!)}
              className="bg-forest text-white px-4 py-2 rounded-md hover:bg-forest/90 transition-colors flex items-center"
            >
              <Save size={16} className="mr-2" />
              {isAddingService ? 'Add Service' : 'Update Service'}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center"
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{service.iconUrl}</span>
                <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-saffron">
                  {formatCurrency(service.rate)}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => startEditing(service)}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center text-sm"
                >
                  <Edit2 size={16} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center text-sm"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No services available.</p>
          <button
            onClick={() => setIsAddingService(true)}
            className="bg-saffron text-white px-4 py-2 rounded-md hover:bg-saffron/90 transition-colors"
          >
            Add Your First Service
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;