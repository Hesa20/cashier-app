"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSignOutAlt, 
  faChevronDown,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function AccountInfo() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error('Error clearing storage:', e);
      }
      alert('Authentication Features will be developed soon');
      setShow(false);
      router.push('/');
    }
  };

  const handleRekap = () => {
    // Currently this is a placeholder — show same popup as logout
    alert('This Features will be developed soon');
    setShow(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  return (
    <div className="account-info-container" ref={containerRef}>
      <button
        className={`account-info-trigger ${show ? 'active' : ''}`}
        onClick={() => setShow(!show)}
        aria-expanded={show}
        aria-label="Account menu"
      >
        <div className="account-avatar">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div className="account-details">
          <div className="account-name">Hesa Firdaus</div>
          <div className="account-id">3124510076</div>
        </div>
        <div className={`account-dropdown-icon ${show ? 'rotated' : ''}`}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </button>

      {show && (
        <div className="account-dropdown-menu">
          <div
            className="account-dropdown-item rekap"
            onClick={handleRekap}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRekap();
              }
            }}
          >
            <FontAwesomeIcon icon={faChartLine} />
            <span>Rekap Penjualan</span>
          </div>

          <div
            className="account-dropdown-item logout"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogout();
              }
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Log out</span>
          </div>
        </div>
      )}
    </div>
  );
}
