import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Award, Download, Share } from 'lucide-react';

interface CertificateProps {
  courseTitle: string;
  userName: string;
  completionDate: Date;
  quizScore: number;
}

const Certificate: React.FC<CertificateProps> = ({ courseTitle, userName, completionDate, quizScore }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const theme = useTheme();

  const handleDownload = () => {
    console.log('Downloading certificate...');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Course Certificate',
          text: `I completed ${courseTitle} with a score of ${quizScore}%!`,
        });
      } catch (error) {
        setShowShareOptions(true);
      }
    } else {
      setShowShareOptions(true);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg px-8 py-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="text-center mb-6">
        <Award className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 mb-3" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
          Certificate of Achievement
        </h1>
        <div className="w-24 h-0.5 bg-blue-600 dark:bg-blue-400 mx-auto"></div>
      </div>

      {/* Body */}
      <div className="text-center space-y-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This certifies that</p>
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{userName}</h2>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">has successfully completed</p>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{courseTitle}</h3>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">with a score of</p>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {quizScore}%
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Issued on {completionDate.toLocaleDateString()}
        </p>
        <div className="w-32 h-px bg-gray-200 dark:bg-gray-700 mx-auto my-2"></div>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-4 py-1.5 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Share className="w-3.5 h-3.5" />
          Share
        </button>
      </div>

      {/* Share Modal */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-64">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Share Certificate
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => window.open('https://twitter.com/intent/tweet')}
                className="px-3 py-1.5 bg-[#1DA1F2] text-white text-sm rounded hover:bg-[#1a8cd8] transition-colors"
              >
                Twitter
              </button>
              <button
                onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/')}
                className="px-3 py-1.5 bg-[#0A66C2] text-white text-sm rounded hover:bg-[#094d92] transition-colors"
              >
                LinkedIn
              </button>
            </div>
            <button
              onClick={() => setShowShareOptions(false)}
              className="w-full px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate;