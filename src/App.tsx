import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { Helios } from './components/Helios';
import { Aerion } from './components/Aerion';
import { Chronos } from './components/Chronos';

export default function App() {
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('HELIOS');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} isDashboard={isDashboard} setIsDashboard={setIsDashboard}>
      {!isDashboard ? (
        <LandingPage onEnter={() => setIsDashboard(true)} />
      ) : (
        <>
          {activeTab === 'HELIOS' && <Helios />}
          {activeTab === 'AERION' && <Aerion />}
          {activeTab === 'CHRONOS' && <Chronos />}
        </>
      )}
    </Layout>
  );
}
