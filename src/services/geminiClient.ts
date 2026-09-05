export type GeminiChatModel =
  | 'gemini-3.5-flash'
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.1-flash-lite';

export type GeminiToolMode = 'none' | 'search' | 'maps';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  toolUsed?: GeminiToolMode;
  groundingChunks?: any[];
  searchQueries?: string[];
  isTranscribed?: boolean;
}

export interface GroundingPlace {
  title: string;
  uri: string;
  snippets?: string[];
}

export interface GroundingWebSource {
  title: string;
  uri: string;
}

export interface GeminiChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  model?: GeminiChatModel;
  toolMode?: GeminiToolMode;
  userLocation?: { latitude: number; longitude: number };
  language?: string;
  patientContext?: {
    name?: string;
    dementiaStage?: string;
    location?: string;
    caregiverName?: string;
  };
  rolePerspective?: 'PATIENT' | 'CAREGIVER' | 'CLINICIAN';
}

export interface GeminiChatResponse {
  success: boolean;
  data: {
    reply: string;
    modelUsed: string;
    toolUsed: GeminiToolMode;
    groundingChunks: any[];
    searchQueries?: string[];
  };
}

export const geminiClient = {
  // 1. Multi-turn Chat with Gemini models & Grounding (Search/Maps)
  async sendChat(req: GeminiChatRequest): Promise<GeminiChatResponse> {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Chat error: ${res.statusText}`);
    }

    return res.json();
  },

  // 2. Audio Transcription using gemini-3.5-transcribe
  async transcribeAudio(
    audioBlob: Blob,
    prompt?: string,
  ): Promise<{ text: string; model: string }> {
    const base64Audio = await this.blobToBase64(audioBlob);

    const res = await fetch('/api/gemini/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioData: base64Audio,
        mimeType: audioBlob.type || 'audio/webm',
        prompt,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Audio transcription failed');
    }

    const data = await res.json();
    return {
      text: data.data?.text || '',
      model: data.data?.model || 'gemini-3.5-transcribe',
    };
  },

  // 3. Helper: Convert Blob to clean Base64 data string
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Strip data:audio/xxx;base64, prefix
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  // 4. Helper: Extract Google Maps grounding places from chunks
  extractMapsPlaces(groundingChunks: any[] = []): GroundingPlace[] {
    const places: GroundingPlace[] = [];
    if (!Array.isArray(groundingChunks)) return places;

    for (const chunk of groundingChunks) {
      if (chunk?.maps) {
        places.push({
          title: chunk.maps.title || 'Location details on Google Maps',
          uri: chunk.maps.uri || '#',
          snippets: chunk.maps.placeAnswerSources?.reviewSnippets || [],
        });
      }
    }
    return places;
  },

  // 5. Helper: Extract Google Search web sources from chunks
  extractWebSources(groundingChunks: any[] = []): GroundingWebSource[] {
    const sources: GroundingWebSource[] = [];
    if (!Array.isArray(groundingChunks)) return sources;

    for (const chunk of groundingChunks) {
      if (chunk?.web) {
        sources.push({
          title: chunk.web.title || chunk.web.uri || 'Web Resource',
          uri: chunk.web.uri || '#',
        });
      }
    }
    return sources;
  },
};

// -------------------------------------------------------------
// Live API Voice Session Manager (gemini-3.1-flash-live-preview)
// -------------------------------------------------------------

export interface LiveVoiceCallbacks {
  onStateChange: (state: 'CONNECTING' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'CLOSED' | 'ERROR') => void;
  onTranscriptChunk?: (text: string, speaker: 'user' | 'model') => void;
  onError?: (errMessage: string) => void;
  onVolumeChange?: (level: number) => void;
}

export class LiveVoiceSession {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private nextStartTime: number = 0;
  private scheduledSources: AudioBufferSourceNode[] = [];
  private callbacks: LiveVoiceCallbacks;
  private isActive: boolean = false;

  constructor(callbacks: LiveVoiceCallbacks) {
    this.callbacks = callbacks;
  }

  async start(): Promise<void> {
    this.isActive = true;
    this.callbacks.onStateChange('CONNECTING');

    try {
      // 1. Establish WebSocket connection to backend Live API bridge
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      this.ws = new WebSocket(wsUrl);

      // 2. Setup Output AudioContext (24kHz as specified by Live API output)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.outputAudioCtx = new AudioContextClass({ sampleRate: 24000 });
      this.nextStartTime = this.outputAudioCtx.currentTime;

      // 3. Setup Input AudioContext (16kHz for Live API input)
      this.inputAudioCtx = new AudioContextClass({ sampleRate: 16000 });
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const source = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
      // Process 4096 frames
      this.processor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        if (!this.isActive || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputChannel = e.inputBuffer.getChannelData(0);

        // Volume level calculation for orb visualization
        let sumSquares = 0;
        for (let i = 0; i < inputChannel.length; i++) {
          sumSquares += inputChannel[i] * inputChannel[i];
        }
        const rms = Math.sqrt(sumSquares / inputChannel.length);
        this.callbacks.onVolumeChange?.(Math.min(1, rms * 5));

        // Convert float32 [-1, 1] to Int16 PCM Little Endian
        const pcm16 = new Int16Array(inputChannel.length);
        for (let i = 0; i < inputChannel.length; i++) {
          const s = Math.max(-1, Math.min(1, inputChannel[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Base64 encode the PCM bytes
        const bytes = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Audio = btoa(binary);

        this.ws.send(JSON.stringify({ audio: base64Audio }));
      };

      source.connect(this.processor);
      this.processor.connect(this.inputAudioCtx.destination);

      // 4. Handle incoming messages from Server Live API
      this.ws.onopen = () => {
        this.callbacks.onStateChange('LISTENING');
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'ready') {
            this.callbacks.onStateChange('LISTENING');
          } else if (msg.type === 'audio' && msg.audio) {
            this.callbacks.onStateChange('SPEAKING');
            this.playAudioChunk(msg.audio);
          } else if (msg.type === 'interrupted') {
            this.stopCurrentPlayback();
            this.callbacks.onStateChange('LISTENING');
          } else if (msg.type === 'text' && msg.text) {
            this.callbacks.onTranscriptChunk?.(msg.text, 'model');
          } else if (msg.type === 'error') {
            this.callbacks.onError?.(msg.error || 'Live API reported an error');
            this.callbacks.onStateChange('ERROR');
          } else if (msg.type === 'closed') {
            this.callbacks.onStateChange('CLOSED');
          }
        } catch (e) {
          console.error('Error parsing live WS message:', e);
        }
      };

      this.ws.onerror = (e) => {
        console.error('Live WS error:', e);
        this.callbacks.onError?.('Failed to connect to Live API bridge');
        this.callbacks.onStateChange('ERROR');
      };

      this.ws.onclose = () => {
        if (this.isActive) {
          this.callbacks.onStateChange('CLOSED');
        }
      };
    } catch (err: any) {
      console.error('Live session initialization error:', err);
      this.callbacks.onError?.(err?.message || 'Could not start voice session');
      this.callbacks.onStateChange('ERROR');
      this.stop();
    }
  }

  private playAudioChunk(base64Pcm: string): void {
    if (!this.outputAudioCtx) return;

    try {
      const binary = atob(base64Pcm);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768;
      }

      // Create AudioBuffer at 24,000 Hz
      const audioBuffer = this.outputAudioCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);

      const sourceNode = this.outputAudioCtx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(this.outputAudioCtx.destination);

      // Gapless scheduling
      const now = this.outputAudioCtx.currentTime;
      if (this.nextStartTime < now) {
        this.nextStartTime = now + 0.05; // small buffer cushion
      }

      sourceNode.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;

      this.scheduledSources.push(sourceNode);
      sourceNode.onended = () => {
        const index = this.scheduledSources.indexOf(sourceNode);
        if (index > -1) {
          this.scheduledSources.splice(index, 1);
        }
        if (this.scheduledSources.length === 0 && this.isActive) {
          this.callbacks.onStateChange('LISTENING');
        }
      };
    } catch (e) {
      console.error('Audio chunk playback error:', e);
    }
  }

  private stopCurrentPlayback(): void {
    for (const source of this.scheduledSources) {
      try {
        source.stop();
      } catch {
        // ignore already stopped
      }
    }
    this.scheduledSources = [];
    if (this.outputAudioCtx) {
      this.nextStartTime = this.outputAudioCtx.currentTime;
    }
  }

  stop(): void {
    this.isActive = false;
    this.stopCurrentPlayback();

    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.inputAudioCtx) {
      this.inputAudioCtx.close().catch(() => {});
      this.inputAudioCtx = null;
    }

    if (this.outputAudioCtx) {
      this.outputAudioCtx.close().catch(() => {});
      this.outputAudioCtx = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.callbacks.onStateChange('CLOSED');
  }
}
