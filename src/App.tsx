/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Theory } from './views/Theory';
import { CALab } from './views/CALab';
import { ABMLab } from './views/ABMLab';
import { Playground } from './views/Playground';

export default function App() {
  const [currentView, setCurrentView] = useState('theory');

  const renderView = () => {
    switch (currentView) {
      case 'theory':
        return <Theory setCurrentView={setCurrentView} />;
      case 'ca':
        return <CALab setCurrentView={setCurrentView} />;
      case 'abm':
        return <ABMLab setCurrentView={setCurrentView} />;
      case 'playground':
        return <Playground />;
      default:
        return <Theory setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary/30">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="pl-64 min-h-screen">
        <div className="p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
