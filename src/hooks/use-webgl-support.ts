import { useState, useEffect } from 'react';

export interface WebGLSupportInfo {
  isSupported: boolean;
  hasWebGL2: boolean;
  renderer: string;
  vendor: string;
  isChecking: boolean;
}

export function useWebGLSupport(): WebGLSupportInfo {
  const [info, setInfo] = useState<WebGLSupportInfo>({
    isSupported: true,
    hasWebGL2: true,
    renderer: '',
    vendor: '',
    isChecking: true,
  });

  useEffect(() => {
    try {
      // Test WebGL 2 first
      const canvas = document.createElement('canvas');
      let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
      let isWebGL2 = false;

      gl = canvas.getContext('webgl2');
      if (gl) {
        isWebGL2 = true;
      } else {
        gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      }

      if (!gl) {
        setInfo({
          isSupported: false,
          hasWebGL2: false,
          renderer: '',
          vendor: '',
          isChecking: false,
        });
        return;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Standard WebGL';
      const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Standard GPU';

      setInfo({
        isSupported: true,
        hasWebGL2: isWebGL2,
        renderer: typeof renderer === 'string' ? renderer : 'Generic GPU',
        vendor: typeof vendor === 'string' ? vendor : 'Standard',
        isChecking: false,
      });
    } catch (e) {
      setInfo({
        isSupported: false,
        hasWebGL2: false,
        renderer: '',
        vendor: '',
        isChecking: false,
      });
    }
  }, []);

  return info;
}
