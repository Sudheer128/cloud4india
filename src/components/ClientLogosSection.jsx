import React, { useState, useEffect } from 'react';
import { getClientLogos } from '../services/cmsApi';
import { CMS_URL } from '../utils/config';

const ClientLogosSection = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        setLoading(true);
        const data = await getClientLogos();
        console.log('✅ Fetched client logos:', data?.length || 0, 'logos');
        if (data && data.length > 0) {
          console.log('Logo IDs:', data.map(l => l.id).join(', '));
        }
        setLogos(data || []);
      } catch (error) {
        console.error('❌ Error fetching client logos:', error);
        setLogos([]);
      } finally {
        setLoading(false);  
      }
    };

    fetchLogos();
  }, []);

  // Don't render if no logos or still loading
  if (loading || logos.length === 0) {
    return null;
  }

  // For seamless infinite scroll, duplicate logos multiple times
  // We need enough duplicates so when we animate one set, the reset is seamless
  // Using 4 duplicates: [Set1, Set2, Set3, Set4]
  // Animating -25% moves from Set1 to Set2, and when it resets, Set2 looks identical to Set1
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
      <div className="relative w-full">
        {/* Wrapper to ensure proper overflow handling */}
        <div className="overflow-hidden">
          {/* Infinite scrolling container - using wrapper technique for seamless scroll */}
          <div className="flex animate-scroll-left gap-8 items-center" style={{ display: 'inline-flex' }}>
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ 
                  minWidth: '150px', 
                  width: '150px', 
                  height: '80px',
                  flexShrink: 0
                }}
              >
                <img
                  src={`${CMS_URL}${logo.logo_path}`}
                  alt={logo.alt_text || 'Client logo'}
                  className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                  onLoad={() => {
                    if (index < logos.length) {
                      console.log(`✅ Image ${index + 1}/${logos.length} loaded:`, logo.alt_text || logo.id);
                    }
                  }}
                  onError={(e) => {
                    console.error('❌ Image failed to load:', logo.logo_path, 'for logo:', logo.alt_text || logo.id);
                    e.target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'flex items-center justify-center w-full h-full text-gray-400 text-sm';
                    fallback.textContent = logo.alt_text || 'Logo';
                    e.target.parentNode.appendChild(fallback);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 4));
          }
        }

        .animate-scroll-left {
          animation: scroll-left ${Math.max(60, logos.length * 3.5)}s linear infinite;
          will-change: transform;
          width: max-content;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .animate-scroll-left {
            animation-duration: ${Math.max(80, logos.length * 4.5)}s;
          }
        }
      `}</style>
    </section>
  );
};

export default ClientLogosSection;

