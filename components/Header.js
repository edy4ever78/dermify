'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/auth-context';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  
  useEffect(() => {
    // Setup scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu') && !event.target.closest('.mobile-menu-btn')) {
        setIsUserMenuOpen(false);
      }
      if (!event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-btn')) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg' : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text">
                Dermify
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1 xl:space-x-4">
              <Link href="/" className="px-2 xl:px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-200">
                {t('navigation.home')}
              </Link>
              <Link href="/products" className="px-2 xl:px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-200">
                {t('navigation.products')}
              </Link>
              <Link href="/ingredients" className="px-2 xl:px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-200">
                {t('navigation.ingredients')}
              </Link>
              <Link href="/skin-analysis" className="px-2 xl:px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-200">
                {t('navigation.skinAnalysis')}
              </Link>
              <Link href="/routines" className="px-2 xl:px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-200">
                {t('navigation.routines')}
              </Link>
            </div>
          </div>
          
          {/* Right section */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Auth Buttons - Desktop */}
            {isAuthenticated ? (
              <div className="relative user-menu hidden sm:block">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center overflow-hidden">
                    {user?.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs sm:text-sm font-bold text-teal-500">
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 
                         user?.firstName?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:inline-block truncate max-w-24 lg:max-w-32">
                    {user?.name || `${user?.firstName} ${user?.lastName}`}
                  </span>
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <Link href="/account/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      {t('navigation.profile')}
                    </Link>
                    {/* Developer access - only show for authorized emails */}
                    {(user?.email === 'admin@dermify.com' || user?.email === 'dev@dermify.com') && (
                      <Link href="/dev" className="block px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        🛠️ Developer
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t('navigation.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/signin" className="px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-200">
                  {t('navigation.login')}
                </Link>
                <Link href="/signup" className="flex items-center px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 transition-colors duration-200">
                  {t('navigation.signup')}
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="mobile-menu-btn p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, toggle based on menu state */}
      {isOpen && (
        <div className="lg:hidden mobile-menu bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-screen overflow-y-auto">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              {t('navigation.home')}
            </Link>
            <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              {t('navigation.products')}
            </Link>
            <Link href="/ingredients" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              {t('navigation.ingredients')}
            </Link>
            <Link href="/skin-analysis" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              {t('navigation.skinAnalysis')}
            </Link>
            <Link href="/routines" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              {t('navigation.routines')}
            </Link>
            
            {/* Mobile auth links */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-3 py-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center overflow-hidden mr-3">
                      {user?.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-teal-500">
                          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 
                           user?.firstName?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-base font-medium text-gray-900 dark:text-white truncate">
                      {user?.name || `${user?.firstName} ${user?.lastName}`}
                    </span>
                  </div>
                  <Link href="/account/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                    {t('navigation.profile')}
                  </Link>
                  {/* Developer access - only show for authorized emails */}
                  {(user?.email === 'admin@dermify.com' || user?.email === 'dev@dermify.com') && (
                    <Link href="/dev" className="block px-3 py-2 rounded-md text-base font-medium text-purple-600 dark:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      🛠️ Developer
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {t('navigation.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                    {t('navigation.login')}
                  </Link>
                  <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-teal-500 text-white hover:bg-teal-600 transition-colors duration-200 mt-2">
                    {t('navigation.signup')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
