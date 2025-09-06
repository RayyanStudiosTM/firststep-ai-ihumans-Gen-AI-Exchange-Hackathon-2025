"use client";
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  User, 
  Mail, 
  Phone, 
  Star, 
  Users, 
  CheckCircle, 
  Coffee,
  Brain as BrainIcon,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function ConnectMentorsPage() {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    meetingType: 'online', // 'online' or 'local'
    selectedDate: '',
    selectedTime: '',
    message: '',
    topic: ''
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Added avatar images
  const avatars = [
    "https://images.unsplash.com/photo-1494790108755-2616b812c88c?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", 
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  ];

  // Sample mentors data
  const mentors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Software Engineer at Google',
      experience: '8+ years',
      expertise: ['Software Development', 'Career Transition', 'Leadership'],
      rating: 4.9,
      reviews: 127,
      location: 'San Francisco, CA',
      avatar: avatars[0], // ✅ Added avatar
      bio: 'Passionate about helping developers grow their careers and transition into tech leadership roles.',
      pricing: { online: 50, local: 75 },
      availability: ['monday', 'wednesday', 'friday']
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Product Manager at Meta',
      experience: '6+ years',
      expertise: ['Product Management', 'Strategy', 'Data Analysis'],
      rating: 4.8,
      reviews: 89,
      location: 'New York, NY',
      avatar: avatars[1], // ✅ Added avatar
      bio: 'Helping professionals transition into product management and develop strategic thinking.',
      pricing: { online: 60, local: 80 },
      availability: ['tuesday', 'thursday', 'saturday']
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'UX Design Director at Adobe',
      experience: '10+ years',
      expertise: ['UX Design', 'Design Leadership', 'Portfolio Review'],
      rating: 5.0,
      reviews: 156,
      location: 'Austin, TX',
      avatar: avatars[2], // ✅ Added avatar
      bio: 'Expert in design thinking and helping designers build successful careers in tech.',
      pricing: { online: 70, local: 95 },
      availability: ['monday', 'tuesday', 'thursday']
    }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const topics = [
    'Career Planning',
    'Job Interview Preparation',
    'Resume Review',
    'Skill Development',
    'Industry Insights',
    'Networking Strategies',
    'Salary Negotiation',
    'Work-Life Balance',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateGoogleMeetLink = () => {
    // In production, you would integrate with Google Calendar API
    const randomId = Math.random().toString(36).substring(2, 15);
    return `https://meet.google.com/${randomId}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const meetLink = bookingData.meetingType === 'online' ? generateGoogleMeetLink() : null;
      
      // In production, you would:
      // 1. Save booking to database
      // 2. Create Google Calendar event with Meet link
      // 3. Send confirmation emails
      // 4. Notify mentor
      
      alert(`✅ Meeting Scheduled Successfully!\n\n` +
            `Mentor: ${selectedMentor.name}\n` +
            `Date: ${bookingData.selectedDate}\n` +
            `Time: ${bookingData.selectedTime}\n` +
            `Type: ${bookingData.meetingType === 'online' ? 'Online' : 'Local'}\n` +
            (meetLink ? `Google Meet Link: ${meetLink}\n` : '') +
            `\nConfirmation email sent to ${bookingData.email}`);
      
      // Reset form
      setBookingData({
        name: '', email: '', phone: '', meetingType: 'online',
        selectedDate: '', selectedTime: '', message: '', topic: ''
      });
      setShowBookingForm(false);
      setSelectedMentor(null);
      
    } catch (error) {
      alert('❌ Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const MentorCard = ({ mentor }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="flex items-start gap-4 mb-4">
        {/* ✅ Updated avatar with actual image */}
        <div className="relative">
          <img 
            src={mentor.avatar} 
            alt={mentor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-violet-200"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div 
            className="w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full items-center justify-center text-white font-bold text-xl hidden"
            style={{ display: 'none' }}
          >
            {mentor.name.split(' ').map(n => n[0]).join('')}
          </div>
          {/* Online status indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
          <p className="text-violet-600 font-medium mb-2">{mentor.title}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">{mentor.rating}</span>
              <span>({mentor.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{mentor.location}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{mentor.bio}</p>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Expertise:</h4>
        <div className="flex flex-wrap gap-2">
          {mentor.expertise.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Experience:</span> {mentor.experience}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Starting from</div>
          <div className="font-bold text-violet-600">${mentor.pricing.online}/session</div>
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedMentor(mentor);
          setShowBookingForm(true);
        }}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <Calendar className="w-5 h-5" />
        Schedule Meeting
      </button>
    </div>
  );

  const BookingModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Book a Session</h2>
            </div>
          </div>

          {selectedMentor && (
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                {/* ✅ Updated booking modal with avatar image */}
                <img 
                  src={selectedMentor.avatar} 
                  alt={selectedMentor.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-violet-200"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="w-12 h-12 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full items-center justify-center text-white font-bold hidden"
                  style={{ display: 'none' }}
                >
                  {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedMentor.name}</h3>
                  <p className="text-violet-600">{selectedMentor.title}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={bookingData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={bookingData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Meeting Type *</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${bookingData.meetingType === 'online' ? 'border-violet-500 bg-violet-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    name="meetingType"
                    value="online"
                    checked={bookingData.meetingType === 'online'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <Video className="w-6 h-6 text-violet-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Online Session</div>
                      <div className="text-sm text-gray-600">Via Google Meet</div>
                      <div className="text-violet-600 font-bold">${selectedMentor?.pricing.online}/session</div>
                    </div>
                  </div>
                </label>
                <label className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${bookingData.meetingType === 'local' ? 'border-violet-500 bg-violet-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    name="meetingType"
                    value="local"
                    checked={bookingData.meetingType === 'local'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <Coffee className="w-6 h-6 text-violet-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Local Meeting</div>
                      <div className="text-sm text-gray-600">Coffee shop/Office</div>
                      <div className="text-violet-600 font-bold">${selectedMentor?.pricing.local}/session</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Select Date *
                </label>
                <input
                  type="date"
                  name="selectedDate"
                  value={bookingData.selectedDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Select Time *
                </label>
                <select
                  name="selectedTime"
                  value={bookingData.selectedTime}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                >
                  <option value="">Choose a time slot</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Discussion Topic</label>
              <select
                name="topic"
                value={bookingData.topic}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
              >
                <option value="">Select a topic (optional)</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Additional Message</label>
              <textarea
                name="message"
                value={bookingData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
                placeholder="Tell your mentor what you'd like to discuss or any specific questions you have..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">What happens next?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• You'll receive a confirmation email with meeting details</li>
                    {bookingData.meetingType === 'online' && <li>• Google Meet link will be included for online sessions</li>}
                    <li>• Your mentor will be notified and may reach out before the meeting</li>
                    <li>• Payment will be processed securely after confirmation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    {bookingData.meetingType === 'online' ? 'Schedule Google Meet' : 'Schedule Local Meeting'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mini Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <BrainIcon className="w-6 h-6 text-violet-600" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                FirstStep AI
              </span>
            </Link>
            <Link href="/" className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-violet-900 to-gray-900 bg-clip-text text-transparent mb-6">
                Connect with Career Counsellors
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Get personalized guidance from industry experts. Schedule one-on-one sessions to accelerate your career growth.
              </p>
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>

          {/* Features */}
          <div className="mt-20 bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Mentors?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex p-4 bg-violet-100 rounded-full mb-4">
                  <Star className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Experts</h3>
                <p className="text-gray-600">All mentors are verified professionals with proven track records in their fields.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                  <Video className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Sessions</h3>
                <p className="text-gray-600">Choose between online Google Meet sessions or local in-person meetings.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Scheduling</h3>
                <p className="text-gray-600">Simple booking process with instant confirmations and calendar integration.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingForm && <BookingModal />}
    </>
  );
}
