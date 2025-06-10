import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Layout } from 'antd'
import Playlist from './pages/Playlist'
import Home from './pages/Home'

const { Content } = Layout

function App() {
  return (
    <Layout>
      <Navbar />
      <Layout style={{ marginLeft: 220, minHeight: '100vh' }}>
        <Content style={{ padding: '2rem', background: '#f5f5f5' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/about" element={<div>About Page</div>} />
          </Routes>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  )
}

export default App
