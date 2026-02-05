import React, { useState } from 'react';
import { Icon } from '@momentum-design/components/react';
import './uxideation.css';

type PatternId = 'inline' | 'drawer' | 'subflow' | 'preconfigure' | 'draft' | 'tabbed' | 'reference';

interface Pattern {
    id: PatternId;
    title: string;
    tagline: string;
    description: string;
    pros: string[];
    cons: string[];
    bestFor: string;
}

const patterns: Pattern[] = [
    {
        id: 'inline',
        title: 'Inline Expansion',
        tagline: 'Complexity unfolds in place',
        description: 'Complex settings expand directly within the wizard step. The step grows to accommodate the configuration UI, keeping context visible.',
        pros: [
            'No context switch — user stays in the wizard',
            'Can see surrounding settings while configuring',
            'Works well for moderately complex settings',
            'Preserves wizard progress visibility'
        ],
        cons: [
            'Step can become very tall/scrollable',
            'May overwhelm users if too much expands at once',
            'Hard to scale for truly complex configurations',
            'Mobile experience can suffer'
        ],
        bestFor: 'Settings with 3-8 fields that need context from surrounding options'
    },
    {
        id: 'drawer',
        title: 'Side Panel / Drawer',
        tagline: 'Slide out, stay connected',
        description: 'A drawer slides in from the right (or left) overlaying part of the wizard while keeping the wizard step visible. The wizard dims but remains accessible.',
        pros: [
            'Wizard context visible behind the drawer',
            'Natural "temporary focus" metaphor',
            'Can be quite spacious (50-70% width)',
            'Familiar pattern from many modern apps',
            'Easy to dismiss and return'
        ],
        cons: [
            'Still a layered UI (drawer on wizard)',
            'May not fit extremely complex UIs',
            'Can feel cramped on smaller screens',
            'Z-index management complexity'
        ],
        bestFor: 'Medium-complexity settings that benefit from dedicated space but need wizard context'
    },
    {
        id: 'subflow',
        title: 'Stepped Sub-Flow',
        tagline: 'Wizard within a wizard',
        description: 'When entering complex settings, the wizard step transforms into a mini-wizard. The parent wizard breadcrumb shows "Template > Call Queue Settings" with ability to collapse back.',
        pros: [
            'Full-page real estate for complex configs',
            'Maintains mental model of "still in template creation"',
            'Can have its own multi-step flow',
            'Progress is preserved when returning'
        ],
        cons: [
            'Nested wizards can be confusing',
            'Need clear navigation breadcrumbs',
            'User may lose context of parent wizard',
            'Back button behavior needs careful handling'
        ],
        bestFor: 'Very complex settings that truly need multiple steps to configure'
    },
    {
        id: 'preconfigure',
        title: 'Pre-Configuration',
        tagline: 'Build blocks, then assemble',
        description: 'Complex settings are configured separately before starting the template wizard. In the wizard, users select from pre-created configurations via a picker/dropdown.',
        pros: [
            'Clean separation of concerns',
            'Configurations are reusable across templates',
            'Wizard stays simple and fast',
            'Configurations can be managed independently'
        ],
        cons: [
            'Requires users to plan ahead',
            'Creates new navigation paths to manage',
            'May feel disconnected from template flow',
            '"Create new" option still needs a solution'
        ],
        bestFor: 'Settings that are genuinely reusable across multiple templates'
    },
    {
        id: 'draft',
        title: 'Save Draft & Navigate',
        tagline: 'Step away, come back',
        description: 'User clicks "Configure" and the wizard auto-saves as draft. User navigates to a full-page configuration experience. Upon completion, they\'re returned to the wizard where they left off.',
        pros: [
            'Full-page experience for complex config',
            'No modal/drawer stacking issues',
            'Clean mental model: "I\'m leaving, then coming back"',
            'Works for any complexity level'
        ],
        cons: [
            'Requires robust draft/state management',
            'Context switch may feel jarring',
            'User needs confidence draft is saved',
            'Deep linking and state restoration complexity'
        ],
        bestFor: 'Very complex settings that truly need a dedicated page experience'
    },
    {
        id: 'tabbed',
        title: 'Tabbed Interface',
        tagline: 'Organize, don\'t stack',
        description: 'The wizard step uses tabs to organize complex settings. Instead of one overwhelming form, content is split across 3-5 focused tabs within the step.',
        pros: [
            'No additional layers or navigation',
            'Users can explore at their own pace',
            'Content is chunked and digestible',
            'Works well on all screen sizes'
        ],
        cons: [
            'Discovery: users may miss tabs',
            'Validation across tabs can be tricky',
            'May not suit linear/dependent configs',
            'Tabs within wizard steps can feel odd'
        ],
        bestFor: 'Complex settings that can be logically grouped into independent categories'
    },
    {
        id: 'reference',
        title: 'Reference Library',
        tagline: 'Pick from what exists',
        description: 'Complex configurations become standalone "building blocks" stored in a library. The wizard provides a picker to browse, preview, and select from existing configs—with an option to create new.',
        pros: [
            'Promotes reusability and consistency',
            'Wizard UX stays lightweight',
            'Organizations build a config library over time',
            '"Create new" can use full-page experience'
        ],
        cons: [
            'Requires new "library" concept and UI',
            'Users may still need to create configs inline',
            'Versioning and updates get complex',
            'May feel over-engineered for simple cases'
        ],
        bestFor: 'Enterprise scenarios where configs are standardized and reused across many templates'
    }
];

// Mock library data for Reference Library pattern
const libraryConfigs = [
    { id: 1, name: 'Enterprise Support', agents: 5, routing: 'Round Robin', waitTime: '5 min', overflow: 'Voicemail', description: 'Standard support queue for enterprise customers with 24/7 coverage.' },
    { id: 2, name: 'Sales West', agents: 3, routing: 'Longest Idle', waitTime: '3 min', overflow: 'Callback', description: 'West coast sales team queue optimized for quick response.' },
    { id: 3, name: 'Partner Escalation', agents: 2, routing: 'Skills-based', waitTime: '2 min', overflow: 'Manager', description: 'High-priority escalation queue for partner issues.' },
    { id: 4, name: 'After Hours', agents: 1, routing: 'Sequential', waitTime: '10 min', overflow: 'Voicemail', description: 'Minimal staffing queue for off-hours support.' },
];

const UxIdeationPage: React.FC = () => {
    const [selectedPattern, setSelectedPattern] = useState<PatternId>('inline');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [subflowActive, setSubflowActive] = useState(false);
    const [expandedInline, setExpandedInline] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [draftSaved, setDraftSaved] = useState(false);
    
    // Reference Library state
    const [libraryModalOpen, setLibraryModalOpen] = useState(false);
    const [selectedConfigId, setSelectedConfigId] = useState<number | null>(1);
    const [previewConfigId, setPreviewConfigId] = useState<number | null>(null);
    const [createNewMode, setCreateNewMode] = useState(false);
    
    // Sub-flow state
    const [subflowStep, setSubflowStep] = useState(1);
    const [subflowCompleted, setSubflowCompleted] = useState(false);
    const [selectedAgents, setSelectedAgents] = useState<string[]>(['JD', 'SM']);

    const currentPattern = patterns.find(p => p.id === selectedPattern)!;
    const selectedConfig = libraryConfigs.find(c => c.id === selectedConfigId);
    const previewConfig = libraryConfigs.find(c => c.id === previewConfigId);

    const renderMockup = () => {
        switch (selectedPattern) {
            case 'inline':
                return (
                    <div className="mockup-container mockup-wizard">
                        <div className="mock-wizard-header">
                            <div className="mock-breadcrumb">Create Template</div>
                            <div className="mock-steps">
                                <span className="mock-step active">1. Info & Settings</span>
                                <span className="mock-step">2. Assign Groups</span>
                            </div>
                        </div>
                        <div className="mock-wizard-content">
                            <div className="mock-setting-row">
                                <label>Display Name</label>
                                <div className="mock-input">Acme Corp Template</div>
                            </div>
                            <div className="mock-setting-row">
                                <label>Time Zone</label>
                                <div className="mock-input">America/Los_Angeles</div>
                            </div>
                            <div className={`mock-complex-setting ${expandedInline ? 'expanded' : ''}`}>
                                <div 
                                    className="mock-complex-header"
                                    onClick={() => setExpandedInline(!expandedInline)}
                                >
                                    <div className="mock-complex-title">
                                        <Icon name={expandedInline ? "arrow-down-regular" : "arrow-right-regular"} />
                                        <span>Call Queue Settings</span>
                                        <span className="mock-complex-badge">Complex</span>
                                    </div>
                                    <span className="mock-expand-hint">{expandedInline ? 'Collapse' : 'Expand to configure'}</span>
                                </div>
                                {expandedInline && (
                                    <div className="mock-inline-expanded">
                                        <div className="mock-inline-grid">
                                            <div className="mock-mini-field">
                                                <label>Queue Name</label>
                                                <div className="mock-input-sm">Support Queue</div>
                                            </div>
                                            <div className="mock-mini-field">
                                                <label>Max Wait Time</label>
                                                <div className="mock-input-sm">5 min</div>
                                            </div>
                                            <div className="mock-mini-field">
                                                <label>Overflow Action</label>
                                                <div className="mock-input-sm">Voicemail</div>
                                            </div>
                                            <div className="mock-mini-field">
                                                <label>Routing Type</label>
                                                <div className="mock-input-sm">Round Robin</div>
                                            </div>
                                        </div>
                                        <div className="mock-inline-agents">
                                            <label>Agents</label>
                                            <div className="mock-agent-list">
                                                <span className="mock-agent-pill">John D.</span>
                                                <span className="mock-agent-pill">Sarah M.</span>
                                                <span className="mock-agent-pill">+ Add</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mock-setting-row">
                                <label>Auto-Attendant</label>
                                <div className="mock-toggle">Enabled</div>
                            </div>
                        </div>
                        <div className="mock-wizard-footer">
                            <button className="mock-btn mock-btn-ghost">Back</button>
                            <button className="mock-btn mock-btn-primary">Next</button>
                        </div>
                    </div>
                );

            case 'drawer':
                return (
                    <div className="mockup-container mockup-drawer-demo">
                        <div className={`mock-wizard-base ${drawerOpen ? 'dimmed' : ''}`}>
                            <div className="mock-wizard-header">
                                <div className="mock-breadcrumb">Create Template</div>
                                <div className="mock-steps">
                                    <span className="mock-step active">1. Info & Settings</span>
                                    <span className="mock-step">2. Assign Groups</span>
                                </div>
                            </div>
                            <div className="mock-wizard-content">
                                <div className="mock-setting-row">
                                    <label>Display Name</label>
                                    <div className="mock-input">Acme Corp Template</div>
                                </div>
                                <div className="mock-setting-row clickable" onClick={() => setDrawerOpen(true)}>
                                    <label>Call Queue Settings</label>
                                    <div className="mock-input mock-input-action">
                                        <span>Configure</span>
                                        <Icon name="arrow-right-regular" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`mock-drawer ${drawerOpen ? 'open' : ''}`}>
                            <div className="mock-drawer-header">
                                <h3>Call Queue Settings</h3>
                                <button className="mock-close-btn" onClick={() => setDrawerOpen(false)}>
                                    <Icon name="cancel-regular" />
                                </button>
                            </div>
                            <div className="mock-drawer-content">
                                <div className="mock-setting-row">
                                    <label>Queue Name</label>
                                    <div className="mock-input">Support Queue</div>
                                </div>
                                <div className="mock-setting-row">
                                    <label>Max Wait Time</label>
                                    <div className="mock-input">5 minutes</div>
                                </div>
                                <div className="mock-setting-row">
                                    <label>Overflow Action</label>
                                    <div className="mock-input">Send to Voicemail</div>
                                </div>
                                <div className="mock-setting-row">
                                    <label>Routing Type</label>
                                    <div className="mock-input">Round Robin</div>
                                </div>
                                <div className="mock-setting-row">
                                    <label>Agents</label>
                                    <div className="mock-agent-list">
                                        <span className="mock-agent-pill">John D.</span>
                                        <span className="mock-agent-pill">Sarah M.</span>
                                        <span className="mock-agent-pill">+ Add</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mock-drawer-footer">
                                <button className="mock-btn mock-btn-ghost" onClick={() => setDrawerOpen(false)}>Cancel</button>
                                <button className="mock-btn mock-btn-primary" onClick={() => setDrawerOpen(false)}>Apply</button>
                            </div>
                        </div>
                    </div>
                );

            case 'subflow':
                const subflowSteps = [
                    { title: 'Queue Basics', desc: 'Name and basic settings for the queue' },
                    { title: 'Routing Rules', desc: 'How calls are distributed to agents' },
                    { title: 'Agent Assignment', desc: 'Select agents to handle calls' },
                    { title: 'Overflow Settings', desc: 'What happens when queue is full' },
                    { title: 'Review', desc: 'Review your configuration' }
                ];
                
                const toggleAgent = (id: string) => {
                    setSelectedAgents(prev => 
                        prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
                    );
                };

                return (
                    <div className="mockup-container mockup-wizard mockup-subflow">
                        {!subflowActive ? (
                            <>
                                <div className="mock-wizard-header">
                                    <div className="mock-breadcrumb">Create Template</div>
                                    <div className="mock-steps">
                                        <span className="mock-step active">1. Info & Settings</span>
                                        <span className="mock-step">2. Assign Groups</span>
                                    </div>
                                </div>
                                <div className="mock-wizard-content">
                                    <div className="mock-setting-row">
                                        <label>Display Name</label>
                                        <div className="mock-input">Acme Corp Template</div>
                                    </div>
                                    {subflowCompleted ? (
                                        <div className="mock-configured-setting">
                                            <div className="mock-configured-header">
                                                <Icon name="check-circle-filled" className="mock-configured-check" />
                                                <div className="mock-configured-info">
                                                    <span className="mock-configured-label">Call Queue Settings</span>
                                                    <span className="mock-configured-summary">
                                                        Support Queue · {selectedAgents.length} agents · Round Robin
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                className="mock-btn mock-btn-sm"
                                                onClick={() => {
                                                    setSubflowActive(true);
                                                    setSubflowStep(5);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <div 
                                            className="mock-setting-row clickable" 
                                            onClick={() => {
                                                setSubflowActive(true);
                                                setSubflowStep(1);
                                            }}
                                        >
                                            <label>Call Queue Settings</label>
                                            <div className="mock-input mock-input-action">
                                                <span>Configure (5 steps)</span>
                                                <Icon name="arrow-right-regular" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mock-wizard-footer">
                                    <button className="mock-btn mock-btn-ghost">Back</button>
                                    <button className="mock-btn mock-btn-primary">Next</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mock-wizard-header subflow">
                                    <div className="mock-breadcrumb-nested">
                                        <span 
                                            className="mock-parent-link" 
                                            onClick={() => {
                                                setSubflowActive(false);
                                            }}
                                        >
                                            <Icon name="arrow-left-regular" />
                                            Create Template
                                        </span>
                                        <span className="mock-separator">/</span>
                                        <span>Call Queue Settings</span>
                                    </div>
                                    <div className="mock-steps-labeled">
                                        {subflowSteps.map((step, i) => (
                                            <span 
                                                key={i}
                                                className={`mock-step-labeled ${i + 1 < subflowStep ? 'completed' : ''} ${i + 1 === subflowStep ? 'active' : ''}`}
                                                onClick={() => i + 1 <= subflowStep && setSubflowStep(i + 1)}
                                            >
                                                <span className="mock-step-num">{i + 1 < subflowStep ? '✓' : i + 1}</span>
                                                <span className="mock-step-name">{step.title}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mock-wizard-content subflow-content">
                                    <h3 className="subflow-title">{subflowSteps[subflowStep - 1].title}</h3>
                                    <p className="subflow-desc">{subflowSteps[subflowStep - 1].desc}</p>
                                    
                                    {subflowStep === 1 && (
                                        <div className="subflow-form">
                                            <div className="mock-setting-row">
                                                <label>Queue Name</label>
                                                <div className="mock-input">Support Queue</div>
                                            </div>
                                            <div className="mock-setting-row">
                                                <label>Description</label>
                                                <div className="mock-input">Primary support queue for customer inquiries</div>
                                            </div>
                                            <div className="mock-setting-row">
                                                <label>Language</label>
                                                <div className="mock-input">English (US)</div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {subflowStep === 2 && (
                                        <div className="subflow-form">
                                            <div className="mock-setting-row">
                                                <label>Routing Type</label>
                                                <div className="mock-radio-group">
                                                    <div className="mock-radio selected">
                                                        <span className="mock-radio-dot"></span>
                                                        <span>Round Robin</span>
                                                    </div>
                                                    <div className="mock-radio">
                                                        <span className="mock-radio-dot"></span>
                                                        <span>Longest Idle</span>
                                                    </div>
                                                    <div className="mock-radio">
                                                        <span className="mock-radio-dot"></span>
                                                        <span>Skills-based</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mock-setting-row">
                                                <label>Max Wait Time</label>
                                                <div className="mock-input">5 minutes</div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {subflowStep === 3 && (
                                        <div className="mock-agent-grid">
                                            {[
                                                { id: 'JD', name: 'John Doe' },
                                                { id: 'SM', name: 'Sarah Miller' },
                                                { id: 'MJ', name: 'Mike Johnson' },
                                                { id: 'AL', name: 'Amy Lee' },
                                                { id: 'RB', name: 'Robert Brown' },
                                                { id: 'EC', name: 'Emily Chen' }
                                            ].map(agent => (
                                                <div 
                                                    key={agent.id}
                                                    className={`mock-agent-card ${selectedAgents.includes(agent.id) ? 'selected' : ''}`}
                                                    onClick={() => toggleAgent(agent.id)}
                                                >
                                                    <div className="mock-avatar">{agent.id}</div>
                                                    <span>{agent.name}</span>
                                                    {selectedAgents.includes(agent.id) && (
                                                        <Icon name="check-regular" className="mock-agent-check" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {subflowStep === 4 && (
                                        <div className="subflow-form">
                                            <div className="mock-setting-row">
                                                <label>When queue is full</label>
                                                <div className="mock-input">Send to voicemail</div>
                                            </div>
                                            <div className="mock-setting-row">
                                                <label>After hours action</label>
                                                <div className="mock-input">Play closed message</div>
                                            </div>
                                            <div className="mock-setting-row">
                                                <label>Max queue size</label>
                                                <div className="mock-input">25 callers</div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {subflowStep === 5 && (
                                        <div className="subflow-review">
                                            <div className="mock-review-section">
                                                <h4>Queue Basics</h4>
                                                <div className="mock-review-grid">
                                                    <span className="mock-review-label">Name</span>
                                                    <span className="mock-review-value">Support Queue</span>
                                                    <span className="mock-review-label">Language</span>
                                                    <span className="mock-review-value">English (US)</span>
                                                </div>
                                            </div>
                                            <div className="mock-review-section">
                                                <h4>Routing</h4>
                                                <div className="mock-review-grid">
                                                    <span className="mock-review-label">Type</span>
                                                    <span className="mock-review-value">Round Robin</span>
                                                    <span className="mock-review-label">Max Wait</span>
                                                    <span className="mock-review-value">5 minutes</span>
                                                </div>
                                            </div>
                                            <div className="mock-review-section">
                                                <h4>Agents ({selectedAgents.length})</h4>
                                                <div className="mock-review-agents">
                                                    {selectedAgents.map(id => (
                                                        <span key={id} className="mock-agent-pill">{id}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mock-wizard-footer">
                                    <button 
                                        className="mock-btn mock-btn-ghost"
                                        onClick={() => {
                                            if (subflowStep > 1) {
                                                setSubflowStep(subflowStep - 1);
                                            } else {
                                                setSubflowActive(false);
                                            }
                                        }}
                                    >
                                        {subflowStep === 1 ? 'Cancel' : 'Back'}
                                    </button>
                                    <button 
                                        className="mock-btn mock-btn-primary"
                                        onClick={() => {
                                            if (subflowStep < 5) {
                                                setSubflowStep(subflowStep + 1);
                                            } else {
                                                setSubflowCompleted(true);
                                                setSubflowActive(false);
                                            }
                                        }}
                                    >
                                        {subflowStep === 5 ? 'Save & Return' : 'Next'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                );

            case 'preconfigure':
                return (
                    <div className="mockup-container mockup-wizard">
                        <div className="mock-wizard-header">
                            <div className="mock-breadcrumb">Create Template</div>
                            <div className="mock-steps">
                                <span className="mock-step active">1. Info & Settings</span>
                                <span className="mock-step">2. Assign Groups</span>
                            </div>
                        </div>
                        <div className="mock-wizard-content">
                            <div className="mock-setting-row">
                                <label>Display Name</label>
                                <div className="mock-input">Acme Corp Template</div>
                            </div>
                            <div className="mock-setting-row">
                                <label>Call Queue Configuration</label>
                                <div className="mock-dropdown">
                                    <div className="mock-dropdown-selected">
                                        <div className="mock-config-preview">
                                            <Icon name="queue-contact-regular" />
                                            <div className="mock-config-info">
                                                <span className="mock-config-name">Enterprise Support Queue</span>
                                                <span className="mock-config-meta">5 agents · Round Robin · 5 min wait</span>
                                            </div>
                                        </div>
                                        <Icon name="arrow-down-regular" />
                                    </div>
                                    <div className="mock-dropdown-menu">
                                        <div className="mock-dropdown-item selected">
                                            <Icon name="check-regular" />
                                            <span>Enterprise Support Queue</span>
                                        </div>
                                        <div className="mock-dropdown-item">
                                            <span className="mock-spacer"></span>
                                            <span>Sales Queue - West</span>
                                        </div>
                                        <div className="mock-dropdown-item">
                                            <span className="mock-spacer"></span>
                                            <span>Partner Escalation Queue</span>
                                        </div>
                                        <div className="mock-dropdown-divider"></div>
                                        <div className="mock-dropdown-item create-new">
                                            <Icon name="plus-regular" />
                                            <span>Create new configuration...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mock-info-banner">
                                <Icon name="info-circle-regular" />
                                <span>Queue configurations are managed in <a href="#">Settings → Call Queues</a></span>
                            </div>
                        </div>
                        <div className="mock-wizard-footer">
                            <button className="mock-btn mock-btn-ghost">Back</button>
                            <button className="mock-btn mock-btn-primary">Next</button>
                        </div>
                    </div>
                );

            case 'draft':
                return (
                    <div className="mockup-container mockup-wizard">
                        <div className="mock-wizard-header">
                            <div className="mock-breadcrumb">
                                Create Template
                                {draftSaved && <span className="mock-draft-badge">Draft saved</span>}
                            </div>
                            <div className="mock-steps">
                                <span className="mock-step active">1. Info & Settings</span>
                                <span className="mock-step">2. Assign Groups</span>
                            </div>
                        </div>
                        <div className="mock-wizard-content">
                            <div className="mock-setting-row">
                                <label>Display Name</label>
                                <div className="mock-input">Acme Corp Template</div>
                            </div>
                            <div className="mock-setting-row">
                                <label>Call Queue Settings</label>
                                <div 
                                    className="mock-input mock-input-action"
                                    onClick={() => setDraftSaved(true)}
                                >
                                    <span>Open full configuration</span>
                                    <Icon name="pop-out-regular" />
                                </div>
                            </div>
                            {draftSaved && (
                                <div className="mock-draft-notice">
                                    <Icon name="check-circle-regular" />
                                    <div>
                                        <strong>Draft auto-saved</strong>
                                        <p>Opening Call Queue configuration. You'll return here when done.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mock-wizard-footer">
                            <button className="mock-btn mock-btn-ghost">Back</button>
                            <button className="mock-btn mock-btn-primary">Next</button>
                        </div>
                    </div>
                );

            case 'tabbed':
                return (
                    <div className="mockup-container mockup-wizard">
                        <div className="mock-wizard-header">
                            <div className="mock-breadcrumb">Create Template</div>
                            <div className="mock-steps">
                                <span className="mock-step active">1. Info & Settings</span>
                                <span className="mock-step">2. Assign Groups</span>
                            </div>
                        </div>
                        <div className="mock-wizard-content tabbed">
                            <div className="mock-tabs">
                                {['General', 'Call Queue', 'Routing', 'Agents', 'Overflow'].map((tab, i) => (
                                    <button 
                                        key={tab}
                                        className={`mock-tab ${selectedTab === i ? 'active' : ''}`}
                                        onClick={() => setSelectedTab(i)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="mock-tab-content">
                                {selectedTab === 0 && (
                                    <>
                                        <div className="mock-setting-row">
                                            <label>Display Name</label>
                                            <div className="mock-input">Acme Corp Template</div>
                                        </div>
                                        <div className="mock-setting-row">
                                            <label>Time Zone</label>
                                            <div className="mock-input">America/Los_Angeles</div>
                                        </div>
                                    </>
                                )}
                                {selectedTab === 1 && (
                                    <>
                                        <div className="mock-setting-row">
                                            <label>Queue Name</label>
                                            <div className="mock-input">Support Queue</div>
                                        </div>
                                        <div className="mock-setting-row">
                                            <label>Max Wait Time</label>
                                            <div className="mock-input">5 minutes</div>
                                        </div>
                                    </>
                                )}
                                {selectedTab === 2 && (
                                    <>
                                        <div className="mock-setting-row">
                                            <label>Routing Type</label>
                                            <div className="mock-input">Round Robin</div>
                                        </div>
                                        <div className="mock-setting-row">
                                            <label>Skill-based Routing</label>
                                            <div className="mock-toggle">Disabled</div>
                                        </div>
                                    </>
                                )}
                                {selectedTab === 3 && (
                                    <div className="mock-agent-list-tab">
                                        <div className="mock-agent-row">
                                            <div className="mock-avatar sm">JD</div>
                                            <span>John Doe</span>
                                        </div>
                                        <div className="mock-agent-row">
                                            <div className="mock-avatar sm">SM</div>
                                            <span>Sarah Miller</span>
                                        </div>
                                    </div>
                                )}
                                {selectedTab === 4 && (
                                    <>
                                        <div className="mock-setting-row">
                                            <label>Overflow Action</label>
                                            <div className="mock-input">Send to Voicemail</div>
                                        </div>
                                        <div className="mock-setting-row">
                                            <label>After Hours</label>
                                            <div className="mock-input">Play message</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="mock-wizard-footer">
                            <button className="mock-btn mock-btn-ghost">Back</button>
                            <button className="mock-btn mock-btn-primary">Next</button>
                        </div>
                    </div>
                );

            case 'reference':
                return (
                    <div className="mockup-container mockup-reference">
                        {/* Main Wizard View */}
                        <div className={`mock-wizard-base ${libraryModalOpen ? 'dimmed' : ''}`}>
                            <div className="mock-wizard-header">
                                <div className="mock-breadcrumb">Create Template</div>
                                <div className="mock-steps">
                                    <span className="mock-step active">1. Info & Settings</span>
                                    <span className="mock-step">2. Assign Groups</span>
                                </div>
                            </div>
                            <div className="mock-wizard-content">
                                <div className="mock-setting-row">
                                    <label>Display Name</label>
                                    <div className="mock-input">Acme Corp Template</div>
                                </div>
                                <div className="mock-library-section">
                                    <div className="mock-library-header">
                                        <label>Call Queue Configuration</label>
                                        <button 
                                            className="mock-btn mock-btn-sm"
                                            onClick={() => setLibraryModalOpen(true)}
                                        >
                                            <Icon name="apps-regular" />
                                            Browse Library
                                        </button>
                                    </div>
                                    {selectedConfig ? (
                                        <div 
                                            className="mock-selected-config"
                                            onClick={() => setLibraryModalOpen(true)}
                                        >
                                            <div className="mock-selected-config-main">
                                                <Icon name="queue-contact-regular" />
                                                <div className="mock-selected-config-info">
                                                    <span className="mock-selected-config-name">{selectedConfig.name}</span>
                                                    <span className="mock-selected-config-meta">
                                                        {selectedConfig.agents} agents · {selectedConfig.routing} · {selectedConfig.waitTime} wait
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="mock-change-btn">Change</button>
                                        </div>
                                    ) : (
                                        <div 
                                            className="mock-no-config"
                                            onClick={() => setLibraryModalOpen(true)}
                                        >
                                            <Icon name="plus-regular" />
                                            <span>Select or create a configuration</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mock-wizard-footer">
                                <button className="mock-btn mock-btn-ghost">Back</button>
                                <button className="mock-btn mock-btn-primary">Next</button>
                            </div>
                        </div>

                        {/* Library Browser Modal */}
                        {libraryModalOpen && (
                            <div className="mock-library-modal">
                                <div className="mock-library-modal-header">
                                    <h3>Configuration Library</h3>
                                    <button 
                                        className="mock-close-btn"
                                        onClick={() => {
                                            setLibraryModalOpen(false);
                                            setPreviewConfigId(null);
                                            setCreateNewMode(false);
                                        }}
                                    >
                                        <Icon name="cancel-regular" />
                                    </button>
                                </div>
                                <div className="mock-library-modal-body">
                                    {/* Left: Config List */}
                                    <div className="mock-library-list">
                                        <div className="mock-library-search">
                                            <Icon name="search-regular" />
                                            <input type="text" placeholder="Search configurations..." />
                                        </div>
                                        <div className="mock-library-items">
                                            {libraryConfigs.map(config => (
                                                <div 
                                                    key={config.id}
                                                    className={`mock-library-item ${selectedConfigId === config.id ? 'selected' : ''} ${previewConfigId === config.id ? 'previewing' : ''}`}
                                                    onClick={() => setPreviewConfigId(config.id)}
                                                >
                                                    <div className="mock-library-item-icon">
                                                        <Icon name="queue-contact-regular" />
                                                    </div>
                                                    <div className="mock-library-item-info">
                                                        <span className="mock-library-item-name">{config.name}</span>
                                                        <span className="mock-library-item-meta">{config.agents} agents · {config.routing}</span>
                                                    </div>
                                                    {selectedConfigId === config.id && (
                                                        <Icon name="check-regular" className="mock-library-item-check" />
                                                    )}
                                                </div>
                                            ))}
                                            <div 
                                                className={`mock-library-item create-new ${createNewMode ? 'previewing' : ''}`}
                                                onClick={() => {
                                                    setPreviewConfigId(null);
                                                    setCreateNewMode(true);
                                                }}
                                            >
                                                <div className="mock-library-item-icon create">
                                                    <Icon name="plus-regular" />
                                                </div>
                                                <div className="mock-library-item-info">
                                                    <span className="mock-library-item-name">Create New Configuration</span>
                                                    <span className="mock-library-item-meta">Build from scratch</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Preview Panel */}
                                    <div className="mock-library-preview">
                                        {previewConfig && !createNewMode && (
                                            <>
                                                <div className="mock-preview-header">
                                                    <h4>{previewConfig.name}</h4>
                                                    <p>{previewConfig.description}</p>
                                                </div>
                                                <div className="mock-preview-details">
                                                    <div className="mock-preview-row">
                                                        <span className="mock-preview-label">Agents</span>
                                                        <span className="mock-preview-value">{previewConfig.agents}</span>
                                                    </div>
                                                    <div className="mock-preview-row">
                                                        <span className="mock-preview-label">Routing</span>
                                                        <span className="mock-preview-value">{previewConfig.routing}</span>
                                                    </div>
                                                    <div className="mock-preview-row">
                                                        <span className="mock-preview-label">Max Wait</span>
                                                        <span className="mock-preview-value">{previewConfig.waitTime}</span>
                                                    </div>
                                                    <div className="mock-preview-row">
                                                        <span className="mock-preview-label">Overflow</span>
                                                        <span className="mock-preview-value">{previewConfig.overflow}</span>
                                                    </div>
                                                </div>
                                                <div className="mock-preview-actions">
                                                    <button 
                                                        className="mock-btn mock-btn-primary"
                                                        onClick={() => {
                                                            setSelectedConfigId(previewConfig.id);
                                                            setLibraryModalOpen(false);
                                                            setPreviewConfigId(null);
                                                        }}
                                                    >
                                                        {selectedConfigId === previewConfig.id ? 'Selected' : 'Use This Configuration'}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                        {createNewMode && (
                                            <>
                                                <div className="mock-preview-header">
                                                    <h4>Create New Configuration</h4>
                                                    <p>This would open a full-page wizard to create a new call queue configuration from scratch.</p>
                                                </div>
                                                <div className="mock-create-new-options">
                                                    <div className="mock-create-option">
                                                        <Icon name="document-regular" />
                                                        <div>
                                                            <strong>Start from scratch</strong>
                                                            <span>Build a new configuration step by step</span>
                                                        </div>
                                                    </div>
                                                    <div className="mock-create-option">
                                                        <Icon name="copy-regular" />
                                                        <div>
                                                            <strong>Clone existing</strong>
                                                            <span>Duplicate and modify an existing config</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mock-preview-actions">
                                                    <button className="mock-btn mock-btn-primary">
                                                        <Icon name="pop-out-regular" />
                                                        Open Configuration Wizard
                                                    </button>
                                                </div>
                                                <div className="mock-create-note">
                                                    <Icon name="info-circle-regular" />
                                                    <span>Your template progress will be saved as a draft while you create the new configuration.</span>
                                                </div>
                                            </>
                                        )}
                                        {!previewConfig && !createNewMode && (
                                            <div className="mock-preview-empty">
                                                <Icon name="arrow-left-regular" />
                                                <span>Select a configuration to preview</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="ux-ideation-page">
            <div className="ideation-content">
                {/* Header */}
                <div className="ideation-header">
                    <div className="ideation-title-block">
                        <span className="ideation-eyebrow">UX Exploration</span>
                        <h1 className="ideation-title">Nested Wizard Patterns</h1>
                        <p className="ideation-subtitle">
                            Exploring solutions for configuring complex settings within a template creation wizard — 
                            without stacking modals on modals.
                        </p>
                    </div>
                </div>

                {/* Problem Statement */}
                <div className="problem-statement">
                    <div className="problem-icon">
                        <Icon name="warning-regular" />
                    </div>
                    <div className="problem-content">
                        <h3>The Problem</h3>
                        <p>
                            Partners create templates that apply settings to groups of customers. Some settings 
                            (like Call Queues) are complex and normally require a full-page modal wizard. But we 
                            can't open a full-page modal on top of the template creation wizard.
                        </p>
                    </div>
                </div>

                {/* Pattern Selector */}
                <div className="pattern-selector">
                    <h2>Explore Patterns</h2>
                    <div className="pattern-pills">
                        {patterns.map(pattern => (
                            <button
                                key={pattern.id}
                                className={`pattern-pill ${selectedPattern === pattern.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedPattern(pattern.id);
                                    setDrawerOpen(false);
                                    setSubflowActive(false);
                                    setExpandedInline(false);
                                    setDraftSaved(false);
                                    setLibraryModalOpen(false);
                                    setPreviewConfigId(null);
                                    setCreateNewMode(false);
                                    setSubflowStep(1);
                                    setSubflowCompleted(false);
                                }}
                            >
                                {pattern.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="ideation-grid">
                    {/* Mockup */}
                    <div className="mockup-section">
                        <div className="mockup-label">
                            <Icon name="play-regular" />
                            Interactive Preview
                        </div>
                        {renderMockup()}
                        <div className="mockup-hint">
                            <Icon name="handset-regular" />
                            Click interactive elements to see behavior
                        </div>
                    </div>

                    {/* Analysis */}
                    <div className="analysis-section">
                        <div className="pattern-header">
                            <h2>{currentPattern.title}</h2>
                            <p className="pattern-tagline">{currentPattern.tagline}</p>
                        </div>

                        <p className="pattern-description">{currentPattern.description}</p>

                        <div className="pros-cons">
                            <div className="pros">
                                <h4>
                                    <Icon name="check-circle-regular" />
                                    Pros
                                </h4>
                                <ul>
                                    {currentPattern.pros.map((pro, i) => (
                                        <li key={i}>{pro}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="cons">
                                <h4>
                                    <Icon name="cancel-regular" />
                                    Cons
                                </h4>
                                <ul>
                                    {currentPattern.cons.map((con, i) => (
                                        <li key={i}>{con}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="best-for">
                            <h4>
                                <Icon name="flag-regular" />
                                Best For
                            </h4>
                            <p>{currentPattern.bestFor}</p>
                        </div>
                    </div>
                </div>

                {/* Recommendation */}
                <div className="recommendation-section">
                    <h2>
                        <Icon name="sparkle-regular" />
                        Suggested Hybrid Approach
                    </h2>
                    <div className="recommendation-content">
                        <p>
                            Consider a <strong>tiered approach</strong> based on complexity:
                        </p>
                        <div className="recommendation-tiers">
                            <div className="tier">
                                <div className="tier-header">
                                    <span className="tier-badge simple">Simple</span>
                                    <span className="tier-label">3-5 fields</span>
                                </div>
                                <p>Use <strong>Inline Expansion</strong> — keeps flow tight and contextual</p>
                            </div>
                            <div className="tier">
                                <div className="tier-header">
                                    <span className="tier-badge medium">Medium</span>
                                    <span className="tier-label">6-15 fields</span>
                                </div>
                                <p>Use <strong>Side Drawer</strong> — dedicated space without losing wizard context</p>
                            </div>
                            <div className="tier">
                                <div className="tier-header">
                                    <span className="tier-badge complex">Complex</span>
                                    <span className="tier-label">Multi-step flows</span>
                                </div>
                                <p>Use <strong>Reference Library + Save & Navigate</strong> — encourage reuse, provide full-page when needed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UxIdeationPage;

