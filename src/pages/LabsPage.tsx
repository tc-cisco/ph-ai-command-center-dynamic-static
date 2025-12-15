import React, { useState } from 'react';
import { Icon } from '@momentum-design/components/react';
import './labs.css';

// Feature card images from Figma
const imgTopCustomers = "https://www.figma.com/api/mcp/asset/7d3c05a2-2ad0-4fb8-a755-a2eb0b7ffa08";
const imgMirrorCustomer = "https://www.figma.com/api/mcp/asset/d1ea0d34-bc80-423a-8ab8-c71312d99d83";
const imgPermissionsMap = "https://www.figma.com/api/mcp/asset/6eaa98f4-9364-4615-8ac9-aff432618427";

const LabsPage: React.FC = () => {
    const [globalSearchValue, setGlobalSearchValue] = useState('');
    const [joinedWaitlist, setJoinedWaitlist] = useState<string[]>([]);

    const handleJoinWaitlist = (featureId: string) => {
        if (!joinedWaitlist.includes(featureId)) {
            setJoinedWaitlist([...joinedWaitlist, featureId]);
        }
    };

    const handleTryNow = (featureName: string) => {
        console.log(`Opening ${featureName}...`);
        // In a real implementation, this would navigate to the feature
    };

    return (
        <div className="labs-page">
            <div className="labs-content">
                {/* Header Section */}
                <div className="labs-header-section">
                    <div className="labs-title-block">
                        <h1 className="labs-main-title">Partner Hub Labs</h1>
                        <p className="labs-subtitle">
                            Discover and try the latest experiments. Get early access, share feedback, and help shape what's next for Partner Hub.
                        </p>
                    </div>
                </div>

                {/* Global Search Card */}
                <div className="labs-global-search-card">
                    <div className="search-card-header">
                        <h2 className="search-card-title">Global search</h2>
                        <p className="search-card-description">
                            <strong>Find anything across your customers.</strong> Look up MAC addresses, users, or customer organizations, without switching views or tools.
                        </p>
                    </div>
                    <div className="search-input-container">
                        <div className="search-input-wrapper">
                            <Icon name="search-regular" className="search-input-icon" />
                            <input
                                type="text"
                                className="global-search-input"
                                placeholder="Search"
                                value={globalSearchValue}
                                onChange={(e) => setGlobalSearchValue(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="feature-cards-grid">
                    {/* Top 5 Customers Card */}
                    <div className="labs-feature-card">
                        <div className="feature-card-image-container">
                            <img 
                                src={imgTopCustomers} 
                                alt="Top 5 customers feature" 
                                className="feature-card-image"
                            />
                        </div>
                        <div className="feature-card-content">
                            <h3 className="feature-card-title">Top 5 customers</h3>
                            <p className="feature-card-description">
                                <strong>Stay focused on what matters most.</strong> See your top customers in one view. Track activation, adoption, and key usage trends to stay ahead of issues and opportunities.
                            </p>
                        </div>
                        <div className="feature-card-actions">
                            <button 
                                className="labs-pill-button"
                                onClick={() => handleTryNow('Top 5 customers')}
                            >
                                Try now
                            </button>
                        </div>
                    </div>

                    {/* Mirror Customer Card */}
                    <div className="labs-feature-card">
                        <div className="feature-card-image-container">
                            <img 
                                src={imgMirrorCustomer} 
                                alt="Mirror customer feature" 
                                className="feature-card-image"
                            />
                        </div>
                        <div className="feature-card-content">
                            <h3 className="feature-card-title">Mirror this customer</h3>
                            <p className="feature-card-description">
                                <strong>Replicate customer setup with confidence.</strong> Clone settings, policies, and configurations from one customer org to another. Save time, reduce setup errors, and ensure consistent deployments.
                            </p>
                        </div>
                        <div className="feature-card-actions">
                            <button 
                                className="labs-pill-button"
                                onClick={() => handleTryNow('Mirror this customer')}
                            >
                                Try now
                            </button>
                        </div>
                    </div>

                    {/* Permissions Map Card */}
                    <div className="labs-feature-card">
                        <div className="feature-card-image-container">
                            <img 
                                src={imgPermissionsMap} 
                                alt="Permissions map feature" 
                                className="feature-card-image"
                            />
                        </div>
                        <div className="feature-card-content">
                            <h3 className="feature-card-title">Permissions map</h3>
                            <p className="feature-card-description">
                                <strong>See access clearly.</strong> Explore customer org relationships and understand how access is structured.
                            </p>
                        </div>
                        <div className="feature-card-actions">
                            <button 
                                className="labs-pill-button"
                                onClick={() => handleTryNow('Permissions map')}
                            >
                                Try now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Section */}
                <div className="coming-soon-section">
                    <div className="coming-soon-header">
                        <h2 className="coming-soon-title">Coming soon</h2>
                        <p className="coming-soon-subtitle">
                            Join the waitlist to be among the first to try them.
                        </p>
                    </div>

                    <div className="coming-soon-cards-grid">
                        {/* AI Campaign Builder Card */}
                        <div className="coming-soon-card">
                            <div className="coming-soon-card-content">
                                <h3 className="coming-soon-card-title">AI Campaign builder</h3>
                                <p className="coming-soon-card-description">
                                    <strong>Find and grow the right customers.</strong> AI groups similar organizations by usage and industry so you can create targeted campaigns that increase adoption and revenue.
                                </p>
                            </div>
                            <div className="coming-soon-card-actions">
                                <button 
                                    className={`labs-pill-button labs-pill-button--waitlist ${joinedWaitlist.includes('campaign-builder') ? 'joined' : ''}`}
                                    onClick={() => handleJoinWaitlist('campaign-builder')}
                                    disabled={joinedWaitlist.includes('campaign-builder')}
                                >
                                    {joinedWaitlist.includes('campaign-builder') ? 'Joined' : 'Join waitlist'}
                                </button>
                            </div>
                        </div>

                        {/* AI Command Center Card */}
                        <div className="coming-soon-card">
                            <div className="coming-soon-card-content">
                                <h3 className="coming-soon-card-title">AI Command Center</h3>
                                <p className="coming-soon-card-description">
                                    <strong>Your Partner Hub, reimagined.</strong> A unified view of your portfolio that highlights health, risk, and growth patterns in real time, giving you a clear command of your business.
                                </p>
                            </div>
                            <div className="coming-soon-card-actions">
                                <button 
                                    className={`labs-pill-button labs-pill-button--waitlist ${joinedWaitlist.includes('command-center') ? 'joined' : ''}`}
                                    onClick={() => handleJoinWaitlist('command-center')}
                                    disabled={joinedWaitlist.includes('command-center')}
                                >
                                    {joinedWaitlist.includes('command-center') ? 'Joined' : 'Join waitlist'}
                                </button>
                            </div>
                        </div>

                        {/* AI Agents Card */}
                        <div className="coming-soon-card">
                            <div className="coming-soon-card-content">
                                <h3 className="coming-soon-card-title">AI Agents</h3>
                                <p className="coming-soon-card-description">
                                    <strong>Get help, not just hints.</strong> Conversational AI agents that help you complete tasks faster through natural chat or voice commands.
                                </p>
                            </div>
                            <div className="coming-soon-card-actions">
                                <button 
                                    className={`labs-pill-button labs-pill-button--waitlist ${joinedWaitlist.includes('ai-agents') ? 'joined' : ''}`}
                                    onClick={() => handleJoinWaitlist('ai-agents')}
                                    disabled={joinedWaitlist.includes('ai-agents')}
                                >
                                    {joinedWaitlist.includes('ai-agents') ? 'Joined' : 'Join waitlist'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabsPage;
