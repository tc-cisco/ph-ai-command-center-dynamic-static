/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Avatar, Appheader, Button, Brandvisual, Toggle, Text } from '@momentum-design/components/react'
import { useLeftSection } from '../../contexts/LeftSectionContext'
import './header.css';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  setIsSideNavExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({setIsSideNavExpanded, theme, setTheme}: HeaderProps) => {
  const { setIsLeftSectionVisible } = useLeftSection();

  const handleSideNavToggle = () => {
    setIsSideNavExpanded((prevState: boolean) => !prevState);
    setIsLeftSectionVisible((prevState: boolean) => !prevState);
  };  

  const checked = theme === 'dark' ? true : false;

  const handleThemeToggle = (e: any) => {
    const newTheme = e.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <>
      <Appheader className="header">
        <div slot="leading" className="leadingSlot">
          <Button variant="tertiary" size={32} prefixIcon="list-menu-bold" aria-label="icon button" onClick={handleSideNavToggle}></Button>
          <div className='brandLogo'>
            <img 
              src="https://raw.githubusercontent.com/momentum-design/momentum-design/main/packages/assets/brand-visuals/src/logos/webex-suite-wordmark-light-partner-hub.svg" 
              alt="Partner Hub" 
              className="brand-logo-light"
            />
            <img 
              src="https://raw.githubusercontent.com/momentum-design/momentum-design/main/packages/assets/brand-visuals/src/logos/webex-suite-wordmark-dark-partner-hub.svg" 
              alt="Partner Hub" 
              className="brand-logo-dark"
            />
          </div>
        </div>
        <div slot="trailing" className="trailingSlot">
          <Text>{theme === "dark" ? "Dark" : "Light"}</Text>
          <Toggle checked={checked} onChange={handleThemeToggle} ></Toggle>
          <Button variant="tertiary" size={32} aria-label="assistant icon button" className="assistantButton">
            <Brandvisual slot="prefix" name="cisco-ai-assistant-color-gradient"></Brandvisual>
          </Button>
          <Avatar size={32} src="https://picsum.photos/id/8/5000/3333"></Avatar>
        </div>
      </Appheader>
    </>
  );
};

export default Header;