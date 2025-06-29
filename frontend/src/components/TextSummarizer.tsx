import { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

interface SummaryRequest {
  text: string;
  max_length?: number;
  min_length?: number;
}

interface SummaryResponse {
  summary: string;
}

const TextSummarizer = () => {
  const [text, setText] = useState<string>('');
  const [maxLength, setMaxLength] = useState<number>(100);
  const [minLength, setMinLength] = useState<number>(30);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const request: SummaryRequest = {
        text: text.trim(),
        max_length: maxLength,
        min_length: minLength
      };

      const response = await axios.post<SummaryResponse>(
        '/api/summarize/summarize',
        request
      );

      setSummary(response.data.summary);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        'Error connecting to summarization service. Make sure the backend is running on port 8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wide-layout">
      <div className="form-section">
        <Card className="custom-card">
          <Card.Header>
            <h4>📝 Text Summarization</h4>
            <p className="mb-0 text-muted">
              Enter text below and get an AI-generated summary
            </p>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-4">
                <Form.Label>Text to Summarize</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="custom-textarea"
                />
              </Form.Group>

              <div className="form-row-desktop">
                <div className="form-col-desktop">
                  <Form.Group className="mb-3">
                    <Form.Label>Min Length: {minLength} words</Form.Label>
                    <Form.Range
                      min={10}
                      max={50}
                      value={minLength}
                      onChange={(e) => setMinLength(parseInt(e.target.value))}
                    />
                  </Form.Group>
                </div>
                <div className="form-col-desktop">
                  <Form.Group className="mb-3">
                    <Form.Label>Max Length: {maxLength} words</Form.Label>
                    <Form.Range
                      min={50}
                      max={200}
                      value={maxLength}
                      onChange={(e) => setMaxLength(parseInt(e.target.value))}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="action-buttons">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSummarize}
                  disabled={loading || !text.trim()}
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
                      Summarizing...
                    </>
                  ) : (
                    'Generate Summary'
                  )}
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

        {summary && (
          <Card className="custom-card">
            <Card.Header>
              <h5>📄 Generated Summary</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-0">{summary}</p>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TextSummarizer;
