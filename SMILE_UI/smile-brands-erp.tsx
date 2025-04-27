import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, DollarSign, Clock, Activity, Calendar, User, Settings, LogOut, Menu, X, List, BarChart2 } from 'lucide-react';
import _ from 'lodash';

// Sample data - in a real application, this would come from an API
const salesData = [
  { month: 'Jan', revenue: 45000, target: 42000 },
  { month: 'Feb', revenue: 52000, target: 45000 },
  { month: 'Mar', revenue: 48000, target: 47000 },
  { month: 'Apr', revenue: 61000, target: 50000 },
  { month: 'May', revenue: 55000, target: 52000 },
  { month: 'Jun', revenue: 67000, target: 55000 },
];

const membershipData = [
  { name: 'Premium', value: 240, color: '#0088FE' },
  { name: 'Standard', value: 350, color: '#00C49F' },
  { name: 'Basic', value: 410, color: '#FFBB28' },
];

const appointmentData = [
  { day: 'Mon', completed: 28, scheduled: 32 },
  { day: 'Tue', completed: 35, scheduled: 38 },
  { day: 'Wed', completed: 42, scheduled: 45 },
  { day: 'Thu', completed: 38, scheduled: 41 },
  { day: 'Fri', completed: 45, scheduled: 48 },
];

const recentAppointments = [
  { id: 1, patient: 'Emma Wilson', service: 'Dental Checkup', time: '09:00 AM', status: 'Completed' },
  { id: 2, patient: 'John Smith', service: 'Teeth Whitening', time: '10:30 AM', status: 'In Progress' },
  { id: 3, patient: 'Sarah Johnson', service: 'Root Canal', time: '11:45 AM', status: 'Scheduled' },
  { id: 4, patient: 'Michael Brown', service: 'Dental Implant', time: '01:15 PM', status: 'Scheduled' },
  { id: 5, patient: 'Lisa Davis', service: 'Orthodontic Consultation', time: '02:30 PM', status: 'Scheduled' },
];

// Main Dashboard Component
const SmileBrandsERP = () => {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  // Stats summary
  const stats = [
    { title: 'Total Patients', value: '1,248', icon: <Users size={24} />, change: '+12%', color: 'bg-blue-100 text-blue-600' },
    { title: 'Monthly Revenue', value: '$67,520', icon: <DollarSign size={24} />, change: '+8%', color: 'bg-green-100 text-green-600' },
    { title: 'Appointments Today', value: '42', icon: <Clock size={24} />, change: '+5%', color: 'bg-purple-100 text-purple-600' },
    { title: 'Active Memberships', value: '1,000', icon: <Activity size={24} />, change: '+15%', color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-xl font-bold text-blue-600">Smile Brands ERP</h1>
        </div>
        <div className="flex flex-col flex-1">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <SidebarItem icon={<BarChart2 />} label="Dashboard" active={selectedView === 'dashboard'} onClick={() => setSelectedView('dashboard')} />
            <SidebarItem icon={<Calendar />} label="Appointments" active={selectedView === 'appointments'} onClick={() => setSelectedView('appointments')} />
            <SidebarItem icon={<Users />} label="Patients" active={selectedView === 'patients'} onClick={() => setSelectedView('patients')} />
            <SidebarItem icon={<DollarSign />} label="Billing" active={selectedView === 'billing'} onClick={() => setSelectedView('billing')} />
            <SidebarItem icon={<Activity />} label="Memberships" active={selectedView === 'memberships'} onClick={() => setSelectedView('memberships')} />
            <SidebarItem icon={<List />} label="Services" active={selectedView === 'services'} onClick={() => setSelectedView('services')} />
            <SidebarItem icon={<Settings />} label="Settings" active={selectedView === 'settings'} onClick={() => setSelectedView('settings')} />
          </nav>
          <div className="px-2 py-4 border-t">
            <SidebarItem icon={<LogOut />} label="Logout" onClick={() => console.log('Logout clicked')} />
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Today's Appointments</h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.patient}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{appointment.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                          appointment.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'In Progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesView = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Dental Checkup', category: 'Preventive', duration: 30, price: 120.00, active: true },
    { id: 2, name: 'Teeth Whitening', category: 'Cosmetic', duration: 60, price: 350.00, active: true },
    { id: 3, name: 'Root Canal', category: 'Restorative', duration: 90, price: 850.00, active: true },
    { id: 4, name: 'Dental Implant', category: 'Restorative', duration: 120, price: 1200.00, active: true },
    { id: 5, name: 'Orthodontic Consultation', category: 'Orthodontics', duration: 45, price: 175.00, active: true },
    { id: 6, name: 'Cavity Filling', category: 'Restorative', duration: 45, price: 200.00, active: true },
    { id: 7, name: 'Dental Cleaning', category: 'Preventive', duration: 45, price: 150.00, active: true },
    { id: 8, name: 'Dentures', category: 'Prosthetics', duration: 60, price: 900.00, active: false },
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Services Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Service</button>
      </div>
      
      <div className="mb-4 flex space-x-2">
        <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">All</button>
        <button className="px-4 py-2 hover:bg-gray-100 rounded-lg">Preventive</button>
        <button className="px-4 py-2 hover:bg-gray-100 rounded-lg">Restorative</button>
        <button className="px-4 py-2 hover:bg-gray-100 rounded-lg">Cosmetic</button>
        <button className="px-4 py-2 hover:bg-gray-100 rounded-lg">Orthodontics</button>
        <button className="px-4 py-2 hover:bg-gray-100 rounded-lg">Prosthetics</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (min)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{service.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{service.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{service.duration} min</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${service.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                  {service.active ? (
                    <button className="text-red-600 hover:text-red-900">Deactivate</button>
                  ) : (
                    <button className="text-green-600 hover:text-green-900">Activate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SettingsView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-5">Clinic Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Clinic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
                <input type="text" className="mt-1 p-2 w-full border rounded-md" value="Smile Brands Healthcare" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" className="mt-1 p-2 w-full border rounded-md" value="123 Dental Street, Suite 100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City, State, ZIP</label>
                <input type="text" className="mt-1 p-2 w-full border rounded-md" value="Healthville, CA 90210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="text" className="mt-1 p-2 w-full border rounded-md" value="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="mt-1 p-2 w-full border rounded-md" value="contact@smilebrands.example.com" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Business Hours</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Monday</span>
                <div className="flex space-x-2">
                  <input type="text" className="p-2 w-24 border rounded-md" value="9:00 AM" />
                  <span>to</span>
                  <input type="text" className="p-2 w-24 border rounded-md" value="5:00 PM" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tuesday</span>
                <div className="flex space-x-2">
                  <input type="text" className="p-2 w-24 border rounded-md" value="9:00 AM" />
                  <span>to</span>
                  <input type="text" className="p-2 w-24 border rounded-md" value="5:00 PM" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Wednesday</span>
                <div className="flex space-x-2">
                  <input type="text" className="p-2 w-24 border rounded-md" value="9:00 AM" />
                  <span>to</span>
                  <input type="text" className="p-2 w-24 border rounded-md" value="5:00 PM" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Thursday</span>
                <div className="flex space-x-2">
                  <input type="text" className="p-2 w-24 border rounded-md" value="9:00 AM" />
                  <span>to</span>
                  <input type="text" className="p-2 w-24 border rounded-md" value="5:00 PM" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Friday</span>
                <div className="flex space-x-2">
                  <input type="text" className="p-2 w-24 border rounded-md" value="9:00 AM" />
                  <span>to</span>
                  <input type="text" className="p-2 w-24 border rounded-md" value="5:00 PM" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Saturday</span>
                <div className="flex space-x-2">
                  <input type="text" className="p-2 w-24 border rounded-md" value="10:00 AM" />
                  <span>to</span>
                  <input type="text" className="p-2 w-24 border rounded-md" value="2:00 PM" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sunday</span>
                <div className="flex space-x-2">
                  <select className="p-2 w-full border rounded-md">
                    <option>Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Changes</button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-5">User Management</h2>
        
        <div className="mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add User</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Admin User</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">admin@smilebrands.example.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-purple-100 text-purple-800">
                    Administrator
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Deactivate</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Doctor User</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">doctor@smilebrands.example.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-blue-100 text-blue-800">
                    Doctor
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Deactivate</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Reception User</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">reception@smilebrands.example.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-yellow-100 text-yellow-800">
                    Receptionist
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Deactivate</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SmileBrandsERP;

const BillingView = () => {
  const [invoices, setInvoices] = useState([
    { id: 1, patient: 'Emma Wilson', service: 'Dental Checkup', date: '2025-04-10', amount: 120.00, status: 'Paid' },
    { id: 2, patient: 'John Smith', service: 'Teeth Whitening', date: '2025-04-15', amount: 350.00, status: 'Pending' },
    { id: 3, patient: 'Sarah Johnson', service: 'Root Canal', date: '2025-04-18', amount: 850.00, status: 'Overdue' },
    { id: 4, patient: 'Michael Brown', service: 'Dental Implant', date: '2025-04-20', amount: 1200.00, status: 'Pending' },
    { id: 5, patient: 'Lisa Davis', service: 'Orthodontic Consultation', date: '2025-04-22', amount: 175.00, status: 'Paid' },
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Financial Management</h2>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">+ New Invoice</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Export Report</button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-blue-900">$24,500</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Paid Invoices</h3>
          <p className="text-2xl font-bold text-green-900">$18,320</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">Pending</h3>
          <p className="text-2xl font-bold text-yellow-900">$4,580</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Overdue</h3>
          <p className="text-2xl font-bold text-red-900">$1,600</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">INV-{invoice.id.toString().padStart(5, '0')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{invoice.patient}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{invoice.service}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{invoice.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${invoice.amount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    invoice.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : invoice.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                  <button className="text-green-600 hover:text-green-900">Send Reminder</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MembershipsView = () => {
  const [membershipPlans, setMembershipPlans] = useState([
    { id: 1, name: 'Basic', price: 29.99, features: ['Bi-annual checkups', 'Basic cleaning', '10% discount on procedures'], active: true },
    { id: 2, name: 'Standard', price: 49.99, features: ['Quarterly checkups', 'Advanced cleaning', '15% discount on procedures', 'Free X-rays'], active: true },
    { id: 3, name: 'Premium', price: 79.99, features: ['Monthly checkups', 'Premium cleaning', '25% discount on procedures', 'Free X-rays', 'Emergency appointments'], active: true },
  ]);

  const [members, setMembers] = useState([
    { id: 1, name: 'Emma Wilson', plan: 'Premium', startDate: '2024-10-15', endDate: '2025-10-15', autoRenew: true },
    { id: 2, name: 'John Smith', plan: 'Standard', startDate: '2024-11-20', endDate: '2025-11-20', autoRenew: true },
    { id: 3, name: 'Sarah Johnson', plan: 'Basic', startDate: '2025-01-05', endDate: '2026-01-05', autoRenew: false },
    { id: 4, name: 'Michael Brown', plan: 'Premium', startDate: '2024-12-10', endDate: '2025-12-10', autoRenew: true },
    { id: 5, name: 'Lisa Davis', plan: 'Standard', startDate: '2025-02-15', endDate: '2026-02-15', autoRenew: true },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-5 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Membership Plans</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Plan</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {membershipPlans.map(plan => (
            <div key={plan.id} className={`border rounded-lg p-5 ${
              plan.name === 'Premium' 
                ? 'border-blue-300 bg-blue-50' 
                : plan.name === 'Standard'
                ? 'border-green-300 bg-green-50'
                : 'border-yellow-300 bg-yellow-50'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">Active</span>
                  <div className={`w-10 h-5 rounded-full ${plan.active ? 'bg-green-500' : 'bg-gray-300'} relative`}>
                    <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${plan.active ? 'left-5' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="mb-4 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">Edit</button>
                <button className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-5 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Active Memberships</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Assign Membership</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto Renew</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                      member.plan === 'Premium'
                        ? 'bg-blue-100 text-blue-800'
                        : member.plan === 'Standard'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.startDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${member.autoRenew ? 'text-green-600' : 'text-red-600'}`}>
                      {member.autoRenew ? 'Yes' : 'No'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

// Placeholder views for other sections
const AppointmentsView = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, patient: 'Emma Wilson', service: 'Dental Checkup', date: '2025-04-23', time: '09:00 AM', status: 'Completed', notes: 'Regular check-up, no issues found' },
    { id: 2, patient: 'John Smith', service: 'Teeth Whitening', date: '2025-04-23', time: '10:30 AM', status: 'In Progress', notes: 'Sensitive teeth, use gentle approach' },
    { id: 3, patient: 'Sarah Johnson', service: 'Root Canal', date: '2025-04-23', time: '11:45 AM', status: 'Scheduled', notes: 'Patient is anxious, requires sedation' },
    { id: 4, patient: 'Michael Brown', service: 'Dental Implant', date: '2025-04-24', time: '01:15 PM', status: 'Scheduled', notes: 'Follow up on previous treatment' },
    { id: 5, patient: 'Lisa Davis', service: 'Orthodontic Consultation', date: '2025-04-24', time: '02:30 PM', status: 'Scheduled', notes: 'First consultation, needs full assessment' },
    { id: 6, patient: 'David Wilson', service: 'Cavity Filling', date: '2025-04-25', time: '09:45 AM', status: 'Scheduled', notes: 'Three cavities to be filled' },
    { id: 7, patient: 'Jennifer Lee', service: 'Dental Cleaning', date: '2025-04-25', time: '11:00 AM', status: 'Scheduled', notes: 'Regular cleaning, 6-month checkup' },
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Appointment Schedule</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ New Appointment</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{appointment.patient}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{appointment.service}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{appointment.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{appointment.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    appointment.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PatientsView = () => {
  const [patients, setPatients] = useState([
    { id: 1, name: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '(555) 123-4567', membership: 'Premium', lastVisit: '2025-04-10' },
    { id: 2, name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 234-5678', membership: 'Standard', lastVisit: '2025-04-15' },
    { id: 3, name: 'Sarah Johnson', email: 'sarah.johnson@example.com', phone: '(555) 345-6789', membership: 'Basic', lastVisit: '2025-04-18' },
    { id: 4, name: 'Michael Brown', email: 'michael.brown@example.com', phone: '(555) 456-7890', membership: 'Premium', lastVisit: '2025-04-20' },
    { id: 5, name: 'Lisa Davis', email: 'lisa.davis@example.com', phone: '(555) 567-8901', membership: 'Standard', lastVisit: '2025-04-22' },
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Patient Directory</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Patient</button>
      </div>
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search patients..." 
          className="w-full p-2 border rounded" 
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{patient.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{patient.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    patient.membership === 'Premium'
                      ? 'bg-blue-100 text-blue-800'
                      : patient.membership === 'Standard'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {patient.membership}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{patient.lastVisit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-green-600 hover:text-green-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 z-40 w-full bg-white border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold text-blue-600">Smile Brands ERP</h1>
          <button
            className="text-gray-500 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-gray-800 bg-opacity-75 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <h1 className="text-xl font-bold text-blue-600">Smile Brands ERP</h1>
              <button
                className="text-gray-500 focus:outline-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <nav className="px-2 py-4 space-y-1">
              <SidebarItem icon={<BarChart2 />} label="Dashboard" active={selectedView === 'dashboard'} onClick={() => { setSelectedView('dashboard'); setMobileMenuOpen(false); }} />
              <SidebarItem icon={<Calendar />} label="Appointments" active={selectedView === 'appointments'} onClick={() => { setSelectedView('appointments'); setMobileMenuOpen(false); }} />
              <SidebarItem icon={<Users />} label="Patients" active={selectedView === 'patients'} onClick={() => { setSelectedView('patients'); setMobileMenuOpen(false); }} />
              <SidebarItem icon={<DollarSign />} label="Billing" active={selectedView === 'billing'} onClick={() => { setSelectedView('billing'); setMobileMenuOpen(false); }} />
              <SidebarItem icon={<Activity />} label="Memberships" active={selectedView === 'memberships'} onClick={() => { setSelectedView('memberships'); setMobileMenuOpen(false); }} />
              <SidebarItem icon={<List />} label="Services" active={selectedView === 'services'} onClick={() => { setSelectedView('services'); setMobileMenuOpen(false); }} />
              <SidebarItem icon={<Settings />} label="Settings" active={selectedView === 'settings'} onClick={() => { setSelectedView('settings'); setMobileMenuOpen(false); }} />
              <SidebarItem icon={<LogOut />} label="Logout" onClick={() => console.log('Logout clicked')} />
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-0 pt-16 md:pt-0">
        <header className="bg-white shadow">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedView === 'dashboard' && 'Dashboard'}
                {selectedView === 'appointments' && 'Appointments'}
                {selectedView === 'patients' && 'Patients'}
                {selectedView === 'billing' && 'Billing'}
                {selectedView === 'memberships' && 'Memberships'}
                {selectedView === 'services' && 'Services'}
                {selectedView === 'settings' && 'Settings'}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{currentDate}</span>
                <div className="relative">
                  <button className="flex items-center text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
                    <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <User size={16} />
                    </span>
                  </button>
                </div>
              </div>
            </div>