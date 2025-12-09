import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@momentum-design/components/react';
import './customers_new.css';

interface CustomersPageProps {
  onPageChange?: (page: string, customerId?: number) => void;
}

const CustomersPage: React.FC<CustomersPageProps> = ({ onPageChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [customers] = useState([
    { id: 1, name: 'Acme', status: 'Ready for customer setup', statusType: 'warning', tags: ['Microsoft compete'] },
    { id: 2, name: 'Axe Capital', status: '', statusType: '', tags: ['Microsoft compete'] },
    { id: 3, name: 'Bailey Building and Loan', status: '', statusType: '', tags: [] },
    { id: 4, name: 'Bayside High School', status: '', statusType: '', tags: [] },
    { id: 5, name: 'Burn Industries', status: 'Ready for customer setup', statusType: 'warning', tags: [] },
    { id: 6, name: 'Blue Hotel', status: '', statusType: '', tags: [] },
    { id: 7, name: 'Cyberdyne Systems incorporated', status: '', statusType: '', tags: [] },
    { id: 8, name: 'Delos Inc', status: '', statusType: '', tags: [] },
    { id: 9, name: 'Dunder Mifflin, Inc.', status: 'Service not assigned', statusType: 'error', tags: [] },
    { id: 10, name: 'E Corp', status: '', statusType: '', tags: [] },
    { id: 11, name: 'Fringe Division', status: 'Expired', statusType: 'neutral', tags: [] },
    { id: 12, name: 'Gregarious Simulation', status: 'No recent activity', statusType: 'error', tags: [] },
    { id: 13, name: 'Globex', status: '', statusType: '', tags: [] },
    { id: 14, name: 'Initech', status: '', statusType: '', tags: [] },
  ]);

  const filteredCustomers = customers
    .filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuOption = (option: string) => {
    console.log('Selected option:', option);
    setIsMenuOpen(false);
    
    if (option === 'Create Wholesale Customer' && onPageChange) {
      onPageChange('create-wholesale-customer');
    }
  };

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const getStatusBadge = (status: string, statusType: string) => {
    if (!status) return null;
    
    const statusIcons = {
      warning: 'warning-bold' as const,
      error: 'priority-circle-bold' as const, 
      neutral: null
    };
    
    const iconName = statusIcons[statusType as keyof typeof statusIcons];
    
    return (
      <div className={`text-badge text-badge--${statusType}`} aria-label={status}>
        {iconName && <Icon name={iconName} size={16} />}
        <span>{status}</span>
      </div>
    );
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h1 className="page-title">Customers</h1>
        
        <div className="tab-navigation">
          <div className="tab tab--active">
            <Icon name="handshake-regular" size={16} className="tab__icon" />
            <span>Customers</span>
          </div>
          <div className="tab">
            <Icon name="people-regular" size={16} className="tab__icon" />
            <span>Groups</span>
          </div>
          <div className="tab">
            <Icon name="file-text-regular" size={16} className="tab__icon" />
            <span>Onboarding templates</span>
          </div>
        </div>
        
        <div className="actions-bar">
          <div className="actions-left">
            <div className="search-container">
              <Icon name="search-regular" size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search customers by name, ID and more"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="customer-count">
              {filteredCustomers.length} customers
            </div>
          </div>
          
              <div className="actions-right">
                <button className="icon-button" title="Download">
                  <Icon name="download-regular" size={16} />
                </button>
                <div className="split-button-wrapper" ref={menuRef}>
                  <div className="split-button">
                    <button className="split-button__main">Actions</button>
                    <button className="split-button__dropdown" onClick={toggleMenu}>
                      <Icon name="arrow-down-regular" size={12} />
                    </button>
                  </div>
                  {isMenuOpen && (
                    <div className="split-button__menu">
                      <button 
                        className="split-button__menu-item"
                        onClick={() => handleMenuOption('Start Enterprise Trial')}
                      >
                        Start Enterprise Trial
                      </button>
                      <button 
                        className="split-button__menu-item"
                        onClick={() => handleMenuOption('Create Wholesale Customer')}
                      >
                        Create Wholesale Customer
                      </button>
                    </div>
                  )}
                </div>
              </div>
        </div>
        
        <div className="filter-bar">
          <span className="filter-label">Filter by</span>
          <div className="filter-tokens">
            <div className="filter-token">Recently viewed</div>
            <div className="filter-token">Enterprise</div>
            <div className="filter-token">Wholesale</div>
            <div className="filter-token">Broadworks</div>
            <div className="filter-token">Has critical status</div>
            <div className="filter-token">Has warning status</div>
          </div>
        </div>
      </div>

      <div className="customers-table">
        <div className="table-header">
          <div className="column-header column-header--sortable" onClick={toggleSortDirection} style={{ cursor: 'pointer' }}>
            <span>Name</span>
            <Icon name={sortDirection === 'asc' ? 'arrow-tail-down-bold' : 'arrow-tail-up-bold'} className="sort-icon" />
          </div>
          <div className="column-header">Status</div>
          <div className="column-header">Tags</div>
          <div className="column-header"></div>
        </div>
        
        <div className="table-body">
          {filteredCustomers.map((customer) => (
            <div 
              key={customer.id} 
              className="table-row"
              onClick={() => onPageChange && onPageChange('customer-details', customer.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="table-cell table-cell--name">
                {customer.name}
              </div>
              <div className="table-cell table-cell--status">
                {getStatusBadge(customer.status, customer.statusType)}
              </div>
              <div className="table-cell table-cell--tags">
                {customer.tags.map((tag, index) => (
                  <div key={index} className="tag">
                    <span>{tag}</span>
                    <button className="tag__remove">
                      <Icon name="cancel-regular" size={14} />
                    </button>
                  </div>
                ))}
                {customer.tags.length === 0 && (
                  <button className="add-tag-button">
                    <Icon name="edit-regular" size={16} />
                  </button>
                )}
              </div>
                  <div className="table-cell table-cell--actions">
                    <button className="icon-button icon-button--tertiary" title="Open details">
                      <Icon name="pop-out-regular" size={16} />
                    </button>
                  </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
