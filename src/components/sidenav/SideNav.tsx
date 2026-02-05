import React, { useCallback } from 'react'
import { SideNavigation, MenuSection, NavMenuItem, Icon } from '@momentum-design/components/react'
import './sidenav.css';

interface SideNavProps {
    isSideNavExpanded: boolean;
    setIsSideNavExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    currentPage: string;
    onPageChange: (page: string) => void;
}

const SideNav: React.FC<SideNavProps> = ({ isSideNavExpanded, setIsSideNavExpanded, currentPage, onPageChange }: SideNavProps) => {

    const handleSideNavToggle = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e: any) => {
            const newToggleState = e.detail.expanded;
            setIsSideNavExpanded(newToggleState);
        }, [setIsSideNavExpanded],
    );

    const handleNavItemClick = useCallback((page: string) => {
        onPageChange(page);
    }, [onPageChange]);

    return (
        <>
            <SideNavigation expanded={isSideNavExpanded} onToggle={handleSideNavToggle} variant="flexible" footerText="Circle USA" grabberBtnAriaLabel="Toggle Side navigation" parentNavTooltipText="Contains active navmenuitem" className="sidenav">
                <MenuSection slot="scrollable-menubar" showDivider>
                    <NavMenuItem 
                        iconName="home-regular" 
                        navId="home" 
                        label="Home"
                        active={currentPage === 'home'}
                        onClick={() => handleNavItemClick('home')}
                    ></NavMenuItem>
                    <NavMenuItem 
                        iconName="sparkle-filled" 
                        navId="labs" 
                        label="Labs"
                        active={currentPage === 'labs'}
                        onClick={() => handleNavItemClick('labs')}
                    ></NavMenuItem>
                    <NavMenuItem 
                        iconName="explore-regular" 
                        navId="ux-ideation" 
                        label="UX Ideation"
                        active={currentPage === 'ux-ideation'}
                        onClick={() => handleNavItemClick('ux-ideation')}
                    ></NavMenuItem>
                </MenuSection>
                <MenuSection slot="scrollable-menubar" showDivider headerText="Management">
                    <NavMenuItem 
                        iconName="handshake-regular" 
                        navId="customers" 
                        label="Customers"
                        active={currentPage === 'customers'}
                        onClick={() => handleNavItemClick('customers')}
                    ></NavMenuItem>
                    <NavMenuItem iconName="admin-regular" navId="admins" label="Administrators"></NavMenuItem>
                    <NavMenuItem iconName="user-regular" navId="account" label="Account"></NavMenuItem>
                    <NavMenuItem iconName="settings-regular" navId="settings" label="Settings"></NavMenuItem>
                    <NavMenuItem iconName="notes-regular" navId="help" label="Resources & Help"></NavMenuItem>
                    <NavMenuItem iconName="user-regular" navId="approvals" label="Approvals"></NavMenuItem>
                </MenuSection>
                <MenuSection slot="scrollable-menubar" showDivider headerText="Monitoring">
                    <NavMenuItem iconName="analysis-regular" navId="analytics" label="Analytics"></NavMenuItem>
                    <NavMenuItem iconName="file-spreadsheet-regular" navId="reports" label="Reports"></NavMenuItem>
                </MenuSection>
                <MenuSection slot="scrollable-menubar" headerText="Services">
                    <NavMenuItem iconName="cloud-regular" navId="cloud-services" label="Services"></NavMenuItem>
                </MenuSection>
                <Icon slot="brand-logo" name="company-regular"></Icon>
            </SideNavigation>
        </>
    );
};

export default SideNav;