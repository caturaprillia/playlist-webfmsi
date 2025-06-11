import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Input, Spin, Empty, Avatar, Drawer, Form, Button, Select, notification, Dropdown, Popconfirm } from 'antd';
import { PlusOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons';
import { playlistService } from '../utils/api';

const { Title, Text } = Typography;
const { Option } = Select;

const GENRES = ['Movie', 'Music', 'Song', 'Education', 'Others'];

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch playlist dari backend
  const fetchPlaylists = () => {
    setLoading(true);
    fetch('https://webfmsi.singapoly.com/api/playlist/37')
      .then(res => res.json())
      .then(data => {
        setPlaylists(data.datas || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // Kelompokkan playlist berdasarkan genre
  const grouped = GENRES.map((genre) => {
    // Urutkan items terbaru di depan
    const items = playlists
      .filter(
        (item) =>
          item.play_genre &&
          item.play_genre.toLowerCase() === genre.toLowerCase() &&
          (
            item.play_name.toLowerCase().includes(search.toLowerCase()) ||
            item.play_description.toLowerCase().includes(search.toLowerCase())
          )
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { genre, items };
  });

  // Fungsi untuk menghapus playlist
  const handleDelete = async (item) => {
    try {
      await playlistService.deletePlaylist(item.id_play);
      notification.success({
        message: 'Berhasil',
        description: 'Playlist berhasil dihapus.',
        placement: 'topRight',
      });
      setEditingItem(null);
      setDrawerOpen(false);
      form.resetFields();
      fetchPlaylists();
    } catch (err) {
      notification.error({
        message: 'Gagal',
        description: 'Gagal menghapus playlist. Coba lagi.',
        placement: 'topRight',
      });
    }
  };

  // Fungsi untuk submit form edit/tambah
  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        // Edit: POST ke /update/:id dengan FormData
        const formData = new FormData();
        formData.append('play_name', values.name);
        formData.append('play_description', values.description);
        formData.append('play_url', values.url);
        formData.append('play_genre', values.genre);
        formData.append('play_thumbnail', values.thumbnail);
        await playlistService.updatePlaylist(editingItem.id_play, formData);
        notification.success({
          message: 'Berhasil',
          description: 'Playlist berhasil diperbarui.',
          placement: 'topRight',
        });
      } else {
        // Tambah: POST ke /37 dengan FormData
        const formData = new FormData();
        formData.append('play_name', values.name);
        formData.append('play_description', values.description);
        formData.append('play_url', values.url);
        formData.append('play_genre', values.genre);
        formData.append('play_thumbnail', values.thumbnail);
        await playlistService.createPlaylist(formData);
        notification.success({
          message: 'Berhasil',
          description: 'Playlist berhasil ditambahkan.',
          placement: 'topRight',
        });
      }
      setDrawerOpen(false);
      form.resetFields();
      setEditingItem(null);
      fetchPlaylists();
    } catch (err) {
      notification.error({
        message: 'Gagal',
        description: 'Gagal menyimpan playlist. Coba lagi.',
        placement: 'topRight',
      });
    }
  };

  // Handle edit playlist
  const handleEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue({
      name: item.play_name,
      description: item.play_description,
      url: item.play_url,
      genre: item.play_genre,
      thumbnail: item.play_thumbnail,
    });
    setDrawerOpen(true);
  };

  // Jika ada card yang dibuka, tampilkan tampilan "Spotify style" untuk genre tersebut
  if (opened) {
    const genreData = grouped.find(g => g.genre === opened);
    return (
      <div style={{ padding: 40, background: '#fff', borderRadius: 12, minHeight: '100vh', maxWidth: 1600, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
          <button
            onClick={() => setOpened(null)}
            style={{
              background: '#1677ff',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              fontSize: 22,
              marginRight: 18,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #e6e6e6'
            }}
            aria-label="Back"
          >
            ←
          </button>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>{opened} Playlist</Title>
        </div>
        {genreData.items.length === 0 ? (
          <Empty description="Belum ada playlist" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div>
            {genreData.items.map((item) => (
              <div
                key={item.id_play}
                className="playlist-card-row"
                style={{
                  display: 'flex',
                  marginBottom: 32,
                  background: '#fff',
                  borderRadius: 18,
                  boxShadow: '0 2px 16px #e6e6e6',
                  overflow: 'hidden',
                  minHeight: 180,
                  position: 'relative'
                }}
                onMouseLeave={() => setMenuOpen(null)}
              >
                {/* Menu titik tiga */}
                <div
                  className="playlist-card-menu"
                  style={{
                    position: 'absolute',
                    top: 18,
                    right: 24,
                    zIndex: 2,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.85)',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setMenuOpen(item.id_play);
                  }}
                  onMouseEnter={() => setMenuOpen(item.id_play)}
                >
                  <MoreOutlined style={{ fontSize: 24, color: '#444' }} />
                  {menuOpen === item.id_play && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 36,
                        right: 0,
                        background: '#fff',
                        border: '1px solid #eee',
                        borderRadius: 8,
                        boxShadow: '0 2px 12px #e6e6e6',
                        minWidth: 120,
                        padding: '6px 0',
                        zIndex: 10
                      }}
                      onMouseLeave={() => setMenuOpen(null)}
                    >
                      <div
                        style={{
                          padding: '10px 18px',
                          cursor: 'pointer',
                          color: '#222',
                          fontWeight: 500,
                          fontSize: 15
                        }}
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </div>
                      <Popconfirm
                        title="Hapus playlist"
                        description="Apakah Anda yakin ingin menghapus playlist ini?"
                        onConfirm={() => handleDelete(item)}
                        okText="Ya"
                        cancelText="Tidak"
                      >
                        <div
                          style={{
                            padding: '10px 18px',
                            cursor: 'pointer',
                            color: '#e74c3c',
                            fontWeight: 500,
                            fontSize: 15
                          }}
                        >
                          Hapus
                        </div>
                      </Popconfirm>
                    </div>
                  )}
                </div>
                {/* Thumbnail */}
                <a
                  href={item.play_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: '0 0 320px',
                    width: 320,
                    height: 180,
                    background: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    border: 'none',
                  }}
                >
                  <img
                    src={item.play_thumbnail}
                    alt={item.play_name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </a>
                {/* Info */}
                <div style={{ flex: 1, padding: '20px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8, color: '#222' }}>
                    {item.play_name}
                  </div>
                  <div style={{ fontSize: 16, color: '#888', marginBottom: 10 }}>
                    {item.play_description}
                  </div>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 6 }}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Tombol + di pojok kanan bawah */}
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined style={{ fontSize: 28 }} />}
          size="large"
          style={{
            position: 'fixed',
            bottom: 40,
            right: 40,
            boxShadow: '0 2px 12px #e6e6e6',
            zIndex: 1000,
            background: '#1677ff',
            border: 'none',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setDrawerOpen(true)}
        />
        <Drawer
          title="Tambah Playlist"
          placement="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={400}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onFinishFailed={() => {
              notification.error({
                message: 'Gagal',
                description: 'Form belum lengkap. Silakan lengkapi semua field yang wajib diisi.',
                placement: 'topRight',
              });
            }}
          >
            <Form.Item label="Nama" name="name" rules={[{ required: true, message: 'Nama wajib diisi' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Deskripsi" name="description" rules={[{ required: true, message: 'Deskripsi wajib diisi' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="URL" name="url" rules={[{ required: true, message: 'URL wajib diisi' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Genre" name="genre" rules={[{ required: true, message: 'Genre wajib diisi' }]}>
              <Select>
                {GENRES.map(g => (
                  <Option key={g} value={g}>{g}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Thumbnail (URL gambar)" name="thumbnail" rules={[{ required: true, message: 'Thumbnail wajib diisi' }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Simpan
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    );
  }

  // Tampilan awal: 5 card genre, tampilkan thumbnail terbaru jika ada
  return (
    <div style={{ padding: 40, background: '#fff', borderRadius: 12, minHeight: '100vh', maxWidth: 1600, margin: '0 auto', position: 'relative' }}>
      <Title level={1} style={{ fontWeight: 700, marginBottom: 0 }}>
        Playlist
      </Title>
      <Input
        size="large"
        placeholder="what are you looking for?"
        prefix={<SearchOutlined />}
        style={{
          margin: '20px 0 40px 0',
          borderRadius: 10,
          maxWidth: 1300,
          minHeight: '6.5vh',
          boxShadow: '0 5px 8px #e6e6e6',
        }}
        value={search}
        onChange={e => setSearch(e.target.value)}
        allowClear
      />
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}><Spin size="large" /></div>
      ) : (
        <Row gutter={[32, 32]}>
          {grouped.map(({ genre, items }) => {
            // Ambil data terbaru genre ini (jika ada)
            const latest = items && items.length > 0 ? items[0] : null;
            return (
              <Col xs={24} sm={12} md={12} lg={6} xl={6} key={genre}>
                <Card
                  hoverable
                  onClick={() => setOpened(genre)}
                  style={{
                    borderRadius: 20,
                    minHeight: 280,
                    background: '#fff',
                    boxShadow: '0 4px 24px #e6e6e6',
                    cursor: 'pointer',
                    padding: 0,
                    border: 'none',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                  }}
                  bodyStyle={{
                    padding: 0,
                  }}
                >
                  {/* Gambar thumbnail */}
                  <div style={{
                    width: '100%',
                    height: 200,
                    background: '#f7fafd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {latest && latest.play_thumbnail ? (
                      <img
                        src={latest.play_thumbnail}
                        alt={latest.play_name || genre}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: '#eaf5ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#b3c6d9',
                        fontSize: 36,
                        fontWeight: 700,
                        letterSpacing: 2
                      }}>
                        {genre}
                      </div>
                    )}
                  </div>
                  {/* Judul */}
                  <div style={{ padding: '18px 18px 8px 18px' }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: 20,
                      marginBottom: 0,
                      color: '#222'
                    }}>
                      {genre}
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
      {/* Tombol + di pojok kanan bawah */}
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined style={{ fontSize: 28 }} />}
        size="large"
        style={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          boxShadow: '0 2px 12px #e6e6e6',
          zIndex: 1000,
          background: '#1677ff',
          border: 'none',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => setDrawerOpen(true)}
      />
      <Drawer
        title="Tambah Playlist"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={400}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={() => {
            notification.error({
              message: 'Gagal',
              description: 'Form belum lengkap. Silakan lengkapi semua field yang wajib diisi.',
              placement: 'topRight',
            });
          }}
        >
          <Form.Item label="Nama" name="name" rules={[{ required: true, message: 'Nama wajib diisi' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Deskripsi" name="description" rules={[{ required: true, message: 'Deskripsi wajib diisi' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="URL" name="url" rules={[{ required: true, message: 'URL wajib diisi' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Genre" name="genre" rules={[{ required: true, message: 'Genre wajib diisi' }]}>
            <Select>
              {GENRES.map(g => (
                <Option key={g} value={g}>{g}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Thumbnail (URL gambar)" name="thumbnail" rules={[{ required: true, message: 'Thumbnail wajib diisi' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

// Add this CSS at the end of the file
const styles = `
.playlist-card-row:hover .playlist-card-menu {
  opacity: 1 !important;
  pointer-events: auto;
}
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Playlist;
