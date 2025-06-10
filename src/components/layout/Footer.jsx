import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ 
      textAlign: 'left',
      background: '#fff',
      padding: '16px',
      borderTop: '1px solid #f0f0f0',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <Text style={{ fontFamily: 'Poppins, sans-serif' }}>
        Made with <span style={{ color: '#1890ff' }}>❤</span> by SrikandiTeam
      </Text>
    </AntFooter>
  );
};

export default Footer;