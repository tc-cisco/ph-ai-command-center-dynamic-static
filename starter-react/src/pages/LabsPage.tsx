import React, { useState } from 'react';
import { Text, Button, Icon } from '@momentum-design/components/react';
import './labs.css';

const LabsPage: React.FC = () => {
    const [experiment1Active, setExperiment1Active] = useState(false);
    const [experiment1Input, setExperiment1Input] = useState('');
    const [experiment1Output, setExperiment1Output] = useState('');
    
    const [experiment2Active, setExperiment2Active] = useState(false);
    const [experiment2Output, setExperiment2Output] = useState('');
    
    const [experiment3Active, setExperiment3Active] = useState(false);
    const [experiment3Input, setExperiment3Input] = useState('');
    const [experiment3Output, setExperiment3Output] = useState('');

    const handleExperiment1 = () => {
        setExperiment1Active(true);
        // Simulate AI processing
        setTimeout(() => {
            setExperiment1Output(`Based on the customer data for "${experiment1Input}", here's an AI-generated health score analysis:

• Overall Health: 78/100 (Good)
• Engagement Trend: ↑ 12% over last quarter
• Risk Factors: Low meeting attendance in past 2 weeks
• Recommendation: Schedule a check-in call to maintain engagement

Key Metrics:
- Active Users: 145/180 (80.5%)
- Feature Adoption: High (8/10 core features in use)
- Support Tickets: 3 open, average response time 2.1 hours
- License Utilization: 89%

Suggested Actions:
1. Send usage optimization tips
2. Invite to upcoming product webinar
3. Review unused licenses`);
            setExperiment1Active(false);
        }, 2000);
    };

    const handleExperiment2 = () => {
        setExperiment2Active(true);
        // Simulate AI processing
        setTimeout(() => {
            setExperiment2Output(`AI-Generated Customer Insights Report

📊 Top Trends Detected:
• 23% of enterprise customers show declining meeting usage
• Healthcare segment shows highest growth (+34% QoQ)
• 15 customers ready for upsell based on usage patterns

🎯 Opportunities Identified:
• 12 accounts using >95% of licenses (expansion ready)
• 8 customers would benefit from advanced calling features
• 5 customer groups have not completed onboarding

⚠️ At-Risk Accounts:
• TechFlow Solutions: 40% decrease in active users
• Meridian Healthcare: Support tickets up 200%
• BlueSky Technologies: No admin logins in 14 days

💡 AI Recommendations:
1. Launch targeted campaign for healthcare segment
2. Proactive outreach to at-risk accounts
3. Create optimization workshop for high-usage customers
4. Automated onboarding reminders for incomplete setups`);
            setExperiment2Active(false);
        }, 2500);
    };

    const handleExperiment3 = () => {
        setExperiment3Active(true);
        // Simulate AI processing
        setTimeout(() => {
            setExperiment3Output(`🤖 AI Assistant Response

I've drafted a personalized email for the customer group: "${experiment3Input}"

---

Subject: Maximizing Your Team's Collaboration Success

Hi [Customer Name],

I hope this message finds you well! I wanted to reach out because our analytics show some exciting opportunities to help your team get even more value from our platform.

What We've Noticed:
• Your team's collaboration has grown 24% over the past month
• Several power users are leveraging advanced features effectively
• There's potential to expand usage across 3 additional departments

Personalized Recommendations:
1. Schedule a 30-minute optimization session to unlock premium features
2. Explore our new AI-powered meeting insights (perfect for your use case)
3. Consider adding 15 licenses to accommodate your growing team

Quick Win:
Based on your usage patterns, enabling advanced calling features could save your team ~8 hours/week in communication overhead.

Would you be available for a brief call next week to discuss these opportunities?

Best regards,
[Your Name]

---

✨ AI Confidence Score: 92%
📧 Suggested Send Time: Tuesday 10am (optimal engagement window)
🎯 Predicted Response Rate: 68% based on customer engagement history`);
            setExperiment3Active(false);
        }, 2200);
    };

    return (
        <div className="labs-page">
            <div className="labs-header">
                <h1 className="page-title">Labs</h1>
                
                <div className="tab-navigation">
                    <div className="tab tab--active">
                        <Icon name="sparkle-filled" className="tab__icon" />
                        <span>AI Experiments</span>
                    </div>
                </div>
                
                <div className="labs-description">
                    Get early access to our latest AI-powered features. These experiments are in active development and we'd love your feedback!
                </div>
            </div>

            <div className="experiments-container">
                {/* AI Priority Tasks Card */}
                <div className="priority-tasks-card">
                    <div className="priority-tasks-header">
                        <h2 className="priority-tasks-title">Today's Priority Tasks</h2>
                        <span className="task-count">10 tasks</span>
                    </div>

                    <div className="simple-tasks-list">
                        <div className="simple-task-item">
                            <input type="checkbox" className="task-checkbox" id="task1" />
                            <label htmlFor="task1" className="task-label">
                                <span className="task-text">Address declining meeting quality for Acme Corporation</span>
                                <span className="task-badge high">High</span>
                            </label>
                        </div>

                        <div className="simple-task-item">
                            <input type="checkbox" className="task-checkbox" id="task2" />
                            <label htmlFor="task2" className="task-label">
                                <span className="task-text">Expand licenses for Global Tech Solutions</span>
                                <span className="task-badge high">High</span>
                            </label>
                        </div>

                        <div className="simple-task-item">
                            <input type="checkbox" className="task-checkbox" id="task3" />
                            <label htmlFor="task3" className="task-label">
                                <span className="task-text">Complete onboarding for Meridian Healthcare</span>
                                <span className="task-badge high">High</span>
                            </label>
                        </div>

                        <div className="simple-task-item">
                            <input type="checkbox" className="task-checkbox" id="task4" />
                            <label htmlFor="task4" className="task-label">
                                <span className="task-text">Schedule QBR with Stellar Enterprises</span>
                                <span className="task-badge medium">Medium</span>
                            </label>
                        </div>

                        <div className="simple-task-item">
                            <input type="checkbox" className="task-checkbox" id="task5" />
                            <label htmlFor="task5" className="task-label">
                                <span className="task-text">Optimize license allocation for BlueSky Technologies</span>
                                <span className="task-badge medium">Medium</span>
                            </label>
                        </div>

                        <div className="simple-task-item">
                            <input type="checkbox" className="task-checkbox" id="task6" />
                            <label htmlFor="task6" className="task-label">
                                <span className="task-text">Introduce advanced features to Nexus Financial Group</span>
                                <span className="task-badge medium">Medium</span>
                            </label>
                        </div>

                        <div className="simple-task-item">
                            <input type="checkbox" className="task-checkbox" id="task7" />
                            <label htmlFor="task7" className="task-label">
                                <span className="task-text">Share best practices with Quantum Systems Inc</span>
                                <span className="task-badge low">Low</span>
                            </label>
                        </div>

                        <div className="simple-task-item">
                            <input type="checkbox" className="task-checkbox" id="task8" />
                            <label htmlFor="task8" className="task-label">
                                <span className="task-text">Send product update to Apex Manufacturing</span>
                                <span className="task-badge low">Low</span>
                            </label>
                        </div>

                        <div className="simple-task-item">
                            <input type="checkbox" className="task-checkbox" id="task9" />
                            <label htmlFor="task9" className="task-label">
                                <span className="task-text">Request feedback from Horizon Media Group</span>
                                <span className="task-badge low">Low</span>
                            </label>
                        </div>

                        <div className="simple-task-item">
                            <input type="checkbox" className="task-checkbox" id="task10" />
                            <label htmlFor="task10" className="task-label">
                                <span className="task-text">Update contact info for Pinnacle Industries</span>
                                <span className="task-badge low">Low</span>
                            </label>
                        </div>
                    </div>

                    <div className="priority-tasks-footer">
                        <span className="tasks-note">🤖 AI-generated • Refreshed daily</span>
                    </div>
                </div>

                {/* Experiment 1: Smart Customer Health Score */}
                <div className="experiment-card">
                    <div className="experiment-header">
                        <div className="experiment-title-row">
                            <Icon name="analysis-regular" className="experiment-icon" />
                            <h2 className="experiment-title">Smart Customer Health Score</h2>
                        </div>
                        <div className="experiment-status experiment-status--beta">
                            <span>Beta</span>
                        </div>
                    </div>
                    
                    <p className="experiment-description">
                        Enter a customer name and our AI will analyze their engagement patterns, usage metrics, and predict potential risks or opportunities.
                    </p>

                    <div className="experiment-interaction">
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="experiment-input"
                                placeholder="Enter customer name (e.g., Acme Corporation)"
                                value={experiment1Input}
                                onChange={(e) => setExperiment1Input(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && experiment1Input && handleExperiment1()}
                            />
                            <Button 
                                variant="primary" 
                                size={32}
                                onClick={handleExperiment1}
                                disabled={!experiment1Input || experiment1Active}
                            >
                                {experiment1Active ? 'Analyzing...' : 'Analyze Health'}
                            </Button>
                        </div>

                        {experiment1Output && (
                            <div className="experiment-output">
                                <pre className="output-text">{experiment1Output}</pre>
                            </div>
                        )}
                    </div>

                    <div className="experiment-footer">
                        <span className="experiment-note">
                            💡 This AI model uses historical data, engagement patterns, and predictive analytics
                        </span>
                    </div>
                </div>

                {/* Experiment 2: Automated Insights Generator */}
                <div className="experiment-card">
                    <div className="experiment-header">
                        <div className="experiment-title-row">
                            <Icon name="lightbulb-regular" className="experiment-icon" />
                            <h2 className="experiment-title">Automated Insights Generator</h2>
                        </div>
                        <div className="experiment-status experiment-status--alpha">
                            <span>Alpha</span>
                        </div>
                    </div>
                    
                    <p className="experiment-description">
                        Generate a comprehensive AI-powered insights report across all your customers. Discover trends, opportunities, and risks automatically.
                    </p>

                    <div className="experiment-interaction">
                        <Button 
                            variant="primary" 
                            size={40}
                            onClick={handleExperiment2}
                            disabled={experiment2Active}
                            className="generate-button"
                        >
                            {experiment2Active ? (
                                <>
                                    <Icon name="spinner-regular" className="spinning" />
                                    Generating Insights...
                                </>
                            ) : (
                                <>
                                    <Icon name="sparkle-filled" />
                                    Generate Insights Report
                                </>
                            )}
                        </Button>

                        {experiment2Output && (
                            <div className="experiment-output">
                                <pre className="output-text">{experiment2Output}</pre>
                            </div>
                        )}
                    </div>

                    <div className="experiment-footer">
                        <span className="experiment-note">
                            🔬 Analyzes customer behavior patterns, usage trends, and business opportunities
                        </span>
                    </div>
                </div>

                {/* Experiment 3: AI Email Composer */}
                <div className="experiment-card">
                    <div className="experiment-header">
                        <div className="experiment-title-row">
                            <Icon name="email-regular" className="experiment-icon" />
                            <h2 className="experiment-title">AI Email Composer</h2>
                        </div>
                        <div className="experiment-status experiment-status--experimental">
                            <span>Experimental</span>
                        </div>
                    </div>
                    
                    <p className="experiment-description">
                        Generate personalized, context-aware emails for customer outreach. The AI considers customer history, usage patterns, and engagement data.
                    </p>

                    <div className="experiment-interaction">
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="experiment-input"
                                placeholder="Enter customer group or scenario (e.g., Healthcare customers)"
                                value={experiment3Input}
                                onChange={(e) => setExperiment3Input(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && experiment3Input && handleExperiment3()}
                            />
                            <Button 
                                variant="primary" 
                                size={32}
                                onClick={handleExperiment3}
                                disabled={!experiment3Input || experiment3Active}
                            >
                                {experiment3Active ? 'Composing...' : 'Compose Email'}
                            </Button>
                        </div>

                        {experiment3Output && (
                            <div className="experiment-output">
                                <pre className="output-text">{experiment3Output}</pre>
                                <div className="output-actions">
                                    <Button variant="secondary" size={32}>Copy to Clipboard</Button>
                                    <Button variant="secondary" size={32}>Refine with Feedback</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="experiment-footer">
                        <span className="experiment-note">
                            ✍️ AI-generated emails based on customer data and best practices
                        </span>
                    </div>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="feedback-section">
                <h3 className="feedback-title">Help Us Improve</h3>
                <p className="feedback-description">
                    These experiments are evolving based on your feedback. Let us know what works and what doesn't!
                </p>
                <div className="feedback-buttons">
                    <Button variant="secondary" size={40}>
                        <Icon name="chat-regular" />
                        Share Feedback
                    </Button>
                    <Button variant="secondary" size={40}>
                        <Icon name="help-circle-regular" />
                        Request a Feature
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LabsPage;

