import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Input,
  FloatButton,
  Spin,
  Empty,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://webfmsi.singapoly.com/api/playlist/37")
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data.datas || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = playlists.filter(
    (item) =>
      item.play_name.toLowerCase().includes(search.toLowerCase()) ||
      item.play_description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        padding: 40,
        background: "#fff",
        borderRadius: 12,
        minHeight: "100vh",
        maxWidth: 1600,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <Title level={1} style={{ fontWeight: 700, marginBottom: 0 }}>
        Home
      </Title>

      <Input
        size="large"
        placeholder="what are you looking for?"
        prefix={<SearchOutlined />}
        style={{ margin: '20px 0 40px 0', borderRadius: 10, maxWidth: 1300, minHeight: '6.5vh', boxShadow: '0 5px 8px #e6e6e6' }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
      />
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Spin size="large" />
        </div>
      ) : filtered.length === 0 ? (
        <Empty description="No Playlist Found" style={{ marginTop: 40 }} />
      ) : (
        <Row gutter={[24, 32]}>
          {filtered.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={item.id_play}>
              <Card
                hoverable
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px #e6e6e6",
                  minHeight: 290,
                  textAlign: "left",
                }}
                cover={
                  <a
                    href={item.play_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt={item.play_name}
                      src={item.play_thumbnail}
                      style={{
                        height: 180,
                        width: "100%",
                        objectFit: "cover",
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        cursor: "pointer",
                      }}
                    />
                  </a>
                }
                bodyStyle={{
                  background: "#fff",
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  padding: 18,
                }}
              >
                <Text
                  strong
                  style={{ fontSize: 18, display: "block", marginBottom: 4 }}
                >
                  {item.play_name}
                </Text>
                <Text type="secondary" style={{ fontSize: 15 }}>
                  {item.play_description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Home;
