import { useState, useEffect } from "react";
import FadeDown from "../components/animations/FadeDown";
import Logo from "../components/ui/Logo";
import AuthModal from "../components/auth/AuthModal";

interface HeaderItem {
  name: string;
  id: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const headerList: HeaderItem[] = [
  { name: "Process", id: "process" },
  { name: "Benefits", id: "benefits" },
  { name: "Services", id: "services" },
  { name: "FAQ", id: "faq" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isBurgerActive, setIsBurgerActive] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check for existing auth token on component mount
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('authToken');
    }
  };

  const handleLogin = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('authToken', token);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    setIsDropdownOpen(false);
  };

  const toggleBurger = () => {
    setIsBurgerActive(!isBurgerActive);
  };

  return (
    <div className="relative" id="header">
      <FadeDown>
        <div className="mx-7 flex items-center justify-between rounded-3xl py-7 text-text">
          <Logo />
          <div className="hidden items-center gap-20 lg:flex">
            <div className="flex flex-row gap-10 font-normal">
              {headerList.map((item) => (
                <a
                  href={`#${item.id}`}
                  key={item.id}
                  className="cursor-pointer transition-all hover:text-gray-300"
                >
                  {item.name}
                </a>
              ))}
            </div>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-background font-medium hover:bg-opacity-90 transition-all"
                >
                  <div className="w-8 h-8 bg-background text-primary rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-bgCard border border-borderGray rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-lightGray border-b border-borderGray">
                        {user.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-text hover:bg-background transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleLogin('login')}
                  className="px-6 py-3 text-text border border-borderGray rounded-full hover:bg-bgCard transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => handleLogin('signup')}
                  className="h-[48px] px-6 bg-primary text-background rounded-full font-medium hover:bg-opacity-90 transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                toggleBurger();
              }}
              className="relative flex h-20 w-20 items-center justify-center"
              aria-label="Burger menu"
            >
              <div className="relative w-full">
                <div
                  className={`absolute left-1/2 h-[1px] w-[40%] -translate-x-1/2 transform bg-white transition-all duration-500 ${
                    isBurgerActive ? "top-0 rotate-45" : "-top-1.5"
                  }`}
                ></div>
                <div
                  className={`absolute left-1/2 h-[1px] w-[40%] -translate-x-1/2 transform bg-white transition-all duration-500 ${
                    isBurgerActive ? "top-0 -rotate-45" : "top-1.5"
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div
          className={`top-18 fixed right-0 z-50 h-screen w-full bg-background text-2xl text-white transition-transform duration-500 ease-in-out lg:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4"></div>
          <ul className="mx-8 flex flex-col items-start gap-8 font-normal">
            {headerList.map((item) => (
              <li key={item.id} className="w-full">
                <a
                  href={`#${item.id}`}
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    toggleBurger();
                  }}
                  className="cursor-pointer underline underline-offset-8 transition-all hover:text-primary"
                >
                  {item.name}
                </a>
              </li>
            ))}
            
            {user ? (
              <>
                <li className="w-full text-lg text-lightGray">
                  Welcome, {user.name}
                </li>
                <li className="w-full">
                  <button
                    onClick={handleLogout}
                    className="text-left underline underline-offset-8 transition-all hover:text-primary"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="w-full">
                  <button
                    onClick={() => {
                      handleLogin('login');
                      setIsMenuOpen(false);
                      toggleBurger();
                    }}
                    className="underline underline-offset-8 transition-all hover:text-primary"
                  >
                    Login
                  </button>
                </li>
                <li className="w-full">
                  <button
                    onClick={() => {
                      handleLogin('signup');
                      setIsMenuOpen(false);
                      toggleBurger();
                    }}
                    className="h-[56px] w-full bg-primary text-background rounded-full text-base font-extralight hover:bg-opacity-90 transition-all"
                  >
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </FadeDown>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}