import React, { useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'luxury';
}

const templates: Template[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, professional design perfect for tech and creative businesses',
    preview: 'modern-minimal-preview.jpg',
    category: 'modern'
  },
  {
    id: 'corporate-classic',
    name: 'Corporate Classic',
    description: 'Traditional business layout ideal for established companies',
    preview: 'corporate-classic-preview.jpg',
    category: 'classic'
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Eye-catching design for creative agencies and freelancers',
    preview: 'creative-bold-preview.jpg',
    category: 'creative'
  },
  {
    id: 'elegant-luxury',
    name: 'Elegant Luxury',
    description: 'Sophisticated design for high-end services and luxury brands',
    preview: 'elegant-luxury-preview.jpg',
    category: 'luxury'
  }
];

interface InvoiceTemplatesProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export default function InvoiceTemplates({ selectedTemplate, onTemplateSelect }: InvoiceTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'modern', name: 'Modern', count: templates.filter(t => t.category === 'modern').length },
    { id: 'classic', name: 'Classic', count: templates.filter(t => t.category === 'classic').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { id: 'luxury', name: 'Luxury', count: templates.filter(t => t.category === 'luxury').length }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
        <p className="text-gray-600">Select a professional template that matches your brand</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template.id)}
            className={`relative cursor-pointer group rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              selectedTemplate === template.id
                ? 'border-blue-500 shadow-xl scale-105'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
            }`}
          >
            {/* Template Preview */}
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
              {/* Mock Invoice Preview */}
              <div className="p-4 h-full flex flex-col">
                <div className="bg-white rounded-lg shadow-sm p-4 h-full">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-16 h-8 bg-blue-600 rounded"></div>
                    <div className="text-xs text-gray-500">INV-001</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <div className="h-1 bg-gray-200 rounded"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/5"></div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-2 bg-blue-600 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.category === 'modern' ? 'bg-blue-100 text-blue-800' :
                  template.category === 'classic' ? 'bg-gray-100 text-gray-800' :
                  template.category === 'creative' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {template.category}
                </span>
                
                {selectedTemplate === template.id && (
                  <div className="flex items-center text-blue-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Button */}
      {selectedTemplate && (
        <div className="mt-8 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
            Preview Template
          </button>
        </div>
      )}
    </div>
  );
}
