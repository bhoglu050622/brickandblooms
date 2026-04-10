import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface LiquidImageProps {
  src: string;
  alt?: string;
}

export const LiquidImage: React.FC<LiquidImageProps> = ({ src }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const reqIdRef = useRef<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Skip WebGL for users who prefer reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsLoaded(true);
      return;
    }

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform float uHover;
      uniform vec2 uResolution;
      uniform vec2 uImageRes;
      varying vec2 vUv;

      void main() {
        // Calculate object-fit: cover dynamically
        vec2 ratio = vec2(
          min((uResolution.x / uResolution.y) / (uImageRes.x / uImageRes.y), 1.0),
          min((uResolution.y / uResolution.x) / (uImageRes.y / uImageRes.x), 1.0)
        );
        vec2 uv = vec2(
          vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
        );

        // Organic Liquid/Wind distortion
        float intensity = 0.015 + (uHover * 0.04); // Base subtle wave + hover amplification
        vec2 p = uv;
        
        // Complex multi-layered sine waves for water-like feeling
        p.x += sin(p.y * 10.0 + uTime * 1.2) * intensity;
        p.y += sin(p.x * 12.0 + uTime * 1.5) * intensity;
        p.x += cos(p.y * 5.0 + uTime * 0.8) * (intensity * 0.5);

        vec4 color = texture2D(uTexture, p);
        gl_FragColor = color;
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uHover: { value: 0 },
        uTexture: { value: new THREE.Texture() },
        uResolution: { value: new THREE.Vector2() },
        uImageRes: { value: new THREE.Vector2(1, 1) },
      }
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const loader = new THREE.TextureLoader();
    loader.load(src, (texture) => {
      material.uniforms.uTexture.value = texture;
      material.uniforms.uImageRes.value.set(texture.image.width, texture.image.height);
      setIsLoaded(true);
      resize();
    });

    const resize = () => {
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    const clock = new THREE.Clock();
    const animate = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      }
      renderer.render(scene, camera);
      reqIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(reqIdRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [src]);

  const handleMouseEnter = () => {
    if (materialRef.current) {
      gsap.to(materialRef.current.uniforms.uHover, { value: 1, duration: 1.2, ease: 'power3.out' });
    }
  };

  const handleMouseLeave = () => {
    if (materialRef.current) {
      gsap.to(materialRef.current.uniforms.uHover, { value: 0, duration: 1.5, ease: 'power2.inOut' });
    }
  };

  // Fallback for reduced motion users
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full overflow-hidden bg-[#1A1A17]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        {prefersReduced && (
          <img src={src} alt="Fallback" className="w-full h-full object-cover" />
        )}
      </div>
    </div>
  );
};
