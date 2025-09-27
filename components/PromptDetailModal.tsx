import React, { useState, useEffect } from 'react';
import { Prompt } from '../types';
import Modal from './Modal';
import Button from './Button';
import { Copy, Loader, Sparkles, Check, Book, Cpu, Tag as TagIcon } from 'lucide-react';
import { generateExampleOutput, generateExampleImage } from '../services/geminiService';

interface PromptDetailModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
}

type ExampleOutput = {
    type: 'text' | 'image';
    content: string;
}

const PromptDetailModal: React.FC<PromptDetailModalProps> = ({ prompt, isOpen, onClose }) => {
  const [example, setExample] = useState<ExampleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && prompt) {
      const generateExample = async () => {
        setIsLoading(true);
        setError(null);
        setExample(null);
        try {
          if (prompt.model === 'MidJourney' || prompt.model === 'DALL-E') {
            const imageUrl = await generateExampleImage(prompt.prompt);
            setExample({ type: 'image', content: imageUrl });
          } else {
            const result = await generateExampleOutput(prompt);
            setExample({ type: 'text', content: result });
          }
        } catch (err) {
          setError('Could not generate an example. Please try again later.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      generateExample();
    }
  }, [isOpen, prompt]);

  if (!prompt) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={prompt.title}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 -mr-4">
        
        {/* Author & Metadata */}
        <div className="pb-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
                <img src={prompt.author.avatar} alt={prompt.author.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{prompt.author.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                 <div className="flex items-center space-x-2">
                    <Book size={16} className="text-primary-500" />
                    <span className="font-semibold">{prompt.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Cpu size={16} className="text-primary-500" />
                    <span className="font-semibold">{prompt.model}</span>
                </div>
            </div>
             <div className="flex flex-wrap gap-2 mt-4">
                {prompt.tags.map(tag => (
                  <span key={tag} className="flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-md">
                    <TagIcon size={12} className="mr-1.5"/>
                    {tag}
                  </span>
                ))}
            </div>
        </div>

        {/* Prompt Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Prompt</h3>
          <div className="relative p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{prompt.prompt}</p>
            <button
              onClick={() => handleCopy(prompt.prompt)}
              className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              title={copied ? "Copied!" : "Copy prompt"}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        
        {/* Example Output Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            <Sparkles size={20} className="mr-2 text-primary-500"/>
            Example Output
          </h3>
          <div className="p-4 border-2 border-dashed rounded-lg min-h-[150px] flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
            {isLoading && (
              <div className="text-center flex flex-col items-center justify-center space-y-2">
                <Loader size={32} className="animate-spin text-primary-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Generating example...</p>
              </div>
            )}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {!isLoading && !error && example && (
              <>
                {example.type === 'text' && (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">{example.content}</p>
                )}
                {example.type === 'image' && (
                  <img src={example.content} alt="Generated example" className="rounded-lg max-w-full max-h-80 object-contain"/>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-4 mt-2 border-t dark:border-gray-700">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default PromptDetailModal;