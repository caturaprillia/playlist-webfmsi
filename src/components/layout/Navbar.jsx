import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  PlayCircleOutlined,
  SettingOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const location = useLocation();
  return (
    <Sider
      width={220}
      style={{
        minHeight: '100vh',
        background: '#1a1a1a',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        paddingTop: 24,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={4} style={{ color: '#fff', letterSpacing: 1, margin: 0 }}>
          SRIKANDI PLAYLIST
        </Title>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ background: '#1a1a1a', border: 'none' }}
      >
        <Menu.Item key="/" icon={<PlayCircleOutlined />}>
          <NavLink to="/">Playlist</NavLink>
        </Menu.Item>
        <Menu.Item key="/manage" icon={<SettingOutlined />}>
          <NavLink to="/manage">Manage Playlist</NavLink>
        </Menu.Item>
        <Menu.Item key="/history" icon={<HistoryOutlined />}>
          <NavLink to="/history">History</NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Navbar;