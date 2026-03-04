import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
    IconButton,
    Divider,
} from '@mui/material';
import {
    Folder,
    FolderOpen,
    PlayCircleOutline,
    DescriptionOutlined,
    CheckCircle,
    MenuOpen,
    Menu
} from '@mui/icons-material';

const FileTreeItem = ({ node, level = 0, onSelect, activeFile, completedFiles }) => {
    const [open, setOpen] = useState(false);

    if (node.isFolder) {
        return (
            <>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setOpen(!open)} sx={{ pl: level * 2 + 2 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            {open ? <FolderOpen color="primary" /> : <Folder color="action" />}
                        </ListItemIcon>
                        <ListItemText primary={node.name} primaryTypographyProps={{ fontWeight: 500 }} />
                    </ListItemButton>
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {node.children.map((child, idx) => (
                            <FileTreeItem
                                key={idx}
                                node={child}
                                level={level + 1}
                                onSelect={onSelect}
                                activeFile={activeFile}
                                completedFiles={completedFiles}
                            />
                        ))}
                    </List>
                </Collapse>
            </>
        );
    }

    const isActive = activeFile?.path === node.path;
    const isCompleted = completedFiles.includes(node.path);

    return (
        <ListItem disablePadding>
            <ListItemButton
                selected={isActive}
                onClick={() => onSelect(node)}
                sx={{ pl: level * 2 + 2 }}
            >
                <ListItemIcon sx={{ minWidth: 36 }}>
                    {node.isVideo ? <PlayCircleOutline color={isActive ? "primary" : "action"} /> : <DescriptionOutlined color={isActive ? "primary" : "action"} />}
                </ListItemIcon>
                <ListItemText
                    primary={node.name}
                    primaryTypographyProps={{
                        fontSize: '0.875rem',
                        color: isActive ? 'primary.main' : 'text.primary',
                        fontWeight: isActive ? 600 : 400
                    }}
                />
                {isCompleted && (
                    <CheckCircle sx={{ fontSize: 16, color: 'success.main', ml: 1 }} />
                )}
            </ListItemButton>
        </ListItem>
    );
};

export const Sidebar = ({ fileTree, onSelect, activeFile, completedFiles, open, toggleSidebar }) => {
    const drawerWidth = 320;

    return (
        <>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                sx={{
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        transition: 'width 0.3s ease',
                        overflowX: 'hidden'
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">Course Content</Typography>
                    <IconButton onClick={toggleSidebar}>
                        <MenuOpen />
                    </IconButton>
                </Box>
                <Divider />
                <List sx={{ pt: 0, flexGrow: 1, overflowY: 'auto' }}>
                    {fileTree.map((node, idx) => (
                        <FileTreeItem
                            key={idx}
                            node={node}
                            onSelect={onSelect}
                            activeFile={activeFile}
                            completedFiles={completedFiles}
                        />
                    ))}
                    {fileTree.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Folder sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                                No folders loaded. Please select a local directory to begin.
                            </Typography>
                        </Box>
                    )}
                </List>
            </Drawer>
            {!open && (
                <IconButton
                    onClick={toggleSidebar}
                    sx={{ position: 'fixed', left: 16, top: 12, zIndex: 1200, bgcolor: 'background.paper', boxShadow: 1 }}
                >
                    <Menu />
                </IconButton>
            )}
        </>
    );
}
