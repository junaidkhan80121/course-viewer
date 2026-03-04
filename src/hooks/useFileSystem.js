import { useState } from 'react';

export const useFileSystem = () => {
    const [fileTree, setFileTree] = useState([]);
    const [flatFiles, setFlatFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const traverseDirectory = async (dirHandle, path = '') => {
        const list = [];
        const flatList = [];

        for await (const entry of dirHandle.values()) {
            const entryPath = `${path}/${entry.name}`;

            if (entry.kind === 'file') {
                if (entry.name.match(/\.(mp4|webm|mkv|txt|md|csv)$/i)) {
                    const isVideo = !!entry.name.match(/\.(mp4|webm|mkv)$/i);
                    const node = {
                        name: entry.name,
                        handle: entry,
                        path: entryPath,
                        isFolder: false,
                        isVideo
                    };
                    list.push(node);
                    flatList.push(node);
                }
            } else if (entry.kind === 'directory') {
                const { children, flatChildren } = await traverseDirectory(entry, entryPath);
                if (children.length > 0) {
                    list.push({
                        name: entry.name,
                        handle: entry,
                        path: entryPath,
                        children,
                        isFolder: true
                    });
                    flatList.push(...flatChildren);
                }
            }
        }

        const sortFn = (a, b) => {
            // Natural sorting logic so 'Chapter 2' comes before 'Chapter 10'
            const numA = parseInt(a.name.match(/\d+/)?.[0] || '0', 10);
            const numB = parseInt(b.name.match(/\d+/)?.[0] || '0', 10);

            if (a.isFolder === b.isFolder) {
                if (numA !== numB) return numA - numB;
                return a.name.localeCompare(b.name);
            }
            return a.isFolder ? -1 : 1;
        };

        return {
            children: list.sort(sortFn),
            flatChildren: flatList
        };
    };

    const selectDirectory = async () => {
        if (!('showDirectoryPicker' in window)) {
            alert("Your browser doesn't support the File System Access API. Please use Google Chrome, Edge, or Opera.");
            return null;
        }

        try {
            const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
            setLoading(true);
            const { children, flatChildren } = await traverseDirectory(dirHandle, '');

            setFileTree(children);
            setFlatFiles(flatChildren);
            setLoading(false);
            return { children, flatChildren, dirName: dirHandle.name };
        } catch (err) {
            console.error("Directory selection cancelled or failed", err);
            setLoading(false);
            return null;
        }
    };

    const getFileUrl = async (fileHandle) => {
        const file = await fileHandle.getFile();
        return URL.createObjectURL(file);
    };

    const getFileText = async (fileHandle) => {
        const file = await fileHandle.getFile();
        return await file.text();
    }

    return { fileTree, flatFiles, selectDirectory, loading, getFileUrl, getFileText };
};
