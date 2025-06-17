'use client'

import React from 'react'
import '@/app/admin-styles.css' // Re-use styles
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Helper component for NavLink to handle active state
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/'); // Handle sub-paths if necessary
  return (
    <Link href={href} className={`nav-link ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
};

export default function UserGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  let pageTitle = "ユーザーページ"; // Default title
  if (pathname === '/dashboard') {
    pageTitle = "ダッシュボード";
  } else if (pathname === '/chat') {
    pageTitle = "チャット";
  } else if (pathname === '/history') {
    pageTitle = "会話履歴";
  } else if (pathname === '/settings') {
    pageTitle = "アカウント設定";
  }
  // Add more page titles as needed

  return (
    <div className="wrapper">
      {/* User Sidebar */}
      <div className="main-sidebar sidebar-dark-primary">
        <div className="brand-link">
          <div className="admin-uchino-wrap"> {/* Using admin logo for now */}
            <img src="/admin-logo.png" alt="うちのAI" className="brand-image" />
            <span className="brand-text font-weight-light admin_utino_logo">
              <img src="/admin-logo-txt.png" alt="うちのAI" />
            </span>
          </div>
        </div>

        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column">
              <li className="nav-item">
                <NavLink href="/dashboard">
                  <p>ダッシュボード</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="/chat">
                  <p>テスト会話</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="/history">
                  <p>会話履歴</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="/settings">
                  <p>アカウント設定</p>
                </NavLink>
              </li>
              <li className="nav-item">
                {/* Assuming logout is handled by a link/button that triggers an API call or redirects */}
                <a href="/logout" className="nav-link"> 
                  <p>ログアウト</p>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">{pageTitle}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
