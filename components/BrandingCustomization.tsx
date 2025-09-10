import React, { useState, useRef } from 'react';

interface BrandingSettings {
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  companyName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

interface BrandingCustomizationProps {
  branding: BrandingSettings;
  onBrandingChange: (branding: BrandingSettings) => void;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter (Modern)', category: 'modern' },
  { value: 'Roboto', label: 'Roboto (Clean)', category: 'modern' },
  { value: 'Open Sans', label: 'Open Sans (Friendly)', category: 'modern' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant)', category: 'classic' },
  { value: 'Merriweather', label: 'Merriweather (Professional)', category: 'classic' },
  { value: 'Montserrat', label: 'Montserrat (Bold)', category: 'creative' },
  { value: 'Poppins', label: 'Poppins (Friendly)', category: 'creative' },
  { value: 'Lora', label: 'Lora (Serif)', category: 'luxury' }
];

const colorPresets = [
  { name: 'Ocean Blue', primary: '#2563eb', secondary: '#1e40af' },
  { name: 'Forest Green', primary: '#059669', secondary: '#047857' },
  { name: 'Royal Purple', primary: '#7c3aed', secondary: '#6d28d9' },
  { name: 'Sunset Orange', primary: '#ea580c', secondary: '#dc2626' },
  { name: 'Midnight Black', primary: '#1f2937', secondary: '#374151' },
  { name: 'Rose Gold', primary: '#e11d48', secondary: '#be185d' },
  { name: 'Emerald', primary: '#10b981', secondary: '#059669' },
  { name: 'Sapphire', primary: '#3b82f6', secondary: '#2563eb' }
];

export default function BrandingCustomization({ branding, onBrandingChange }: BrandingCustomizationProps) {
  const [activeTab, setActiveTab] = useState<'logo' | 'colors' | 'typography' | 'company'>('logo');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onBrandingChange({
          ...branding,
          logo: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (type: 'primary' | 'secondary', color: string) => {
    onBrandingChange({
      ...branding,
      [type === 'primary' ? 'primaryColor' : 'secondaryColor']: color
    });
  };

  const handleCompanyInfoChange = (field: keyof BrandingSettings, value: string) => {
    onBrandingChange({
      ...branding,
      [field]: value
    });
  };

  const tabs = [
    { 
      id: 'logo', 
      name: 'Logo & Branding', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'colors', 
      name: 'Colors', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      )
    },
    { 
      id: 'typography', 
      name: 'Typography', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    { 
      id: 'company', 
      name: 'Company Info', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Branding & Customization</h2>
        <p className="text-gray-600">Personalize your invoices with your brand identity</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Logo & Branding Tab */}
        {activeTab === 'logo' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Logo</h3>
              
              {/* Logo Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
              >
                {branding.logo ? (
                  <div className="space-y-4">
                    <img
                      src={branding.logo}
                      alt="Company Logo"
                      className="max-h-24 mx-auto rounded-lg shadow-sm"
                    />
                    <p className="text-sm text-gray-600">Click to change logo</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Upload your logo</p>
                      <p className="text-sm text-gray-600">PNG, JPG, or SVG up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            {/* Logo Guidelines */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Logo Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use high-resolution images (300 DPI or higher)</li>
                <li>• Transparent backgrounds work best</li>
                <li>• Recommended size: 200x100 pixels</li>
                <li>• Supported formats: PNG, JPG, SVG</li>
              </ul>
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
              
              {/* Color Presets */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Color Presets</h4>
                <div className="grid grid-cols-4 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        handleColorChange('primary', preset.primary);
                        handleColorChange('secondary', preset.secondary);
                      }}
                      className="group relative p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
                    >
                      <div className="flex space-x-2 mb-2">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: preset.primary }}
                        ></div>
                        <div
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: preset.secondary }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 group-hover:text-gray-900">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.secondaryColor}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Color Preview</h4>
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  A
                </div>
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: branding.secondaryColor }}
                >
                  B
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Selection</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fontOptions.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => handleCompanyInfoChange('fontFamily', font.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      branding.fontFamily === font.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{font.label}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        font.category === 'modern' ? 'bg-blue-100 text-blue-800' :
                        font.category === 'classic' ? 'bg-gray-100 text-gray-800' :
                        font.category === 'creative' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {font.category}
                      </span>
                    </div>
                    <p
                      className="text-lg"
                      style={{ fontFamily: font.value }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Company Info Tab */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={branding.companyName}
                    onChange={(e) => handleCompanyInfoChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Company Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={branding.tagline}
                    onChange={(e) => handleCompanyInfoChange('tagline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company tagline"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={branding.address}
                    onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your business address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={branding.phone}
                    onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={branding.email}
                    onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="hello@yourcompany.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={branding.website}
                    onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            {/* Mock Invoice Preview */}
            <div className="flex justify-between items-center mb-6">
              {branding.logo && (
                <img src={branding.logo} alt="Logo" className="h-8" />
              )}
              <div className="text-sm text-gray-500">INV-001</div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 
                  className="text-xl font-bold"
                  style={{ 
                    fontFamily: branding.fontFamily,
                    color: branding.primaryColor 
                  }}
                >
                  {branding.companyName || 'Your Company'}
                </h2>
                {branding.tagline && (
                  <p className="text-sm text-gray-600">{branding.tagline}</p>
                )}
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                {branding.address && <p>{branding.address}</p>}
                {branding.phone && <p>{branding.phone}</p>}
                {branding.email && <p>{branding.email}</p>}
                {branding.website && <p>{branding.website}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






















