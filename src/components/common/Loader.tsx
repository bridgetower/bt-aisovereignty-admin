import React from 'react';

type LoaderWrapperProps = {
  show: boolean;
};

export const Loader: React.FC<LoaderWrapperProps> = ({ show }) => {
  return (
    <>
      {show ? (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30"
          style={{ zIndex: 110 }}
        >
          <div className="relative flex items-center justify-center w-16 h-16">
            <img
              src="/logo512.png"
              alt="Loading indicator"
              className="w-12 h-12 rounded-full animate-zoom-in-out"
            />
            {/* Lucide Loader Icon */}
            <div className="absolute border-4 border-t-transparent border-primary border-solid rounded-full w-full h-full animate-spin"></div>
          </div>
        </div>
      ) : null}
    </>
  );
};
