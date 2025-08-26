
import React from 'react';
import { DesignIdeas } from '../types';
import { CheckCircleIcon } from './Icons';

interface ResultsDisplayProps {
  ideas: DesignIdeas;
  imageUrl: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ ideas, imageUrl }) => {
  return (
    <div className="w-full animate-fade-in max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-brand-primary mb-3">Your New Room!</h3>
          <img src={imageUrl} alt="Redesigned room" className="w-full rounded-lg shadow-lg" />
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-brand-dark">Current Style Analysis</h4>
          <p className="text-gray-600 italic">"{ideas.currentStyle}"</p>
        </div>

        {/* Redesign Concept */}
        <div className="border border-gray-200 p-4 rounded-lg">
          <h4 className="text-xl font-bold text-brand-dark mb-2">{ideas.redesignConcept.title}</h4>
          <p className="text-gray-600 mb-3">{ideas.redesignConcept.description}</p>
          <ul className="space-y-2">
            {ideas.redesignConcept.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Color Palette */}
        <div>
            <h4 className="text-lg font-bold text-brand-dark mb-2">Suggested Color Palette</h4>
            <div className="flex space-x-2">
            {ideas.colorPalette.map((color, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                        className="w-full h-16 rounded-md shadow" 
                        style={{ backgroundColor: color }}
                        title={color}
                    ></div>
                    <span className="text-xs mt-1 text-gray-500">{color}</span>
                </div>
            ))}
            </div>
        </div>

        {/* Shopping Ideas */}
        <div>
          <h4 className="text-lg font-bold text-brand-dark mb-2">Shopping Ideas</h4>
          <ul className="divide-y divide-gray-200">
            {ideas.shoppingIdeas.map((item, index) => (
              <li key={index} className="flex justify-between items-center py-2">
                <span className="text-gray-700">{item.item}</span>
                <span className="font-semibold text-brand-primary bg-blue-100 px-2 py-1 rounded-md text-sm">{item.estimatedPrice}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Alternative Concept */}
        <div className="border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
          <h4 className="text-lg font-bold text-brand-dark mb-2">Alternative Idea: {ideas.alternativeConcept.title}</h4>
          <p className="text-gray-600 mb-3">{ideas.alternativeConcept.description}</p>
          <ul className="space-y-1 text-sm">
            {ideas.alternativeConcept.suggestions.map((suggestion, index) => (
               <li key={index} className="flex items-start">
                <CheckCircleIcon className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
   