import React from 'react';
import { IState } from '@preview-workspace/preview-lib';
import Section1 from '../components/section1';
import Section2 from '../components/section2';
import Section3 from '../components/section3';
import { Section4 } from '../components/section4';

export default function HomePage() {
  // Initial state for the sections - same as in app.tsx
  const initialState: IState = [
    {
      id: 'section1',
      key: 'section1',
      title: 'Welcome to Preview',
      order: 0,
      image: 'https://picsum.photos/800/400?random=1',
      isUpdated: false,
    },
    {
      id: 'section2',
      key: 'section2',
      title: 'Features',
      order: 1,
      children: [
        {
          id: 'child1',
          name: 'Feature 1',
          order: 0,
          isUpdated: false,
          key: 'section2Child',
        },
        {
          id: 'child2',
          name: 'Feature 2',
          order: 1,
          isUpdated: false,
          key: 'section2Child',
        },
        {
          id: 'child3',
          name: 'Feature 3',
          order: 2,
          isUpdated: false,
          key: 'section2Child',
        },
      ],
      isUpdated: false,
    },
    {
      id: 'section3',
      key: 'section3',
      title: 'About Us',
      subtitle: 'Learn more about our mission and values',
      order: 2,
      cta: {
        title: 'Get Started',
        link: 'https://example.com/get-started',
        isUpdated: false,
      },
      isUpdated: false,
    },
    {
      id: 'section4',
      key: 'section4',
      title: 'Carousel Section',
      order: 3,
      children: [
        {
          id: 'section4-child1',
          title: 'Carousel Item 1',
          order: 0,
          isUpdated: false,
          key: 'section4Child',
        },
        {
          id: 'section4-child2',
          title: 'Carousel Item 2',
          order: 1,
          isUpdated: false,
          key: 'section4Child',
        },
        {
          id: 'section4-child3',
          title: 'Carousel Item 3',
          order: 2,
          isUpdated: false,
          key: 'section4Child',
        },
      ],
      isUpdated: false,
    },
  ];

  const sortedSections = [...initialState].sort((a, b) => a.order - b.order);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
      }}
    >
      {/* Render all sections */}
      {sortedSections.map((section) => {
        switch (section.key) {
          case 'section1':
            return (
              <Section1 key={section.id} section1={section} isPreview={false} />
            );
          case 'section2':
            return (
              <Section2 key={section.id} section2={section} isPreview={false} />
            );
          case 'section3':
            return (
              <Section3 key={section.id} section3={section} isPreview={false} />
            );
          case 'section4':
            return (
              <Section4 key={section.id} section4={section} isPreview={false} />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
