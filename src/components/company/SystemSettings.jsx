// src/pages/admin/SystemSettings.jsx
import React, { useState } from 'react';
import { FaSave, FaEnvelope, FaShieldAlt, FaCogs } from 'react-icons/fa';

// Mock Data for Settings (replace with an API call to fetch current settings)
const MOCK_SETTINGS = {
  general: {
    siteName: 'EduPortal',
    supportEmail: 'support@eduportal.com',
  },
  security: {
    twoFactorAuth: true,
    passwordMinLength: 8,
  },
  notifications: {
    newUserSignup: true,
    newCompanySignup: true,
    testCompletion: false,
  },
};

const Toggle = ({ label, enabled, setEnabled }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-slate-300">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={enabled} onChange={() => setEnabled(!enabled)} />
      <div className={`block w-14 h-8 rounded-full ${enabled ? 'bg-indigo-600' : 'bg-slate-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
    </div>
  </label>
);

const SystemSettings = () => {
  const [settings, setSettings] = useState(MOCK_SETTINGS);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, general: { ...prev.general, [name]: value } }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, security: { ...prev.security, [name]: value } }));
  };
  
  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, [key]: value } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving settings:", settings);
    // Add API call to save settings here
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">System Settings</h1>
        <p className="text-slate-400">Manage global configuration for the platform.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white flex items-center mb-4"><FaCogs className="mr-2 text-indigo-400" />General Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-slate-300 mb-1">Platform Name</label>
              <input type="text" id="siteName" name="siteName" value={settings.general.siteName} onChange={handleGeneralChange} className="w-full md:w-1/2 input-style" />
            </div>
            <div>
              <label htmlFor="supportEmail" className="block text-sm font-medium text-slate-300 mb-1">Support Email</label>
              <input type="email" id="supportEmail" name="supportEmail" value={settings.general.supportEmail} onChange={handleGeneralChange} className="w-full md:w-1/2 input-style" />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white flex items-center mb-4"><FaShieldAlt className="mr-2 text-green-400" />Security</h2>
          <div className="space-y-4">
            <Toggle label="Enable Two-Factor Authentication for Admins" enabled={settings.security.twoFactorAuth} setEnabled={(val) => setSettings(p => ({...p, security: {...p.security, twoFactorAuth: val}}))} />
            <div>
              <label htmlFor="passwordMinLength" className="block text-sm font-medium text-slate-300 mb-1">Minimum Password Length</label>
              <input type="number" id="passwordMinLength" name="passwordMinLength" value={settings.security.passwordMinLength} onChange={handleSecurityChange} className="w-full md:w-1/4 input-style" />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white flex items-center mb-4"><FaEnvelope className="mr-2 text-purple-400" />Email Notifications</h2>
          <div className="space-y-4">
            <Toggle label="Notify on New Student Signup" enabled={settings.notifications.newUserSignup} setEnabled={(val) => handleNotificationChange('newUserSignup', val)} />
            <Toggle label="Notify on New Company Signup" enabled={settings.notifications.newCompanySignup} setEnabled={(val) => handleNotificationChange('newCompanySignup', val)} />
            <Toggle label="Notify Admins on Test Completion" enabled={settings.notifications.testCompletion} setEnabled={(val) => handleNotificationChange('testCompletion', val)} />
          </div>
        </div>

        <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 flex items-center shadow-lg">
                <FaSave className="mr-2" />
                Save Settings
            </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
