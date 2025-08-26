
import React, { useState, useCallback } from 'react';
import { generateDesignIdeas, generateStyledImage } from './services/geminiService';
import { DesignIdeas } from './types';
import { ROOM_STYLES } from './constants';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ResultsDisplay from './components/ResultsDisplay';
import { LogoIcon, SparklesIcon } from './components/Icons';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [designIdeas, setDesignIdeas] = useState<DesignIdeas | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setUploadedImage(URL.createObjectURL(file));
      setImageBase64(base64String);
      setDesignIdeas(null);
      setGeneratedImageUrl(null);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!imageBase64 || !selectedStyle) {
      setError('Please upload an image and select a style.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDesignIdeas(null);
    setGeneratedImageUrl(null);

    try {
      const designPrompt = `A photo of a room redesigned in a ${selectedStyle} style.`;

      const [ideasResponse, imageResponse] = await Promise.all([
        generateDesignIdeas(imageBase64, selectedStyle),
        generateStyledImage(designPrompt)
      ]);

      if (ideasResponse) {
        setDesignIdeas(ideasResponse);
      } else {
        throw new Error('Could not generate design ideas.');
      }
      
      if(imageResponse) {
        setGeneratedImageUrl(imageResponse);
      } else {
         throw new Error('Could not generate a new room image.');
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64, selectedStyle]);
  
  const canGenerate = uploadedImage && selectedStyle && !isLoading;

  return (
    <div className="min-h-screen bg-gray-50 text-brand-dark font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-10 w-10 text-brand-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark">AI Room Maker</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-primary mb-2">Reimagine Your Space in Seconds</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Upload a photo of your room, pick a style, and let our AI generate stunning new designs for you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Controls Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-up">
            <div>
              <h3 className="text-xl font-bold text-brand-dark mb-1">1. Upload Your Room</h3>
              <p className="text-gray-500 mb-4">Upload a photo or even a sketch of your room.</p>
              <ImageUploader onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-brand-dark mb-1">2. Choose a Style</h3>
              <p className="text-gray-500 mb-4">Select the aesthetic you want to achieve.</p>
              <StyleSelector styles={ROOM_STYLES} selectedStyle={selectedStyle} onSelectStyle={setSelectedStyle} />
            </div>

            <div className="mt-8">
              <button 
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`w-full text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105
                  ${canGenerate ? 'bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-xl' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Generating Your Dream Room...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-6 h-6 mr-2" />
                    Generate Redesign
                  </>
                )}
              </button>
              {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[400px] flex items-center justify-center animate-fade-in animation-delay-300">
            {isLoading ? (
               <div className="text-center">
                  <LoadingSpinner className="w-12 h-12" />
                  <p className="mt-4 text-gray-600 font-semibold">Our AI is redesigning your room...</p>
                  <p className="text-sm text-gray-500">This might take a moment.</p>
               </div>
            ) : designIdeas && generatedImageUrl ? (
              <ResultsDisplay ideas={designIdeas} imageUrl={generatedImageUrl} />
            ) : (
              <div className="text-center text-gray-500">
                <div className="bg-brand-light p-6 rounded-full inline-block mb-4">
                  <LogoIcon className="h-16 w-16 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark">Your Redesigned Room Awaits</h3>
                <p>Follow the steps on the left to see the magic happen!</p>
              </div>
            )}
          </div>
        </div>
      </main>
       <footer className="text-center py-6 mt-8 text-gray-500">
          <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
   