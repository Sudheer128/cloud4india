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

  // For seamless infinite scroll, duplicate logos once
  // Animation moves exactly one set width, then resets seamlessly
  const duplicatedLogos = [...logos, ...logos];
  const logoWidth = 150; // px per logo
  const logoGap = 32; // gap-8 = 2rem = 32px
  const singleSetWidth = logos.length * (logoWidth + logoGap);

  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div 
            className="flex gap-8 items-center animate-scroll-left"
            style={{ width: 'max-content' }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: `${logoWidth}px`, height: '80px' }}
              >
                <img
                  src={`${CMS_URL}${logo.logo_path}`}
                  alt={logo.alt_text || 'Client logo'}
                  className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${singleSetWidth}px); }
        }
        .animate-scroll-left {
          animation: scroll-left ${Math.max(30, logos.length * 2)}s linear infinite;
        }
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ClientLogosSection;

