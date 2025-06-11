import React from 'react';
import { Typography, Card } from 'antd';
import aboutImg from '../assets/about.jpg';

const { Title, Paragraph } = Typography;

const aboutText = `Kelompok Srikandi merupakan sebuah tim yang terdiri dari empat perempuan. Nama "Srikandi" diambil dari tokoh pewayangan yang dikenal sebagai simbol keberanian, kecerdasan, dan kepemimpinan wanita. Masing-masing anggota kelompok membawa keunikan, kemampuan, dan kontribusi tersendiri, tetapi tetap bersatu dalam semangat kolaborasi dan saling mendukung. Dengan latar belakang dan minat yang beragam, kelompok Srikandi menunjukkan bahwa perempuan mampu bersinar di berbagai bidang, termasuk dalam menyelesaikan tantangan akademik dan proyek-proyek yang kompleks. Semangat kerja sama, komunikasi yang solid, dan komitmen yang kuat menjadi kunci keberhasilan kelompok ini dalam mencapai tujuan bersama.`;

export default function About() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#fff',
      padding: 40,
      maxWidth: 1200,
      margin: '0 auto',
      borderRadius: 16,
      boxShadow: '0 4px 24px #e6e6e6',
      gap: 48,
      fontFamily: 'Poppins, sans-serif',
    }}>
      <div style={{ flex: '0 0 480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={aboutImg}
          alt="Kelompok Srikandi"
          style={{
            width: 460,
            height: 400,
            objectFit: 'cover',
            borderRadius: 18,
            boxShadow: '0 2px 16px #e6e6e6',
            maxWidth: '100%',
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Title level={1} style={{ fontWeight: 700, marginBottom: 18, fontFamily: 'Poppins, sans-serif' }}>Tentang Srikandi</Title>
        <Paragraph style={{ fontSize: 18, color: '#444', lineHeight: 1.7, fontFamily: 'Poppins, sans-serif', textAlign: 'justify' }}>{aboutText}</Paragraph>
      </div>
    </div>
  );
}
