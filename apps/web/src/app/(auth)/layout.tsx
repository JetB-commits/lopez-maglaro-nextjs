'use client'
import React from 'react'
import '@/app/admin-styles.css' // Ensures admin styles like .card are available

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // This div will be a child of the <body> from the root layout.
    // It sets a background and centers its children (e.g., the login form page).
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh', 
      background: '#f4f7fa', // Consistent with admin pages' content background
      padding: '20px' // Give some space around the login form
    }}>
      {children}
    </div>
  )
}
