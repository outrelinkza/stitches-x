import React from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
}

interface InvoiceTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

const InvoiceTemplates: React.FC<InvoiceTemplatesProps> = ({ onSelectTemplate }) => {
  const templates: Template[] = [
    {
      id: '1',
      name: 'Professional',
      description: 'Clean and modern design',
      preview: '/templates/professional.png',
      category: 'Business'
    },
    {
      id: '2',
      name: 'Creative',
      description: 'Colorful and artistic',
      preview: '/templates/creative.png',
      category: 'Creative'
    },
    {
      id: '3',
      name: 'Minimal',
      description: 'Simple and elegant',
      preview: '/templates/minimal.png',
      category: 'Minimal'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelectTemplate(template)}
        >
          <div className="aspect-video bg-gray-200 rounded mb-4"></div>
          <h3 className="font-semibold text-lg">{template.name}</h3>
          <p className="text-gray-600 text-sm">{template.description}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {template.category}
          </span>
        </div>
      ))}
    </div>
  );
};

export default InvoiceTemplates;
