
import React from 'react';

interface StyleSelectorProps {
  styles: string[];
  selectedStyle: string;
  onSelectStyle: (style: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onSelectStyle }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {styles.map((style) => (
        <button
          key={style}
          onClick={() => onSelectStyle(style)}
          className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary
            ${selectedStyle === style 
              ? 'bg-brand-primary text-white shadow-md' 
              : 'bg-brand-light text-brand-dark hover:bg-blue-200'
            }`}
        >
          {style}
        </button>
      ))}
    </div>
  );
};

export default StyleSelector;
   