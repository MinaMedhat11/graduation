import React from 'react';

const Loading = () => {
  return (
    <div className="spinner-container" style={{display:"flex", justifyContent: "center", alignItems: "center", height:"100vh"}}>
      <div className="spinner-border text-info" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
