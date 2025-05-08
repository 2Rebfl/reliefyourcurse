import { useState, useRef, useEffect } from "react";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  maxDuration?: number; // in seconds
  autoStart?: boolean; // automatically start recording when component mounts
}

const AudioRecorder = ({ 
  onRecordingComplete, 
  maxDuration = 5,
  autoStart = false 
}: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Auto-start recording if autoStart is true
    if (autoStart && !isRecording) {
      startRecording();
    }
    
    // Clean up timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoStart]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => {
          const newTime = prevTime + 1;
          
          // Auto-stop recording when max duration is reached
          if (newTime >= maxDuration) {
            stopRecording();
          }
          
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  return (
    <div className="audio-recorder">
      <div className="recording-status">
        {isRecording ? (
          <div className="recording-indicator">
            Recording: {recordingTime}s / {maxDuration}s
          </div>
        ) : (
          <div>Ready to record (max {maxDuration} seconds)</div>
        )}
      </div>
      
      <div className="recording-controls">
        {!isRecording ? (
          <button 
            className="record-button"
            onClick={startRecording}
          >
            Start Recording
          </button>
        ) : (
          <button 
            className="stop-button"
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
