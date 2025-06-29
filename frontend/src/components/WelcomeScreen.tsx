import { Card, Button, Row, Col } from 'react-bootstrap';

interface WelcomeScreenProps {
  onServiceSelect: (service: string) => void;
}

const WelcomeScreen = ({ onServiceSelect }: WelcomeScreenProps) => {
  return (
    <div className="welcome-screen">
      <Card className="welcome-card text-center">
        <Card.Body className="p-5">
          <h1 className="display-4 mb-4">🧠 Deep Learning API Hub</h1>
          <p className="lead mb-5">
            Welcome to our comprehensive AI services platform! Choose from three powerful 
            deep learning services to enhance your content and creativity.
          </p>
          
          <Row className="g-4">
            <Col md={4}>
              <Card className="service-card h-100" onClick={() => onServiceSelect('summarize')}>
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="service-icon mb-3">📝</div>
                  <h5>Text Summarizer</h5>
                  <p className="text-muted mb-4">
                    Transform long texts into concise, meaningful summaries using advanced AI.
                  </p>
                  <Button variant="primary" size="lg" className="mt-auto">
                    Try Text Summarizer
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="service-card h-100" onClick={() => onServiceSelect('style')}>
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="service-icon mb-3">🎨</div>
                  <h5>Style Transfer</h5>
                  <p className="text-muted mb-4">
                    Apply artistic styles to your images with neural style transfer technology.
                  </p>
                  <Button variant="success" size="lg" className="mt-auto">
                    Try Style Transfer
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="service-card h-100" onClick={() => onServiceSelect('complete')}>
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="service-icon mb-3">✍️</div>
                  <h5>Text Completion</h5>
                  <p className="text-muted mb-4">
                    Generate creative text continuations using state-of-the-art language models.
                  </p>
                  <Button variant="info" size="lg" className="mt-auto">
                    Try Text Completion
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className="mt-5">
            <p className="text-muted">
              <strong>Getting Started:</strong> Click on any service above to begin, or use the navigation tabs to switch between services.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
