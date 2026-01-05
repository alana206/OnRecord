
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  label?: string;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, label = "Record Voice Note", className = "" }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const gemini = new GeminiService();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stop microphone access

        // Default to webm/mp4 depending on browser, generally treated as generic audio for API
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (blob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        // Remove data URL prefix (e.g., "data:audio/webm;base64,")
        const base64Content = base64data.split(',')[1];
        
        const text = await gemini.transcribeAudio(base64Content);
        if (text) {
            onTranscription(text);
        }
        setIsProcessing(false);
      };
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {!isRecording && !isProcessing && (
        <button
            type="button"
            onClick={startRecording}
            className="flex items-center justify-center text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors focus:outline-none px-3 py-1.5 rounded-lg shadow-sm"
        >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            {label}
        </button>
      )}
      
      {isRecording && (
        <button
            type="button"
            onClick={stopRecording}
            className="flex items-center justify-center text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 animate-pulse transition-colors focus:outline-none px-3 py-1.5 rounded-lg shadow-sm"
        >
             <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="5" /></svg>
            Recording...
        </button>
      )}

      {isProcessing && (
         <div className="flex items-center justify-center text-xs font-medium bg-slate-500 text-white px-3 py-1.5 rounded-lg shadow-sm">
            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Transcribing...
         </div>
      )}
    </div>
  );
};

export default VoiceInput;
