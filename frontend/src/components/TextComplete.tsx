import { useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

interface CompletionRequest {
  prompt: string;
  max_new_tokens?: number;
}

interface MultiCompletionRequest extends CompletionRequest {
  num_sequences?: number;
}

interface CompletionResponse {
  completion: string;
}

interface MultiCompletionResponse {
  completions: string[];
}

const TextComplete = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [maxTokens, setMaxTokens] = useState<number>(50);
  const [numSequences, setNumSequences] = useState<number>(3);
  const [completions, setCompletions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [mode, setMode] = useState<'single' | 'multi'>('single');

  const handleComplete = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to complete');
      return;
    }

    setLoading(true);
    setError('');
    setCompletions([]);

    try {
      if (mode === 'single') {
        const request: CompletionRequest = {
          prompt: prompt.trim(),
          max_new_tokens: maxTokens
        };

        const response = await axios.post<CompletionResponse>(
          '/api/complete/complete',
          request
        );

        setCompletions([response.data.completion]);
      } else {
        const request: MultiCompletionRequest = {
          prompt: prompt.trim(),
          max_new_tokens: maxTokens,
          num_sequences: numSequences
        };

        const response = await axios.post<MultiCompletionResponse>(
          '/api/complete/multi-complete',
          request
        );

        setCompletions(response.data.completions);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        'Error connecting to text completion service. Make sure the backend is running on port 8002.'
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
            <h4>✍️ Text Completion</h4>
            <p className="mb-0 text-muted">
              Generate text continuations using AI (Bloom-560m model)
            </p>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-4">
                <Form.Label>Completion Mode</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="Single Completion"
                    name="mode"
                    id="single"
                    checked={mode === 'single'}
                    onChange={() => setMode('single')}
                  />
                  <Form.Check
                    type="radio"
                    label="Multiple Completions"
                    name="mode"
                    id="multi"
                    checked={mode === 'multi'}
                    onChange={() => setMode('multi')}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Prompt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter your text prompt here... (e.g., 'Il était une fois')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="custom-textarea"
                />
                <Form.Text className="text-muted">
                  The AI will continue your text from where you leave off
                </Form.Text>
              </Form.Group>

              <div className="form-row-desktop">
                <div className="form-col-desktop">
                  <Form.Group className="mb-4">
                    <Form.Label>Max New Tokens: {maxTokens}</Form.Label>
                    <Form.Range
                      min={20}
                      max={150}
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    />
                    <Form.Text className="text-muted">
                      Controls the length of generated text
                    </Form.Text>
                  </Form.Group>
                </div>
                {mode === 'multi' && (
                  <div className="form-col-desktop">
                    <Form.Group className="mb-4">
                      <Form.Label>Number of Completions: {numSequences}</Form.Label>
                      <Form.Range
                        min={2}
                        max={5}
                        value={numSequences}
                        onChange={(e) => setNumSequences(parseInt(e.target.value))}
                      />
                      <Form.Text className="text-muted">
                        Generate multiple different completions
                      </Form.Text>
                    </Form.Group>
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleComplete}
                  disabled={loading || !prompt.trim()}
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
                      Generating...
                    </>
                  ) : (
                    `Generate ${mode === 'single' ? 'Completion' : 'Completions'}`
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

        {completions.length > 0 && (
          <Card className="custom-card">
            <Card.Header>
              <h5>📝 Generated Text{completions.length > 1 ? 's' : ''}</h5>
            </Card.Header>
            <Card.Body>
              {completions.map((completion, index) => (
                <div key={index} className={`mb-3 ${index < completions.length - 1 ? 'border-bottom pb-3' : ''}`}>
                  {completions.length > 1 && (
                    <Badge bg="secondary" className="mb-2">
                      Option {index + 1}
                    </Badge>
                  )}
                  <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: '#f8f9fa', padding: '1rem', borderRadius: '0.375rem' }}>
                    {completion}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TextComplete;
