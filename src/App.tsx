import React, { useState } from 'react';
import { CRTMonitor } from './components/CRTMonitor';
import { BootSequence } from './components/BootSequence';
import { DOSScreen } from './components/DOSScreen';

function App() {
  const [bootComplete, setBootComplete] = useState(false);

  const handleBootComplete = () => {
    setBootComplete(true);
  };

  return (
    <CRTMonitor>
      {!bootComplete ? (
        <BootSequence onBootComplete={handleBootComplete} />
      ) : (
        <DOSScreen />
      )}
    </CRTMonitor>
  );
}

export default App;