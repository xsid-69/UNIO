import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';

const AnimatedItem = ({ children, delay = 0, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4"
    >
      {children}
    </motion.div>
  );
};

const SubjectsList = ({
  branch,
  semester,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {
  const listRef = useRef(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!branch || !semester) {
        setSubjects([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/subjects?branch=${branch}&semester=${semester}`);
        if (!response.ok) {
          // Log the response status and text for debugging
          const errorText = await response.text();
          console.error("Error fetching subjects:", `HTTP error! status: ${response.status}`, errorText);
          throw new Error(`HTTP error! status: ${response.status}. See console for details.`);
        }
        const data = await response.json();
        setSubjects(data);
      } catch (e) {
        // If the error is already logged above, just set the message
        if (!e.message.includes("HTTP error!")) {
          console.error("Error fetching subjects:", e);
        }
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [branch, semester]);

  const handleScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = e => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, subjects.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < subjects.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(subjects[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subjects, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  if (loading) {
    return <div className="text-white">Loading subjects...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (subjects.length === 0) {
    return <div className="text-white">No subjects found for the selected branch and semester.</div>;
  }

  return (
    <div className={`relative md:w-[65vw] ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[700px] overflow-y-auto p-4 ${
          displayScrollbar
            ? '[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-thumb]:rounded-[4px]'
            : 'scrollbar-hide'
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          scrollbarColor: '#222 #060010'
        }}
      >
        {subjects.map((item, index) => (
          <AnimatedItem key={index} delay={0.1} index={index}>
            {item.to ? (
              <Link to={item.to} className="no-underline block">
                <div
                  className={`p-4 bg-gray-800 rounded-lg transition-all duration-200 ease-in-out active:scale-95 hover:bg-gray-700 hover:scale-99 cursor-pointer ${
                    selectedIndex === index ? 'bg-[#222]' : ''
                  } ${item.className || itemClassName}`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    setSelectedIndex(index);
                    if (onItemSelect) {
                      onItemSelect(item, index);
                    }
                  }}
                >
                  <p className="text-white m-0">{item.name}</p>
                </div>
              </Link>
            ) : (
              <div
                className={`p-4 bg-gray-800 rounded-lg transition-all duration-200 ease-in-out active:scale-95 hover:bg-gray-700 hover:scale-99 cursor-pointer ${
                  selectedIndex === index ? 'bg-[#222]' : ''
                } ${item.className || itemClassName}`}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  setSelectedIndex(index);
                  if (onItemSelect) {
                    onItemSelect(item, index);
                  }
                }}
              >
                <p className="text-white m-0">{item.name}</p>
              </div>
            )}
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b from-[#060010] to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#060010] to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};

export default SubjectsList;
