import React, { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";

// Helper function
const getColorForNode = (nodeName, darkMode) => {
  if (!nodeName) return darkMode ? "#2d3748" : "#f8f3e3";
  let hash = 0;
  for (let i = 0; i < nodeName.length; i++) {
    hash = nodeName.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const hue = Math.abs(hash) % 360;
  return darkMode ? `hsl(${hue}, 50%, 35%)` : `hsl(${hue}, 70%, 85%)`;
};

// Custom Node Component
const CustomNode = ({ nodeDatum, toggleNode, darkMode }) => {
  const nodeColor = getColorForNode(nodeDatum.name, darkMode);
  const nodeWidth = 160;
  const nodeHeight = 80;

  return (
    <g>
      <rect
        width={nodeWidth}
        height={nodeHeight}
        x={-nodeWidth / 2}
        y={-nodeHeight / 2}
        rx={10}
        ry={10}
        fill={nodeColor}
        stroke={darkMode ? "#4a5568" : "#a7a7a7"}
        onClick={toggleNode}
        style={{ cursor: "pointer" }}
        filter="url(#shadow)"
      />
      <foreignObject
        width={nodeWidth - 20}
        height={nodeHeight - 20}
        x={-nodeWidth / 2 + 10}
        y={-nodeHeight / 2 + 10}
        style={{ pointerEvents: "none" }}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontFamily: "sans-serif",
            fontSize: "14px",
            color: darkMode ? "#e2e8f0" : "#333",
            wordBreak: "break-word",
          }}
        >
          {nodeDatum.name}
        </div>
      </foreignObject>
    </g>
  );
};

// Icon Components
const SparklesIcon = ({ style }) => (
  <svg 
    style={style} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M12 3v18m9-9H3m15.364-6.364L5.636 18.364m12.728 0L5.636 5.636"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const MessageSquareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const LoaderIcon = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.07" y2="19.07"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.07" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.07" y2="4.22"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

// Progress Bar Component
const ProgressBar = ({ progress, status, darkMode }) => (
  <div style={{ marginTop: '16px', width: '100%', maxWidth: '672px', margin: '16px auto 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '500', color: darkMode ? '#e2e8f0' : '#374151' }}>{status}</span>
      <span style={{ fontSize: '14px', fontWeight: '500', color: darkMode ? '#60a5fa' : '#2563eb' }}>{progress}%</span>
    </div>
    <div style={{ width: '100%', backgroundColor: darkMode ? '#374151' : '#e5e7eb', borderRadius: '9999px', height: '10px', overflow: 'hidden' }}>
      <div
        style={{
          background: 'linear-gradient(to right, #3b82f6, #9333ea)',
          height: '10px',
          borderRadius: '9999px',
          transition: 'width 0.3s ease-out',
          width: `${progress}%`
        }}
      />
    </div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description, gradient, darkMode }) => (
  <div style={{
    background: darkMode ? '#2d3748' : 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    border: darkMode ? '1px solid #4a5568' : '1px solid #e5e7eb'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      color: 'white'
    }}>
      {icon}
    </div>
    <h3 style={{ 
      fontSize: '18px', 
      fontWeight: '600', 
      marginBottom: '8px',
      color: darkMode ? '#f7fafc' : '#1f2937'
    }}>
      {title}
    </h3>
    <p style={{ 
      fontSize: '14px', 
      color: darkMode ? '#cbd5e0' : '#6b7280',
      lineHeight: '1.6'
    }}>
      {description}
    </p>
  </div>
);

function App() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [chatError, setChatError] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [mindmapData, setMindmapData] = useState(null);
  const mindmapRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [darkMode, setDarkMode] = useState(false);
  
  const [notesProgress, setNotesProgress] = useState(0);
  const [notesLoading, setNotesLoading] = useState(false);
  const [mindmapProgress, setMindmapProgress] = useState(0);
  const [mindmapLoading, setMindmapLoading] = useState(false);
  const [notesGenerated, setNotesGenerated] = useState(false);

  useEffect(() => {
    if (mindmapRef.current) {
      const dimensions = mindmapRef.current.getBoundingClientRect();
      setTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 2,
      });
    }
  }, [mindmapData]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const simulateProgress = (setProgress, duration = 3000) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      setProgress(Math.min(progress, 90));
    }, duration / 20);
    return interval;
  };

  const handleSubmit = async () => {
    setError("");
    setPdfUrl("");
    setNotesLoading(true);
    setNotesProgress(0);
    setNotesGenerated(false);
    
    const progressInterval = simulateProgress(setNotesProgress);
    
    try {
      const res = await fetch("http://your-n8n-instance/webhook/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to fetch PDF");
      const blob = await res.blob();
      if (blob.size === 0) throw new Error("Received empty PDF blob");
      const objectUrl = URL.createObjectURL(blob);
      
      clearInterval(progressInterval);
      setNotesProgress(100);
      setPdfUrl(objectUrl);
      setNotesGenerated(true);
      
      setTimeout(() => {
        setNotesLoading(false);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF. Please check the backend.");
      setNotesLoading(false);
      setNotesProgress(0);
    }
  };

  const handleChat = async () => {
    setChatError("");
    if (!question.trim()) return setChatError("Please enter a question");
    
    const userQuestion = question.trim();
    setChatHistory((prev) => [...prev, { question: userQuestion, answer: null, loading: true }]);
    setQuestion("");
    setChatLoading(true);
    
    try {
      const res = await fetch("http://your-n8n-instance/webhook/chat-with-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, question: userQuestion }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to get answer");
      const data = await res.json();
      const answerText = data?.answer || "No answer returned";
      
      setChatHistory((prev) => 
        prev.map((item, idx) => 
          idx === prev.length - 1 
            ? { ...item, answer: answerText, loading: false }
            : item
        )
      );
    } catch (err) {
      console.error("Chat error:", err);
      setChatError("Something went wrong while chatting.");
      setChatHistory((prev) => prev.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateMindmap = async () => {
    setMindmapLoading(true);
    setMindmapProgress(0);
    
    const progressInterval = simulateProgress(setMindmapProgress, 4000);
    
    try {
      const fallback = {
        name: "Main Topic (Center)",
        children: [
          { name: "Node A (North)" },
          { name: "Node B (NE)" },
          { name: "Node C (East)" },
          { name: "Node D (SE)" },
          { name: "Node E (South)" },
          { name: "Node F (SW)" },
          { name: "Node G (West)" },
          { name: "Node H (NW)" },
        ],
      };

      if (url.trim()) {
        const res = await fetch("http://your-n8n-instance/webhook/generate-mindmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (!res.ok) throw new Error(await res.text() || "Failed to generate mindmap");
        const data = await res.json();
        
        clearInterval(progressInterval);
        setMindmapProgress(100);
        setMindmapData(data?.name ? data : fallback);
      } else {
        clearInterval(progressInterval);
        setMindmapProgress(100);
        setMindmapData(fallback);
      }
      
      setTimeout(() => {
        setMindmapLoading(false);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Mindmap error:", err);
      alert("Failed to generate mindmap. Please check your workflow.");
      setMindmapLoading(false);
      setMindmapProgress(0);
    }
  };

  const handleDownloadMindmap = () => {
    if (!mindmapRef.current) return;

    const svg = mindmapRef.current.querySelector("svg");
    if (!svg) {
      console.error("Could not find SVG element to download.");
      return;
    }

    const contentG = svg.querySelector("g.rd3t-g");
    if (!contentG) {
      console.error("Could not find mindmap content group.");
      return;
    }

    const { x, y, width, height } = contentG.getBBox();
    const padding = 40;
    
    const finalWidth = Math.ceil(width) + (padding * 2);
    const finalHeight = Math.ceil(height) + (padding * 2);
    const viewBoxX = x - padding;
    const viewBoxY = y - padding;

    const svgClone = svg.cloneNode(true);
    svgClone.setAttribute("width", finalWidth);
    svgClone.setAttribute("height", finalHeight);
    svgClone.setAttribute("viewBox", `${viewBoxX} ${viewBoxY} ${finalWidth} ${finalHeight}`);

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    const svgBase64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));

    const img = new Image();
    img.src = svgBase64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.fillStyle = darkMode ? "#1a202c" : "#f9f9f9";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "mindmap.png";
      link.click();
    };

    img.onerror = (err) => {
      console.error("Image loading error for SVG-to-PNG conversion:", err);
      alert("Failed to convert mindmap to PNG.");
    };
  };

  const bgGradient = darkMode 
    ? 'linear-gradient(to bottom right, #1a202c, #2d3748, #1e293b)' 
    : 'linear-gradient(to bottom right, #eff6ff, #faf5ff, #fdf2f8)';
  const cardBg = darkMode ? '#2d3748' : '#ffffff';
  const textPrimary = darkMode ? '#f7fafc' : '#1f2937';
  const textSecondary = darkMode ? '#cbd5e0' : '#6b7280';
  const borderColor = darkMode ? '#4a5568' : '#e5e7eb';
  const inputBg = darkMode ? '#374151' : '#ffffff';
  const inputBorder = darkMode ? '#4a5568' : '#e5e7eb';
  const inputFocusBorder = darkMode ? '#60a5fa' : '#3b82f6';

  return (
    <div style={{ minHeight: '100vh', background: bgGradient }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div style={{ backgroundColor: cardBg, boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)', borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)', padding: '8px', borderRadius: '8px', color: 'white' }}>
                <SparklesIcon style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(to right, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                  NoteFlow
                </h1>
                <p style={{ fontSize: '14px', color: textSecondary, margin: '2px 0 0 0' }}>AI-Powered YouTube Notes Generator</p>
              </div>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: '10px',
                background: darkMode ? '#374151' : '#f3f4f6',
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: darkMode ? '#fbbf24' : '#2563eb',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px' }}>
        {/* Enhanced Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
          {/* Floating decorative elements */}
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '10%', 
            width: '60px', 
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            opacity: '0.1',
            filter: 'blur(20px)'
          }} className="float-animation" />
          
          <div 
            style={{ 
              position: 'absolute', 
              top: '40px', 
              right: '15%', 
              width: '80px', 
              height: '80px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '50%',
              opacity: '0.1',
              filter: 'blur(25px)',
              animationDelay: '1s' // <-- Merged here
            }} 
            className="float-animation" 
          />

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: darkMode 
              ? 'linear-gradient(to right, #1e293b, #334155)' 
              : 'linear-gradient(to right, #ede9fe, #fae8ff)',
            padding: '10px 24px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '24px',
            border: darkMode ? '1px solid #4a5568' : '1px solid #e9d5ff',
            boxShadow: darkMode 
              ? '0 4px 6px rgba(0,0,0,0.3)' 
              : '0 4px 6px rgba(147, 51, 234, 0.1)'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }} className="pulse-animation" />
            <span style={{ 
              background: 'linear-gradient(to right, #7c3aed, #2563eb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ✨ Transform Videos into Smart Notes
            </span>
          </div>

          {/* Main Heading */}
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            color: textPrimary,
            marginBottom: '24px',
            lineHeight: '1.2',
            letterSpacing: '-0.02em'
          }}>
            Turn Any YouTube Video
            <br />
            Into{' '}
            <span style={{
              background: 'linear-gradient(to right, #7c3aed, #2563eb, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              display: 'inline-block'
            }}>
              Comprehensive Notes
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(to right, #7c3aed, #2563eb, #ec4899)',
                borderRadius: '2px',
                opacity: '0.3'
              }} />
            </span>
          </h2>

          {/* Subtitle */}
          <p style={{
            color: textSecondary,
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px'
          }}>
            Paste a YouTube URL and let AI extract insights, create mindmaps, and answer your questions instantly
          </p>

          {/* Feature Icons Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            maxWidth: '900px',
            margin: '48px auto 0',
            padding: '0 16px'
          }}>
            <FeatureCard
              icon={<VideoIcon />}
              title="Video Analysis"
              description="Automatically extract key insights from any YouTube video"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<BrainIcon />}
              title="Visual Mindmaps"
              description="Generate interactive mindmaps to visualize content structure"
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<ZapIcon />}
              title="AI Chat"
              description="Ask questions and get instant answers about the video content"
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              darkMode={darkMode}
            />
          </div>
        </div>

        {/* URL Input Section */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)', padding: '32px', marginBottom: '32px', border: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ color: '#2563eb' }}><FileTextIcon /></div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: textPrimary, margin: 0 }}>Generate Notes</h2>
          </div>
          <p style={{ color: textSecondary, marginBottom: '24px' }}>Enter a YouTube video URL to generate AI-powered notes</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <input
              type="text"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ 
                flex: '1', 
                minWidth: '300px', 
                padding: '12px 16px', 
                border: `2px solid ${inputBorder}`, 
                borderRadius: '12px', 
                fontSize: '14px', 
                outline: 'none', 
                transition: 'border-color 0.2s',
                backgroundColor: inputBg,
                color: textPrimary
              }}
              onFocus={(e) => e.target.style.borderColor = inputFocusBorder}
              onBlur={(e) => e.target.style.borderColor = inputBorder}
            />
            <button
              onClick={handleSubmit}
              disabled={notesLoading || !url.trim()}
              style={{
                padding: '12px 24px',
                background: notesLoading || !url.trim() ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #9333ea)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '500',
                border: 'none',
                cursor: notesLoading || !url.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '140px',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              {notesLoading ? (
                <>
                  <LoaderIcon className="spinner" />
                  <span>Processing</span>
                </>
              ) : (
                <>
                  <FileTextIcon />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>

          {notesLoading && (
            <ProgressBar 
              progress={notesProgress} 
              status="Generating your notes..." 
              darkMode={darkMode}
            />
          )}

          {error && (
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: darkMode ? '#7f1d1d' : '#fef2f2', border: `1px solid ${darkMode ? '#991b1b' : '#fecaca'}`, borderRadius: '12px', color: darkMode ? '#fecaca' : '#991b1b' }}>
              {error}
            </div>
          )}

          {notesGenerated && pdfUrl && (
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: darkMode ? '#064e3b' : '#f0fdf4', border: `1px solid ${darkMode ? '#059669' : '#bbf7d0'}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#16a34a' }}><CheckCircleIcon /></div>
                <span style={{ color: darkMode ? '#d1fae5' : '#166534', fontWeight: '500' }}>Notes generated successfully!</span>
              </div>
              <a
                href={pdfUrl}
                download="notes.pdf"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
              >
                <DownloadIcon />
                <span>Download PDF</span>
              </a>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)', padding: '32px', marginBottom: '32px', border: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ color: '#9333ea' }}><MessageSquareIcon /></div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: textPrimary, margin: 0 }}>Chat with Notes</h2>
          </div>
          <p style={{ color: textSecondary, marginBottom: '24px' }}>Ask questions about the video content</p>

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div style={{ marginBottom: '24px', maxHeight: '384px', overflowY: 'auto', paddingRight: '8px' }}>
              {chatHistory.map((entry, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  {/* Question */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                    <div style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)', color: 'white', borderRadius: '16px', borderTopRightRadius: '4px', padding: '12px 16px', maxWidth: '80%' }}>
                      <p style={{ fontSize: '14px', margin: 0 }}>{entry.question}</p>
                    </div>
                  </div>
                  
                  {/* Answer */}
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6', borderRadius: '16px', borderTopLeftRadius: '4px', padding: '12px 16px', maxWidth: '80%' }}>
                      {entry.loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <LoaderIcon className="spinner" />
                          <span style={{ fontSize: '14px', color: textSecondary }}>Thinking...</span>
                        </div>
                      ) : (
                        <p style={{ fontSize: '14px', color: textPrimary, margin: 0 }}>{entry.answer}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Ask a question about this video..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !chatLoading && handleChat()}
              style={{ 
                flex: '1', 
                padding: '12px 16px', 
                border: `2px solid ${inputBorder}`, 
                borderRadius: '12px', 
                fontSize: '14px', 
                outline: 'none', 
                transition: 'border-color 0.2s',
                backgroundColor: inputBg,
                color: textPrimary
              }}
              onFocus={(e) => e.target.style.borderColor = '#9333ea'}
              onBlur={(e) => e.target.style.borderColor = inputBorder}
            />
            <button
              onClick={handleChat}
              disabled={chatLoading || !question.trim()}
              style={{
                padding: '12px 24px',
                background: chatLoading || !question.trim() ? '#9ca3af' : 'linear-gradient(to right, #9333ea, #ec4899)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '500',
                border: 'none',
                cursor: chatLoading || !question.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '100px',
                transition: 'all 0.2s'
              }}
            >
              {chatLoading ? (
                <LoaderIcon className="spinner" />
              ) : (
                <SendIcon />
              )}
            </button>
          </div>

          {chatError && (
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: darkMode ? '#7f1d1d' : '#fef2f2', border: `1px solid ${darkMode ? '#991b1b' : '#fecaca'}`, borderRadius: '12px', color: darkMode ? '#fecaca' : '#991b1b' }}>
              {chatError}
            </div>
          )}
        </div>

        {/* Mindmap Section */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)', padding: '32px', border: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ color: '#ec4899' }}><BrainIcon /></div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: textPrimary, margin: 0 }}>Visual Mindmap</h2>
            </div>
            <button
              onClick={handleGenerateMindmap}
              disabled={mindmapLoading}
              style={{
                padding: '12px 24px',
                background: mindmapLoading ? '#9ca3af' : 'linear-gradient(to right, #ec4899, #f97316)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '500',
                border: 'none',
                cursor: mindmapLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {mindmapLoading ? (
                <>
                  <LoaderIcon className="spinner" />
                  <span>Generating</span>
                </>
              ) : (
                <>
                  <BrainIcon />
                  <span>Generate Mindmap</span>
                </>
              )}
            </button>
          </div>

          {mindmapLoading && (
            <ProgressBar 
              progress={mindmapProgress} 
              status="Creating your visual mindmap..." 
              darkMode={darkMode}
            />
          )}

          {mindmapData && !mindmapLoading && (
            <>
              <div
                ref={mindmapRef}
                style={{
                  width: '100%',
                  height: '600px',
                  background: darkMode 
                    ? 'linear-gradient(to bottom right, #1e293b, #334155)' 
                    : 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
                  borderRadius: '12px',
                  border: `2px solid ${borderColor}`,
                  overflow: 'hidden',
                  marginTop: '24px'
                }}
              >
                <Tree
                  data={mindmapData}
                  orientation="radial"
                  translate={translate}
                  zoomable={true}
                  collapsible={true}
                  separation={{ siblings: 2, nonSiblings: 2.5 }}
                  renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
                    <CustomNode nodeDatum={nodeDatum} toggleNode={toggleNode} darkMode={darkMode} />
                  )}
                  pathFunc="diagonal"
                  transitionDuration={300}
                  pathClassFunc={() => "custom-path"}
                  styles={{
                    links: {
                      stroke: darkMode ? '#64748b' : '#999',
                      strokeWidth: 2
                    }
                  }}
                />
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                  <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
                    </filter>
                  </defs>
                </svg>
              </div>
              <button
                onClick={handleDownloadMindmap}
                style={{
                  marginTop: '24px',
                  padding: '12px 24px',
                  background: 'linear-gradient(to right, #16a34a, #0d9488)',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '24px auto 0',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #15803d, #0f766e)'}
                onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #16a34a, #0d9488)'}
              >
                <DownloadIcon />
                <span>Download Mindmap as PNG</span>
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '64px', 
          padding: '32px', 
          textAlign: 'center',
          borderTop: `1px solid ${borderColor}`
        }}>
          <p style={{ 
            color: textSecondary, 
            fontSize: '14px',
            marginBottom: '8px'
          }}>
            Made with ❤️ by NoteFlow
          </p>
          <p style={{ 
            color: textSecondary, 
            fontSize: '12px'
          }}>
            Transform your learning experience with AI-powered note generation
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
