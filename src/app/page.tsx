import React from 'react';
import Section1 from './components/section1';
import Section2 from './components/section2';

export default function Index() {
  // Sample data for the sections
  const section1Data = {
    id: 'section1-1',
    title: 'Welcome to Section 1',
    order: 1,
    image: null,
    isUpdated: false,
    key: 'section1' as const,
  };

  const section2Data = {
    id: 'section2-1',
    title: 'Welcome to Section 2',
    order: 2,
    children: [],
    isUpdated: false,
    key: 'section2' as const,
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Section1 section1={section1Data} />
      <Section2 section2={section2Data} />
    </div>
  );
}
