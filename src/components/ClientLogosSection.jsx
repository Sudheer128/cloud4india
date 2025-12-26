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
        setLogos(data || []);
      } catch (error) {
        console.error('Error fetching client logos:', error);
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

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
      <div className="relative">
        {/* Infinite scrolling container */}
        <div className="flex animate-scroll-left gap-8 items-center">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ minWidth: '150px', height: '80px' }}
            >
              <img
                src={`${CMS_URL}${logo.logo_path}`}
                alt={logo.alt_text || 'Client logo'}
                className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                onError={(e) => {
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

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 10s linear infinite;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .animate-scroll-left {
            animation-duration: 40s;
          }
        }
      `}</style>
    </section>
  );
};

export default ClientLogosSection;

