import './App.css'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LabsPage from './pages/LabsPage'
import CustomersPage from './pages/CustomersPage'
import CustomerDetailsPage from './pages/CustomerDetailsPage'
import CreateWholesaleCustomerWizard from './pages/CreateWholesaleCustomerWizard'
import UxIdeationPage from './pages/UxIdeationPage'
import '@momentum-design/fonts/dist/css/fonts.css';
import '@momentum-design/tokens/dist/css/components/complete.css';
import { ThemeProvider, IconProvider } from '@momentum-design/components/react'
import { LeftSectionProvider } from './contexts/LeftSectionContext'
import { useState } from 'react';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [currentPage, setCurrentPage] = useState<string>('home')
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)

  const handlePageChange = (page: string, customerId?: number) => {
    setCurrentPage(page)
    if (customerId !== undefined) {
      setSelectedCustomerId(customerId)
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'labs':
        return <LabsPage />
      case 'ux-ideation':
        return <UxIdeationPage />
      case 'customers':
        return <CustomersPage onPageChange={handlePageChange} />
      case 'customer-details':
        return selectedCustomerId ? (
          <CustomerDetailsPage 
            customerId={selectedCustomerId} 
            onBack={() => setCurrentPage('customers')} 
          />
        ) : (
          <CustomersPage onPageChange={handlePageChange} />
        )
      case 'create-wholesale-customer':
        return <CreateWholesaleCustomerWizard onClose={() => setCurrentPage('customers')} />
      default:
        return <HomePage />
    }
  }

  return (
    <LeftSectionProvider>
      <ThemeProvider themeclass={`mds-theme-stable-${theme}Webex`}>
        <IconProvider iconSet='momentum-icons'>
          {currentPage === 'create-wholesale-customer' ? (
            <CreateWholesaleCustomerWizard onClose={() => setCurrentPage('customers')} />
          ) : (
            <MainLayout 
              theme={theme} 
              setTheme={setTheme}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            >
              {renderCurrentPage()}
            </MainLayout>
          )}
        </IconProvider>
      </ThemeProvider>
    </LeftSectionProvider>
  )
}

export default App
