import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { playlistService } from '../utils/api';

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const data = await playlistService.getAllPlaylists();
      setPlaylists(data);
    } catch (error) {
      message.error('Failed to fetch playlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      if (editingId) {
        await playlistService.updatePlaylist(editingId, formData);
        message.success('Playlist updated successfully');
      } else {
        await playlistService.createPlaylist(formData);
        message.success('Playlist created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchPlaylists();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await playlistService.deletePlaylist(id);
      message.success('Playlist deleted successfully');
      fetchPlaylists();
    } catch (error) {
      message.error('Failed to delete playlist');
    }
  };

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'play_thumbnail',
      key: 'thumbnail',
      render: (thumbnail) => (
        <img src={thumbnail} alt="thumbnail" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'play_name',
      key: 'name',
    },
    {
      title: 'Genre',
      dataIndex: 'play_genre',
      key: 'genre',
    },
    {
      title: 'Description',
      dataIndex: 'play_description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id_play);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure you want to delete this playlist?"
            onConfirm={() => handleDelete(record.id_play)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Playlist
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={playlists}
        rowKey="id_play"
        loading={loading}
      />

      <Modal
        title={editingId ? 'Edit Playlist' : 'Add Playlist'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="play_name"
            label="Name"
            rules={[{ required: true, message: 'Please input playlist name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="play_url"
            label="URL"
            rules={[{ required: true, message: 'Please input playlist URL!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="play_thumbnail"
            label="Thumbnail URL"
            rules={[{ required: true, message: 'Please input thumbnail URL!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="play_genre"
            label="Genre"
            rules={[{ required: true, message: 'Please input genre!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="play_description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Playlist;
