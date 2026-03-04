import React from 'react';
import { Box, Button, Typography, LinearProgress, Paper } from '@mui/material';
import {
    NavigateBefore,
    NavigateNext,
    CheckCircle,
    RadioButtonUnchecked
} from '@mui/icons-material';

export const Controls = ({
    activeFile,
    onPrevious,
    onNext,
    onMarkCompleted,
    isCompleted,
    flatFiles,
    completedFiles,
    hasNext,
    hasPrevious
}) => {
    if (!activeFile) return null;

    const total = flatFiles.length;
    const completedCount = completedFiles.length;
    // Determine actual unique completions by intersection just in case
    const progress = total === 0 ? 0 : (completedCount / total) * 100;

    return (
        <Paper
            elevation={4}
            sx={{
                p: 2,
                px: 4,
                borderRadius: 0,
                position: 'sticky',
                bottom: 0,
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
                    />
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight="500">
                    {completedCount} / {total} Completed ({Math.round(progress)}%)
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    startIcon={<NavigateBefore />}
                    onClick={onPrevious}
                    variant="outlined"
                    color="inherit"
                    disabled={!hasPrevious}
                >
                    Previous
                </Button>

                <Button
                    variant={isCompleted ? "outlined" : "contained"}
                    color={isCompleted ? "success" : "primary"}
                    onClick={onMarkCompleted}
                    startIcon={isCompleted ? <CheckCircle /> : <RadioButtonUnchecked />}
                    size="large"
                    sx={{ minWidth: 200, py: 1 }}
                >
                    {isCompleted ? "Completed" : "Mark as Completed"}
                </Button>

                <Button
                    endIcon={<NavigateNext />}
                    onClick={onNext}
                    variant="outlined"
                    color="inherit"
                    disabled={!hasNext}
                >
                    Next
                </Button>
            </Box>
        </Paper>
    );
};
