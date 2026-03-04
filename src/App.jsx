import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, IconButton, Button, Tooltip } from '@mui/material';
import { Brightness4, Brightness7, FolderOpen } from '@mui/icons-material';
import { getTheme } from './theme';
import { useFileSystem } from './hooks/useFileSystem';
import { Sidebar } from './components/Sidebar';
import { Viewer } from './components/Viewer';
import { Controls } from './components/Controls';

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFile, setActiveFile] = useState(null);
  const [completedFiles, setCompletedFiles] = useState([]);

  const { fileTree, flatFiles, selectDirectory, loading, getFileUrl, getFileText } = useFileSystem();

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  // Handle local storage for mode and dark mode body class
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    if (mode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [mode]);

  const handleToggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectDirectory = async () => {
    const result = await selectDirectory();
    if (result) {
      setActiveFile(null);
      if (!sidebarOpen) setSidebarOpen(true);
    }
  };

  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('localLearnerProgress');
    if (saved) {
      setCompletedFiles(JSON.parse(saved));
    }
  }, []);

  // Save progress unconditionally whenever completedFiles changes
  useEffect(() => {
    localStorage.setItem('localLearnerProgress', JSON.stringify(completedFiles));
  }, [completedFiles]);

  const handleMarkCompleted = () => {
    if (!activeFile) return;
    setCompletedFiles(prev => {
      if (prev.includes(activeFile.path)) {
        return prev.filter(p => p !== activeFile.path); // toggle off
      }
      return [...prev, activeFile.path];
    });
  };

  const handleVideoEnded = () => {
    if (activeFile && !completedFiles.includes(activeFile.path)) {
      setCompletedFiles(prev => [...prev, activeFile.path]);
    }
    // Auto advance
    handleNext();
  };

  const currentIndex = activeFile ? flatFiles.findIndex(f => f.path === activeFile.path) : -1;
  const hasNext = currentIndex !== -1 && currentIndex < flatFiles.length - 1;
  const hasPrevious = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      setActiveFile(flatFiles[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      setActiveFile(flatFiles[currentIndex - 1]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar
          fileTree={fileTree}
          onSelect={setActiveFile}
          activeFile={activeFile}
          completedFiles={completedFiles}
          open={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
          <AppBar position="static" color="inherit" elevation={0} sx={{ zIndex: 10 }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                Local Learner 📚
              </Typography>

              <Button
                variant="contained"
                color="primary"
                startIcon={<FolderOpen />}
                onClick={handleSelectDirectory}
                disabled={loading}
                sx={{ mr: 2 }}
              >
                {loading ? 'Loading...' : 'Select Course Folder'}
              </Button>

              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton onClick={handleToggleTheme} color="inherit">
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>

          <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <Viewer
                activeFile={activeFile}
                getFileUrl={getFileUrl}
                getFileText={getFileText}
                onVideoEnded={handleVideoEnded}
              />
            </Box>

            <Box sx={{ flexShrink: 0 }}>
              <Controls
                activeFile={activeFile}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onMarkCompleted={handleMarkCompleted}
                isCompleted={activeFile ? completedFiles.includes(activeFile.path) : false}
                flatFiles={flatFiles}
                completedFiles={completedFiles}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
