import React, { useState, useRef, useEffect, useMemo } from 'react';

import { Text, Button } from '@momentum-design/components/react';
import './homepage.css';

const HomePage: React.FC = () => {
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedContext, setSelectedContext] = useState<string>('');
    const [mainSearchValue, setMainSearchValue] = useState<string>('');
    const [showCustomerSummary, setShowCustomerSummary] = useState(false);
    const [showCustomerGroups, setShowCustomerGroups] = useState(false);
    const [showMeetingsAnalysis, setShowMeetingsAnalysis] = useState(false);
    const [viewMode, setViewMode] = useState<'workspace' | 'control-center'>('workspace');
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mainSearchInputRef = useRef<HTMLInputElement>(null);

    const handleContextMenuToggle = () => {
        setIsContextMenuOpen(prev => {
            const newState = !prev;
            if (newState) {
                // Focus the search input when menu opens for autocomplete
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 100);
            } else {
                // Clear search and reset category when menu closes
                setSearchTerm('');
                setSelectedCategory(null);
            }
            return newState;
        });
    };

    const handleCategoryClick = (category: string) => {
        console.log('Category clicked:', category);
        setSelectedCategory(category);
        setSearchTerm('');
        // Focus the search input after category selection
        setTimeout(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
                console.log('Search input focused after category click');
            } else {
                console.log('Search input ref is null');
            }
        }, 50);
    };

    const handleSubcategoryClick = (category: string, subcategory: string) => {
        const contextText = `${category} | ${subcategory}`;
        setSelectedContext(contextText);
        setIsContextMenuOpen(false);
        setSearchTerm('');
        setSelectedCategory(null);
        
        // Focus the main search input after context is set
        setTimeout(() => {
            if (mainSearchInputRef.current) {
                mainSearchInputRef.current.focus();
            }
        }, 100);
    };

    const handleBackClick = () => {
        setSelectedCategory(null);
        setSearchTerm('');
    };

    const handleMainSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMainSearchValue(e.target.value);
    };

    const handleMainSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendClick();
        }
    };

    const handleSendClick = () => {
            // Handle search submission with context
            const searchQuery = selectedContext ? `${selectedContext}: ${mainSearchValue}` : mainSearchValue;
            console.log('Search submitted:', searchQuery);
        
        // Show customer summary if the search is about customer summary
        if (mainSearchValue.toLowerCase().includes('summarize how my customers are today') || 
            mainSearchValue.toLowerCase().includes('customers are today')) {
            setShowCustomerSummary(true);
            setShowCustomerGroups(false);
            setShowMeetingsAnalysis(false);
        }
        // Show customer groups if the search is about customer groups
        else if (mainSearchValue.toLowerCase().includes('customer groups doing today') || 
                 mainSearchValue.toLowerCase().includes('how\'s my customer groups')) {
            setShowCustomerGroups(true);
            setShowCustomerSummary(false);
            setShowMeetingsAnalysis(false);
        }
        // Show meetings analysis if the search is about declining meetings
        else if (mainSearchValue.toLowerCase().includes('declining meetings') || 
                 mainSearchValue.toLowerCase().includes('check declining meetings')) {
            setShowMeetingsAnalysis(true);
            setShowCustomerSummary(false);
            setShowCustomerGroups(false);
        }
    };

    const handleClearContext = () => {
        setSelectedContext('');
        setMainSearchValue('');
        if (mainSearchInputRef.current) {
            mainSearchInputRef.current.focus();
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        console.log('handleSearchChange called:', { 
            newSearchTerm, 
            selectedCategory, 
            previousSearchTerm: searchTerm,
            isSecondLevel: !!selectedCategory 
        });
        setSearchTerm(newSearchTerm);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentItems.length > 0) {
            if (selectedCategory) {
                handleSubcategoryClick(selectedCategory, currentItems[0]);
            } else {
                handleCategoryClick(currentItems[0]);
            }
        } else if (e.key === 'ArrowDown' && currentItems.length > 0) {
            e.preventDefault();
            const firstItem = contextMenuRef.current?.querySelector('.context-menu-item') as HTMLButtonElement;
            firstItem?.focus();
        } else if (e.key === 'Escape' && selectedCategory) {
            e.preventDefault();
            handleBackClick();
        }
    };

    // Close menu when clicking outside or pressing Escape
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setIsContextMenuOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsContextMenuOpen(false);
            }
        };

        if (isContextMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isContextMenuOpen]);

    // Focus search input when selectedCategory changes (going to second level)
    useEffect(() => {
        if (selectedCategory && isContextMenuOpen) {
            console.log('useEffect: Focusing input for second level:', selectedCategory);
            const timer = setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                    console.log('useEffect: Input focused successfully');
                }
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [selectedCategory, isContextMenuOpen]);

    const contextMenuCategories = {
        'Customers': {
            icon: 'handshake-regular',
            items: [
                'Acme Corporation',
                'Global Tech Solutions', 
                'Pinnacle Industries',
                'Stellar Enterprises',
                'BlueSky Technologies',
                'Nexus Financial Group',
                'Quantum Systems Inc',
                'Meridian Healthcare',
                'Apex Manufacturing',
                'Horizon Media Group'
            ]
        },
        'Customer groups': {
            icon: 'people-regular',
            items: [
                'Healthcare & Life Sciences',
                'North America Enterprise',
                'Fortune 500 Companies',
                'Premium Support Customers',
                'Q1 2024 Renewals',
                'Manufacturing & Industrial',
                'EMEA Mid-Market',
                'High Growth SaaS',
                'Financial Services Tier 1',
                'SMB Technology Partners'
            ]
        },
        'Onboarding templates': {
            icon: 'file-text-regular',
            items: [
                'Enterprise Cloud Migration Template',
                'SMB Quick Setup Guide',
                'Healthcare Compliance Checklist',
                'Financial Services Security Setup',
                'Multi-Cloud Integration Template',
                'Legacy System Migration Guide',
                'New Partner Welcome Kit',
                'API Integration Walkthrough',
                'Training Program Template',
                'Success Metrics Framework'
            ]
        },
        'Indirect providers': {
            icon: 'people-regular',
            items: [
                'CloudTech Solutions',
                'DataBridge Systems',
                'SecureNet Partners',
                'TechFlow Integrators',
                'NextGen Consulting',
                'RegionalTech EMEA',
                'GlobalScale Partners',
                'InnovateNow Solutions',
                'DigitalFirst Consulting',
                'ProServices Alliance'
            ]
        },
        'Administrators': {
            icon: 'admin-regular',
            items: [
                'Sarah Chen - System Admin',
                'Michael Rodriguez - Security Lead',
                'Jennifer Kim - Partner Admin',
                'David Thompson - Integration Lead',
                'Lisa Wang - Support Manager',
                'Robert Johnson - Billing Admin',
                'Emma Davis - User Management',
                'James Wilson - Analytics Lead',
                'Maria Garcia - Compliance Admin',
                'Alex Kumar - Platform Admin'
            ]
        },
        'Account': {
            icon: 'file-text-regular',
            items: [
                'Partnership Agreement Details',
                'Billing & Payment Methods',
                'API Usage & Limits',
                'Security Certificates',
                'Contact Directory',
                'Service Level Agreements',
                'Revenue Share Settings',
                'Integration Credentials',
                'Compliance Documentation',
                'Partner Performance Metrics'
            ]
        },
        'Organization settings': {
            icon: 'settings-regular',
            items: [
                'Single Sign-On Configuration',
                'Multi-Factor Authentication',
                'API Rate Limiting',
                'Data Sharing Permissions',
                'Notification Preferences',
                'White-label Branding',
                'Custom Domain Setup',
                'Webhook Configuration',
                'Security Policy Rules',
                'Backup & Recovery Settings'
            ]
        },
        'Resources & help': {
            icon: 'notes-regular',
            items: [
                'Partner API Documentation',
                'Integration Best Practices Guide',
                'Security Implementation Videos',
                'Troubleshooting Knowledge Base',
                'Partner Success Stories',
                'Technical Support Portal',
                'Community Discussion Forums',
                'Product Release Notes',
                'Training Certification Program',
                'Partner Enablement Resources'
            ]
        },
        'Approvals': {
            icon: 'user-regular',
            items: [
                'Partner Application Reviews',
                'Contract Amendments',
                'Security Clearances',
                'Integration Certifications',
                'Revenue Share Approvals',
                'Marketing Co-op Requests',
                'Technical Documentation',
                'Training Certifications',
                'Access Level Changes',
                'Compliance Attestations'
            ]
        },
        'Analytics': {
            icon: 'analysis-regular',
            items: [
                'Customer Acquisition Dashboard',
                'Revenue Performance Tracker',
                'API Usage Analytics',
                'Partner Engagement Metrics',
                'Customer Health Scores',
                'Conversion Funnel Analysis',
                'Support Ticket Trends',
                'Product Usage Insights',
                'Geographic Performance Map',
                'Custom KPI Dashboard'
            ]
        },
        'Reports': {
            icon: 'file-spreadsheet-regular',
            items: [
                'Monthly Partner Performance',
                'Quarterly Business Review',
                'Customer Success Scorecard',
                'Revenue Attribution Report',
                'API Integration Status',
                'Support Metrics Summary',
                'Security Compliance Audit',
                'User Adoption Trends',
                'Partner ROI Analysis',
                'Executive Summary Dashboard'
            ]
        },
        'Services': {
            icon: 'cloud-regular',
            items: [
                'Technical Implementation Support',
                'Partner Onboarding Program',
                'Custom Integration Development',
                'Security Assessment Service',
                'Training & Certification',
                'Go-to-Market Strategy',
                '24/7 Technical Support',
                'Data Migration Assistance',
                'Performance Optimization',
                'Strategic Account Management'
            ]
        }
    };

    // Get current items to display (categories or subcategories)
    const currentItems = useMemo(() => {
        console.log('useMemo recalculating currentItems:', { selectedCategory, searchTerm });
        
        if (selectedCategory) {
            // Show subcategories of selected category
            const categoryData = contextMenuCategories[selectedCategory as keyof typeof contextMenuCategories];
            const subcategories = categoryData ? categoryData.items : [];
            const filteredItems = searchTerm 
                ? subcategories.filter((item: string) => item.toLowerCase().includes(searchTerm.toLowerCase()))
                : subcategories;
            console.log('Second level filtering:', { 
                selectedCategory, 
                searchTerm, 
                subcategories: subcategories.length, 
                filtered: filteredItems.length, 
                filteredItems,
                allSubcategories: subcategories 
            });
            return filteredItems;
        } else {
            // Show categories
            const categories = Object.keys(contextMenuCategories);
            const filteredCategories = searchTerm
                ? categories.filter((category: string) => category.toLowerCase().includes(searchTerm.toLowerCase()))
                : categories;
            console.log('First level filtering:', { searchTerm, categories: categories.length, filtered: filteredCategories.length, filteredCategories });
            return filteredCategories;
        }
    }, [selectedCategory, searchTerm]);
    
    // Debug: Log component state changes
    useEffect(() => {
        console.log('State changed:', { 
            selectedCategory, 
            searchTerm, 
            isContextMenuOpen,
            currentItemsLength: currentItems.length 
        });
    }, [selectedCategory, searchTerm, isContextMenuOpen, currentItems]);

    return (
        <div className="home-page-wrapper">
                <div className="home-page-content">
            {/* View Mode Toggle - fixed position, centered on page */}
            <div className="view-mode-toggle">
                <button 
                    className={`toggle-option ${viewMode === 'workspace' ? 'active' : ''}`}
                    onClick={() => setViewMode('workspace')}
                >
                    Workspace
                </button>
                <button 
                    className={`toggle-option ${viewMode === 'control-center' ? 'active' : ''}`}
                    onClick={() => setViewMode('control-center')}
                >
                    Overview
                </button>
            </div>

            {/* WORKSPACE VIEW - Dynamic UI */}
            <div className="home-page-top-search" style={{ display: viewMode === 'workspace' ? 'flex' : 'none' }}>
                <div className="top-search-container">
                    <Text type="heading-midsize-bold" tagname='h2' className="top-search-title">Find what you need</Text>
                    <Text type="body-midsize-medium" tagname='p' className="top-search-subtitle">Ask, find, or act across across customers, groups, and insights</Text>
                    
                    <div className="search-container-rounded">
                        <div className="search-first-line" ref={contextMenuRef}>
                                    <Button
                                        variant="tertiary"
                                        size={24}
                                        prefixIcon="mention-regular"
                                        aria-label="add context"
                                        aria-expanded={isContextMenuOpen}
                                        aria-haspopup="menu"
                                        className={`search-at-icon ${isContextMenuOpen ? 'has-context' : ''}`}
                                        onClick={handleContextMenuToggle}
                                        title="Add context"
                                    ></Button>
                                    
                                            {selectedContext && (
                                                <div className="context-badge-momentum">
                                                    <Button 
                                                        variant="tertiary" 
                                                        size={20} 
                                                        prefixIcon={contextMenuCategories[selectedContext.split(' | ')[0] as keyof typeof contextMenuCategories]?.icon as any}
                                                        className="context-badge-icon"
                                                    />
                                                    <Text type="body-small-medium">{selectedContext}</Text>
                                                    <button 
                                                        aria-label="clear context"
                                                        className="context-badge-close"
                                                        onClick={handleClearContext}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                handleClearContext();
                                                            }
                                                        }}
                                                    >×</button>
                                                </div>
                                            )}
                            {isContextMenuOpen && (
                                <div className="context-menu" role="menu" aria-label="Add Context Menu">
                                    <div className="context-menu-header">
                                        <input
                                            key={selectedCategory || 'first-level'}
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onKeyDown={handleSearchKeyDown}
                                            onFocus={() => console.log('Search input focused, selectedCategory:', selectedCategory)}
                                            onBlur={() => console.log('Search input blurred')}
                                            placeholder={selectedCategory ? `Search in ${selectedCategory}...` : "Search context..."}
                                            className="context-search-input"
                                            autoComplete="off"
                                            autoFocus={selectedCategory ? true : false}
                                        />
                                    </div>
                                    <div className="context-menu-items" role="group">
                                        {selectedCategory && (
                                            <button
                                                className="context-menu-back"
                                                onClick={handleBackClick}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'ArrowUp') {
                                                        e.preventDefault();
                                                        searchInputRef.current?.focus();
                                                    } else if (e.key === 'ArrowDown') {
                                                        e.preventDefault();
                                                        const firstItem = e.currentTarget.nextElementSibling as HTMLButtonElement;
                                                        firstItem?.focus();
                                                    }
                                                }}
                                                tabIndex={0}
                                                role="menuitem"
                                            >
                                                <Text type="body-small-medium">← Back to categories</Text>
                                            </button>
                                        )}
                                        {(() => {
                                            console.log('Rendering menu items:', { 
                                                currentItemsLength: currentItems.length, 
                                                currentItems: currentItems,
                                                selectedCategory,
                                                searchTerm,
                                                isSecondLevel: !!selectedCategory
                                            });
                                            return null;
                                        })()}
                                        {currentItems.length > 0 ? (
                                            currentItems.map((item: string, index: number) => (
                                                    <button
                                                        key={item}
                                                        className="context-menu-item"
                                                        onClick={() => selectedCategory ? handleSubcategoryClick(selectedCategory, item) : handleCategoryClick(item)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'ArrowUp') {
                                                                e.preventDefault();
                                                                if (index === 0) {
                                                                    if (selectedCategory) {
                                                                        const backButton = e.currentTarget.parentElement?.querySelector('.context-menu-back') as HTMLButtonElement;
                                                                        if (backButton) {
                                                                            backButton.focus();
                                                                        } else {
                                                                            searchInputRef.current?.focus();
                                                                        }
                                                                    } else {
                                                                        searchInputRef.current?.focus();
                                                                    }
                                                                } else {
                                                                    const prevItem = e.currentTarget.previousElementSibling as HTMLButtonElement;
                                                                    prevItem?.focus();
                                                                }
                                                            } else if (e.key === 'ArrowDown') {
                                                                e.preventDefault();
                                                                const nextItem = e.currentTarget.nextElementSibling as HTMLButtonElement;
                                                                nextItem?.focus();
                                                            } else if (e.key === 'ArrowRight' && !selectedCategory) {
                                                                e.preventDefault();
                                                                handleCategoryClick(item);
                                                            } else if (e.key === 'ArrowLeft' && selectedCategory) {
                                                                e.preventDefault();
                                                                handleBackClick();
                                                            }
                                                        }}
                                                        tabIndex={0}
                                                        role="menuitem"
                                                    >
                                                        <Button 
                                                            variant="tertiary" 
                                                            size={20} 
                                                            prefixIcon={!selectedCategory 
                                                                ? contextMenuCategories[item as keyof typeof contextMenuCategories]?.icon as any
                                                                : contextMenuCategories[selectedCategory as keyof typeof contextMenuCategories]?.icon as any
                                                            }
                                                            className="context-menu-item-icon"
                                                        />
                                                        <Text type="body-small-medium">{item}</Text>
                                                    </button>
                                            ))
                                        ) : (
                                            <div className="context-menu-no-results">
                                                <Text type="body-small-medium">No matches found</Text>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="search-second-line">
                            <div className="custom-search-wrapper">
                                <Button variant="tertiary" size={20} prefixIcon="sparkle-filled" aria-label="search" className="custom-search-icon"></Button>
                                <input 
                                    ref={mainSearchInputRef}
                                    type="text" 
                                    className="custom-search-input" 
                                    placeholder="Ask anything"
                                    value={mainSearchValue}
                                    onChange={handleMainSearchChange}
                                    onKeyDown={handleMainSearchKeyDown}
                                />
                            </div>
                                    <Button variant="tertiary" size={24} prefixIcon="send-filled" aria-label="send" className="search-send-icon" onClick={handleSendClick}></Button>
                                </div>
                            </div>
                            
                            {/* Search Suggestions */}
                            <div className="search-suggestions">
                                <Text type="body-small-medium" tagname='p' className="suggestions-label">Try asking:</Text>
                                <div className="suggestions-list">
                                    <Button 
                                        variant="secondary"
                                        size={32}
                                        className="suggestion-button"
                                        onClick={() => setMainSearchValue("Summarize how my customers are today")}
                                    >
                                        Summarize how my customers are today
                                    </Button>
                                    <Button 
                                        variant="secondary"
                                        size={32}
                                        className="suggestion-button"
                                        onClick={() => setMainSearchValue("How's my customer groups doing today?")}
                                    >
                                        How's my customer groups doing today?
                                    </Button>
                                    <Button 
                                        variant="secondary"
                                        size={32}
                                        className="suggestion-button"
                                        onClick={() => setMainSearchValue("Check declining meetings for Acme Corp and TechFlow Solutions")}
                                    >
                                        Check declining meetings for Acme Corp and TechFlow Solutions
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Customer Summary Panel */}
                {viewMode === 'workspace' && showCustomerSummary && (
                    <div className="customer-summary-panel">
                        <div className="panel-header">
                            <Text type="heading-small-bold" tagname="h3">Customer Summary</Text>
                            <Button 
                                variant="tertiary" 
                                size={24} 
                                prefixIcon="cancel-regular" 
                                aria-label="Close panel"
                                onClick={() => setShowCustomerSummary(false)}
                            />
                        </div>
                        <div className="panel-content">
                            <div className="summary-cards-section">
                                <div className="summary-card">
                                    <div className="summary-badge">
                                        <Text type="body-small-medium" className="summary-label">Overall Health</Text>
                                    </div>
                                    <div className="health-metrics">
                                        <div className="metric">
                                            <Text type="body-small-medium">Active Customers</Text>
                                            <Text type="heading-small-bold" className="metric-value positive">847</Text>
                                        </div>
                                        <div className="metric">
                                            <Text type="body-small-medium">At Risk</Text>
                                            <Text type="heading-small-bold" className="metric-value warning">23</Text>
                                        </div>
                                        <div className="metric">
                                            <Text type="body-small-medium">Churned (30d)</Text>
                                            <Text type="heading-small-bold" className="metric-value negative">5</Text>
                                        </div>
                                    </div>
                                </div>

                                <div className="summary-card">
                                    <div className="summary-badge">
                                        <Text type="body-small-medium" className="summary-label">Recent Activity</Text>
                                    </div>
                                    <div className="activity-list">
                                        <div className="activity-item">
                                            <Text type="body-small-medium">Acme Corporation upgraded to Enterprise plan</Text>
                                            <Text type="body-small-regular" className="activity-time">2 hours ago</Text>
                                        </div>
                                        <div className="activity-item">
                                            <Text type="body-small-medium">TechFlow Solutions reported connectivity issues</Text>
                                            <Text type="body-small-regular" className="activity-time">4 hours ago</Text>
                                        </div>
                                        <div className="activity-item">
                                            <Text type="body-small-medium">Global Tech renewed annual contract</Text>
                                            <Text type="body-small-regular" className="activity-time">1 day ago</Text>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="concerns-section">
                                <Text type="body-small-bold" tagname="h4">Top Concerns</Text>
                                <div className="concerns-list">
                                    <div className="concern-item">
                                        <div className="concern-icon">⚠️</div>
                                        <Text type="body-small-medium">Meeting quality issues reported by 3 customers</Text>
                                    </div>
                                    <div className="concern-item">
                                        <div className="concern-icon">📊</div>
                                        <Text type="body-small-medium">License utilization below 60% for 12 accounts</Text>
                                    </div>
                                    <div className="concern-item">
                                        <div className="concern-icon">📈</div>
                                        <Text type="body-small-medium">Support ticket volume up 15% this week</Text>
                                    </div>
                                </div>
                            </div>

                            <div className="actions-section">
                                <Text type="body-small-bold" tagname="h4">Recommended Actions</Text>
                                <div className="actions-list">
                                    <Button variant="secondary" size={32} className="action-button">
                                        Review at-risk customers
                                    </Button>
                                    <Button variant="secondary" size={32} className="action-button">
                                        Schedule health check calls
                                    </Button>
                                    <Button variant="secondary" size={32} className="action-button">
                                        Optimize license allocation
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Customer Groups Panel */}
                {viewMode === 'workspace' && showCustomerGroups && (
                    <div className="customer-groups-panel">
                        <div className="panel-header">
                            <Text type="heading-small-bold" tagname="h3">Favorite customer groups</Text>
                            <Button 
                                variant="tertiary" 
                                size={24} 
                                prefixIcon="cancel-regular" 
                                aria-label="Close panel"
                                onClick={() => setShowCustomerGroups(false)}
                            />
                        </div>
                        <div className="panel-content">
                            <div className="groups-section">
                                <div className="action-item">
                                    <div className="action-badge">
                                        <Text type="body-small-medium" className="action-label">Action taken</Text>
                                    </div>
                                    <Text type="body-small-bold" className="action-title">Poor calling quality for Southwest customers</Text>
                                    <Text type="body-small-regular" className="action-description">
                                        Looks like calling quality has decreased for this customer group, leading to last month's usage decline
                                    </Text>
                                    <div className="action-buttons">
                                        <Button variant="secondary" size={24} className="action-button">Upgrade licenses</Button>
                                        <Button variant="secondary" size={24} className="action-button">Launch engagement campaign</Button>
                                    </div>
                                </div>

                                <div className="suggestion-item">
                                    <div className="suggestion-badge">
                                        <Text type="body-small-medium" className="suggestion-label">Suggested action</Text>
                                    </div>
                                    <Text type="body-small-bold" className="suggestion-title">Upgraded 6 customers licenses to Professional Calling 🎉</Text>
                                    <Text type="body-small-regular" className="suggestion-description">
                                        Do you want to set a reminder to check the call quality in a month?
                                    </Text>
                                    <div className="suggestion-buttons">
                                        <Button variant="primary" size={24} className="suggestion-button">Yes, remind me</Button>
                                        <Button variant="tertiary" size={24} className="suggestion-button">Later</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="customers-section">
                                <div className="customers-header">
                                    <Text type="body-small-bold" tagname="h4">Customers (16)</Text>
                                    <div className="customers-controls">
                                        <Button variant="secondary" size={24} className="filter-button">
                                            <Text type="body-small-medium">Decline % range</Text>
                                        </Button>
                                        <div className="search-input-small">
                                            <input type="text" placeholder="Search by customer" className="customer-search" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="customers-list">
                                    <div className="customer-row">
                                        <Text type="body-small-medium" className="customer-name">Acme Corporation</Text>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{width: '85%'}}></div>
                                        </div>
                                    </div>
                                    <div className="customer-row">
                                        <Text type="body-small-medium" className="customer-name">Bluth Company</Text>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{width: '45%'}}></div>
                                        </div>
                                    </div>
                                    <div className="customer-row">
                                        <Text type="body-small-medium" className="customer-name">Dunder Mifflin</Text>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{width: '78%'}}></div>
                                        </div>
                                    </div>
                                    <div className="customer-row">
                                        <Text type="body-small-medium" className="customer-name">Fringe LLC</Text>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{width: '32%'}}></div>
                                        </div>
                                    </div>
                                    <div className="customer-row">
                                        <Text type="body-small-medium" className="customer-name">Gekko & Co</Text>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{width: '72%'}}></div>
                                        </div>
                                    </div>
                                    <div className="customer-row">
                                        <Text type="body-small-medium" className="customer-name">Oceanic Airlines</Text>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{width: '28%'}}></div>
                                        </div>
                                    </div>
                                    <div className="customer-row">
                                        <Text type="body-small-medium" className="customer-name">Soylent</Text>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{width: '68%'}}></div>
                                        </div>
                                    </div>
                                    <div className="customer-row">
                                        <Text type="body-small-medium" className="customer-name">Stark Industries</Text>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{width: '82%'}}></div>
                                        </div>
                                    </div>
                                    <div className="customer-row">
                                        <Text type="body-small-medium" className="customer-name">Wonka Industries</Text>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{width: '15%'}}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pagination">
                                    <div className="pagination-info">
                                        <Text type="body-small-medium">Items per page</Text>
                                        <select className="items-select">
                                            <option>10</option>
                                            <option>20</option>
                                            <option>50</option>
                                        </select>
                                    </div>
                                    <Button variant="tertiary" size={24} className="next-button">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Meetings Analysis Panel */}
                {viewMode === 'workspace' && showMeetingsAnalysis && (
                    <div className="meetings-analysis-panel">
                        <div className="panel-header">
                            <Text type="heading-small-bold" tagname="h3">Meeting Insights</Text>
                            <Button 
                                variant="tertiary" 
                                size={24} 
                                prefixIcon="cancel-regular" 
                                aria-label="Close panel"
                                onClick={() => setShowMeetingsAnalysis(false)}
                            />
                        </div>
                        <div className="panel-content">
                            <div className="insights-section">
                                <div className="insight-card">
                                    <div className="insight-header">
                                        <Text type="body-small-bold" className="company-name">Acme Corporation</Text>
                                        <div className="trend-indicator negative">
                                            <Text type="body-small-medium">↓ 23%</Text>
                                        </div>
                                    </div>
                                    <Text type="body-small-regular" className="insight-description">
                                        Meeting participation has declined significantly over the past 30 days. Average meeting duration down from 45min to 32min.
                                    </Text>
                                    <div className="metrics-row">
                                        <div className="metric-item">
                                            <Text type="body-small-medium" className="metric-label">Meetings/week</Text>
                                            <Text type="body-small-bold" className="metric-value">12 → 9</Text>
                                        </div>
                                        <div className="metric-item">
                                            <Text type="body-small-medium" className="metric-label">Avg duration</Text>
                                            <Text type="body-small-bold" className="metric-value">45m → 32m</Text>
                                        </div>
                                    </div>
                                    <div className="action-buttons">
                                        <Button variant="primary" size={24} className="action-button">Schedule check-in</Button>
                                        <Button variant="secondary" size={24} className="action-button">View details</Button>
                                    </div>
                                </div>

                                <div className="insight-card">
                                    <div className="insight-header">
                                        <Text type="body-small-bold" className="company-name">TechFlow Solutions</Text>
                                        <div className="trend-indicator negative">
                                            <Text type="body-small-medium">↓ 18%</Text>
                                        </div>
                                    </div>
                                    <Text type="body-small-regular" className="insight-description">
                                        Reduced meeting frequency and shorter sessions. Several recurring meetings have been cancelled or postponed.
                                    </Text>
                                    <div className="metrics-row">
                                        <div className="metric-item">
                                            <Text type="body-small-medium" className="metric-label">Meetings/week</Text>
                                            <Text type="body-small-bold" className="metric-value">15 → 12</Text>
                                        </div>
                                        <div className="metric-item">
                                            <Text type="body-small-medium" className="metric-label">Cancelled</Text>
                                            <Text type="body-small-bold" className="metric-value">8 this month</Text>
                                        </div>
                                    </div>
                                    <div className="action-buttons">
                                        <Button variant="primary" size={24} className="action-button">Schedule check-in</Button>
                                        <Button variant="secondary" size={24} className="action-button">View details</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="summary-section">
                                <Text type="body-small-bold" tagname="h4">Key Findings</Text>
                                <div className="findings-list">
                                    <div className="finding-item">
                                        <div className="finding-icon warning">⚠️</div>
                                        <Text type="body-small-medium">Both companies show declining meeting engagement patterns</Text>
                                    </div>
                                    <div className="finding-item">
                                        <div className="finding-icon info">📊</div>
                                        <Text type="body-small-medium">Average meeting duration decreased across both accounts</Text>
                                    </div>
                                    <div className="finding-item">
                                        <div className="finding-icon suggestion">💡</div>
                                        <Text type="body-small-medium">Consider proactive outreach to understand usage changes</Text>
                                    </div>
                                </div>
                            </div>

                            <div className="recommendations-section">
                                <Text type="body-small-bold" tagname="h4">Recommended Actions</Text>
                                <div className="recommendations-list">
                                    <Button variant="secondary" size={32} className="recommendation-button">
                                        Schedule customer success calls
                                    </Button>
                                    <Button variant="secondary" size={32} className="recommendation-button">
                                        Send usage optimization guide
                                    </Button>
                                    <Button variant="secondary" size={32} className="recommendation-button">
                                        Review license utilization
                                    </Button>
                        </div>
                    </div>
                </div>
            </div>
                )}

            {/* OVERVIEW VIEW - Static Dashboard */}
            {viewMode === 'control-center' && (
                <div className="overview-dashboard">
                    {/* High-Level Metrics */}
                    <div className="metrics-section">
                        <div className="metric-card">
                            <div className="metric-value-large">847</div>
                            <div className="metric-label-large">Total Customers</div>
                            <div className="metric-trend positive">↑ 12 this month</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-value-large">$2.4M</div>
                            <div className="metric-label-large">Monthly Revenue</div>
                            <div className="metric-trend positive">↑ 8% vs last month</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-value-large">94%</div>
                            <div className="metric-label-large">Avg Health Score</div>
                            <div className="metric-trend neutral">→ No change</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-value-large">23</div>
                            <div className="metric-label-large">Pending Actions</div>
                            <div className="metric-trend negative">↑ 5 new today</div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        {/* Portfolio Health Signals */}
                        <div className="dashboard-card health-signals">
                            <div className="card-header">
                                <h3>Portfolio Health Signals</h3>
                            </div>
                            <div className="card-content">
                                <div className="health-item critical">
                                    <div className="health-indicator"></div>
                                    <div className="health-info">
                                        <span className="health-count">7</span>
                                        <span className="health-label">Critical - Immediate attention needed</span>
                                    </div>
                                </div>
                                <div className="health-item warning">
                                    <div className="health-indicator"></div>
                                    <div className="health-info">
                                        <span className="health-count">23</span>
                                        <span className="health-label">At Risk - Renewal concerns</span>
                                    </div>
                                </div>
                                <div className="health-item attention">
                                    <div className="health-indicator"></div>
                                    <div className="health-info">
                                        <span className="health-count">45</span>
                                        <span className="health-label">Needs Attention - Low adoption</span>
                                    </div>
                                </div>
                                <div className="health-item healthy">
                                    <div className="health-indicator"></div>
                                    <div className="health-info">
                                        <span className="health-count">772</span>
                                        <span className="health-label">Healthy - On track</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Suggested Actions */}
                        <div className="dashboard-card suggested-actions">
                            <div className="card-header">
                                <h3>Suggested Actions</h3>
                                <span className="action-count">23 pending</span>
                            </div>
                            <div className="card-content">
                                <div className="action-item priority-high">
                                    <div className="action-priority">HIGH</div>
                                    <div className="action-details">
                                        <div className="action-title">Contact Meridian Corp about renewal</div>
                                        <div className="action-meta">Renewal in 14 days • $45K ARR</div>
                                    </div>
                                </div>
                                <div className="action-item priority-high">
                                    <div className="action-priority">HIGH</div>
                                    <div className="action-details">
                                        <div className="action-title">Review Apex Industries license usage</div>
                                        <div className="action-meta">Usage dropped 40% • At risk</div>
                                    </div>
                                </div>
                                <div className="action-item priority-medium">
                                    <div className="action-priority">MED</div>
                                    <div className="action-details">
                                        <div className="action-title">Schedule QBR with TechFlow Inc</div>
                                        <div className="action-meta">Last QBR: 4 months ago</div>
                                    </div>
                                </div>
                                <div className="action-item priority-medium">
                                    <div className="action-priority">MED</div>
                                    <div className="action-details">
                                        <div className="action-title">Upsell opportunity at DataBridge</div>
                                        <div className="action-meta">90% license utilization</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="view-all-btn">View all actions →</button>
                            </div>
                        </div>

                        {/* Recent Partner Activity */}
                        <div className="dashboard-card recent-activity">
                            <div className="card-header">
                                <h3>Recent Activity</h3>
                            </div>
                            <div className="card-content">
                                <div className="activity-item">
                                    <div className="activity-icon provisioned"></div>
                                    <div className="activity-details">
                                        <div className="activity-text"><strong>New customer provisioned:</strong> CloudFirst Solutions</div>
                                        <div className="activity-time">2 hours ago</div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon renewed"></div>
                                    <div className="activity-details">
                                        <div className="activity-text"><strong>Renewal completed:</strong> Summit Healthcare ($120K)</div>
                                        <div className="activity-time">5 hours ago</div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon alert"></div>
                                    <div className="activity-details">
                                        <div className="activity-text"><strong>Health alert:</strong> Velocity Logistics usage declined 35%</div>
                                        <div className="activity-time">Yesterday</div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon upgraded"></div>
                                    <div className="activity-details">
                                        <div className="activity-text"><strong>License upgrade:</strong> Pinnacle Finance (+50 seats)</div>
                                        <div className="activity-time">Yesterday</div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon support"></div>
                                    <div className="activity-details">
                                        <div className="activity-text"><strong>Support escalation resolved:</strong> Metro Industries</div>
                                        <div className="activity-time">2 days ago</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;