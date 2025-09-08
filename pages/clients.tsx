import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Acme Corp',
      email: 'contact@acmecorp.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, USA'
    },
    {
      id: '2',
      name: 'Global Innovations',
      email: 'info@globalinnovations.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Springfield, USA'
    },
    {
      id: '3',
      name: 'Tech Solutions Inc.',
      email: 'support@techsolutions.com',
      phone: '(555) 111-2222',
      address: '789 Pine Ln, Metropolis, USA'
    },
    {
      id: '4',
      name: 'Creative Designs LLC',
      email: 'hello@creativedesigns.com',
      phone: '(555) 333-4444',
      address: '101 Elm Rd, Harmony, USA'
    },
    {
      id: '5',
      name: 'Sunrise Ventures',
      email: 'inquiries@sunriseventures.com',
      phone: '(555) 555-6666',
      address: '222 Maple Dr, Serenity, USA'
    }
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery) ||
    client.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const handleEditClient = (clientId: string) => {
    // In a real app, this would open an edit modal or navigate to edit page
    alert(`Edit client functionality would be implemented here for client ID: ${clientId}`);
  };

  const handleAddClient = () => {
    // In a real app, this would open an add client modal or navigate to add page
    alert('Add new client functionality would be implemented here');
  };

  return (
    <>
      <Head>
        <title>Clients - Stitches</title>
        <meta name="description" content="Manage your client information and contacts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <div className="layout-container flex h-full grow flex-col">
          <Header currentPage="/clients" />

          <div className="px-40 flex flex-1 justify-center py-10">
            <div className="layout-content-container flex flex-col w-full max-w-6xl">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <h1 className="text-gray-900 text-4xl font-bold leading-tight">Clients</h1>
                <button 
                  onClick={handleAddClient}
                  className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  <span className="truncate">New Client</span>
                </button>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <span className="material-symbols-outlined text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 text-2xl">search</span>
                  <input 
                    className="form-input w-full rounded-lg text-gray-900 border-gray-200 bg-white h-12 placeholder:text-gray-400 pl-12 pr-4 text-base font-normal focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Search clients by name, email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full @container">
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" style={{backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.75)'}}>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">Client Name</th>
                        <th className="px-6 py-4 text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-4 text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">Address</th>
                        <th className="px-6 py-4 text-left text-gray-500 text-xs font-semibold uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr key={client.id} className="border-t border-t-gray-200/80 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 align-middle text-gray-800 text-sm font-medium">{client.name}</td>
                          <td className="px-6 py-4 align-middle text-gray-500 text-sm">{client.email}</td>
                          <td className="px-6 py-4 align-middle text-gray-500 text-sm">{client.phone}</td>
                          <td className="px-6 py-4 align-middle text-gray-500 text-sm">{client.address}</td>
                          <td className="px-6 py-4 align-middle text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleEditClient(client.id)}
                                className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                <span className="material-symbols-outlined text-xl">edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteClient(client.id)}
                                className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <span className="material-symbols-outlined text-xl">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredClients.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <span className="material-symbols-outlined text-6xl">group</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? 'Try adjusting your search terms.' : 'Get started by adding your first client.'}
                  </p>
                  {!searchQuery && (
                    <button 
                      onClick={handleAddClient}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span className="material-symbols-outlined">add</span>
                      Add First Client
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
