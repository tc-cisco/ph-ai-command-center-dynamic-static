import React, { useState } from 'react';
import { Icon } from '@momentum-design/components/react';
import './customerdetails.css';

// MDS Illustrations
import supportContactSvg from '@momentum-design/illustrations/dist/svg/support-contact-threetwozero-onboarding-quinary.svg';
import contactCenterSvg from '@momentum-design/illustrations/dist/svg/contacts-threetwozero-onboarding-quinary.svg';
import classroomSvg from '@momentum-design/illustrations/dist/svg/classroom-threetwozero-onboarding-quinary.svg';
import phoneServicesSvg from '@momentum-design/illustrations/dist/svg/phone-services-onetwozero-onboarding-quinary.svg';
import meetingsSvg from '@momentum-design/illustrations/dist/svg/meetings-threetwozero-onboarding-quinary.svg';
import callingSvg from '@momentum-design/illustrations/dist/svg/calling-threetwozero-onboarding-quinary.svg';
import supportMessageSvg from '@momentum-design/illustrations/dist/svg/support-message-threetwozero-onboarding-quinary.svg';

interface CustomerDetailsPageProps {
  customerId: number;
  onBack?: () => void;
}

const CustomerDetailsPage: React.FC<CustomerDetailsPageProps> = ({ customerId, onBack }) => {
  // Mock data - in a real app, this would fetch data based on customerId
  const mockCustomers = [
    { id: 1, name: 'Acme', orgId: '11111111-1111-1111-1111-111111111111', subscriptionType: 'IT subscription' },
    { id: 2, name: 'Axe Capital', orgId: '22222222-2222-2222-2222-222222222222', subscriptionType: 'IT subscription' },
    { id: 3, name: 'Bailey Building and Loan', orgId: '38f43035-1639-483b-80ab-eb2eb1534f41', subscriptionType: 'IT subscription' },
    { id: 4, name: 'Bayside High School', orgId: '44444444-4444-4444-4444-444444444444', subscriptionType: 'IT subscription' },
    { id: 5, name: 'Burn Industries', orgId: '55555555-5555-5555-5555-555555555555', subscriptionType: 'IT subscription' },
    { id: 6, name: 'Blue Hotel', orgId: '66666666-6666-6666-6666-666666666666', subscriptionType: 'IT subscription' },
    { id: 7, name: 'Cyberdyne Systems incorporated', orgId: '77777777-7777-7777-7777-777777777777', subscriptionType: 'IT subscription' },
    { id: 8, name: 'Delos Inc', orgId: '88888888-8888-8888-8888-888888888888', subscriptionType: 'IT subscription' },
    { id: 9, name: 'Dunder Mifflin, Inc.', orgId: '99999999-9999-9999-9999-999999999999', subscriptionType: 'IT subscription' },
    { id: 10, name: 'E Corp', orgId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', subscriptionType: 'IT subscription' },
    { id: 11, name: 'Fringe Division', orgId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', subscriptionType: 'IT subscription' },
    { id: 12, name: 'Gregarious Simulation', orgId: 'cccccccc-cccc-cccc-cccc-cccccccccccc', subscriptionType: 'IT subscription' },
    { id: 13, name: 'Globex', orgId: 'dddddddd-dddd-dddd-dddd-dddddddddddd', subscriptionType: 'IT subscription' },
    { id: 14, name: 'Initech', orgId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', subscriptionType: 'IT subscription' },
  ];

  const customer = mockCustomers.find(c => c.id === customerId) || mockCustomers[2]; // Default to Bailey Building and Loan if not found

  // Bayside High School has package quantity activated
  const hasPackageQuantity = customerId === 4;

  // State for packages and add-ons
  const [packages, setPackages] = useState({
    customerAssist: true,
    contactCenter: false,
    webexSuite: false,
    commonAreaCalling: false,
    webexMeetings: false,
    webexCalling: false,
    webexVoice: false
  });

  const [addOns, setAddOns] = useState({
    ciscoCallingPlan: false,
    attendantConsole: false,
    routeListCalls: true
  });

  const [maxConcurrentCalls, setMaxConcurrentCalls] = useState(50);

  const [packageQuantities, setPackageQuantities] = useState({
    customerAssist: 10,
    contactCenter: 5,
    webexSuite: 5,
    commonAreaCalling: 3,
    webexMeetings: 8,
    webexCalling: 15,
    webexVoice: 7
  });

  const hasSelectedPackage = Object.values(packages).some(v => v);

  const handleCopyOrgId = () => {
    navigator.clipboard.writeText(customer.orgId);
  };

  const handleRemoveSubscription = () => {
    console.log('Remove subscription');
  };

  return (
    <div className="customer-details-page">
      {/* Header with Customer Info */}
      <div className="customer-details-header">
        <button className="back-button" onClick={onBack}>
          <Icon name="arrow-left-regular" />
          <span>Customers</span>
        </button>
        <div className="header-divider" />
        <div className="customer-info-content">
          <div className="customer-info-left">
            <div className="customer-name-section">
              <h1 className="customer-name">{customer.name}</h1>
            </div>
            <div className="org-id-section">
              <p className="org-id-text">
                <span className="org-id-label">Org ID</span> {customer.orgId}
              </p>
              <button className="copy-button" onClick={handleCopyOrgId}>
                <Icon name="copy-regular" />
              </button>
            </div>
          </div>
          <div className="customer-info-right">
            <button className="secondary-button">
              Launch User Hub
            </button>
            <button className="primary-button">
              Launch Control Hub
            </button>
          </div>
        </div>
        <div className="tags-container">
          <div className="tag">
            <span>{customer.subscriptionType}</span>
            <button className="tag__remove" onClick={handleRemoveSubscription}>
              <Icon name="cancel-regular" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="customer-details-tabs">
        <button className="tab-button tab-button--active">Subscriptions</button>
        <button className="tab-button">Partner Administrators</button>
        <button className="tab-button">Tags</button>
        <button className="tab-button">Settings</button>
      </div>

      {/* Main Content */}
      <div className="customer-details-content">
        <div className="packages-card">
          <div className="card-header">
            <div className="card-title-row">
              <h2 className="card-title">Wholesale packages and add-ons</h2>
              {hasPackageQuantity && (
                <span className="package-limit-chip">Package limit activated</span>
              )}
            </div>
            <p className="card-description">
              Activate or deactivate your customer's Webex packages, and wait a few minutes between each package update. 
              Keep in mind that they aren't considered a Wholesale customer without at least one assigned package.
            </p>
          </div>
          <div className="packages-section">
            <div className="packages-grid">
            <div className="packages-column">
              <h3 className="section-title">Available packages</h3>
              <div className="package-cards">
                <div className={`selectable-card ${packages.customerAssist ? 'selected' : ''}`}>
                  <div className="selectable-input">
                    <input
                      type="checkbox"
                      id="customerAssist"
                      checked={packages.customerAssist}
                      onChange={(e) => setPackages(prev => ({
                        ...prev,
                        customerAssist: e.target.checked
                      }))}
                    />
                  </div>
                  <div className="media-container">
                    <img src={supportContactSvg} alt="Customer Assist" />
                  </div>
                  <div className="main-content">
                    <h4 className="card-title">Customer Assist</h4>
                    <p className="card-description">
                      Build a bridge between a customer's existing contact center and the broader business.
                    </p>
                    {packages.customerAssist && hasPackageQuantity && (
                      <div className="quantity-section">
                        <div className="quantity-input-group">
                          <label className="quantity-label">Quantity</label>
                          <input
                            type="number"
                            className="quantity-input"
                            value={packageQuantities.customerAssist}
                            onChange={(e) => setPackageQuantities(prev => ({
                              ...prev,
                              customerAssist: parseInt(e.target.value) || 1
                            }))}
                            min="1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`selectable-card ${packages.contactCenter ? 'selected' : ''}`}>
                  <div className="selectable-input">
                    <input
                      type="checkbox"
                      id="contactCenter"
                      checked={packages.contactCenter}
                      onChange={(e) => setPackages(prev => ({
                        ...prev,
                        contactCenter: e.target.checked
                      }))}
                    />
                  </div>
                  <div className="media-container">
                    <img src={contactCenterSvg} alt="Contact Center" />
                  </div>
                  <div className="main-content">
                    <h4 className="card-title">Contact Center</h4>
                    <p className="card-description">
                      Deliver exceptional customer experiences with our comprehensive contact center solution.
                    </p>
                    {packages.contactCenter && hasPackageQuantity && (
                      <div className="quantity-section">
                        <div className="quantity-input-group">
                          <label className="quantity-label">Quantity</label>
                          <input
                            type="number"
                            className="quantity-input"
                            value={packageQuantities.contactCenter}
                            onChange={(e) => setPackageQuantities(prev => ({
                              ...prev,
                              contactCenter: parseInt(e.target.value) || 1
                            }))}
                            min="1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`selectable-card ${packages.webexSuite ? 'selected' : ''}`}>
                  <div className="selectable-input">
                    <input
                      type="checkbox"
                      id="webexSuite"
                      checked={packages.webexSuite}
                      onChange={(e) => setPackages(prev => ({
                        ...prev,
                        webexSuite: e.target.checked
                      }))}
                    />
                  </div>
                  <div className="media-container">
                    <img src={classroomSvg} alt="Webex Suite" />
                  </div>
                  <div className="main-content">
                    <h4 className="card-title">Webex Suite</h4>
                    <p className="card-description">
                      Our premium enterprise suite for a powerful hybrid collaboration experience. The suite includes full Meeting, Messaging, Calling, and more.
                    </p>
                    {packages.webexSuite && hasPackageQuantity && (
                      <div className="quantity-section">
                        <div className="quantity-input-group">
                          <label className="quantity-label">Quantity</label>
                          <input
                            type="number"
                            className="quantity-input"
                            value={packageQuantities.webexSuite}
                            onChange={(e) => setPackageQuantities(prev => ({
                              ...prev,
                              webexSuite: parseInt(e.target.value) || 1
                            }))}
                            min="1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`selectable-card ${packages.commonAreaCalling ? 'selected' : ''}`}>
                  <div className="selectable-input">
                    <input
                      type="checkbox"
                      id="commonAreaCalling"
                      checked={packages.commonAreaCalling}
                      onChange={(e) => setPackages(prev => ({
                        ...prev,
                        commonAreaCalling: e.target.checked
                      }))}
                    />
                  </div>
                  <div className="media-container">
                    <img src={phoneServicesSvg} alt="Common Area Calling" />
                  </div>
                  <div className="main-content">
                    <h4 className="card-title">Common Area Calling</h4>
                    <p className="card-description">
                      Webex Calling for shared usage between phones. This is limited to a single device and not intended for individual users.
                    </p>
                    {packages.commonAreaCalling && hasPackageQuantity && (
                      <div className="quantity-section">
                        <div className="quantity-input-group">
                          <label className="quantity-label">Quantity</label>
                          <input
                            type="number"
                            className="quantity-input"
                            value={packageQuantities.commonAreaCalling}
                            onChange={(e) => setPackageQuantities(prev => ({
                              ...prev,
                              commonAreaCalling: parseInt(e.target.value) || 1
                            }))}
                            min="1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`selectable-card ${packages.webexMeetings ? 'selected' : ''}`}>
                  <div className="selectable-input">
                    <input
                      type="checkbox"
                      id="webexMeetings"
                      checked={packages.webexMeetings}
                      onChange={(e) => setPackages(prev => ({
                        ...prev,
                        webexMeetings: e.target.checked
                      }))}
                    />
                  </div>
                  <div className="media-container">
                    <img src={meetingsSvg} alt="Webex Meetings" />
                  </div>
                  <div className="main-content">
                    <h4 className="card-title">Webex Meetings</h4>
                    <p className="card-description">
                      Our powerful video conferences drives engaging meetings with intelligent automation and inclusive features.
                    </p>
                    {packages.webexMeetings && hasPackageQuantity && (
                      <div className="quantity-section">
                        <div className="quantity-input-group">
                          <label className="quantity-label">Quantity</label>
                          <input
                            type="number"
                            className="quantity-input"
                            value={packageQuantities.webexMeetings}
                            onChange={(e) => setPackageQuantities(prev => ({
                              ...prev,
                              webexMeetings: parseInt(e.target.value) || 1
                            }))}
                            min="1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`selectable-card ${packages.webexCalling ? 'selected' : ''}`}>
                  <div className="selectable-input">
                    <input
                      type="checkbox"
                      id="webexCalling"
                      checked={packages.webexCalling}
                      onChange={(e) => setPackages(prev => ({
                        ...prev,
                        webexCalling: e.target.checked
                      }))}
                    />
                  </div>
                  <div className="media-container">
                    <img src={callingSvg} alt="Webex Calling" />
                  </div>
                  <div className="main-content">
                    <h4 className="card-title">Webex Calling</h4>
                    <p className="card-description">
                      Our secure, reliable cloud phone system with powerful calling features across any devices, anywhere.
                    </p>
                    {packages.webexCalling && hasPackageQuantity && (
                      <div className="quantity-section">
                        <div className="quantity-input-group">
                          <label className="quantity-label">Quantity</label>
                          <input
                            type="number"
                            className="quantity-input"
                            value={packageQuantities.webexCalling}
                            onChange={(e) => setPackageQuantities(prev => ({
                              ...prev,
                              webexCalling: parseInt(e.target.value) || 1
                            }))}
                            min="1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`selectable-card ${packages.webexVoice ? 'selected' : ''}`}>
                  <div className="selectable-input">
                    <input
                      type="checkbox"
                      id="webexVoice"
                      checked={packages.webexVoice}
                      onChange={(e) => setPackages(prev => ({
                        ...prev,
                        webexVoice: e.target.checked
                      }))}
                    />
                  </div>
                  <div className="media-container">
                    <img src={supportMessageSvg} alt="Webex Voice" />
                  </div>
                  <div className="main-content">
                    <h4 className="card-title">Webex Voice</h4>
                    <p className="card-description">
                      Use your mobile phone, tablet, or desktop for the Webex App. You'll see call logs, the phone dialer, contacts, and more.
                    </p>
                    {packages.webexVoice && hasPackageQuantity && (
                      <div className="quantity-section">
                        <div className="quantity-input-group">
                          <label className="quantity-label">Quantity</label>
                          <input
                            type="number"
                            className="quantity-input"
                            value={packageQuantities.webexVoice}
                            onChange={(e) => setPackageQuantities(prev => ({
                              ...prev,
                              webexVoice: parseInt(e.target.value) || 1
                            }))}
                            min="1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="separator"></div>

            <div className="addons-column">
              <h3 className="section-title">Available add-ons</h3>
              <div className="addon-cards">
                <div className={`selectable-card addon-card ${!hasSelectedPackage ? 'disabled' : ''} ${addOns.ciscoCallingPlan ? 'selected' : ''}`}>
                  <div className="selectable-input">
                    <input
                      type="checkbox"
                      id="ciscoCallingPlan"
                      checked={addOns.ciscoCallingPlan}
                      disabled={!hasSelectedPackage}
                      onChange={(e) => setAddOns(prev => ({
                        ...prev,
                        ciscoCallingPlan: e.target.checked
                      }))}
                    />
                  </div>
                  <div className="main-content">
                    <h4 className="card-title">Cisco Calling Plan</h4>
                    <p className="card-description">
                      A bundled Cisco solution that simplifies the cloud calling experience with easy PSTN ordering.
                    </p>
                  </div>
                </div>

                <div className={`selectable-card addon-card ${!hasSelectedPackage ? 'disabled' : ''} ${addOns.attendantConsole ? 'selected' : ''}`}>
                  <div className="selectable-input">
                    <input
                      type="checkbox"
                      id="attendantConsole"
                      checked={addOns.attendantConsole}
                      disabled={!hasSelectedPackage}
                      onChange={(e) => setAddOns(prev => ({
                        ...prev,
                        attendantConsole: e.target.checked
                      }))}
                    />
                  </div>
                  <div className="main-content">
                    <h4 className="card-title">Attendant Console</h4>
                    <p className="card-description">
                      Simplify managing call status and direct them effectively to the appropriate department.
                    </p>
                  </div>
                </div>

                <div className={`selectable-card addon-card ${!hasSelectedPackage ? 'disabled' : ''} ${addOns.routeListCalls ? 'selected' : ''}`}>
                  <div className="selectable-input">
                    <input
                      type="checkbox"
                      id="routeListCalls"
                      checked={addOns.routeListCalls}
                      disabled={!hasSelectedPackage}
                      onChange={(e) => setAddOns(prev => ({
                        ...prev,
                        routeListCalls: e.target.checked
                      }))}
                    />
                  </div>
                  <div className="main-content">
                    <h4 className="card-title">Route List Calls</h4>
                    <p className="card-description">
                      Handle multiple calls and route them to the right teams.
                    </p>
                    {addOns.routeListCalls && (
                      <>
                        <div className="addon-divider" />
                        <div className="addon-input-section">
                          <label className="input-label">
                            Max concurrent calls<span className="required">*</span>
                          </label>
                          <input
                            type="number"
                            className="addon-input"
                            value={maxConcurrentCalls}
                            onChange={(e) => setMaxConcurrentCalls(parseInt(e.target.value) || 0)}
                            min="1"
                            max="10000"
                          />
                          <p className="input-help">Range: 1–10,000 calls</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;

