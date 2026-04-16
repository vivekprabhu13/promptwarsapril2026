import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Ticket, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { processTicketImage } from '@/services/geminiService';

interface TicketData {
  matchName: string;
  venue: string;
  date: string;
  time: string;
  section: string;
  gate: string;
  seat: string;
}

interface TicketLandingProps {
  onComplete: (data: TicketData) => void;
}

export function TicketLanding({ onComplete }: TicketLandingProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Extract data and mime type from the data URL
      const [header, base64Data] = preview.split(',');
      const mimeType = header.split(':')[1].split(';')[0];
      
      const result = await processTicketImage(base64Data, mimeType);
      onComplete(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to process ticket. Please try again or enter details manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2B0B07] flex flex-col items-center justify-center p-6 text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#C41212] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C41212]/20">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-[#C41212] via-[#E65124] to-emerald-500 bg-clip-text text-transparent">KrowdFlux</span>
          </h1>
          <p className="text-red-200/60">Upload your ticket to personalize your experience</p>
        </div>

        <Card className="bg-[#3D100A] border-[#4D150D] shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#4D150D] rounded-2xl cursor-pointer hover:bg-[#4D150D]/30 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-4 bg-[#C41212]/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-[#C41212]" />
                  </div>
                  <p className="mb-2 text-sm font-bold">Click to upload ticket</p>
                  <p className="text-xs text-red-200/40">PNG, JPG or JPEG (max. 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#4D150D]">
                  <img src={preview} alt="Ticket Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B0B07] to-transparent opacity-60" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={() => { setPreview(null); setFile(null); }}
                  >
                    Change
                  </Button>
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-center bg-red-900/20 p-2 rounded-lg border border-red-900/50">
                    {error}
                  </p>
                )}

                <Button 
                  className="w-full h-14 bg-[#C41212] hover:bg-[#7D0A07] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#C41212]/20 disabled:opacity-50"
                  onClick={handleUpload}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Ticket...
                    </>
                  ) : (
                    <>
                      Scan Ticket <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4 text-red-200/40">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">Auto-extract details</span>
          </div>
          <div className="w-1 h-1 bg-red-200/20 rounded-full" />
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">Personalized routes</span>
          </div>
        </div>

        <Button 
          variant="ghost" 
          className="w-full text-red-200/60 hover:text-white hover:bg-white/5"
          onClick={() => onComplete({
            matchName: 'RCB vs MI - IPL 2026',
            venue: 'Chinnaswamy Stadium, Bengaluru',
            date: '2026-04-14',
            time: '19:30',
            section: 'Section 102',
            gate: 'Gate 2',
            seat: 'A-12'
          })}
        >
          Skip and use default details
        </Button>
      </motion.div>
    </div>
  );
}
