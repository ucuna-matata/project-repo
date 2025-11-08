import { useState } from 'react';
import { FileText, File } from 'lucide-react';
import { profileService } from '../../services/profile';

interface CVExportButtonsProps {
  cvId: string;
  cvTitle?: string;
}

export default function CVExportButtons({ cvId }: CVExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | null>(null);

  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExporting(true);
    setExportFormat(format);

    try {
      const { blob, filename } = await profileService.exportCV(cvId, format);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      alert(`Failed to export CV as ${format.toUpperCase()}. Please try again.`);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport('pdf')}
        disabled={isExporting}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export as PDF"
      >
        {isExporting && exportFormat === 'pdf' ? (
          <>
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-300 border-t-blue-600 rounded-full" />
            Exporting...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </>
        )}
      </button>

      <button
        onClick={() => handleExport('docx')}
        disabled={isExporting}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export as DOCX"
      >
        {isExporting && exportFormat === 'docx' ? (
          <>
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-300 border-t-blue-600 rounded-full" />
            Exporting...
          </>
        ) : (
          <>
            <File className="h-4 w-4 mr-2" />
            DOCX
          </>
        )}
      </button>
    </div>
  );
}

