'use client'

import type { Metadata } from "next";
import React from 'react'
import '@/app/admin-styles.css'
import { usePathname } from 'next/navigation'; // Import usePathname

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAdminLoginPage = pathname === '/admin/login'; // Adjust if your admin login path is different

  if (isAdminLoginPage) {
    // Render a minimal layout for the admin login page (no sidebar)
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f4f7fa',
        padding: '20px'
      }}>
        {children}
      </div>
    );
  }

  // Render the standard admin layout with sidebar for other admin pages
  return (
    <div className="wrapper">
      <div className="main-sidebar sidebar-dark-primary">
        {/* サイドバー */}
        <div className="brand-link">
          <div className="admin-uchino-wrap">
            <img src="/admin-logo.svg" alt="うちのAI" className="brand-image" />
            <span className="brand-text font-weight-light admin_utino_logo">
              <img src="/admin-logo-txt.svg" alt="うちのAI" />
            </span>
          </div>
        </div>

        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column">
              <li className="nav-item" id="news-nav">
                <a href="/admin/news" className="nav-link active">
                  <p>お知らせ</p>
                </a>
              </li>
              <li className="nav-item" id="testai-nav">
                <a href="/admin/testai" className="nav-link">
                  <p>テスト会話</p>
                </a>
              </li>
              <li className="nav-item" id="history-nav">
                <a href="/admin/history" className="nav-link">
                  <p>会話履歴</p>
                </a>
              </li>
              <li className="nav-item" id="learning-nav">
                <a href="/admin/learning" className="nav-link">
                  <p>学習データ</p>
                </a>
              </li>
              <li className="nav-item" id="profile-nav">
                <a href="/admin/profile" className="nav-link">
                  <p>プロフィール</p>
                </a>
              </li>
              <li className="nav-item" id="logout-nav">
                <a href="/logout" className="nav-link">
                  <p>ログアウト</p>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                {/* Update title dynamically based on page if needed */}
                <h1 className="m-0 text-dark">管理画面</h1> 
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
