import { useState, useRef } from 'react';
import { Card, Form, Button, Alert, Spinner, Image } from 'react-bootstrap';
import axios from 'axios';

const StyleTransfer = () => {
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [styleFile, setStyleFile] = useState<File | null>(null);
  const [alpha, setAlpha] = useState<number>(1.0);
  const [resultImage, setResultImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const contentInputRef = useRef<HTMLInputElement>(null);
  const styleInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null, type: 'content' | 'style') => {
    if (type === 'content') {
      setContentFile(file);
    } else {
      setStyleFile(file);
    }
  };

  const handleStyleTransfer = async () => {
    if (!contentFile || !styleFile) {
      setError('Please select both content and style images');
      return;
    }

    setLoading(true);
    setError('');
    setResultImage('');

    try {
      const formData = new FormData();
      formData.append('content_file', contentFile);
      formData.append('style_file', styleFile);

      const response = await axios.post(
        `/api/style/style-transfer?alpha=${alpha}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob'
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setResultImage(imageUrl);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        'Error connecting to style transfer service. Make sure the backend is running on port 8001.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setContentFile(null);
    setStyleFile(null);
    setResultImage('');
    setError('');
    if (contentInputRef.current) contentInputRef.current.value = '';
    if (styleInputRef.current) styleInputRef.current.value = '';
  };

  return (
    <div className="wide-layout">
      <div className="form-section">
        <Card className="custom-card">
          <Card.Header>
            <h4>🎨 Style Transfer</h4>
            <p className="mb-0 text-muted">
              Apply artistic styles to your images using AI
            </p>
          </Card.Header>
          <Card.Body>
            <Form>
              <div className="form-row-desktop">
                <div className="form-col-desktop">
                  <Form.Group className="mb-4">
                    <Form.Label>Content Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      ref={contentInputRef}
                      onChange={(e) => {
                        const files = (e.target as HTMLInputElement).files;
                        handleFileChange(files ? files[0] : null, 'content');
                      }}
                    />
                    {contentFile && (
                      <div className="mt-2">
                        <small className="text-success">✓ {contentFile.name}</small>
                      </div>
                    )}
                  </Form.Group>
                </div>
                <div className="form-col-desktop">
                  <Form.Group className="mb-4">
                    <Form.Label>Style Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      ref={styleInputRef}
                      onChange={(e) => {
                        const files = (e.target as HTMLInputElement).files;
                        handleFileChange(files ? files[0] : null, 'style');
                      }}
                    />
                    {styleFile && (
                      <div className="mt-2">
                        <small className="text-success">✓ {styleFile.name}</small>
                      </div>
                    )}
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-4">
                <Form.Label>Style Strength: {alpha.toFixed(1)}</Form.Label>
                <Form.Range
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                />
                <Form.Text className="text-muted">
                  0.1 = subtle style, 1.0 = full style transfer
                </Form.Text>
              </Form.Group>

              <div className="action-buttons">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStyleTransfer}
                  disabled={loading || !contentFile || !styleFile}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        className="me-2"
                      />
                      Processing...
                    </>
                  ) : (
                    'Apply Style Transfer'
                  )}
                </Button>
                <Button variant="outline-secondary" size="lg" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>

      <div className="result-section">
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {resultImage && (
          <Card className="custom-card">
            <Card.Header>
              <h5>🎨 Style Transfer Result</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <Image
                src={resultImage}
                alt="Style transfer result"
                fluid
                className="image-preview mb-3"
              />
              <div>
                <a
                  href={resultImage}
                  download="style_transfer_result.png"
                  className="btn btn-success btn-lg"
                >
                  📥 Download Result
                </a>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StyleTransfer;
