import { useState } from 'react';
import { Nav, Navbar, Tab, Tabs } from 'react-bootstrap';
import TextSummarizer from './components/TextSummarizer';
import StyleTransfer from './components/StyleTransfer';
import TextComplete from './components/TextComplete';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [activeTab, setActiveTab] = useState<string>('welcome');

  const handleServiceSelect = (service: string) => {
    setActiveTab(service);
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <div className="w-100 px-3 px-md-4 px-lg-5 px-xl-6">
          <div className="d-flex justify-content-between align-items-center">
            <Navbar.Brand href="#home">
              🧠 Deep Learning API Hub
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="#welcome" onClick={() => setActiveTab('welcome')}>
                  🏠 Home
                </Nav.Link>
                <Nav.Link href="#summarize" onClick={() => setActiveTab('summarize')}>
                  📝 Text Summarizer
                </Nav.Link>
                <Nav.Link href="#style" onClick={() => setActiveTab('style')}>
                  🎨 Style Transfer
                </Nav.Link>
                <Nav.Link href="#complete" onClick={() => setActiveTab('complete')}>
                  ✍️ Text Complete
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </div>
      </Navbar>

      <div className="w-100 px-3 px-md-4 px-lg-5 px-xl-6">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || 'welcome')}
          className="mb-4"
          variant="pills"
          justify
        >
          <Tab eventKey="welcome" title="🏠 Home">
            <WelcomeScreen onServiceSelect={handleServiceSelect} />
          </Tab>
          <Tab eventKey="summarize" title="📝 Text Summarizer">
            <TextSummarizer />
          </Tab>
          <Tab eventKey="style" title="🎨 Style Transfer">
            <StyleTransfer />
          </Tab>
          <Tab eventKey="complete" title="✍️ Text Complete">
            <TextComplete />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
