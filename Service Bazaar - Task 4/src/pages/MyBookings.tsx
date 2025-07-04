import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Star, Check, Info, Phone, MessageCircle, Send, Users, Award, Heart } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  rate: number;
  currency: string;
  iconUrl: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
}

const UserDashboard: React.FC = () => {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingService, setBookingService] = useState<string | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSection, setActiveSection] = useState('services');
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    service: '',
    rating: 5,
    comment: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Mock customer reviews with Indian names
  const customerReviews: Review[] = [
    {
      id: '1',
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Excellent plumbing service! Very professional and quick response.',
      service: 'Home Plumbing',
      date: '2024-01-15'
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      rating: 4,
      comment: 'Good electrical work. The technician was knowledgeable and efficient.',
      service: 'Electrical Services',
      date: '2024-01-12'
    },
    {
      id: '3',
      name: 'Anita Patel',
      rating: 5,
      comment: 'Amazing cleaning service! My house looks spotless. Highly recommended.',
      service: 'House Cleaning',
      date: '2024-01-10'
    },
    {
      id: '4',
      name: 'Vikram Singh',
      rating: 5,
      comment: 'AC repair was done perfectly. Cool air is back! Thank you so much.',
      service: 'AC Repair & Service',
      date: '2024-01-08'
    },
    {
      id: '5',
      name: 'Meera Reddy',
      rating: 4,
      comment: 'Pest control service was effective. No more unwanted guests!',
      service: 'Pest Control',
      date: '2024-01-05'
    }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
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

  const handleBookService = async (serviceId: string) => {
    if (!token) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const service = services.find(s => s.id === serviceId);
      
      const newBooking = {
        id: Date.now().toString(),
        serviceId,
        serviceName: service?.name,
        rate: service?.rate,
        notes: bookingNotes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      existingBookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));
      
      setSuccessMessage('Service booked successfully!');
      setBookingService(null);
      setBookingNotes('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error booking service:', error);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save feedback to localStorage
    const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    const newFeedback = {
      ...feedbackForm,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    existingFeedback.push(newFeedback);
    localStorage.setItem('feedback', JSON.stringify(existingFeedback));
    
    setSuccessMessage('Thank you for your feedback!');
    setFeedbackForm({ name: '', email: '', service: '', rating: 5, comment: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save contact message to localStorage
    const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const newMessage = {
      ...contactForm,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    existingMessages.push(newMessage);
    localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
    
    setSuccessMessage('Message sent successfully! We will get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
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
      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'services', label: 'Services', icon: Calendar },
              { id: 'about', label: 'About Us', icon: Info },
              { id: 'reviews', label: 'Reviews', icon: Star },
              { id: 'feedback', label: 'Give Feedback', icon: MessageCircle },
              { id: 'contact', label: 'Contact Us', icon: Phone }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeSection === id
                    ? 'border-saffron text-saffron'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
          <Check size={20} className="mr-2" />
          {successMessage}
        </div>
      )}

      {/* Services Section */}
      {activeSection === 'services' && (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Services</h1>
            <p className="text-gray-600">Book the services you need for your home or office</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">{service.iconUrl}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8 (125 reviews)</span>
                    </div>
                    <span className="text-2xl font-bold text-saffron">
                      {formatCurrency(service.rate)}
                    </span>
                  </div>

                  {bookingService === service.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="Add any special requirements or notes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleBookService(service.id)}
                          className="flex-1 bg-forest text-white py-2 px-4 rounded-md hover:bg-forest/90 transition-colors text-sm font-medium"
                        >
                          Confirm Booking
                        </button>
                        <button
                          onClick={() => setBookingService(null)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setBookingService(service.id)}
                      className="w-full bg-saffron text-white py-2 px-4 rounded-md hover:bg-saffron/90 transition-colors font-medium"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No services available at the moment.</p>
            </div>
          )}
        </div>
      )}

      {/* About Us Section */}
      {activeSection === 'about' && (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">About Service Bazaar</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Users className="text-saffron mr-3" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To connect homeowners with trusted, professional service providers across India. 
                We believe everyone deserves access to quality home services at fair prices.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Award className="text-forest mr-3" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">Our Promise</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Quality service, transparent pricing, and customer satisfaction are at the heart 
                of everything we do. Your trust is our most valuable asset.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-saffron/10 to-forest/10 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Service Bazaar?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-saffron text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Check size={20} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Verified Professionals</h4>
                <p className="text-sm text-gray-600">All service providers are background checked and verified</p>
              </div>
              <div className="text-center">
                <div className="bg-forest text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Heart size={20} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer First</h4>
                <p className="text-sm text-gray-600">Your satisfaction is our top priority</p>
              </div>
              <div className="text-center">
                <div className="bg-saffron text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Star size={20} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Quality Assured</h4>
                <p className="text-sm text-gray-600">High-quality service guaranteed or your money back</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {activeSection === 'reviews' && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="bg-saffron text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.service}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {new Date(review.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {activeSection === 'feedback' && (
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Give Us Your Feedback</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Used</label>
                <select
                  required
                  value={feedbackForm.service}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, service: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
                >
                  <option value="">Select a service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.name}>{service.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, rating }))}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={rating <= feedbackForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({feedbackForm.rating} stars)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
                <textarea
                  required
                  value={feedbackForm.comment}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
                  rows={4}
                  placeholder="Tell us about your experience..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-saffron text-white py-3 px-4 rounded-md hover:bg-saffron/90 transition-colors font-medium flex items-center justify-center"
              >
                <Send size={16} className="mr-2" />
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Section */}
      {activeSection === 'contact' && (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
                    placeholder="Your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
                    rows={5}
                    placeholder="How can we help you?"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-saffron text-white py-3 px-4 rounded-md hover:bg-saffron/90 transition-colors font-medium flex items-center justify-center"
                >
                  <Send size={16} className="mr-2" />
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="text-saffron mr-3 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-600">+91 9003524743</p>
                    <p className="text-sm text-gray-500">Mon-Sat 9AM-7PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageCircle className="text-saffron mr-3 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">mukul.chauhan2022@vitstudent.ac.in</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="text-saffron mr-3 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-gray-900">Service Areas</h4>
                    <p className="text-gray-600">All major cities across India</p>
                    <p className="text-sm text-gray-500">Expanding to more locations</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gradient-to-br from-saffron/10 to-forest/10 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Need Immediate Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  For urgent service requests, call us directly or use our emergency booking feature.
                </p>
                <button className="bg-forest text-white px-4 py-2 rounded-md hover:bg-forest/90 transition-colors text-sm font-medium">
                  Emergency Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
