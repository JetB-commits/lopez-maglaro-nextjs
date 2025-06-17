'use client'

import React from 'react'

export default function NewsPage() {
  const newsItems = [
    {
      date: '2025.03.25',
      title: '一段階認証機能の実装につきまして',
      link: '#'
    },
    {
      date: '2024.12.12',
      title: '障害解消のお知らせ',
      link: '#'
    },
    {
      date: '2024.12.12',
      title: '障害情報',
      link: '#'
    },
    {
      date: '2024.07.29',
      title: '【重要】チャットログの保持期間変更のお知らせ',
      link: '#'
    },
    {
      date: '2024.07.24',
      title: 'メンテナンスのお知らせ',
      link: '#'
    },
    {
      date: '2024.07.22',
      title: '障害解消のお知らせ',
      link: '#'
    },
    {
      date: '2024.07.19',
      title: '障害情報',
      link: '#'
    },
    {
      date: '2024.04.18',
      title: '新機能のお知らせ：レポート機能を導入しました！',
      link: '#'
    },
    {
      date: '2024.04.15',
      title: '2024年 ゴールデンウィーク休業のお知らせ',
      link: '#'
    },
    {
      date: '2024.03.01',
      title: '500名の社会人を対象とした生成AIに対する意識調査レポートを公開しました。',
      link: '#'
    }
  ]

  return (
    <div className="card">
      <div className="card-body">
        <div id="news_area">
          <div className="cont">
            {newsItems.map((item, index) => (
              <div key={index} className="news_day_title">
                <div className="post_day">
                  <span className="text-dark release_date">{item.date}</span>
                </div>
                <div className="title">
                  <a href={item.link} className="text-dark" style={{ textDecoration: 'none' }}>
                    {item.title}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation">
          <ul className="news_nav">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&lsaquo;</span>
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">2</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&rsaquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
