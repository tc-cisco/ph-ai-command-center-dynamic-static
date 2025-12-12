import React, { useState, useRef, useEffect, useMemo } from 'react';

import { Text, Button, Icon, Divider } from '@momentum-design/components/react';
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
    const [hasSearchSubmitted, setHasSearchSubmitted] = useState(false);
    const [showGenericResponse, setShowGenericResponse] = useState(false);
    const [showRenewalRisk, setShowRenewalRisk] = useState(false);
    const [showAdoptionGrowth, setShowAdoptionGrowth] = useState(false);
    const [selectedGrowthLevel, setSelectedGrowthLevel] = useState<'high-potential' | 'moderate' | 'some-room' | 'optimized'>('high-potential');
    const [submittedQuery, setSubmittedQuery] = useState('');
    
    // GenAI loading states
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatingSteps, setGeneratingSteps] = useState<string[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [pendingPanel, setPendingPanel] = useState<'renewal' | 'adoption' | null>(null);
    
    // Skeleton loading states for panel components
    const [isPanelLoading, setIsPanelLoading] = useState(false);
    const [loadedSections, setLoadedSections] = useState({
        header: false,
        summary: false,
        metrics: false,
        chart: false,
        table: false,
    });
    // Track which panels have finished loading (for tab switching)
    const [fullyLoadedPanels, setFullyLoadedPanels] = useState<Set<'renewal' | 'adoption'>>(new Set());
    
    // Analysis steps for each panel type
    const renewalAnalysisSteps = [
        'Checking renewal timelines for 238 customers...',
        'Analyzing 8 weeks of weekly active user trends...',
        'Comparing usage against product-level benchmarks...',
        'Flagging customers with negative adoption + upcoming renewals...',
        'Prioritizing by seat utilization and feature activation gaps...',
    ];
    
    const adoptionAnalysisSteps = [
        'Analyzing activation rates for key features...',
        'Looking at depth of usage over 30 days...',
        'Comparing seat allocation vs. actual consumption...',
        'Flagging customers with >30% unused capacity...',
        'Ranking by potential revenue and adoption impact...',
    ];
    
    // Function to start the generating animation
    const startGenerating = (panelType: 'renewal' | 'adoption') => {
        const steps = panelType === 'renewal' ? renewalAnalysisSteps : adoptionAnalysisSteps;
        setIsGenerating(true);
        setPendingPanel(panelType);
        setGeneratingSteps([]);
        setCurrentStepIndex(0);
        
        // Reset loaded sections for the NEW panel being generated
        setLoadedSections({
            header: false,
            summary: false,
            metrics: false,
            chart: false,
            table: false,
        });
        
        // Reveal steps one by one
        steps.forEach((step, index) => {
            setTimeout(() => {
                setGeneratingSteps(prev => [...prev, step]);
                setCurrentStepIndex(index);
                
                // After last step, show the panel with skeleton
                if (index === steps.length - 1) {
                    setTimeout(() => {
                        console.log('✨ Generation complete for:', panelType);
                        setIsGenerating(false);
                        setIsPanelLoading(true);
                        
                        if (panelType === 'renewal') {
                            setShowRenewalRisk(true);
                        } else {
                            setShowAdoptionGrowth(true);
                        }
                        setPendingPanel(null);
                        
                        // Progressive loading of sections (longer delays to see skeleton)
                        setTimeout(() => setLoadedSections(prev => ({ ...prev, header: true })), 400);
                        setTimeout(() => setLoadedSections(prev => ({ ...prev, summary: true })), 1000);
                        setTimeout(() => setLoadedSections(prev => ({ ...prev, metrics: true })), 1800);
                        setTimeout(() => setLoadedSections(prev => ({ ...prev, chart: true })), 2400);
                        setTimeout(() => {
                            setLoadedSections(prev => ({ ...prev, table: true }));
                            setIsPanelLoading(false);
                            // Mark this panel as fully loaded so tab switching doesn't show skeleton
                            setFullyLoadedPanels(prev => new Set([...prev, panelType]));
                        }, 3000);
                        
                    }, 800);
                }
            }, (index + 1) * 600); // 600ms delay between each step
        });
    };
    const [viewMode, setViewMode] = useState<'workspace' | 'control-center'>('workspace');
    const [suggestedActionsTab, setSuggestedActionsTab] = useState<'all' | 'groups' | 'customers'>('all');
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [isGroupFilterOpen, setIsGroupFilterOpen] = useState(false);
    const [summaryTab, setSummaryTab] = useState<'ai' | 'data' | 'activity' | 'insights'>('ai');
    const [activityTimeRange, setActivityTimeRange] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
    const [selectedAction, setSelectedAction] = useState<{
        id: string;
        priority: string;
        title: string;
        meta: string;
        description: string;
        customer: string;
    } | null>(null);
    const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
    const [refreshKey, setRefreshKey] = useState(0);
    const [isBasedOnExpanded, setIsBasedOnExpanded] = useState(false);
    const [selectedRiskLevel, setSelectedRiskLevel] = useState<'high' | 'medium' | 'low' | 'healthy' | 'trending'>('high');
    
    // Tab management state - EASILY REVERTABLE: Remove these and the tab logic below
    const [openTabs, setOpenTabs] = useState<Array<'renewal' | 'adoption'>>([]);
    const [activeTab, setActiveTab] = useState<'renewal' | 'adoption' | null>(null);
    // Ref to always get latest openTabs value (avoid stale closure issues)
    const openTabsRef = useRef(openTabs);
    // Update ref synchronously on every render
    openTabsRef.current = openTabs;
    // Also log when openTabs changes
    useEffect(() => {
        console.log('🔄 openTabs state changed:', openTabs);
    }, [openTabs]);

    // Customer data by risk level
    const customersByRisk = {
        trending: [
            { name: 'Excel Consulting Group', score: 96, days: 12, utilization: '34%', issue: 'Stalled onboarding progress' },
            { name: 'Elevate Consulting', score: 95, days: 18, utilization: '41%', issue: 'High support ticket volume' },
            { name: 'Aspire Education Services', score: 94, days: 23, utilization: '38%', issue: 'Low admin log-in frequency' },
        ],
        high: [
            { name: 'Excel Consulting Group', score: 96, days: 12, utilization: '34%', issue: 'Stalled onboarding progress' },
            { name: 'Elevate Consulting', score: 95, days: 18, utilization: '41%', issue: 'High support ticket volume' },
            { name: 'Aspire Education Services', score: 94, days: 23, utilization: '38%', issue: 'Low admin log-in frequency' },
            { name: 'Catalyst Training Solutions', score: 93, days: 31, utilization: '45%', issue: 'Declining meeting usage' },
            { name: 'Insight Solutions', score: 92, days: 45, utilization: '52%', issue: 'Low adoption of AI features' },
            { name: 'Summit Professional Services', score: 91, days: 52, utilization: '48%', issue: 'Frequent device troubleshooting' },
            { name: 'Nexus Advisors', score: 90, days: 58, utilization: '55%', issue: 'Inactive key users' },
            { name: 'Visionary Strategies', score: 89, days: 67, utilization: '49%', issue: 'Declining calling usage' },
            { name: 'Pinnacle Learning Group', score: 88, days: 74, utilization: '42%', issue: 'Underutilized messaging features' },
            { name: 'Proficient Partners', score: 87, days: 82, utilization: '51%', issue: 'Low Webex app engagement' },
        ],
        medium: [
            { name: 'TechForward Inc', score: 72, days: 45, utilization: '58%', issue: 'Gradual decline in usage' },
            { name: 'Global Dynamics', score: 70, days: 60, utilization: '62%', issue: 'Reduced executive engagement' },
            { name: 'Meridian Healthcare', score: 68, days: 38, utilization: '55%', issue: 'Support tickets increasing' },
            { name: 'Coastal Enterprises', score: 67, days: 72, utilization: '61%', issue: 'Feature adoption stalled' },
            { name: 'Summit Analytics', score: 65, days: 55, utilization: '59%', issue: 'Meeting frequency declining' },
            { name: 'Precision Manufacturing', score: 64, days: 48, utilization: '57%', issue: 'User complaints rising' },
            { name: 'Heritage Financial', score: 62, days: 65, utilization: '63%', issue: 'Training completion low' },
            { name: 'Nova Scientific', score: 60, days: 42, utilization: '56%', issue: 'Admin engagement dropping' },
            { name: 'Pacific Retail Group', score: 58, days: 80, utilization: '60%', issue: 'Calling usage down 15%' },
            { name: 'Evergreen Solutions', score: 55, days: 35, utilization: '54%', issue: 'Integration issues reported' },
        ],
        low: [
            { name: 'Stellar Innovations', score: 42, days: 120, utilization: '72%', issue: 'Minor usage fluctuations' },
            { name: 'Quantum Systems', score: 40, days: 95, utilization: '75%', issue: 'Seasonal usage patterns' },
            { name: 'Apex Industries', score: 38, days: 88, utilization: '71%', issue: 'New admin onboarding' },
            { name: 'Pioneer Technologies', score: 35, days: 110, utilization: '78%', issue: 'Department restructuring' },
            { name: 'Velocity Partners', score: 32, days: 75, utilization: '74%', issue: 'Budget review pending' },
            { name: 'Synergy Labs', score: 30, days: 130, utilization: '76%', issue: 'Temporary staff changes' },
            { name: 'Keystone Consulting', score: 28, days: 100, utilization: '73%', issue: 'Project transition phase' },
            { name: 'Horizon Tech', score: 25, days: 85, utilization: '77%', issue: 'Usage pattern shift' },
            { name: 'Fusion Dynamics', score: 22, days: 140, utilization: '70%', issue: 'Regional office changes' },
            { name: 'Vertex Solutions', score: 20, days: 92, utilization: '79%', issue: 'Feature exploration phase' },
        ],
        healthy: [
            { name: 'Cornerstone Corp', score: 15, days: 180, utilization: '92%', issue: '—' },
            { name: 'Pinnacle Holdings', score: 12, days: 200, utilization: '95%', issue: '—' },
            { name: 'Horizon Enterprises', score: 10, days: 150, utilization: '88%', issue: '—' },
            { name: 'Sterling Partners', score: 8, days: 220, utilization: '91%', issue: '—' },
            { name: 'Atlas Global', score: 5, days: 165, utilization: '94%', issue: '—' },
            { name: 'Granite Industries', score: 14, days: 175, utilization: '89%', issue: '—' },
            { name: 'Summit Holdings', score: 11, days: 190, utilization: '93%', issue: '—' },
            { name: 'Crown Enterprises', score: 9, days: 210, utilization: '90%', issue: '—' },
            { name: 'Eagle Corp', score: 7, days: 185, utilization: '96%', issue: '—' },
            { name: 'Titan Solutions', score: 6, days: 195, utilization: '97%', issue: '—' },
        ],
    };

    // Adoption growth customer data by level
    const adoptionCustomersByLevel = {
        'high-potential': [
            { name: 'Vertex Health Systems', featureGap: 'Webex Assistant', utilization: '62%', activation: '45%', recommendation: 'Schedule AI features demo' },
            { name: 'Cascade Financial', featureGap: 'Whiteboarding', utilization: '71%', activation: '52%', recommendation: 'Offer collaboration workshop' },
            { name: 'Summit Logistics', featureGap: 'Meeting transcription', utilization: '58%', activation: '38%', recommendation: 'Enable transcription trial' },
            { name: 'Pinnacle Manufacturing', featureGap: 'Breakout rooms', utilization: '65%', activation: '48%', recommendation: 'Training session for hosts' },
            { name: 'Horizon Legal Group', featureGap: 'Polling & Q&A', utilization: '69%', activation: '41%', recommendation: 'Share engagement best practices' },
            { name: 'Atlas Education', featureGap: 'Virtual backgrounds', utilization: '74%', activation: '55%', recommendation: 'Distribute brand assets' },
            { name: 'Keystone Retail', featureGap: 'Scheduling integration', utilization: '60%', activation: '42%', recommendation: 'Calendar sync setup' },
            { name: 'Nova Healthcare', featureGap: 'Recording & storage', utilization: '67%', activation: '49%', recommendation: 'Compliance recording setup' },
            { name: 'Apex Consulting', featureGap: 'Mobile app usage', utilization: '72%', activation: '35%', recommendation: 'Mobile adoption campaign' },
            { name: 'Sterling Partners', featureGap: 'Device management', utilization: '64%', activation: '44%', recommendation: 'IT admin training' },
        ],
        'moderate': [
            { name: 'Beacon Industries', featureGap: 'Live translation', utilization: '76%', activation: '58%', recommendation: 'Multilingual team outreach' },
            { name: 'Crestview Partners', featureGap: 'Webex Events', utilization: '78%', activation: '62%', recommendation: 'Event hosting workshop' },
            { name: 'Delta Solutions', featureGap: 'Screen sharing', utilization: '74%', activation: '56%', recommendation: 'Presenter training' },
            { name: 'Emerald Tech', featureGap: 'Chat features', utilization: '77%', activation: '61%', recommendation: 'Messaging best practices' },
            { name: 'Frontier Corp', featureGap: 'File sharing', utilization: '75%', activation: '59%', recommendation: 'Cloud storage integration' },
            { name: 'Gateway Systems', featureGap: 'Calendar sync', utilization: '79%', activation: '63%', recommendation: 'Calendar setup guide' },
            { name: 'Highland Group', featureGap: 'Noise removal', utilization: '73%', activation: '57%', recommendation: 'Audio quality session' },
            { name: 'Ironclad Security', featureGap: 'E2E encryption', utilization: '76%', activation: '60%', recommendation: 'Security feature demo' },
            { name: 'Junction Labs', featureGap: 'Webex Calling', utilization: '74%', activation: '55%', recommendation: 'Calling migration plan' },
            { name: 'Kinetic Ventures', featureGap: 'Voicemail', utilization: '78%', activation: '64%', recommendation: 'Voicemail setup assist' },
        ],
        'some-room': [
            { name: 'Lakeside Holdings', featureGap: 'Custom layouts', utilization: '82%', activation: '71%', recommendation: 'Layout customization tips' },
            { name: 'Momentum Inc', featureGap: 'Gesture recognition', utilization: '84%', activation: '73%', recommendation: 'New features newsletter' },
            { name: 'Northstar Analytics', featureGap: 'Meeting insights', utilization: '81%', activation: '69%', recommendation: 'Analytics dashboard tour' },
            { name: 'Optima Group', featureGap: 'Webex Assistant', utilization: '83%', activation: '72%', recommendation: 'AI features refresher' },
            { name: 'Pacific Networks', featureGap: 'Device pairing', utilization: '85%', activation: '74%', recommendation: 'Device setup guide' },
            { name: 'Quantum Dynamics', featureGap: 'Slido integration', utilization: '82%', activation: '70%', recommendation: 'Engagement tools demo' },
            { name: 'Radiant Solutions', featureGap: 'Webex Go', utilization: '84%', activation: '75%', recommendation: 'Mobile-first training' },
            { name: 'Silverline Corp', featureGap: 'Hot desking', utilization: '81%', activation: '68%', recommendation: 'Hybrid work setup' },
            { name: 'Trident Systems', featureGap: 'People insights', utilization: '83%', activation: '71%', recommendation: 'Analytics onboarding' },
            { name: 'Unity Partners', featureGap: 'Webex Connect', utilization: '85%', activation: '76%', recommendation: 'CPaaS exploration' },
        ],
        'optimized': [
            { name: 'Vanguard Global', featureGap: '—', utilization: '94%', activation: '91%', recommendation: 'Maintain engagement' },
            { name: 'Westfield Corp', featureGap: '—', utilization: '96%', activation: '93%', recommendation: 'Case study opportunity' },
            { name: 'Xavier Industries', featureGap: '—', utilization: '95%', activation: '92%', recommendation: 'Reference program' },
            { name: 'Yellowstone Tech', featureGap: '—', utilization: '97%', activation: '94%', recommendation: 'Executive briefing' },
            { name: 'Zenith Partners', featureGap: '—', utilization: '93%', activation: '90%', recommendation: 'Beta program invite' },
            { name: 'Apex Global', featureGap: '—', utilization: '95%', activation: '91%', recommendation: 'Customer advisory board' },
            { name: 'Blueprint Systems', featureGap: '—', utilization: '94%', activation: '89%', recommendation: 'Expansion discussion' },
            { name: 'Catalyst Corp', featureGap: '—', utilization: '96%', activation: '92%', recommendation: 'Success story feature' },
            { name: 'Dynasty Holdings', featureGap: '—', utilization: '97%', activation: '95%', recommendation: 'Advocacy program' },
            { name: 'Eclipse Ventures', featureGap: '—', utilization: '95%', activation: '93%', recommendation: 'Innovation partnership' },
        ],
    };

    const getGrowthLevelLabel = (level: string) => {
        switch (level) {
            case 'high-potential': return 'High potential customers';
            case 'moderate': return 'Moderate potential customers';
            case 'some-room': return 'Low potential customers';
            case 'optimized': return 'Optimized customers';
            default: return 'Customers';
        }
    };

    const getRiskLevelLabel = (level: string) => {
        switch (level) {
            case 'trending': return 'Newly at-risk customers';
            case 'high': return 'High risk customers';
            case 'medium': return 'Medium risk customers';
            case 'low': return 'Low risk customers';
            case 'healthy': return 'Healthy customers';
            default: return 'Customers';
        }
    };

    const getAISummary = (level: string) => {
        switch (level) {
            case 'trending':
                return '3 customers have moved into high-risk status in the last 90 days. These accounts show sudden drops in engagement, with usage declining 40%+ in recent weeks. Early intervention is critical to prevent churn.';
            case 'high':
                return '14 customers show declining Calling and Meetings usage and are within 90 days of renewal. These customers represent the highest risk of churn this quarter. Risk is concentrated among small and mid-sized orgs in education and professional services.';
            case 'medium':
                return '23 customers show moderate risk signals with inconsistent usage patterns. These accounts have 60-75% license utilization and sporadic engagement. Proactive outreach could stabilize these relationships before they escalate.';
            case 'low':
                return '65 customers show minor fluctuations in usage but remain generally stable. These accounts have good utilization rates (70-80%) with occasional dips. Monitor for any downward trends but no immediate action required.';
            case 'healthy':
                return '4,136 customers are performing well with strong engagement and high utilization rates (85%+). These accounts show consistent usage patterns and positive adoption trends. Focus on expansion opportunities and maintaining satisfaction.';
            default:
                return '14 customers show declining Calling and Meetings usage and are within 90 days of renewal.';
        }
    };

    const getRecommendedActions = (level: string) => {
        switch (level) {
            case 'trending':
                return {
                    text: 'Act fast on newly at-risk accounts. Partner AI can help you understand what changed and suggest immediate interventions.',
                    buttons: ['Analyze usage drop', 'Schedule check-in calls']
                };
            case 'high':
                return {
                    text: 'Engage high-risk customers early. Partner AI can draft an outreach summary or generate a prioritized playbook.',
                    buttons: ['Share customer list', 'Draft outreach summary']
                };
            case 'medium':
                return {
                    text: 'Stabilize medium-risk accounts before they escalate. Partner AI can help identify engagement opportunities and training gaps.',
                    buttons: ['Create engagement plan', 'Schedule training sessions']
                };
            case 'low':
                return {
                    text: 'Keep low-risk customers on track with light-touch engagement. Partner AI can set up automated health monitoring.',
                    buttons: ['Set up health alerts', 'Send satisfaction survey']
                };
            case 'healthy':
                return {
                    text: 'Maximize value from healthy accounts. Partner AI can identify expansion opportunities and generate case studies.',
                    buttons: ['Find upsell opportunities', 'Request testimonials']
                };
            default:
                return {
                    text: 'Engage high-risk customers early. Partner AI can draft an outreach summary or generate a prioritized playbook.',
                    buttons: ['Share customer list', 'Draft outreach summary']
                };
        }
    };
    
    // Calculate time since last refresh
    const getTimeSinceRefresh = () => {
        const now = new Date();
        const diffMs = now.getTime() - lastRefreshTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        
        if (diffMins < 1) return 'Updated just now';
        if (diffMins === 1) return 'Updated 1 min ago';
        if (diffMins < 60) return `Updated ${diffMins} min ago`;
        if (diffHours === 1) return 'Updated 1 hour ago';
        return `Updated ${diffHours} hours ago`;
    };
    
    const [timestampDisplay, setTimestampDisplay] = useState(getTimeSinceRefresh());
    
    // Update timestamp display every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setTimestampDisplay(getTimeSinceRefresh());
        }, 60000);
        return () => clearInterval(interval);
    }, [lastRefreshTime]);
    
    // Handle refresh
    const handleRefresh = () => {
        setLastRefreshTime(new Date());
        setTimestampDisplay('Updated just now');
        setRefreshKey(prev => prev + 1);
    };
    
    const suggestedActionsData = [
        {
            id: '1',
            priority: 'HIGH',
            title: 'Contact Meridian corp about renewal',
            meta: 'Renewal in 14 days',
            time: '5 min',
            customer: 'Meridian corp',
            type: 'customer',
            group: 'North America enterprise',
            summary: 'Contract renewal approaching with positive recent engagement. Schedule renewal discussion.',
            description: 'Meridian corp\'s contract is up for renewal in 14 days. Recent engagement has been positive with 3 executive meetings in the last month. Recommend scheduling a renewal discussion call to secure the contract and explore expansion opportunities.'
        },
        {
            id: '2',
            priority: 'HIGH',
            title: 'Review Apex industries license usage',
            meta: 'Usage dropped 40% • At risk',
            time: '12 min',
            customer: 'Apex industries',
            type: 'customer',
            group: 'Manufacturing & industrial',
            summary: 'Significant usage drop detected. Key contacts inactive for 2 weeks.',
            description: 'Apex industries has shown a significant 40% drop in license usage over the past 30 days. This could indicate potential churn risk. Key contacts have not logged in for 2 weeks. Immediate outreach recommended to understand their challenges and re-engage the account.'
        },
        {
            id: '3',
            priority: 'MED',
            title: 'Schedule QBR with TechFlow inc',
            meta: 'Last QBR: 4 months ago',
            time: '1 hour',
            customer: 'TechFlow inc',
            type: 'customer',
            group: 'Fortune 500 companies',
            summary: 'Overdue for quarterly business review. Stable customer with expansion potential.',
            description: 'TechFlow inc is overdue for a quarterly business review. Their last QBR was 4 months ago. They have been a stable customer with consistent usage. A QBR would help identify expansion opportunities and strengthen the relationship.'
        },
        {
            id: '4',
            priority: 'MED',
            title: 'Upsell opportunity at Databridge',
            meta: '90% license utilization',
            time: '2 hours',
            customer: 'Databridge',
            type: 'group',
            group: 'Healthcare & life sciences',
            summary: 'High license utilization with team growth. Prime upsell opportunity.',
            description: 'Databridge is at 90% license utilization, indicating strong adoption and potential need for additional users. Their team has grown by 15% this quarter. This is a prime opportunity to discuss expanding their license count before they hit capacity limits.'
        },
        {
            id: '5',
            priority: 'LOW',
            title: 'Send NPS survey to Horizon media',
            meta: '90 days since last survey',
            time: '1 day',
            customer: 'Horizon media',
            type: 'group',
            group: 'EMEA mid-market',
            summary: 'Feedback collection overdue. Last NPS score was 8/10.',
            description: 'It has been 90 days since Horizon media received an NPS survey. Regular feedback collection helps track customer satisfaction and identify potential issues early. Their last NPS score was 8/10.'
        },
        {
            id: '6',
            priority: 'LOW',
            title: 'Update contact info for BlueSky tech',
            meta: 'Primary contact changed',
            time: '2 days',
            customer: 'BlueSky tech',
            type: 'group',
            group: 'Premium support customers',
            summary: 'Primary contact has moved roles. New contact needs identification.',
            description: 'BlueSky tech\'s primary contact has changed. The previous contact, Sarah Johnson, has moved to a different role. The new primary contact needs to be identified and relationship building should begin to ensure continuity.'
        }
    ];
    
    // Filter suggested actions based on selected tab and groups
    const filteredSuggestedActions = useMemo(() => {
        let filtered = suggestedActionsData;
        
        if (suggestedActionsTab === 'groups') {
            filtered = filtered.filter(action => action.type === 'group');
            if (selectedGroups.length > 0) {
                filtered = filtered.filter(action => selectedGroups.includes(action.group));
            }
        } else if (suggestedActionsTab === 'customers') {
            filtered = filtered.filter(action => action.type === 'customer');
        }
        
        return filtered;
    }, [suggestedActionsTab, selectedGroups]);

    // Activity data by time range
    const activityDataByTimeRange = {
        day: {
            timeLabel: 'Today',
            cards: [
                { id: '1', title: 'New customers onboarded', chip: '+2', chipType: 'positive', label: 'Onboarding', description: 'Acme corp and Nexus systems completed onboarding today.', highlighted: true },
                { id: '2', title: 'Renewals completed', chip: '+1', chipType: 'positive', label: 'Renewals', description: '1 customer renewed their contract today.' },
                { id: '3', title: 'Support tickets resolved', chip: '8', chipType: 'neutral', label: 'Support', description: '8 tickets closed with avg resolution time of 3.5 hours.' },
                { id: '4', title: 'Health score changes', chip: '1 declined', chipType: 'warning', label: 'Health alerts', description: '1 customer moved to at-risk status. Prism analytics needs attention.' }
            ]
        },
        week: {
            timeLabel: 'This week',
            cards: [
                { id: '1', title: 'New customers onboarded', chip: '+12', chipType: 'positive', label: 'Onboarding', description: 'CloudFirst solutions, Summit healthcare, and 10 others completed onboarding this week.', highlighted: true },
                { id: '2', title: 'Renewals completed', chip: '+8', chipType: 'positive', label: 'Renewals', description: '8 customers renewed contracts this period. 100% renewal rate.' },
                { id: '3', title: 'Support tickets resolved', chip: '47', chipType: 'neutral', label: 'Support', description: '47 tickets closed with avg resolution time of 4.2 hours. 3 escalations this week.' },
                { id: '4', title: 'Health score changes', chip: '5 declined', chipType: 'warning', label: 'Health alerts', description: '5 customers moved to at-risk status. Velocity logistics, Metro industries need attention.' }
            ]
        },
        month: {
            timeLabel: 'This month',
            cards: [
                { id: '1', title: 'New customers onboarded', chip: '+34', chipType: 'positive', label: 'Onboarding', description: '34 new customers completed onboarding this month, a 15% increase from last month.', highlighted: true },
                { id: '2', title: 'Renewals completed', chip: '+22', chipType: 'positive', label: 'Renewals', description: '22 customers renewed contracts. 96% renewal rate this month.' },
                { id: '3', title: 'Support tickets resolved', chip: '186', chipType: 'neutral', label: 'Support', description: '186 tickets closed with avg resolution time of 4.8 hours. 12 escalations.' },
                { id: '4', title: 'Health score changes', chip: '14 declined', chipType: 'warning', label: 'Health alerts', description: '14 customers moved to at-risk status. 8 have been re-engaged successfully.' }
            ]
        },
        quarter: {
            timeLabel: 'This quarter',
            cards: [
                { id: '1', title: 'New customers onboarded', chip: '+89', chipType: 'positive', label: 'Onboarding', description: '89 new customers onboarded this quarter. On track to exceed quarterly target by 12%.', highlighted: true },
                { id: '2', title: 'Renewals completed', chip: '+67', chipType: 'positive', label: 'Renewals', description: '67 customers renewed. 94% renewal rate this quarter.' },
                { id: '3', title: 'Support tickets resolved', chip: '542', chipType: 'neutral', label: 'Support', description: '542 tickets closed. Average satisfaction score of 4.6/5.' },
                { id: '4', title: 'Health score changes', chip: '28 declined', chipType: 'warning', label: 'Health alerts', description: '28 customers moved to at-risk status. 19 successfully recovered.' }
            ]
        }
    };

    const currentActivityData = activityDataByTimeRange[activityTimeRange];
    
    const customerGroups = [
        'Healthcare & life sciences',
        'North America enterprise',
        'Fortune 500 companies',
        'Premium support customers',
        'Manufacturing & industrial',
        'EMEA mid-market',
        'Financial services tier 1',
        'SMB Technology Partners'
    ];
    
    const toggleGroupFilter = (group: string) => {
        setSelectedGroups(prev => 
            prev.includes(group) 
                ? prev.filter(g => g !== group)
                : [...prev, group]
        );
    };
    
    const clearGroupFilters = () => {
        setSelectedGroups([]);
    };
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
        // Don't submit if there's no search value
        if (!mainSearchValue.trim()) return;
        
        // Handle search submission with context
        const searchQuery = selectedContext ? `${selectedContext}: ${mainSearchValue}` : mainSearchValue;
        console.log('🚀 Search submitted:', searchQuery);
        console.log('📋 Current openTabs at start of handleSendClick:', openTabs);
        console.log('📋 Current activeTab:', activeTab);
        console.log('📋 Current isGenerating:', isGenerating);
        
        // Mark search as submitted to transition to chat-like layout
        setHasSearchSubmitted(true);
        setSubmittedQuery(mainSearchValue);
        
        // Determine which panel this search should show
        const query = mainSearchValue.toLowerCase();
        const isRenewalQuery = query.includes('renewal risk') || 
                               query.includes('customers at renewal risk') ||
                               query.includes('customers at risk') ||
                               query.includes('at risk renewal') ||
                               query.includes('risk renewal') ||
                               query.includes('churn risk') ||
                               query.includes('churn') ||
                               query.includes('likely to churn');
        
        const isAdoptionQuery = query.includes('increase adoption') ||
                                query.includes('growth opportunit') ||
                                query.includes('adoption lift') ||
                                query.includes('help increase');
        
        const isCustomerSummaryQuery = query.includes('summarize how my customers are today') || 
                                       query.includes('customers are today');
        
        const isCustomerGroupsQuery = query.includes('customer groups doing today') || 
                                      query.includes('how\'s my customer groups');
        
        const isMeetingsQuery = query.includes('declining meetings') || 
                                query.includes('check declining meetings');
        
        // Tab-based logic for renewal/adoption panels
        // Use ref to get latest value (avoid stale closure issues)
        const currentOpenTabs = openTabsRef.current;
        
        if (isRenewalQuery) {
            console.log('🔍 Renewal query detected, currentOpenTabs:', currentOpenTabs);
            // If renewal tab is already open, just switch to it
            if (currentOpenTabs.includes('renewal')) {
                console.log('✅ Renewal tab already open, switching to it');
                setActiveTab('renewal');
                return;
            }
            // Add renewal tab to open tabs and make it active
            console.log('➕ Adding renewal tab to existing tabs:', currentOpenTabs);
            setOpenTabs([...currentOpenTabs, 'renewal']);
            setActiveTab('renewal');
            startGenerating('renewal');
            return;
        }
        
        if (isAdoptionQuery) {
            console.log('🔍 Adoption query detected, currentOpenTabs:', currentOpenTabs);
            // If adoption tab is already open, just switch to it
            if (currentOpenTabs.includes('adoption')) {
                console.log('✅ Adoption tab already open, switching to it');
                setActiveTab('adoption');
                return;
            }
            // Add adoption tab to open tabs and make it active
            console.log('➕ Adding adoption tab to existing tabs:', currentOpenTabs);
            setOpenTabs([...currentOpenTabs, 'adoption']);
            setActiveTab('adoption');
            startGenerating('adoption');
            return;
        }
        
        // For non-tabbed panels, reset tab state and show the appropriate panel
        setOpenTabs([]);
        setActiveTab(null);
        setShowRenewalRisk(false);
        setShowAdoptionGrowth(false);
        
        // If the relevant panel is already open, don't restart animation - just keep it
        if (isCustomerSummaryQuery && showCustomerSummary) {
            return;
        }
        if (isCustomerGroupsQuery && showCustomerGroups) {
            return;
        }
        if (isMeetingsQuery && showMeetingsAnalysis) {
            return;
        }
        
        // Reset non-tabbed panels
        setShowCustomerSummary(false);
        setShowCustomerGroups(false);
        setShowMeetingsAnalysis(false);
        setShowGenericResponse(false);
        
        // Show the appropriate panel
        if (isCustomerSummaryQuery) {
            setShowCustomerSummary(true);
        }
        else if (isCustomerGroupsQuery) {
            setShowCustomerGroups(true);
        }
        else if (isMeetingsQuery) {
            setShowMeetingsAnalysis(true);
        }
        // Show generic response for any other query
        else {
            setShowGenericResponse(true);
        }
    };

    const handleClearContext = () => {
        setSelectedContext('');
        setMainSearchValue('');
        setHasSearchSubmitted(false);
        setShowCustomerSummary(false);
        setShowCustomerGroups(false);
        setShowMeetingsAnalysis(false);
        setShowGenericResponse(false);
        setShowRenewalRisk(false);
        setShowAdoptionGrowth(false);
        // Reset tab state
        setOpenTabs([]);
        setActiveTab(null);
        setFullyLoadedPanels(new Set());
        // Reset generating and loading states
        setIsGenerating(false);
        setIsPanelLoading(false);
        setPendingPanel(null);
        setGeneratingSteps([]);
        setLoadedSections({
            header: false,
            summary: false,
            metrics: false,
            chart: false,
            table: false,
        });
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
                    Catch up
                </button>
            </div>

            {/* WORKSPACE VIEW - Full Width Search */}
            {viewMode === 'workspace' && (
                <div className={`workspace-fullwidth ${hasSearchSubmitted ? 'search-submitted' : ''}`}>
                    <div className={`workspace-search-content ${hasSearchSubmitted ? 'search-submitted' : ''}`}>
                        {!hasSearchSubmitted && (
                            <>
                                <Text type="heading-midsize-bold" tagname='h2' className="top-search-title">Find what you need</Text>
                                <Text type="body-midsize-medium" tagname='p' className="top-search-subtitle">Ask, find, or act across customers, groups, and insights</Text>
                            </>
                        )}
                        
                        {/* Results area - shown after search submission */}
                        {hasSearchSubmitted && (
                            <div className="workspace-results-area">
                                {showCustomerSummary && (
                                    <div className="workspace-result-panel">
                                        <div className="panel-header">
                                            <Text type="heading-small-bold" tagname="h3">Customer Summary</Text>
                                            <Button 
                                                variant="tertiary" 
                                                size={24} 
                                                prefixIcon="cancel-regular" 
                                                aria-label="Close panel"
                                                onClick={() => {
                                                    setShowCustomerSummary(false);
                                                    setHasSearchSubmitted(false);
                                                    setMainSearchValue('');
                                                }}
                                            />
                                        </div>
                                        <div className="panel-content">
                                            <Text type="body-midsize-regular">
                                                Based on your customer data, here's a summary of how your customers are doing today:
                                            </Text>
                                            <ul className="summary-list">
                                                <li><strong>Active customers:</strong> 142 (↑ 3% from last week)</li>
                                                <li><strong>At-risk accounts:</strong> 8 requiring attention</li>
                                                <li><strong>Renewal pipeline:</strong> 12 renewals in next 30 days</li>
                                                <li><strong>Health score average:</strong> 78/100</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {showCustomerGroups && (
                                    <div className="workspace-result-panel">
                                        <div className="panel-header">
                                            <Text type="heading-small-bold" tagname="h3">Customer Groups Overview</Text>
                                            <Button 
                                                variant="tertiary" 
                                                size={24} 
                                                prefixIcon="cancel-regular" 
                                                aria-label="Close panel"
                                                onClick={() => {
                                                    setShowCustomerGroups(false);
                                                    setHasSearchSubmitted(false);
                                                    setMainSearchValue('');
                                                }}
                                            />
                                        </div>
                                        <div className="panel-content">
                                            <Text type="body-midsize-regular">
                                                Here's how your customer groups are performing today:
                                            </Text>
                                            <ul className="summary-list">
                                                <li><strong>Enterprise:</strong> 45 accounts, 92% health score</li>
                                                <li><strong>Mid-Market:</strong> 67 accounts, 81% health score</li>
                                                <li><strong>SMB:</strong> 30 accounts, 74% health score</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {showMeetingsAnalysis && (
                                    <div className="workspace-result-panel">
                                        <div className="panel-header">
                                            <Text type="heading-small-bold" tagname="h3">Declining Meetings Analysis</Text>
                                            <Button 
                                                variant="tertiary" 
                                                size={24} 
                                                prefixIcon="cancel-regular" 
                                                aria-label="Close panel"
                                                onClick={() => {
                                                    setShowMeetingsAnalysis(false);
                                                    setHasSearchSubmitted(false);
                                                    setMainSearchValue('');
                                                }}
                                            />
                                        </div>
                                        <div className="panel-content">
                                            <Text type="body-midsize-regular">
                                                Analysis of declining meetings for Acme Corp and TechFlow Solutions:
                                            </Text>
                                            <ul className="summary-list">
                                                <li><strong>Acme Corp:</strong> 3 declined meetings this month (scheduling conflicts)</li>
                                                <li><strong>TechFlow Solutions:</strong> 2 declined meetings (resource constraints)</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                
                                {/* GenAI Generating State */}
                                {isGenerating && (
                                    <div className="generating-panel">
                                        <div className="generating-header">
                                            <div className="generating-icon">
                                                <Icon name="sparkle-regular" />
                                            </div>
                                            <span className="generating-title">
                                                {pendingPanel === 'renewal' ? 'Analyzing renewal risk...' : 'Analyzing growth opportunities...'}
                                            </span>
                                        </div>
                                        <div className="generating-steps">
                                            {generatingSteps.map((step, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`generating-step ${index === currentStepIndex ? 'active' : 'completed'}`}
                                                >
                                                    <div className="step-indicator">
                                                        {index < currentStepIndex ? (
                                                            <Icon name="check-regular" />
                                                        ) : index === currentStepIndex ? (
                                                            <div className="step-spinner"></div>
                                                        ) : null}
                                                    </div>
                                                    <span className="step-text">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* UNIFIED TAB SYSTEM - EASILY REVERTABLE:
                                    1. Remove this entire openTabs.length > 0 block
                                    2. Replace with the individual showRenewalRisk and showAdoptionGrowth blocks from the backup below
                                */}
                                {console.log('🎨 Render check - openTabs:', openTabs, 'isGenerating:', isGenerating, 'activeTab:', activeTab)}
                                {openTabs.length > 0 && !isGenerating && (
                                    <div className={`workspace-result-panel renewal-risk-panel renewal-risk-v2 ${activeTab === 'adoption' ? 'adoption-growth-panel' : ''}`}>
                                        {/* Unified Tab Bar for all open tabs */}
                                        <div className="panel-tab-bar">
                                            {openTabs.map(tab => (
                                                <div 
                                                    key={tab}
                                                    className={`panel-tab-header ${tab === 'adoption' ? 'growth-tab' : ''} ${activeTab === tab ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setActiveTab(tab);
                                                        // If switching to a fully loaded panel, show all sections immediately
                                                        if (fullyLoadedPanels.has(tab)) {
                                                            setLoadedSections({
                                                                header: true,
                                                                summary: true,
                                                                metrics: true,
                                                                chart: true,
                                                                table: true,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <div className="tab-header-left">
                                                        <div className="tab-icon">
                                                            <Icon name={tab === 'renewal' ? 'alert-active-filled' : 'analysis-regular'} />
                                                        </div>
                                                        <span className="tab-title">{tab === 'renewal' ? 'Renewal risk' : 'Growth opportunities'}</span>
                                                    </div>
                                                    <div className="tab-header-actions">
                                                        <button className="tab-action-btn" title="Share" onClick={(e) => e.stopPropagation()}>
                                                            <Icon name="share-c-native-iph-regular" />
                                                        </button>
                                                        <button className="tab-action-btn" title="Pin panel" onClick={(e) => e.stopPropagation()}>
                                                            <Icon name="pin-regular" />
                                                        </button>
                                                        <button 
                                                            className="tab-action-btn tab-close-btn"
                                                            title="Close panel"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newOpenTabs = openTabs.filter(t => t !== tab);
                                                                setOpenTabs(newOpenTabs);
                                                                // Remove from fully loaded panels so it shows skeleton again if reopened
                                                                setFullyLoadedPanels(prev => {
                                                                    const newSet = new Set(prev);
                                                                    newSet.delete(tab);
                                                                    return newSet;
                                                                });
                                                                // If closing active tab, switch to another tab or clear
                                                                if (activeTab === tab) {
                                                                    if (newOpenTabs.length > 0) {
                                                                        setActiveTab(newOpenTabs[0]);
                                                                        // If switching to a fully loaded panel, show all sections
                                                                        if (fullyLoadedPanels.has(newOpenTabs[0])) {
                                                                            setLoadedSections({
                                                                                header: true,
                                                                                summary: true,
                                                                                metrics: true,
                                                                                chart: true,
                                                                                table: true,
                                                                            });
                                                                        }
                                                                    } else {
                                                                        setActiveTab(null);
                                                                        setHasSearchSubmitted(false);
                                                                        setMainSearchValue('');
                                                                    }
                                                                }
                                                                // Also update the show states for compatibility
                                                                if (tab === 'renewal') setShowRenewalRisk(false);
                                                                if (tab === 'adoption') setShowAdoptionGrowth(false);
                                                            }}
                                                        >
                                                            <Icon name="cancel-regular" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* RENEWAL RISK CONTENT - only shown when active */}
                                        {activeTab === 'renewal' && (
                                        <>
                                        <div className="panel-tab-content">
                                        <div className="panel-content">
                                            {/* Gradient Divider */}
                                            <div className={`divider-wrapper panel-section ${loadedSections.header ? 'loaded' : ''}`}>
                                                <Divider orientation="horizontal" variant="gradient" />
                                            </div>

                                            {/* AI Summary Section - with skeleton */}
                                            <div className={`ai-summary-section panel-section ${loadedSections.summary ? 'loaded' : ''}`}>
                                                {!loadedSections.summary ? (
                                                    /* SKELETON STATE - easily revertable: remove this block */
                                                    <div className="skeleton-summary">
                                                        <div className="skeleton-summary-row">
                                                            <div className="skeleton-summary-content">
                                                                <div className="skeleton skeleton-text small" style={{ width: '100px' }}></div>
                                                                <div className="skeleton skeleton-text large"></div>
                                                                <div className="skeleton skeleton-text medium"></div>
                                                                <div className="skeleton skeleton-text medium" style={{ width: '70%' }}></div>
                                                            </div>
                                                            <div className="skeleton skeleton-card skeleton-actions-card"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* ACTUAL CONTENT */
                                                    <div className="ai-summary-row">
                                                        <div className="ai-summary-content">
                                                            <div className="ai-summary-label">AI SUMMARY</div>
                                                            <p className="ai-summary-text">
                                                                {getAISummary(selectedRiskLevel)}
                                                            </p>
                                                            {/* Based on section - Accordion */}
                                                            <div className={`based-on-section ${isBasedOnExpanded ? 'expanded' : 'collapsed'}`}>
                                                                <button 
                                                                    className="based-on-toggle"
                                                                    onClick={() => setIsBasedOnExpanded(!isBasedOnExpanded)}
                                                                >
                                                                    <Icon name="arrow-up-regular" className={`toggle-icon ${isBasedOnExpanded ? 'expanded' : ''}`} />
                                                                    <span>Based on</span>
                                                                </button>
                                                                {isBasedOnExpanded && (
                                                                    <ul className="based-on-list">
                                                                        <li>Checked renewal timelines for 238 customers</li>
                                                                        <li>Analyzed 8 weeks of weekly active user trends</li>
                                                                        <li>Compared usage against product-level benchmarks</li>
                                                                        <li>Flagged customers with negative adoption + upcoming renewals</li>
                                                                        <li>Prioritized by seat utilization and feature activation gaps</li>
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Recommended Actions Card */}
                                                        <div className="recommended-actions-card">
                                                            <span className="recommended-tag">Recommended actions</span>
                                                            <div className="recommended-card-bg"></div>
                                                            <div className="recommended-card-content">
                                                                <p className="recommended-text">
                                                                    {getRecommendedActions(selectedRiskLevel).text}
                                                                </p>
                                                                <div className="recommended-buttons">
                                                                    {getRecommendedActions(selectedRiskLevel).buttons.map((btn, idx) => (
                                                                        <button key={idx} className="recommended-btn">{btn}</button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Gradient Divider */}
                                            <div className={`divider-wrapper panel-section ${loadedSections.metrics ? 'loaded' : ''}`}>
                                                <Divider orientation="horizontal" variant="gradient" />
                                            </div>

                                            {/* Two column layout - with skeleton */}
                                            <div className={`churn-content-grid panel-section ${loadedSections.metrics ? 'loaded' : ''}`}>
                                                {/* Left column - ACTIONABLE RISK DASHBOARD */}
                                                <div className="churn-left-column">
                                                    {!loadedSections.metrics ? (
                                                        /* SKELETON STATE */
                                                        <>
                                                            <div className="skeleton skeleton-card" style={{ height: '140px' }}></div>
                                                            <div className="skeleton skeleton-card" style={{ height: '180px' }}></div>
                                                            <div className="skeleton skeleton-card" style={{ height: '200px' }}></div>
                                                        </>
                                                    ) : (
                                                        /* ACTUAL CONTENT */
                                                        <>
                                                    {/* Customers at Risk Card */}
                                                    <div className="risk-metric-card">
                                                        <div className="risk-metric-header">
                                                            <span className="risk-metric-label">Customers at Risk</span>
                                                            <span className="risk-metric-trend negative">↑ 12% vs last quarter</span>
                                                        </div>
                                                        <div className="risk-metric-value">102</div>
                                                        <div className="risk-metric-context">renewing in the next 90 days</div>
                                                    </div>

                                                    {/* Risk Distribution Bar */}
                                                    <div className="risk-distribution-card">
                                                        <div className="risk-distribution-header">
                                                            <span className="risk-distribution-label">Risk Distribution</span>
                                                            <button 
                                                                className={`risk-trend-btn ${selectedRiskLevel === 'trending' ? 'selected' : ''}`}
                                                                onClick={() => setSelectedRiskLevel('trending')}
                                                            >
                                                                <Icon name="arrow-tail-up-regular" className="trend-icon-small" />
                                                                <span>3 new this quarter</span>
                                                            </button>
                                                        </div>
                                                        
                                                        {/* Stacked Bar */}
                                                        <div className="risk-stacked-bar">
                                                            <button 
                                                                className={`risk-segment high ${selectedRiskLevel === 'high' ? 'selected' : ''}`}
                                                                style={{ flex: 14 }}
                                                                onClick={() => setSelectedRiskLevel('high')}
                                                                title="High Risk: 14 customers"
                                                            >
                                                                <span className="segment-count">14</span>
                                                            </button>
                                                            <button 
                                                                className={`risk-segment medium ${selectedRiskLevel === 'medium' ? 'selected' : ''}`}
                                                                style={{ flex: 23 }}
                                                                onClick={() => setSelectedRiskLevel('medium')}
                                                                title="Medium Risk: 23 customers"
                                                            >
                                                                <span className="segment-count">23</span>
                                                            </button>
                                                            <button 
                                                                className={`risk-segment low ${selectedRiskLevel === 'low' ? 'selected' : ''}`}
                                                                style={{ flex: 65 }}
                                                                onClick={() => setSelectedRiskLevel('low')}
                                                                title="Low Risk: 65 customers"
                                                            >
                                                                <span className="segment-count">65</span>
                                                            </button>
                                                        </div>
                                                        
                                                        {/* Legend */}
                                                        <div className="risk-legend">
                                                            <button 
                                                                className={`legend-item ${selectedRiskLevel === 'high' ? 'selected' : ''}`}
                                                                onClick={() => setSelectedRiskLevel('high')}
                                                            >
                                                                <span className="legend-dot high"></span>
                                                                <span className="legend-label">High</span>
                                                                <span className="legend-value">2.4K seats</span>
                                                            </button>
                                                            <button 
                                                                className={`legend-item ${selectedRiskLevel === 'medium' ? 'selected' : ''}`}
                                                                onClick={() => setSelectedRiskLevel('medium')}
                                                            >
                                                                <span className="legend-dot medium"></span>
                                                                <span className="legend-label">Medium</span>
                                                                <span className="legend-value">3.1K seats</span>
                                                            </button>
                                                            <button 
                                                                className={`legend-item ${selectedRiskLevel === 'low' ? 'selected' : ''}`}
                                                                onClick={() => setSelectedRiskLevel('low')}
                                                            >
                                                                <span className="legend-dot low"></span>
                                                                <span className="legend-label">Low</span>
                                                                <span className="legend-value">4.8K seats</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Urgency Timeline */}
                                                    <div className="urgency-card">
                                                        <div className="urgency-header">
                                                            <span className="urgency-label">Renewal Urgency</span>
                                                        </div>
                                                        <div className="urgency-timeline">
                                                            <div className="urgency-item critical">
                                                                <span className="urgency-window">Next 30 days</span>
                                                                <span className="urgency-count">6 customers</span>
                                                                <span className="urgency-arr">1.2K seats</span>
                                                            </div>
                                                            <div className="urgency-item warning">
                                                                <span className="urgency-window">31-60 days</span>
                                                                <span className="urgency-count">12 customers</span>
                                                                <span className="urgency-arr">2.8K seats</span>
                                                            </div>
                                                            <div className="urgency-item moderate">
                                                                <span className="urgency-window">61-90 days</span>
                                                                <span className="urgency-count">19 customers</span>
                                                                <span className="urgency-arr">3.4K seats</span>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            className={`healthy-toggle ${selectedRiskLevel === 'healthy' ? 'selected' : ''}`}
                                                            onClick={() => setSelectedRiskLevel('healthy')}
                                                        >
                                                            <Icon name="check-circle-regular" />
                                                            <span>View 4,136 healthy customers</span>
                                                        </button>
                                                    </div>
                                                        </>
                                                    )}
                                                </div>
                                                
                                                {/* 
                                                ============================================
                                                PREVIOUS LEFT COLUMN - TO REVERT:
                                                1. Remove the risk-flow-card above
                                                2. Uncomment this entire block
                                                ============================================
                                                <div className="churn-left-column">
                                                    <div className="trend-card-v2 v2-card">
                                                        <span className="v2-card-tag">Trending upwards</span>
                                                        <div className="v2-card-bg"></div>
                                                        <div className="v2-card-content">
                                                            <div className="trend-value-row">
                                                                <span className="trend-big-number">14</span>
                                                                <button 
                                                                    className={`trend-change-wrapper clickable ${selectedRiskLevel === 'trending' ? 'selected' : ''}`}
                                                                    onClick={() => setSelectedRiskLevel('trending')}
                                                                >
                                                                    <Icon name="arrow-tail-up-regular" className="trend-arrow" />
                                                                    <span className="trend-change">3 customers</span>
                                                                </button>
                                                            </div>
                                                            <div className="trend-period">In the last 90 days</div>
                                                        </div>
                                                    </div>

                                                    <div className="risk-snapshot-card v2-card">
                                                        <span className="v2-card-tag">At risk snapshot</span>
                                                        <div className="v2-card-bg"></div>
                                                        <div className="v2-card-content">
                                                            <div className="snapshot-grid">
                                                                <button 
                                                                    className={`snapshot-item clickable ${selectedRiskLevel === 'high' ? 'selected' : ''}`}
                                                                    onClick={() => setSelectedRiskLevel('high')}
                                                                >
                                                                    <span className="snapshot-category high">High</span>
                                                                    <span className="snapshot-value">14</span>
                                                                </button>
                                                                <button 
                                                                    className={`snapshot-item clickable ${selectedRiskLevel === 'medium' ? 'selected' : ''}`}
                                                                    onClick={() => setSelectedRiskLevel('medium')}
                                                                >
                                                                    <span className="snapshot-category medium">Medium</span>
                                                                    <span className="snapshot-value">23</span>
                                                                </button>
                                                                <button 
                                                                    className={`snapshot-item clickable ${selectedRiskLevel === 'low' ? 'selected' : ''}`}
                                                                    onClick={() => setSelectedRiskLevel('low')}
                                                                >
                                                                    <span className="snapshot-category low">Low</span>
                                                                    <span className="snapshot-value">65</span>
                                                                </button>
                                                                <button 
                                                                    className={`snapshot-item clickable ${selectedRiskLevel === 'healthy' ? 'selected' : ''}`}
                                                                    onClick={() => setSelectedRiskLevel('healthy')}
                                                                >
                                                                    <span className="snapshot-category healthy">Healthy</span>
                                                                    <span className="snapshot-value">4136</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                */}

                                                {/* Right column - Customers table - with skeleton */}
                                                <div className={`customers-table-card v2-card risk-table panel-section ${loadedSections.table ? 'loaded' : ''}`}>
                                                    {!loadedSections.table ? (
                                                        /* SKELETON STATE */
                                                        <div className="skeleton-table-wrapper">
                                                            <div className="skeleton skeleton-text small" style={{ width: '150px', marginBottom: '16px' }}></div>
                                                            <div className="skeleton-table">
                                                                <div className="skeleton-table-header">
                                                                    <div className="skeleton skeleton-cell wide"></div>
                                                                    <div className="skeleton skeleton-cell narrow"></div>
                                                                    <div className="skeleton skeleton-cell narrow"></div>
                                                                    <div className="skeleton skeleton-cell"></div>
                                                                    <div className="skeleton skeleton-cell"></div>
                                                                </div>
                                                                <div className="skeleton-table-body">
                                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                                        <div className="skeleton-row" key={i}>
                                                                            <div className="skeleton skeleton-cell wide"></div>
                                                                            <div className="skeleton skeleton-cell narrow"></div>
                                                                            <div className="skeleton skeleton-cell narrow"></div>
                                                                            <div className="skeleton skeleton-cell"></div>
                                                                            <div className="skeleton skeleton-cell"></div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* ACTUAL CONTENT */
                                                        <>
                                                    <span className="v2-card-tag">{getRiskLevelLabel(selectedRiskLevel)}</span>
                                                    <div className="v2-card-bg"></div>
                                                    <div className="v2-card-content">
                                                        <div className="customers-table-v2">
                                                            <div className="table-header-v2">
                                                                <div className="col-header col-name">Customer name</div>
                                                                <div className="col-header col-score sorted">
                                                                    Risk score
                                                                    <Icon name="arrow-down-regular" className="sort-icon" />
                                                                </div>
                                                                <div className="col-header col-days">Days to renewal</div>
                                                                <div className="col-header col-utilization">License utilization</div>
                                                                <div className="col-header col-issue">Primary issue</div>
                                                            </div>
                                                            <div className="table-body-v2">
                                                                {customersByRisk[selectedRiskLevel].map((customer, idx) => (
                                                                    <div className="table-row-v2" key={idx}>
                                                                        <div className="col-cell col-name">{customer.name}</div>
                                                                        <div className="col-cell col-score">{customer.score}/100</div>
                                                                        <div className="col-cell col-days">{customer.days}</div>
                                                                        <div className="col-cell col-utilization">{customer.utilization}</div>
                                                                        <div className="col-cell col-issue">{customer.issue}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {/* Pagination */}
                                                        <div className="table-pagination">
                                                            <button className="pagination-btn" disabled>
                                                                <Icon name="arrow-left-regular" />
                                                            </button>
                                                            <div className="pagination-select">
                                                                <span>1</span>
                                                                <Icon name="arrow-down-regular" className="dropdown-icon" />
                                                            </div>
                                                            <span className="pagination-text">
                                                                of {Math.ceil(
                                                                    (selectedRiskLevel === 'high' ? 14 : 
                                                                     selectedRiskLevel === 'medium' ? 23 : 
                                                                     selectedRiskLevel === 'low' ? 65 : 
                                                                     selectedRiskLevel === 'healthy' ? 4136 :
                                                                     selectedRiskLevel === 'trending' ? 3 : 10) / 10
                                                                )} pages
                                                            </span>
                                                            <button className="pagination-btn">
                                                                <Icon name="arrow-right-regular" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        </div>{/* panel-tab-content for renewal */}
                                        </>
                                        )}

                                        {/* ADOPTION GROWTH CONTENT - only shown when active */}
                                        {activeTab === 'adoption' && (
                                        <>
                                        <div className="panel-tab-content">
                                        <div className="panel-content">
                                            {/* Gradient Divider */}
                                            <div className={`divider-wrapper panel-section ${loadedSections.header ? 'loaded' : ''}`}>
                                                <Divider orientation="horizontal" variant="gradient" />
                                            </div>

                                            {/* AI Summary Section - with skeleton */}
                                            <div className={`ai-summary-section panel-section ${loadedSections.summary ? 'loaded' : ''}`}>
                                                {!loadedSections.summary ? (
                                                    /* SKELETON STATE - easily revertable: remove this block */
                                                    <div className="skeleton-summary">
                                                        <div className="skeleton-summary-row">
                                                            <div className="skeleton-summary-content">
                                                                <div className="skeleton skeleton-text small" style={{ width: '100px' }}></div>
                                                                <div className="skeleton skeleton-text large"></div>
                                                                <div className="skeleton skeleton-text medium"></div>
                                                                <div className="skeleton skeleton-text medium" style={{ width: '70%' }}></div>
                                                            </div>
                                                            <div className="skeleton skeleton-card skeleton-actions-card"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* ACTUAL CONTENT */
                                                    <div className="ai-summary-row">
                                                        <div className="ai-summary-content">
                                                            <div className="ai-summary-label">AI SUMMARY</div>
                                                            <p className="ai-summary-text">
                                                                <strong>Adoption Lift:</strong> 12 customers have significant untapped capacity with over 30% unused licenses and low feature activation. 
                                                                These accounts represent the highest potential for growth this quarter. Opportunity is concentrated among mid-market organizations 
                                                                in healthcare and professional services.
                                                            </p>
                                                            {/* Based on section - Accordion */}
                                                            <div className={`based-on-section ${isBasedOnExpanded ? 'expanded' : 'collapsed'}`}>
                                                                <button 
                                                                    className="based-on-toggle"
                                                                    onClick={() => setIsBasedOnExpanded(!isBasedOnExpanded)}
                                                                >
                                                                    <Icon name="arrow-up-regular" className={`toggle-icon ${isBasedOnExpanded ? 'expanded' : ''}`} />
                                                                    <span>Based on</span>
                                                                </button>
                                                                {isBasedOnExpanded && (
                                                                    <ul className="based-on-list">
                                                                        <li>Analyzed activation rates for key features</li>
                                                                        <li>Looked at depth of usage over 30 days</li>
                                                                        <li>Compared seat allocation vs. actual consumption</li>
                                                                        <li>Flagged customers with &gt;30% unused capacity</li>
                                                                        <li>Ranked by potential revenue and adoption impact</li>
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Recommended Actions Card */}
                                                        <div className="recommended-actions-card">
                                                            <span className="recommended-tag">Recommended actions</span>
                                                            <div className="recommended-card-bg"></div>
                                                            <div className="recommended-card-content">
                                                                <p className="recommended-text">
                                                                    Drive adoption with targeted enablement. Partner AI can create personalized training plans 
                                                                    or feature adoption campaigns.
                                                                </p>
                                                                <div className="recommended-buttons">
                                                                    <button className="recommended-btn">Create adoption plan</button>
                                                                    <button className="recommended-btn">Schedule training</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Gradient Divider */}
                                            <div className={`divider-wrapper panel-section ${loadedSections.metrics ? 'loaded' : ''}`}>
                                                <Divider orientation="horizontal" variant="gradient" />
                                            </div>

                                            {/* Two column layout - with skeleton */}
                                            <div className={`churn-content-grid adoption-grid panel-section ${loadedSections.metrics ? 'loaded' : ''}`}>
                                                {/* Left column - GROWTH POTENTIAL DASHBOARD */}
                                                <div className="churn-left-column">
                                                    {!loadedSections.metrics ? (
                                                        /* SKELETON STATE */
                                                        <>
                                                            <div className="skeleton skeleton-card" style={{ height: '200px' }}></div>
                                                            <div className="skeleton skeleton-card" style={{ height: '250px' }}></div>
                                                            <div className="skeleton skeleton-card" style={{ height: '160px' }}></div>
                                                        </>
                                                    ) : (
                                                        /* ACTUAL CONTENT */
                                                        <>
                                                    {/* Adoption Opportunity */}
                                                    <div className="growth-metric-card">
                                                        <div className="growth-metric-header">
                                                            <span className="growth-metric-label">Adoption Opportunity</span>
                                                            <span className="growth-metric-badge">AI Projected</span>
                                                        </div>
                                                        <div className="growth-metric-value">+38%</div>
                                                        <div className="growth-metric-context">potential usage lift across 12 high-potential customers</div>
                                                        
                                                        {/* Mini progress rings */}
                                                        <div className="growth-rings-row">
                                                            <div className="growth-ring-item">
                                                                <svg className="growth-ring" viewBox="0 0 36 36">
                                                                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                                                    <circle cx="18" cy="18" r="15" fill="none" stroke="#00b8a9" strokeWidth="3" 
                                                                        strokeDasharray="58 94" strokeLinecap="round" transform="rotate(-90 18 18)" />
                                                                </svg>
                                                                <span className="ring-label">62%</span>
                                                                <span className="ring-sublabel">Avg Utilization</span>
                                                            </div>
                                                            <div className="growth-ring-item">
                                                                <svg className="growth-ring" viewBox="0 0 36 36">
                                                                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                                                    <circle cx="18" cy="18" r="15" fill="none" stroke="#6366f1" strokeWidth="3" 
                                                                        strokeDasharray="42 94" strokeLinecap="round" transform="rotate(-90 18 18)" />
                                                                </svg>
                                                                <span className="ring-label">45%</span>
                                                                <span className="ring-sublabel">Avg Activation</span>
                                                            </div>
                                                            <div className="growth-ring-item">
                                                                <svg className="growth-ring" viewBox="0 0 36 36">
                                                                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                                                    <circle cx="18" cy="18" r="15" fill="none" stroke="#27a17a" strokeWidth="3" 
                                                                        strokeDasharray="85 94" strokeLinecap="round" transform="rotate(-90 18 18)" />
                                                                </svg>
                                                                <span className="ring-label">90%</span>
                                                                <span className="ring-sublabel">Target</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Growth Potential Segments */}
                                                    <div className="growth-segments-card">
                                                        <div className="growth-segments-header">
                                                            <span className="growth-segments-label">Growth Potential</span>
                                                        </div>
                                                        
                                                        {/* Vertical segments */}
                                                        <div className="growth-segments-list">
                                                            <button 
                                                                className={`growth-segment-item ${selectedGrowthLevel === 'high-potential' ? 'selected' : ''}`}
                                                                onClick={() => setSelectedGrowthLevel('high-potential')}
                                                            >
                                                                <div className="segment-bar-container">
                                                                    <div className="segment-bar high-potential" style={{ width: '95%' }}></div>
                                                                </div>
                                                                <div className="segment-info">
                                                                    <span className="segment-name">High</span>
                                                                    <span className="segment-count">12 customers</span>
                                                                </div>
                                                                <span className="segment-lift">+45% lift</span>
                                                            </button>
                                                            
                                                            <button 
                                                                className={`growth-segment-item ${selectedGrowthLevel === 'moderate' ? 'selected' : ''}`}
                                                                onClick={() => setSelectedGrowthLevel('moderate')}
                                                            >
                                                                <div className="segment-bar-container">
                                                                    <div className="segment-bar moderate" style={{ width: '70%' }}></div>
                                                                </div>
                                                                <div className="segment-info">
                                                                    <span className="segment-name">Moderate</span>
                                                                    <span className="segment-count">34 customers</span>
                                                                </div>
                                                                <span className="segment-lift">+28% lift</span>
                                                            </button>
                                                            
                                                            <button 
                                                                className={`growth-segment-item ${selectedGrowthLevel === 'some-room' ? 'selected' : ''}`}
                                                                onClick={() => setSelectedGrowthLevel('some-room')}
                                                            >
                                                                <div className="segment-bar-container">
                                                                    <div className="segment-bar some-room" style={{ width: '40%' }}></div>
                                                                </div>
                                                                <div className="segment-info">
                                                                    <span className="segment-name">Low</span>
                                                                    <span className="segment-count">89 customers</span>
                                                                </div>
                                                                <span className="segment-lift">+12% lift</span>
                                                            </button>
                                                            
                                                            <button 
                                                                className={`growth-segment-item optimized ${selectedGrowthLevel === 'optimized' ? 'selected' : ''}`}
                                                                onClick={() => setSelectedGrowthLevel('optimized')}
                                                            >
                                                                <div className="segment-bar-container">
                                                                    <div className="segment-bar optimized" style={{ width: '100%' }}></div>
                                                                </div>
                                                                <div className="segment-info">
                                                                    <span className="segment-name">Optimized</span>
                                                                    <span className="segment-count">103 customers</span>
                                                                </div>
                                                                <span className="segment-check"><Icon name="check-circle-filled" /></span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* AI Scenario Card */}
                                                    <div className="ai-scenario-card">
                                                        <div className="ai-scenario-icon">
                                                            <Icon name="sparkle-filled" />
                                                        </div>
                                                        <div className="ai-scenario-content">
                                                            <span className="ai-scenario-label">AI Scenario</span>
                                                            <p className="ai-scenario-text">
                                                                If the top 12 customers increase activation by 10%, your overall portfolio usage increases by <strong>~7%</strong>.
                                                            </p>
                                                        </div>
                                                    </div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Right column - Customers table - with skeleton */}
                                                <div className={`customers-table-card v2-card growth-table panel-section ${loadedSections.table ? 'loaded' : ''}`}>
                                                    {!loadedSections.table ? (
                                                        /* SKELETON STATE */
                                                        <div className="skeleton-table-wrapper">
                                                            <div className="skeleton skeleton-text small" style={{ width: '150px', marginBottom: '16px' }}></div>
                                                            <div className="skeleton-table">
                                                                <div className="skeleton-table-header">
                                                                    <div className="skeleton skeleton-cell wide"></div>
                                                                    <div className="skeleton skeleton-cell"></div>
                                                                    <div className="skeleton skeleton-cell narrow"></div>
                                                                    <div className="skeleton skeleton-cell narrow"></div>
                                                                    <div className="skeleton skeleton-cell wide"></div>
                                                                </div>
                                                                <div className="skeleton-table-body">
                                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                                        <div className="skeleton-row" key={i}>
                                                                            <div className="skeleton skeleton-cell wide"></div>
                                                                            <div className="skeleton skeleton-cell"></div>
                                                                            <div className="skeleton skeleton-cell narrow"></div>
                                                                            <div className="skeleton skeleton-cell narrow"></div>
                                                                            <div className="skeleton skeleton-cell wide"></div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* ACTUAL CONTENT */
                                                        <>
                                                    <span className="v2-card-tag">{getGrowthLevelLabel(selectedGrowthLevel)}</span>
                                                    <div className="v2-card-bg"></div>
                                                    <div className="v2-card-content">
                                                        <div className="customers-table-v2">
                                                            <div className="table-header-v2">
                                                                <div className="col-header col-name">Customer</div>
                                                                <div className="col-header col-feature-gap">Key feature gap</div>
                                                                <div className="col-header col-utilization">License utilization</div>
                                                                <div className="col-header col-activation">License activation</div>
                                                                <div className="col-header col-recommendation">Recommendation</div>
                                                            </div>
                                                            <div className="table-body-v2">
                                                                {adoptionCustomersByLevel[selectedGrowthLevel].map((customer, idx) => (
                                                                    <div className="table-row-v2" key={idx}>
                                                                        <div className="col-cell col-name">{customer.name}</div>
                                                                        <div className="col-cell col-feature-gap">{customer.featureGap}</div>
                                                                        <div className="col-cell col-utilization">{customer.utilization}</div>
                                                                        <div className="col-cell col-activation">{customer.activation}</div>
                                                                        <div className="col-cell col-recommendation">{customer.recommendation}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {/* Pagination */}
                                                        <div className="table-pagination">
                                                            <button className="pagination-btn" disabled>
                                                                <Icon name="arrow-left-regular" />
                                                            </button>
                                                            <div className="pagination-select">
                                                                <span>1</span>
                                                                <Icon name="arrow-down-regular" className="dropdown-icon" />
                                                            </div>
                                                            <span className="pagination-text">
                                                                of {Math.ceil(
                                                                    (selectedGrowthLevel === 'high-potential' ? 12 : 
                                                                     selectedGrowthLevel === 'moderate' ? 34 : 
                                                                     selectedGrowthLevel === 'some-room' ? 89 : 
                                                                     selectedGrowthLevel === 'optimized' ? 103 : 10) / 10
                                                                )} pages
                                                            </span>
                                                            <button className="pagination-btn">
                                                                <Icon name="arrow-right-regular" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        </div>{/* panel-tab-content for adoption */}
                                        </>
                                        )}
                                    </div>
                                )}
                                
                                {/* 
                                ============================================
                                PREVIOUS RENEWAL RISK PANEL DESIGN - TO REVERT:
                                1. Remove the renewal-risk-v2 panel above
                                2. Uncomment this entire block
                                ============================================
                                {showRenewalRisk && (
                                    <div className="workspace-result-panel renewal-risk-panel">
                                        <div className="panel-header">
                                            <Text type="heading-small-bold" tagname="h3">Customers Most Likely to Churn</Text>
                                            <Button variant="tertiary" size={24} prefixIcon="cancel-regular" aria-label="Close panel"
                                                onClick={() => { setShowRenewalRisk(false); setHasSearchSubmitted(false); setMainSearchValue(''); }} />
                                        </div>
                                        <div className="panel-content">
                                            [Previous flow visualization, stats bar, cards grid, and reasoning block were here]
                                        </div>
                                    </div>
                                )}
                                */}
                                {showGenericResponse && (
                                    <div className="workspace-result-panel">
                                        <div className="panel-header">
                                            <Text type="heading-small-bold" tagname="h3">AI Response</Text>
                                            <Button 
                                                variant="tertiary" 
                                                size={24} 
                                                prefixIcon="cancel-regular" 
                                                aria-label="Close panel"
                                                onClick={() => {
                                                    setShowGenericResponse(false);
                                                    setHasSearchSubmitted(false);
                                                    setMainSearchValue('');
                                                }}
                                            />
                                        </div>
                                        <div className="panel-content">
                                            <Text type="body-small-medium" className="query-echo">"{submittedQuery}"</Text>
                                            <Text type="body-midsize-regular" style={{ marginTop: '12px' }}>
                                                I'm analyzing your request. Here's what I found based on your customer data and recent activity...
                                            </Text>
                                            <ul className="summary-list">
                                                <li>Your portfolio includes 142 active customers across 12 segments</li>
                                                <li>8 customers require immediate attention based on health scores</li>
                                                <li>Recent engagement trends show positive momentum overall</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                                
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
                </div>
            </div>
            )}
                
                {/* Customer Summary Panel - Legacy (only shown when not in chat layout) */}
                {viewMode === 'workspace' && showCustomerSummary && !hasSearchSubmitted && (
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

                {/* Customer Groups Panel - Legacy (only shown when not in chat layout) */}
                {viewMode === 'workspace' && showCustomerGroups && !hasSearchSubmitted && (
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

                {/* Meetings Analysis Panel - Legacy (only shown when not in chat layout) */}
                {viewMode === 'workspace' && showMeetingsAnalysis && !hasSearchSubmitted && (
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

            {/* OVERVIEW VIEW - Full Width Dashboard */}
            {viewMode === 'control-center' && (
                <div className="overview-fullwidth">
                        {/* Welcome Card with Tabs */}
                        <div className="dashboard-card welcome-summary-card">
                            <div className="card-header welcome-header">
                                <div className="ai-header-left">
                                    {selectedAction ? (
                                        <>
                                            <button 
                                                className="back-to-summary"
                                                onClick={() => setSelectedAction(null)}
                                            >
                                                ← Back
                                            </button>
                                            <h3>{selectedAction.customer}</h3>
                                        </>
                                    ) : (
                                        <>
                                            <span className="ai-sparkle">✨</span>
                                            <h3>Welcome back, Molly</h3>
                                        </>
                                    )}
                                </div>
                                <div className="ai-header-right">
                                    <span className="ai-timestamp">{timestampDisplay}</span>
                                    <Button 
                                        variant="tertiary" 
                                        size={24}
                                        prefixIcon="refresh-regular"
                                        aria-label="Refresh"
                                        onPress={handleRefresh}
                                    />
                                    <Button 
                                        variant="tertiary" 
                                        size={24}
                                        prefixIcon="share-c-native-iph-regular"
                                        aria-label="Share"
                                    />
                                </div>
                            </div>
                            
                            {/* Show tabs only when no action is selected */}
                            {!selectedAction && (
                                <div className="summary-tabs">
                                    <button 
                                        className={`summary-tab ${summaryTab === 'ai' ? 'active' : ''}`}
                                        onClick={() => setSummaryTab('ai')}
                                    >
                                        AI summary
                                    </button>
                                    <button 
                                        className={`summary-tab ${summaryTab === 'data' ? 'active' : ''}`}
                                        onClick={() => setSummaryTab('data')}
                                    >
                                        Customer portfolio
                                    </button>
                                    <button 
                                        className={`summary-tab ${summaryTab === 'activity' ? 'active' : ''}`}
                                        onClick={() => setSummaryTab('activity')}
                                    >
                                        Activity
                                    </button>
                                    <button 
                                        className={`summary-tab ${summaryTab === 'insights' ? 'active' : ''}`}
                                        onClick={() => setSummaryTab('insights')}
                                    >
                                        Insights
                                    </button>
                                </div>
                            )}
                            
                            {/* Selected Action Content */}
                            {selectedAction && (
                                <div className="card-content action-detail-content">
                                    <div className={`action-detail-priority priority-${selectedAction.priority.toLowerCase()}`}>
                                        <span className="priority-badge">{selectedAction.priority.charAt(0) + selectedAction.priority.slice(1).toLowerCase()} priority</span>
                                    </div>
                                    <h4 className="action-detail-title">{selectedAction.title}</h4>
                                    <p className="action-detail-meta">{selectedAction.meta}</p>
                                    <p className="action-detail-description">{selectedAction.description}</p>
                                </div>
                            )}
                            
                            {/* AI Summary Content */}
                            {!selectedAction && summaryTab === 'ai' && (
                                <div className="card-content">
                                    <p className="ai-summary-text">
                                        Your portfolio is performing <strong>above average</strong> this week. Overall customer health remains stable at 94%, 
                                        though <strong>7 accounts need immediate attention</strong> due to declining engagement. Activity is trending 
                                        positively with an 8% month-over-month increase driven by enterprise expansions.
                                    </p>
                                    <div className="ai-insights">
                                        <div className="ai-insight-card highlighted">
                                            <div className="insight-card-header">
                                                <div className="insight-card-title-section">
                                                    <div className="insight-card-title-row">
                                                        <h4 className="insight-card-title">Renewal at risk</h4>
                                                        <span className="insight-chip urgent">Urgent</span>
                                                    </div>
                                                    <span className="insight-card-time">15 minutes</span>
                                                </div>
                                                <Button variant="secondary" size={28}>Schedule call</Button>
                                            </div>
                                            <div className="insight-card-divider"></div>
                                            <div className="insight-card-body">
                                                <span className="insight-card-label">Alert</span>
                                                <p className="insight-card-description">Meridian corp renewal at risk — engagement down 35% over the past 30 days. Recommend immediate outreach to prevent churn.</p>
                                            </div>
                                        </div>
                                        <div className="ai-insight-card">
                                            <div className="insight-card-header">
                                                <div className="insight-card-title-section">
                                                    <div className="insight-card-title-row">
                                                        <h4 className="insight-card-title">Expansion opportunity</h4>
                                                        <span className="insight-chip opportunity">Opportunity</span>
                                                    </div>
                                                    <span className="insight-card-time">2 minutes</span>
                                                </div>
                                                <Button variant="secondary" size={28}>Review accounts</Button>
                                            </div>
                                            <div className="insight-card-divider"></div>
                                            <div className="insight-card-body">
                                                <span className="insight-card-label">Insight</span>
                                                <p className="insight-card-description">3 customers showing strong expansion signals based on usage patterns and recent engagement metrics.</p>
                                            </div>
                                        </div>
                                        <div className="ai-insight-card">
                                            <div className="insight-card-header">
                                                <div className="insight-card-title-section">
                                                    <div className="insight-card-title-row">
                                                        <h4 className="insight-card-title">Proactive outreach</h4>
                                                        <span className="insight-chip suggestion">Suggestion</span>
                                                    </div>
                                                    <span className="insight-card-time">1 hour</span>
                                                </div>
                                                <Button variant="secondary" size={28}>Send campaign</Button>
                                            </div>
                                            <div className="insight-card-divider"></div>
                                            <div className="insight-card-body">
                                                <span className="insight-card-label">Recommendation</span>
                                                <p className="insight-card-description">Consider proactive outreach to healthcare segment customers who have shown decreased login activity this week.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Customer Health Content */}
                            {!selectedAction && summaryTab === 'data' && (
                                <div className="card-content data-summary-content">
                                    <div className="org-health-cards three-col">
                                        <div className="org-health-card featured">
                                            <h4 className="org-health-title">Total customers</h4>
                                            <div className="org-health-body">
                                                <div className="org-health-value-row">
                                                    <span className="org-health-value">847</span>
                                                    <span className="org-health-trend positive">↑ 12 added</span>
                                                </div>
                                                <p className="org-health-description">Total active customers across all segments and tiers in the last 30 days</p>
                                            </div>
                                        </div>
                                        <div className="org-health-card">
                                            <h4 className="org-health-title">Total users</h4>
                                            <div className="org-health-body">
                                                <div className="org-health-value-row">
                                                    <span className="org-health-value">24,580</span>
                                                    <span className="org-health-trend positive">↑ 340 added</span>
                                                </div>
                                                <p className="org-health-description">Total provisioned users across all customer accounts</p>
                                            </div>
                                        </div>
                                        <div className="org-health-card">
                                            <h4 className="org-health-title">Active users</h4>
                                            <div className="org-health-body">
                                                <div className="org-health-value-row">
                                                    <span className="org-health-value">78%</span>
                                                    <span className="org-health-trend neutral">→ No change</span>
                                                </div>
                                                <p className="org-health-description">Users with activity in last 30 days. Industry avg is 72%</p>
                                            </div>
                                        </div>
                                        <div className="org-health-card">
                                            <h4 className="org-health-title">Activation rate</h4>
                                            <div className="org-health-body">
                                                <div className="org-health-value-row">
                                                    <span className="org-health-value">89%</span>
                                                    <span className="org-health-trend positive">↑ 3%</span>
                                                </div>
                                                <p className="org-health-description">New users completing activation within first 7 days</p>
                                            </div>
                                        </div>
                                        <div className="org-health-card">
                                            <h4 className="org-health-title">Renewals this quarter</h4>
                                            <div className="org-health-body">
                                                <div className="org-health-value-row">
                                                    <span className="org-health-value">42</span>
                                                    <span className="org-health-trend negative">3 at risk</span>
                                                </div>
                                                <p className="org-health-description">Customers with contracts expiring Q1 2025</p>
                                            </div>
                                        </div>
                                        <div className="org-health-card">
                                            <h4 className="org-health-title">New customers</h4>
                                            <div className="org-health-body">
                                                <div className="org-health-value-row">
                                                    <span className="org-health-value">12</span>
                                                    <span className="org-health-trend positive">↑ 18%</span>
                                                </div>
                                                <p className="org-health-description">Customers added in last 30 days</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recent Activity Content */}
                            {!selectedAction && summaryTab === 'activity' && (
                                <div className="card-content activity-content">
                                    <div className="activity-time-selector">
                                        <span className="activity-time-label">Showing activity from:</span>
                                        <div className="activity-time-options">
                                            <button 
                                                className={`time-option ${activityTimeRange === 'day' ? 'active' : ''}`}
                                                onClick={() => setActivityTimeRange('day')}
                                            >
                                                Past 24h
                                            </button>
                                            <button 
                                                className={`time-option ${activityTimeRange === 'week' ? 'active' : ''}`}
                                                onClick={() => setActivityTimeRange('week')}
                                            >
                                                Past week
                                            </button>
                                            <button 
                                                className={`time-option ${activityTimeRange === 'month' ? 'active' : ''}`}
                                                onClick={() => setActivityTimeRange('month')}
                                            >
                                                Past month
                                            </button>
                                            <button 
                                                className={`time-option ${activityTimeRange === 'quarter' ? 'active' : ''}`}
                                                onClick={() => setActivityTimeRange('quarter')}
                                            >
                                                Past quarter
                                            </button>
                                        </div>
                                    </div>
                                    <div className="activity-summary-cards">
                                        {currentActivityData.cards.map((card, index) => (
                                            <div key={card.id} className={`activity-summary-card ${card.highlighted ? 'highlighted' : ''}`}>
                                                <div className="activity-summary-header">
                                                    <div className="activity-summary-title-section">
                                                        <div className="activity-summary-title-row">
                                                            <h4 className="activity-summary-title">{card.title}</h4>
                                                            <span className={`activity-chip ${card.chipType}`}>{card.chip}</span>
                                                        </div>
                                                        <span className="activity-summary-time">{currentActivityData.timeLabel}</span>
                                                    </div>
                                                    <Button variant="secondary" size={28}>View</Button>
                                                </div>
                                                <div className="activity-summary-divider"></div>
                                                <div className="activity-summary-body">
                                                    <span className="activity-summary-label">{card.label}</span>
                                                    <p className="activity-summary-description">{card.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Insights Content */}
                            {!selectedAction && summaryTab === 'insights' && (
                                <div className="card-content insights-content">
                                    <div className="insights-filter-selector">
                                        <span className="insights-filter-label">Showing recommendations for:</span>
                                        <div className="insights-filter-options">
                                            <button 
                                                className={`filter-option ${suggestedActionsTab === 'all' ? 'active' : ''}`}
                                                onClick={() => setSuggestedActionsTab('all')}
                                            >
                                                All
                                            </button>
                                            <button 
                                                className={`filter-option ${suggestedActionsTab === 'groups' ? 'active' : ''}`}
                                                onClick={() => setSuggestedActionsTab('groups')}
                                            >
                                                Customer groups
                                            </button>
                                            <button 
                                                className={`filter-option ${suggestedActionsTab === 'customers' ? 'active' : ''}`}
                                                onClick={() => setSuggestedActionsTab('customers')}
                                            >
                                                External customers
                                            </button>
                                        </div>
                                    </div>
                                    {suggestedActionsTab === 'groups' && (
                                        <div className="group-filter-section inline">
                                            <div className="group-filter-container">
                                                <button 
                                                    className={`group-filter-trigger ${isGroupFilterOpen ? 'open' : ''}`}
                                                    onClick={() => setIsGroupFilterOpen(!isGroupFilterOpen)}
                                                >
                                                    <span className="filter-icon">⏷</span>
                                                    <span>
                                                        {selectedGroups.length === 0 
                                                            ? 'Filter by customer group' 
                                                            : `${selectedGroups.length} group${selectedGroups.length > 1 ? 's' : ''} selected`}
                                                    </span>
                                                </button>
                                                {isGroupFilterOpen && (
                                                    <div className="group-filter-dropdown">
                                                        <div className="group-filter-header">
                                                            <span>Select groups</span>
                                                            {selectedGroups.length > 0 && (
                                                                <button className="clear-filters-btn" onClick={clearGroupFilters}>
                                                                    Clear all
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="group-filter-list">
                                                            {customerGroups.map(group => (
                                                                <label key={group} className="group-filter-item">
                                                                    <input 
                                                                        type="checkbox"
                                                                        checked={selectedGroups.includes(group)}
                                                                        onChange={() => toggleGroupFilter(group)}
                                                                    />
                                                                    <span className="checkbox-custom"></span>
                                                                    <span className="group-name">{group}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {selectedGroups.length > 0 && (
                                                <div className="selected-groups-tags">
                                                    {selectedGroups.map(group => (
                                                        <span key={group} className="group-tag">
                                                            {group}
                                                            <button 
                                                                className="remove-tag"
                                                                onClick={() => toggleGroupFilter(group)}
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="insights-actions-list">
                                        {filteredSuggestedActions.map(action => (
                                            <div 
                                                key={action.id}
                                                className="action-card"
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <div className="action-card-header">
                                                    <div className="action-card-title-section">
                                                        <div className="action-card-title-row">
                                                            <h4 className="action-card-title">{action.title}</h4>
                                                            <span className={`action-chip ${action.priority.toLowerCase()}`}>
                                                                {action.priority === 'HIGH' ? 'Urgent' : action.priority === 'MED' ? 'Medium' : 'Low'}
                                                            </span>
                                                        </div>
                                                        <span className="action-card-time">{action.time}</span>
                                                    </div>
                                                </div>
                                                <div className="action-card-divider"></div>
                                                <div className="action-card-body">
                                                    <span className="action-card-label">{action.customer}</span>
                                                    <p className="action-card-description">{action.summary}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                </div>
            )}

            {/* SUGGESTED ACTIONS VIEW - Full Width (REMOVED) */}
            {false && viewMode === 'suggested-actions' && (
                <div className="suggested-actions-fullwidth">
                    <div className="dashboard-card suggested-actions-card">
                        <div className="card-header">
                            <h3>Suggested actions</h3>
                            <span className="action-count">{filteredSuggestedActions.length} actions</span>
                        </div>
                        <div className="suggested-actions-tabs">
                            <button 
                                className={`suggested-action-tab ${suggestedActionsTab === 'all' ? 'active' : ''}`}
                                onClick={() => setSuggestedActionsTab('all')}
                            >
                                All
                            </button>
                            <button 
                                className={`suggested-action-tab ${suggestedActionsTab === 'groups' ? 'active' : ''}`}
                                onClick={() => setSuggestedActionsTab('groups')}
                            >
                                Customer groups
                            </button>
                            <button 
                                className={`suggested-action-tab ${suggestedActionsTab === 'customers' ? 'active' : ''}`}
                                onClick={() => setSuggestedActionsTab('customers')}
                            >
                                External customers
                            </button>
                        </div>
                        {suggestedActionsTab === 'groups' && (
                            <div className="group-filter-section">
                                <div className="group-filter-container">
                                    <button 
                                        className={`group-filter-trigger ${isGroupFilterOpen ? 'open' : ''}`}
                                        onClick={() => setIsGroupFilterOpen(!isGroupFilterOpen)}
                                    >
                                        <span className="filter-icon">⏷</span>
                                        <span>
                                            {selectedGroups.length === 0 
                                                ? 'Filter by customer group' 
                                                : `${selectedGroups.length} group${selectedGroups.length > 1 ? 's' : ''} selected`}
                                        </span>
                                    </button>
                                    {isGroupFilterOpen && (
                                        <div className="group-filter-dropdown">
                                            <div className="group-filter-header">
                                                <span>Select groups</span>
                                                {selectedGroups.length > 0 && (
                                                    <button className="clear-filters-btn" onClick={clearGroupFilters}>
                                                        Clear all
                                                    </button>
                                                )}
                                            </div>
                                            <div className="group-filter-list">
                                                {customerGroups.map(group => (
                                                    <label key={group} className="group-filter-item">
                                                        <input 
                                                            type="checkbox"
                                                            checked={selectedGroups.includes(group)}
                                                            onChange={() => toggleGroupFilter(group)}
                                                        />
                                                        <span className="checkbox-custom"></span>
                                                        <span className="group-name">{group}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {selectedGroups.length > 0 && (
                                    <div className="selected-groups-tags">
                                        {selectedGroups.map(group => (
                                            <span key={group} className="group-tag">
                                                {group}
                                                <button 
                                                    className="remove-tag"
                                                    onClick={() => toggleGroupFilter(group)}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="card-content actions-grid">
                            {filteredSuggestedActions.map(action => (
                                <div 
                                    key={action.id}
                                    className="action-card"
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="action-card-header">
                                        <div className="action-card-title-section">
                                            <div className="action-card-title-row">
                                                <h4 className="action-card-title">{action.title}</h4>
                                                <span className={`action-chip ${action.priority.toLowerCase()}`}>
                                                    {action.priority === 'HIGH' ? 'Urgent' : action.priority === 'MED' ? 'Medium' : 'Low'}
                                                </span>
                                            </div>
                                            <span className="action-card-time">{action.time}</span>
                                        </div>
                                    </div>
                                    <div className="action-card-divider"></div>
                                    <div className="action-card-body">
                                        <span className="action-card-label">{action.customer}</span>
                                        <p className="action-card-description">{action.summary}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default HomePage;