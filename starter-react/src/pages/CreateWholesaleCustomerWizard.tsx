import React, { useState } from 'react';
import { Icon, Button, Appheader, Text } from '@momentum-design/components/react';
import './CreateWholesaleCustomerWizard.css';

// MDS Illustrations
import supportContactSvg from '@momentum-design/illustrations/dist/svg/support-contact-threetwozero-onboarding-quinary.svg';
import contactCenterSvg from '@momentum-design/illustrations/dist/svg/contacts-threetwozero-onboarding-quinary.svg';
import classroomSvg from '@momentum-design/illustrations/dist/svg/classroom-threetwozero-onboarding-quinary.svg';
import phoneServicesSvg from '@momentum-design/illustrations/dist/svg/phone-services-onetwozero-onboarding-quinary.svg';
import meetingsSvg from '@momentum-design/illustrations/dist/svg/meetings-threetwozero-onboarding-quinary.svg';
import callingSvg from '@momentum-design/illustrations/dist/svg/calling-threetwozero-onboarding-quinary.svg';
import supportMessageSvg from '@momentum-design/illustrations/dist/svg/support-message-threetwozero-onboarding-quinary.svg';

// Note: Icons now use Momentum Design System Icon component instead of hardcoded assets

interface CreateWholesaleCustomerWizardProps {
  onClose?: () => void;
}

const CreateWholesaleCustomerWizard: React.FC<CreateWholesaleCustomerWizardProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    legalOrganizationName: '',
    externalCustomerId: '',
    administratorEmail: '',
    businessVertical: '',
    countryOrRegion: '',
    template: '',
    verifyLocation: false,
    activatePackageQuantity: false,
    locationName: '',
    announcementLanguage: '',
    locationCountry: '',
    timezone: '',
    packages: {
      customerAssist: false,
      contactCenter: false,
      webexSuite: false,
      commonAreaCalling: false,
      webexMeetings: false,
      webexCalling: false,
      webexVoice: false
    },
    addOns: {
      ciscoCallingPlan: false,
      attendantConsole: false,
      routeListCalls: false
    },
    maxConcurrentCalls: 50,
    packageQuantities: {
      customerAssist: 1,
      contactCenter: 1,
      webexSuite: 1,
      commonAreaCalling: 1,
      webexMeetings: 1,
      webexCalling: 1,
      webexVoice: 1
    }
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Creating wholesale customer:', formData);
    // Handle form submission
  };

  const renderWizardStepper = () => (
    <div className="wizard-stepper">
      <div className="stepper-content">
        <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
          <div className="step-indicator">
            <div className="step-circle" />
          </div>
          <div className="step-label">
            <Text>Customer information</Text>
      </div>
        </div>

        <div className="step-bridge"></div>
        
        <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
          <div className="step-indicator">
            <div className="step-circle" />
          </div>
          <div className="step-label">
            <Text>Packages</Text>
          </div>
        </div>

        <div className="step-bridge"></div>
        
        <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
          <div className="step-indicator">
            <div className="step-circle" />
          </div>
          <div className="step-label">
            <Text>Headquarter's location</Text>
          </div>
        </div>

        <div className="step-bridge"></div>
        
        <div className={`step ${currentStep === 4 ? 'active' : ''}`}>
          <div className="step-indicator">
            <div className="step-circle" />
        </div>
          <div className="step-label">
            <Text>Review</Text>
        </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    // Check if at least one package is selected
    const hasSelectedPackage = Object.values(formData.packages).some(value => value);

    return (
      <div className="wizard-content">
        <div className="content-header">
          <h1 className="content-title">Packages and add-ons</h1>
          <p className="content-description">
            Select your customer's Webex packages and any available add-ons. You can always adjust their packages later, but removing the Cisco Calling Plan add-on requires deactivating their Calling packages.
          </p>
        </div>
        
        <div className="form-section">
          <div className="checkbox-group">
            <div className="checkbox">
              <input
                type="checkbox"
                id="activatePackageQuantity"
                checked={formData.activatePackageQuantity}
                onChange={(e) => handleInputChange('activatePackageQuantity', e.target.checked)}
              />
              <label htmlFor="activatePackageQuantity" className="checkbox-label">
                <span>Activate package quantity selection</span>
              </label>
            </div>
            <div className="help-text">
              <p>Enables quantity selection for all applicable packages and add-ons. Some add-ons may not require it. Once set, you can adjust quantities but can't return to unlimited.</p>
            </div>
          </div>

          <div className="packages-section">
            <div className="packages-grid">
              <div className="packages-column">
                <h3 className="section-title">Available packages</h3>
                <div className="package-cards">
                      <div className={`selectable-card ${formData.packages.customerAssist ? 'selected' : ''}`}>
                        <div className="selectable-input">
                          <input
                            type="checkbox"
                            id="customerAssist"
                            checked={formData.packages.customerAssist}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              packages: { ...prev.packages, customerAssist: e.target.checked }
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
                      {formData.packages.customerAssist && formData.activatePackageQuantity && (
                        <div className="quantity-section">
                          <div className="quantity-input-group">
                            <label className="quantity-label">Quantity</label>
                            <input
                              type="number"
                              className="quantity-input"
                              value={formData.packageQuantities.customerAssist}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                packageQuantities: {
                                  ...prev.packageQuantities,
                                  customerAssist: parseInt(e.target.value) || 1
                                }
                              }))}
                              min="1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`selectable-card ${formData.packages.contactCenter ? 'selected' : ''}`}>
                    <div className="selectable-input">
                      <input
                        type="checkbox"
                        id="contactCenter"
                        checked={formData.packages.contactCenter}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          packages: { ...prev.packages, contactCenter: e.target.checked }
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
                      {formData.packages.contactCenter && formData.activatePackageQuantity && (
                        <div className="quantity-section">
                          <div className="quantity-input-group">
                            <label className="quantity-label">Quantity</label>
                            <input
                              type="number"
                              className="quantity-input"
                              value={formData.packageQuantities.contactCenter}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                packageQuantities: {
                                  ...prev.packageQuantities,
                                  contactCenter: parseInt(e.target.value) || 1
                                }
                              }))}
                              min="1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`selectable-card ${formData.packages.webexSuite ? 'selected' : ''}`}>
                    <div className="selectable-input">
                      <input
                        type="checkbox"
                        id="webexSuite"
                        checked={formData.packages.webexSuite}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          packages: { ...prev.packages, webexSuite: e.target.checked }
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
                      {formData.packages.webexSuite && formData.activatePackageQuantity && (
                        <div className="quantity-section">
                          <div className="quantity-input-group">
                            <label className="quantity-label">Quantity</label>
                            <input
                              type="number"
                              className="quantity-input"
                              value={formData.packageQuantities.webexSuite}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                packageQuantities: {
                                  ...prev.packageQuantities,
                                  webexSuite: parseInt(e.target.value) || 1
                                }
                              }))}
                              min="1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`selectable-card ${formData.packages.commonAreaCalling ? 'selected' : ''}`}>
                    <div className="selectable-input">
                      <input
                        type="checkbox"
                        id="commonAreaCalling"
                        checked={formData.packages.commonAreaCalling}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          packages: { ...prev.packages, commonAreaCalling: e.target.checked }
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
                      {formData.packages.commonAreaCalling && formData.activatePackageQuantity && (
                        <div className="quantity-section">
                          <div className="quantity-input-group">
                            <label className="quantity-label">Quantity</label>
                            <input
                              type="number"
                              className="quantity-input"
                              value={formData.packageQuantities.commonAreaCalling}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                packageQuantities: {
                                  ...prev.packageQuantities,
                                  commonAreaCalling: parseInt(e.target.value) || 1
                                }
                              }))}
                              min="1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`selectable-card ${formData.packages.webexMeetings ? 'selected' : ''}`}>
                    <div className="selectable-input">
                      <input
                        type="checkbox"
                        id="webexMeetings"
                        checked={formData.packages.webexMeetings}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          packages: { ...prev.packages, webexMeetings: e.target.checked }
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
                      {formData.packages.webexMeetings && formData.activatePackageQuantity && (
                        <div className="quantity-section">
                          <div className="quantity-input-group">
                            <label className="quantity-label">Quantity</label>
                            <input
                              type="number"
                              className="quantity-input"
                              value={formData.packageQuantities.webexMeetings}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                packageQuantities: {
                                  ...prev.packageQuantities,
                                  webexMeetings: parseInt(e.target.value) || 1
                                }
                              }))}
                              min="1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`selectable-card ${formData.packages.webexCalling ? 'selected' : ''}`}>
                    <div className="selectable-input">
                      <input
                        type="checkbox"
                        id="webexCalling"
                        checked={formData.packages.webexCalling}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          packages: { ...prev.packages, webexCalling: e.target.checked }
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
                      {formData.packages.webexCalling && formData.activatePackageQuantity && (
                        <div className="quantity-section">
                          <div className="quantity-input-group">
                            <label className="quantity-label">Quantity</label>
                            <input
                              type="number"
                              className="quantity-input"
                              value={formData.packageQuantities.webexCalling}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                packageQuantities: {
                                  ...prev.packageQuantities,
                                  webexCalling: parseInt(e.target.value) || 1
                                }
                              }))}
                              min="1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`selectable-card ${formData.packages.webexVoice ? 'selected' : ''}`}>
                    <div className="selectable-input">
                      <input
                        type="checkbox"
                        id="webexVoice"
                        checked={formData.packages.webexVoice}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          packages: { ...prev.packages, webexVoice: e.target.checked }
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
                      {formData.packages.webexVoice && formData.activatePackageQuantity && (
                        <div className="quantity-section">
                          <div className="quantity-input-group">
                            <label className="quantity-label">Quantity</label>
                            <input
                              type="number"
                              className="quantity-input"
                              value={formData.packageQuantities.webexVoice}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                packageQuantities: {
                                  ...prev.packageQuantities,
                                  webexVoice: parseInt(e.target.value) || 1
                                }
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
                  <div className={`selectable-card addon-card ${!hasSelectedPackage ? 'disabled' : ''} ${formData.addOns.ciscoCallingPlan ? 'selected' : ''}`}>
                    <div className="selectable-input">
                      <input
                        type="checkbox"
                        id="ciscoCallingPlan"
                        checked={formData.addOns.ciscoCallingPlan}
                        disabled={!hasSelectedPackage}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          addOns: { ...prev.addOns, ciscoCallingPlan: e.target.checked }
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

                  <div className={`selectable-card addon-card ${!hasSelectedPackage ? 'disabled' : ''} ${formData.addOns.attendantConsole ? 'selected' : ''}`}>
                    <div className="selectable-input">
                      <input
                        type="checkbox"
                        id="attendantConsole"
                        checked={formData.addOns.attendantConsole}
                        disabled={!hasSelectedPackage}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          addOns: { ...prev.addOns, attendantConsole: e.target.checked }
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

                  <div className={`selectable-card addon-card ${!hasSelectedPackage ? 'disabled' : ''} ${formData.addOns.routeListCalls ? 'selected' : ''}`}>
                    <div className="selectable-input">
                      <input
                        type="checkbox"
                        id="routeListCalls"
                        checked={formData.addOns.routeListCalls}
                        disabled={!hasSelectedPackage}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          addOns: { ...prev.addOns, routeListCalls: e.target.checked }
                        }))}
                      />
                    </div>
                    <div className="main-content">
                      <h4 className="card-title">Route List Calls</h4>
                      <p className="card-description">
                        Handle multiple calls and route them to the right teams.
                      </p>
                      {formData.addOns.routeListCalls && (
                        <>
                          <div className="addon-divider" />
                          <div className="addon-input-section">
                            <label className="input-label">
                              Max concurrent calls<span className="required">*</span>
                            </label>
                            <input
                              type="number"
                              className="addon-input"
                              value={formData.maxConcurrentCalls}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                maxConcurrentCalls: parseInt(e.target.value) || 0
                              }))}
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
    );
  };

  const renderStep3 = () => (
    <div className="wizard-content">
      <div className="content-header">
        <h1 className="content-title">Headquarter's location</h1>
        <p className="content-description">
          Tell us your customer's main location for data residency (to store all user data, encryption keys, and more). Based on your customer's original onboarding location, we pre-selected their country.
        </p>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <div className="form-label">
            <span>Location name</span>
            <span className="required">*</span>
          </div>
          <div className="form-field">
            <input
              type="text"
              className="form-input"
              value={formData.locationName}
              onChange={(e) => handleInputChange('locationName', e.target.value)}
              placeholder="Enter location name"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <span>Announcement language</span>
            <span className="required">*</span>
          </div>
          <div className="form-field">
            <select
              className="form-select"
              value={formData.announcementLanguage}
              onChange={(e) => handleInputChange('announcementLanguage', e.target.value)}
            >
              <option value="">Select announcement language</option>
              <option value="en-US">English (United States)</option>
              <option value="en-GB">English (United Kingdom)</option>
              <option value="es-ES">Spanish (Spain)</option>
              <option value="fr-FR">French (France)</option>
              <option value="de-DE">German (Germany)</option>
              <option value="ja-JP">Japanese (Japan)</option>
              <option value="zh-CN">Chinese (Simplified)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <span>Country</span>
            <span className="required">*</span>
          </div>
          <div className="form-field">
            <select
              className="form-select"
              value={formData.locationCountry}
              onChange={(e) => handleInputChange('locationCountry', e.target.value)}
            >
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="ES">Spain</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <span>Address</span>
            <span className="required">*</span>
          </div>
          <div className="form-field">
            <input
              type="text"
              className="form-input"
              placeholder="Enter headquarters address"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <span>City</span>
            <span className="required">*</span>
          </div>
          <div className="form-field">
            <input
              type="text"
              className="form-input"
              placeholder="Enter city"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <span>State/Province</span>
            <span className="required">*</span>
          </div>
          <div className="form-field">
            <select className="form-select">
              <option value="">Select state/province</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <span>ZIP code</span>
            <span className="required">*</span>
          </div>
          <div className="form-field">
            <input
              type="text"
              className="form-input"
              placeholder="Enter ZIP code"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <span>Time zone</span>
            <span className="required">*</span>
          </div>
          <div className="form-field">
            <select
              className="form-select"
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
            >
              <option value="">Select a time zone</option>
              <option value="America/New_York">(GMT-5:00) America/New York</option>
              <option value="America/Chicago">(GMT-6:00) America/Chicago</option>
              <option value="America/Denver">(GMT-7:00) America/Denver</option>
              <option value="America/Los_Angeles">(GMT-8:00) America/Los Angeles</option>
              <option value="America/Anchorage">(GMT-9:00) America/Anchorage</option>
              <option value="Pacific/Honolulu">(GMT-10:00) Pacific/Honolulu</option>
              <option value="Europe/London">(GMT+0:00) Europe/London</option>
              <option value="Europe/Paris">(GMT+1:00) Europe/Paris</option>
              <option value="Europe/Berlin">(GMT+1:00) Europe/Berlin</option>
              <option value="Asia/Tokyo">(GMT+9:00) Asia/Tokyo</option>
              <option value="Asia/Shanghai">(GMT+8:00) Asia/Shanghai</option>
              <option value="Australia/Sydney">(GMT+11:00) Australia/Sydney</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="wizard-content">
      <div className="content-header">
        <h1 className="content-title">Here's what you'll set up</h1>
        <p className="content-description">
          Review your customer's information and subscription services.
        </p>
      </div>
      
      <div className="form-section">
        {/* Customer Information Section */}
        <div className="review-card">
          <div className="review-card-header">
            <div className="review-card-title">
              <div className="review-icon">
                <Icon name="user-regular" />
              </div>
              <h3>Customer information</h3>
            </div>
            <button className="edit-link" onClick={() => setCurrentStep(1)}>Go back and edit</button>
          </div>
          <div className="review-card-content">
            <div className="review-row">
              <div className="review-field">
                <span className="field-label">Legal company name</span>
                <span className="field-value">{formData.legalOrganizationName || 'Circle US'}</span>
              </div>
              <div className="review-field">
                <span className="field-label">Administrator email</span>
                <span className="field-value">{formData.administratorEmail || 'rutpart@circle.com'}</span>
              </div>
              <div className="review-field">
                <span className="field-label">External ID</span>
                <span className="field-value">{formData.externalCustomerId || '3423243'}</span>
              </div>
            </div>
            <div className="review-row">
              <div className="review-field">
                <span className="field-label">Template</span>
                <span className="field-value">{formData.template || 'Calling and messaging'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Packages and Add-ons Section */}
        <div className="review-card">
          <div className="review-card-header">
            <div className="review-card-title">
              <div className="review-icon">
                <Icon name="apps-regular" />
              </div>
              <h3>Packages and add-ons</h3>
            </div>
            <button className="edit-link" onClick={() => setCurrentStep(2)}>Go back and edit</button>
          </div>
          <div className="review-card-content">
            <div className="review-row">
              <div className="review-field">
                <span className="field-label">Selected packages</span>
                <span className="field-value">
                  {Object.entries(formData.packages)
                    .filter(([, value]) => value)
                    .map(([key], index, array) => {
                      const packageName = 
                        key === 'customerAssist' ? 'Customer Assist' :
                        key === 'contactCenter' ? 'Contact Center' :
                        key === 'webexSuite' ? 'Webex Suite' :
                        key === 'commonAreaCalling' ? 'Common Area Calling' :
                        key === 'webexMeetings' ? 'Webex Meetings' :
                        key === 'webexCalling' ? 'Webex Calling' :
                        key === 'webexVoice' ? 'Webex Voice' : key;
                      
                      const isLast = index === array.length - 1;
                      
                      return (
                        <React.Fragment key={key}>
                          {packageName}
                          {formData.activatePackageQuantity && (
                            <span className="quantity-text"> {formData.packageQuantities[key as keyof typeof formData.packageQuantities]}</span>
                          )}
                          {!isLast && ', '}
                        </React.Fragment>
                      );
                    })}
                  {Object.values(formData.packages).every(v => !v) && 'None'}
                </span>
              </div>
              <div className="review-field">
                <span className="field-label">Selected add-ons</span>
                <span className="field-value">
                  {Object.entries(formData.addOns)
                    .filter(([, value]) => value)
                    .map(([key], index, array) => {
                      const addonName = 
                        key === 'ciscoCallingPlan' ? 'Cisco Calling Plan' :
                        key === 'attendantConsole' ? 'Attendant Console' :
                        key === 'routeListCalls' ? 'Route List Calls' : key;
                      
                      const isLast = index === array.length - 1;
                      
                      return (
                        <React.Fragment key={key}>
                          {addonName}
                          {key === 'routeListCalls' && (
                            <span className="quantity-text"> {formData.maxConcurrentCalls} concurrent calls</span>
                          )}
                          {!isLast && ', '}
                        </React.Fragment>
                      );
                    })}
                  {Object.values(formData.addOns).every(v => !v) && 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Headquarter's Location Section */}
        <div className="review-card">
          <div className="review-card-header">
            <div className="review-card-title">
              <div className="review-icon">
                <Icon name="location-regular" />
              </div>
              <h3>Headquarter's location</h3>
            </div>
            <button className="edit-link" onClick={() => setCurrentStep(3)}>Go back and edit</button>
          </div>
          <div className="review-card-content">
            <div className="review-row">
              <div className="review-field">
                <span className="field-label">Location name</span>
                <span className="field-value">Circle US</span>
              </div>
              <div className="review-field">
                <span className="field-label">Country or region</span>
                <span className="field-value">United States of America</span>
              </div>
              <div className="review-field">
                <span className="field-label">Announcement language</span>
                <span className="field-value">English (United States)</span>
              </div>
            </div>
            <div className="review-row">
              <div className="review-field">
                <span className="field-label">Time zone</span>
                <span className="field-value">(GMT-7:00) America/Los An...</span>
              </div>
              <div className="review-field">
                <span className="field-label">Address</span>
                <div className="field-value address-value">
                  <div>9715 Circle way</div>
                  <div>Birmingham, AL</div>
                  <div>35201</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="wizard-content">
      <div className="content-header">
        <h1 className="content-title">Customer information</h1>
        <p className="content-description">
          Tell us about your new customer, starting with their email address and country code.
        </p>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <div className="form-label">
            <span>Legal organization name</span>
            <span className="required">*</span>
            <Icon name="help-circle-regular" className="info-icon" />
        </div>
          <div className="form-field">
            <input
              type="text"
              className="form-input"
              value={formData.legalOrganizationName}
              onChange={(e) => handleInputChange('legalOrganizationName', e.target.value)}
              placeholder="Enter organization name"
            />
          </div>
          </div>

          <div className="form-group">
          <div className="form-label">
            <span>External customer ID</span>
            <span className="required">*</span>
            <Icon name="help-circle-regular" className="info-icon" />
          </div>
          <div className="form-field">
            <input
              type="text"
              className="form-input"
              value={formData.externalCustomerId}
              onChange={(e) => handleInputChange('externalCustomerId', e.target.value)}
              placeholder="Enter external customer ID"
            />
          </div>
        </div>

          <div className="form-group">
          <div className="form-label">
            <span>Administrator email</span>
            <span className="required">*</span>
          </div>
          <div className="form-field">
            <input
              type="email"
              className="form-input"
              value={formData.administratorEmail}
              onChange={(e) => handleInputChange('administratorEmail', e.target.value)}
              placeholder="Enter administrator email address"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <span>Business vertical</span>
          </div>
          <div className="form-field">
            <select
              className="form-select"
              value={formData.businessVertical}
              onChange={(e) => handleInputChange('businessVertical', e.target.value)}
            >
              <option value="">Select a business vertical</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
            </select>
          </div>
          </div>

          <div className="form-group">
          <div className="form-label">
            <span>Country or region</span>
            <span className="required">*</span>
          </div>
          <div className="form-field">
            <select
              className="form-select"
              value={formData.countryOrRegion}
              onChange={(e) => handleInputChange('countryOrRegion', e.target.value)}
            >
              <option value="">Select a country or region</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="DE">Germany</option>
            </select>
          </div>
      </div>
      
        <div className="form-group">
          <div className="form-label">
            <span>Template</span>
            <span className="required">*</span>
            <Icon name="help-circle-regular" className="info-icon" />
          </div>
          <div className="form-field">
            <select
              className="form-select"
              value={formData.template}
              onChange={(e) => handleInputChange('template', e.target.value)}
            >
              <option value="">Select a template</option>
              <option value="standard">Standard Template</option>
              <option value="enterprise">Enterprise Template</option>
              <option value="custom">Custom Template</option>
            </select>
          </div>
        </div>

        <div className="checkbox-group">
          <div className="checkbox">
            <input
              type="checkbox"
              id="verifyLocation"
              checked={formData.verifyLocation}
              onChange={(e) => handleInputChange('verifyLocation', e.target.checked)}
            />
            <label htmlFor="verifyLocation" className="checkbox-label">
              <span>I verify that this customer is in a Cisco Webex</span>
              <span className="link">supported location</span>
              <Icon name="pop-out-regular" className="pop-out-icon" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="customer-info-modal">
      <Appheader className="modal-header">
        <div slot="leading" className="leadingSlot">
          <Text className="modal-title">Create Wholesale customer</Text>
              </div>
        <div slot="trailing" className="trailingSlot">
          <Button 
            variant="tertiary" 
            onClick={onClose} 
            aria-label="Close modal"
            size={32}
            prefixIcon="cancel-regular"
          />
        </div>
      </Appheader>
      
          {renderWizardStepper()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

      <div className="modal-footer">
        <div className="footer-actions">
          {currentStep === 1 ? (
            <Button 
              variant="secondary" 
              onClick={onClose}
              size={32}
            >
              Cancel
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              onClick={handlePrevious}
              size={32}
            >
              Back
            </Button>
          )}
          <Button 
            variant="primary" 
            onClick={currentStep === 4 ? handleSubmit : handleNext}
            size={32}
          >
            {currentStep === 4 ? 'Create customer' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWholesaleCustomerWizard;
