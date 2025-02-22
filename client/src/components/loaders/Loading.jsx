import { useState, useEffect } from "react";

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress((prevProgress) => prevProgress + 10);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [progress]);
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-white z-[100] overflow-hidden">
      <iframe
        title="Loading..."
        src="https://smctdevt.github.io/smctloder/"
        frameBorder="0"
        allowFullScreen
        style={{ width: "100%", height: "100%" }}
      ></iframe>
    </div>
  );
};

export default Loading;
