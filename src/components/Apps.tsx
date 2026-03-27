import React from 'react';
import { motion } from 'framer-motion';
import AppCard from './AppCard';

// Sample data - Replace with your own projects!
const appsData = [
  {
    title: 'My First App',
    packageName: 'com.example.app1',
    icon: '🚀',
    primaryColor: '#7C6FFF',
    description: 'A sample app description. Replace this with your own project.',
    features: [
      'Feature 1 - Describe your key feature',
      'Feature 2 - Another great feature',
      'Feature 3 - What makes it special',
      'Feature 4 - Why users love it'
    ],
    websiteUrl: 'https://example.com'
  },
  {
    title: 'My Second App',
    packageName: 'com.example.app2',
    icon: '💡',
    primaryColor: '#B794F6',
    description: 'Another sample project. Customize this to showcase your work.',
    features: [
      'Feature 1 - Your first feature',
      'Feature 2 - Your second feature',
      'Feature 3 - Your third feature',
      'Feature 4 - Your fourth feature'
    ]
  },
];

const Apps: React.FC = () => {
  return (
    <section id="apps" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Showcase your projects here. Edit the appsData array in Apps.tsx to add your own.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {appsData.map((app, index) => (
            <AppCard
              key={app.packageName}
              {...app}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-gray-900/50 border border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400">Actively developing</span>
            </div>
            <div className="text-gray-600">|</div>
            <span className="text-gray-400">More coming soon</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Apps;
