import React from "react";

const TrackingPage: React.FC = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      <iframe
        src="http://172.15.80.28:8080/mine-map"
        title="Mine Map Tracking"
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default TrackingPage;
