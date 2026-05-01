import { useState, useRef, useCallback } from "react";
import {
  Typography,
  Button,
  Card,
  Select,
  Radio,
  Space,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import {
  FilePdfOutlined,
  UploadOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface UploadedFile {
  id: number;
  file: File;
  name: string;
  size: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function PdfMerge() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [filesPerPage, setFilesPerPage] = useState(2);
  const [pageSize, setPageSize] = useState("a4");
  const [layout, setLayout] = useState("vertical");
  const [orientation, setOrientation] = useState("portrait");
  const [merging, setMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    const pdfFiles = files.filter((f) => f.type === "application/pdf");
    if (pdfFiles.length === 0) {
      message.error("请上传PDF格式的文件");
      return;
    }
    const newFiles: UploadedFile[] = pdfFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: formatFileSize(file.size),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setMergedBlob(null);
  }, []);

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setMergedBlob(null);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return;
    setUploadedFiles((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(dragIndex, 1);
      arr.splice(dropIndex, 0, item);
      return arr;
    });
    setDragIndex(null);
  };

  const mergePDFs = async () => {
    if (uploadedFiles.length === 0) {
      message.warning("请至少上传一个PDF文件");
      return;
    }

    setMerging(true);
    setMergedBlob(null);

    try {
      const formData = new FormData();
      uploadedFiles.forEach((item, index) => {
        formData.append(`pdf_${index}`, item.file);
      });
      formData.append("filesPerPage", String(filesPerPage));
      formData.append("pageSize", pageSize);
      formData.append("layout", layout);
      formData.append("orientation", orientation);

      const response = await fetch("/api/merge-pdf", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.error || "合并失败,请检查文件格式");
      }

      if (!response.ok) {
        throw new Error("合并失败: HTTP " + response.status);
      }

      const blob = await response.blob();
      setMergedBlob(blob);
      message.success("PDF合并成功！");
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message.includes("Failed to fetch")
            ? "无法连接到服务器,请确保服务正在运行"
            : error.message
          : "合并失败,请重试";
      message.error(msg);
    } finally {
      setMerging(false);
    }
  };

  const downloadPDF = () => {
    if (!mergedBlob) return;
    const url = URL.createObjectURL(mergedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `merged_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setUploadedFiles([]);
    setMergedBlob(null);
  };

  const totalPages = Math.ceil(uploadedFiles.length / filesPerPage);

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
          padding: "80px 0",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={1} style={{ color: "#fff", marginBottom: 8 }}>
            PDF合并工具
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 18 }}>
            灵活合并多个PDF文件，支持自定义布局
          </Paragraph>
        </div>
      </section>

      {/* 工具主区域 */}
      <section style={{ padding: "80px 0", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Title level={3}>上传PDF文件</Title>
              <Text type="secondary">支持上传多个PDF文件，可拖拽调整顺序</Text>
            </div>

            {/* 上传区域 */}
            <Dragger
              accept=".pdf"
              multiple
              showUploadList={false}
              beforeUpload={(file) => {
                handleFiles([file]);
                return false;
              }}
              style={{ marginBottom: 20 }}
            >
              <p className="ant-upload-drag-icon">
                <FilePdfOutlined style={{ fontSize: 48, color: "#1677ff", opacity: 0.5 }} />
              </p>
              <p className="ant-upload-text">点击或拖拽上传PDF文件</p>
              <p className="ant-upload-hint">支持多个文件，建议不超过20个</p>
            </Dragger>

            {/* 文件列表 */}
            {uploadedFiles.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                {uploadedFiles.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      background: dragIndex === index ? "#e6f4ff" : "#fff",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      marginBottom: 8,
                      cursor: "move",
                      transition: "all 0.2s",
                    }}
                  >
                    <MenuOutlined style={{ fontSize: 20, color: "#999" }} />
                    <FilePdfOutlined style={{ fontSize: 28, color: "#ff4d4f" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.size}
                      </Text>
                    </div>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      {index + 1}
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => removeFile(index)}
                    />
                  </div>
                ))}
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    + 添加更多文件
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    hidden
                    onChange={(e) => {
                      if (e.target.files) handleFiles(Array.from(e.target.files));
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
            )}

            {/* 配置选项 */}
            <Card
              size="small"
              style={{ background: "#fafafa", marginBottom: 24 }}
              title="合并配置"
            >
              <Row gutter={[16, 20]}>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: 8, fontWeight: 600 }}>每页合并数量</div>
                  <Select
                    value={filesPerPage}
                    onChange={setFilesPerPage}
                    style={{ width: "100%" }}
                    options={Array.from({ length: 10 }, (_, i) => ({
                      value: i + 1,
                      label: `${i + 1}个文件/页`,
                    }))}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: 8, fontWeight: 600 }}>纸张大小</div>
                  <Radio.Group value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                    <Space direction="vertical">
                      <Radio value="a4">A4 (210×297mm)</Radio>
                      <Radio value="letter">Letter (216×279mm)</Radio>
                      <Radio value="auto">自动(根据内容)</Radio>
                    </Space>
                  </Radio.Group>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: 8, fontWeight: 600 }}>排列方式</div>
                  <Radio.Group value={layout} onChange={(e) => setLayout(e.target.value)}>
                    <Space direction="vertical">
                      <Radio value="grid">网格布局</Radio>
                      <Radio value="horizontal">水平排列</Radio>
                      <Radio value="vertical">垂直排列</Radio>
                    </Space>
                  </Radio.Group>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: 8, fontWeight: 600 }}>页面方向</div>
                  <Radio.Group value={orientation} onChange={(e) => setOrientation(e.target.value)}>
                    <Space direction="vertical">
                      <Radio value="portrait">纵向</Radio>
                      <Radio value="landscape">横向</Radio>
                    </Space>
                  </Radio.Group>
                </Col>
              </Row>
            </Card>

            {/* 操作按钮 */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Button
                type="primary"
                size="large"
                icon={<UploadOutlined />}
                loading={merging}
                disabled={uploadedFiles.length === 0}
                onClick={mergePDFs}
              >
                {merging ? "处理中..." : "开始合并"}
              </Button>
              <div style={{ marginTop: 12 }}>
                <Text type={uploadedFiles.length > 0 ? "success" : "secondary"}>
                  {uploadedFiles.length === 0
                    ? "请至少上传一个PDF文件"
                    : `已上传 ${uploadedFiles.length} 个文件，可以开始合并`}
                </Text>
              </div>
            </div>

            {/* 结果区域 */}
            {mergedBlob && (
              <Card
                style={{
                  background: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  textAlign: "center",
                }}
              >
                <CheckCircleOutlined
                  style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }}
                />
                <Title level={4}>合并成功!</Title>
                <Paragraph type="secondary">
                  共 {uploadedFiles.length} 个文件合并为 {totalPages} 页
                </Paragraph>
                <Space>
                  <Button
                    type="primary"
                    size="large"
                    icon={<DownloadOutlined />}
                    onClick={downloadPDF}
                  >
                    下载合并后的PDF
                  </Button>
                  <Button size="large" icon={<ReloadOutlined />} onClick={resetTool}>
                    重新合并
                  </Button>
                </Space>
              </Card>
            )}
          </Card>
        </div>
      </section>

      {/* 使用说明 */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 50 }}>
            使用说明
          </Title>
          <Row gutter={[24, 24]}>
            {[
              { step: 1, title: "上传PDF", desc: "点击上传或拖拽多个PDF文件，可拖拽调整顺序" },
              { step: 2, title: "配置选项", desc: "设置每页数量、纸张大小、排列方式等" },
              { step: 3, title: "合并下载", desc: "点击合并按钮，等待处理后下载结果" },
            ].map((item) => (
              <Col key={item.step} xs={24} md={8}>
                <Card hoverable style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: "bold",
                      margin: "0 auto 20px",
                    }}
                  >
                    {item.step}
                  </div>
                  <Title level={4}>{item.title}</Title>
                  <Text type="secondary">{item.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </>
  );
}
