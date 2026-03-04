import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';

export const Viewer = ({ activeFile, getFileUrl, getFileText, onVideoEnded }) => {
    const [contentUrl, setContentUrl] = useState(null);
    const [textContent, setTextContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;

        const loadContent = async () => {
            if (!activeFile) {
                if (active) {
                    setContentUrl(null);
                    setTextContent('');
                }
                return;
            }

            setLoading(true);
            try {
                if (activeFile.isVideo) {
                    const url = await getFileUrl(activeFile.handle);
                    if (active) setContentUrl(url);
                } else {
                    const text = await getFileText(activeFile.handle);
                    if (active) setTextContent(text);
                }
            } catch (err) {
                console.error("Error loading file", err);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadContent();

        return () => {
            active = false;
            if (contentUrl) {
                URL.revokeObjectURL(contentUrl); // Release memory when file changes
            }
        };
    }, [activeFile, getFileUrl, getFileText]);

    if (!activeFile) {
        return (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
                <Box textAlign="center" sx={{ opacity: 0.6 }}>
                    <Typography variant="h5" color="text.secondary" gutterBottom>Nothing Selected</Typography>
                    <Typography variant="body2" color="text.secondary">Select a video or document from the sidebar.</Typography>
                </Box>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', overflowY: 'auto', p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
            {activeFile.isVideo ? (
                <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', boxShadow: 6, borderRadius: 2, overflow: 'hidden', bgcolor: 'black' }}>
                    <video
                        key={contentUrl}
                        controls
                        autoPlay
                        onEnded={onVideoEnded}
                        style={{ width: '100%', display: 'block', maxHeight: '75vh' }}
                    >
                        <source src={contentUrl} />
                        Your browser does not support the video tag.
                    </video>
                </Box>
            ) : (
                <Paper elevation={1} sx={{ p: { xs: 3, md: 6 }, maxWidth: '800px', margin: '0 auto', borderRadius: 3, minHeight: '60vh' }}>
                    <Box className="markdown-body" sx={{
                        '& img': { maxWidth: '100%', borderRadius: 1 },
                        '& pre': { p: 2, bgcolor: 'background.default', borderRadius: 1, overflowX: 'auto', fontSize: '0.875rem' },
                        '& code': { fontFamily: 'monospace', bgcolor: 'background.default', p: 0.5, borderRadius: 1 },
                        '& h1, & h2': { borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb: 2 }
                    }}>
                        <ReactMarkdown>{textContent}</ReactMarkdown>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};
