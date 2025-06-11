import React from "react";
import { Layout, Menu, Typography } from "antd";
import {
  HomeOutlined,
  PlayCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const location = useLocation();
  return (
    <Sider
      width={228}
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        paddingTop: 24,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Title
          level={4}
          style={{
            color: "#1890ff",
            letterSpacing: 1,
            margin: 0,
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
          }}
        >
          SRIKANDI
        </Title>
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          background: "#ffffff",
          border: "none",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <NavLink to="/">Home</NavLink>
        </Menu.Item>
        <Menu.Item key="/playlist" icon={<PlayCircleOutlined />}>
          <NavLink to="/playlist">Playlist</NavLink>
        </Menu.Item>
        <Menu.Item key="/about" icon={<InfoCircleOutlined />}>
          <NavLink to="/about">About</NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Navbar;
