import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import App from './App'
import './index.css'

const convexUrl = import.meta.env.VITE_CONVEX_URL

// Only create the Convex client if a URL is provided
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null

function Root() {
  if (!convex) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', color: '#e4e4ed' }}>⚠️ Convex Not Configured</h1>
        <p style={{ color: '#8888a0', maxWidth: '500px' }}>
          To get started, run <code style={{ color: '#10b981', background: '#12121a', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>npx convex dev</code> in the <code style={{ color: '#ff6b35' }}>packages/backend</code> directory, then add your Convex URL to <code style={{ color: '#ff6b35' }}>.env.local</code>
        </p>
        <pre style={{ 
          background: '#12121a', 
          padding: '1rem', 
          borderRadius: '8px', 
          color: '#8888a0',
          fontSize: '0.875rem'
        }}>
          VITE_CONVEX_URL=https://your-deployment.convex.cloud
        </pre>
      </div>
    )
  }

  return (
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
