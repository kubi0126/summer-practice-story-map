import { useState, useEffect } from 'react';
import { NAV_LINKS } from '../utils/constants';

/**
 * 导航栏组件
 *
 * 行为：
 * - 页面顶部时背景透明
 * - 向下滚动后变为毛玻璃背景
 * - 移动端收起为汉堡菜单
 * - 点击导航项平滑滚动到对应 Section
 */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navClass = scrolled
    ? 'bg-white/85 backdrop-blur-lg shadow-sm'
    : 'bg-transparent';

  const textClass = scrolled ? 'text-text-main' : 'text-white';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className={`text-lg font-bold tracking-wide ${textClass}`}
          >
            🏔️ 西部实践
          </button>

          {/* PC 端导航 */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${scrolled
                    ? 'text-text-secondary hover:text-primary hover:bg-gray-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* 移动端汉堡菜单按钮 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg ${textClass}`}
            aria-label="菜单"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 移动端菜单 */}
        {mobileOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-lg mt-2 p-2 animate-in">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="block w-full text-left px-4 py-3 rounded-xl text-text-main hover:bg-gray-50 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
