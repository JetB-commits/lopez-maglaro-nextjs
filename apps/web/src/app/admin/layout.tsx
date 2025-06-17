'use client'

import React from 'react'
import '@/app/admin-styles.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="wrapper">
      <div className="main-sidebar sidebar-dark-primary">
        {/* サイドバー */}
        <div className="brand-link">
          <div className="admin-uchino-wrap">
            <img src="/admin-logo.png" alt="うちのAI" className="brand-image" />
            <span className="brand-text font-weight-light admin_utino_logo">
              <img src="/admin-logo-txt.png" alt="うちのAI" />
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
                <h1 className="m-0 text-dark">お知らせ</h1>
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
