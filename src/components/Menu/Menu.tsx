import React from 'react';
import type { MenuSection } from '../../types';
import './Menu.css';

interface MenuProps {
    currentSection: MenuSection;
    onSectionChange: (section: MenuSection) => void;
}

const Menu: React.FC<MenuProps> = ({ currentSection, onSectionChange }) => {
    return (
        <nav className="main-menu">
            <button
                className={`menu-item ${currentSection === 'home' ? 'active' : ''}`}
                onClick={() => onSectionChange('home')}
            >
                🏠 Home
            </button>


            <button
                className={`menu-item ${currentSection === 'faq-referendum' ? 'active' : ''}`}
                onClick={() => onSectionChange('faq-referendum')}
            >
                ✏️ Referendum
            </button>


            <button
                className={`menu-item ${currentSection === 'faq' ? 'active' : ''}`}
                onClick={() => onSectionChange('faq')}
            >
                ❓ FAQ
            </button>


            <button
                className={`menu-item ${currentSection === 'credits' ? 'active' : ''}`}
                onClick={() => onSectionChange('credits')}
            >
                ℹ️ Credits
            </button>
        </nav>
    );
};

export default Menu;