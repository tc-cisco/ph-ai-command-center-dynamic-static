import React from 'react';
import Header from '../components/header/Header';
import SideNavigation from '../components/sidenav/SideNav';
import { useState } from 'react';
import './mainlayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, theme, setTheme, currentPage, onPageChange }) => {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false)
  return (
    <div className="background-base">
      <div className="background">
        <Header setIsSideNavExpanded={setIsSideNavExpanded} theme={theme} setTheme={setTheme} />
        <div className="main-layout">
          <SideNavigation 
            isSideNavExpanded={isSideNavExpanded} 
            setIsSideNavExpanded={setIsSideNavExpanded}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
          <main>
            {/* NOTE: This is where the main content of the page will be rendered */}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
