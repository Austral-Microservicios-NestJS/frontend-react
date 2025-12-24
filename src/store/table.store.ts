import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ColumnVisibility {
    [tableId: string]: {
        [columnId: string]: boolean;
    };
}

interface MinimizedColumns {
    [tableId: string]: {
        [columnId: string]: boolean;
    };
}

interface TableStore {
    columnVisibility: ColumnVisibility;
    minimizedColumns: MinimizedColumns;
    setColumnVisibility: (tableId: string, visibility: Record<string, boolean>) => void;
    resetColumnVisibility: (tableId: string) => void;
    toggleColumn: (tableId: string, columnId: string) => void;
    setMinimizedColumns: (tableId: string, minimized: Record<string, boolean>) => void;
    resetMinimizedColumns: (tableId: string) => void;
    toggleMinimizedColumn: (tableId: string, columnId: string) => void;
}

export const useTableStore = create<TableStore>()(
    persist(
        (set) => ({
            columnVisibility: {},
            minimizedColumns: {},

            setColumnVisibility: (tableId, visibility) =>
                set((state) => ({
                    columnVisibility: {
                        ...state.columnVisibility,
                        [tableId]: visibility,
                    },
                })),

            resetColumnVisibility: (tableId) =>
                set((state) => {
                    const newVisibility = { ...state.columnVisibility };
                    delete newVisibility[tableId];
                    return { columnVisibility: newVisibility };
                }),

            toggleColumn: (tableId, columnId) =>
                set((state) => ({
                    columnVisibility: {
                        ...state.columnVisibility,
                        [tableId]: {
                            ...(state.columnVisibility[tableId] || {}),
                            [columnId]: !(state.columnVisibility[tableId]?.[columnId] ?? true),
                        },
                    },
                })),

            setMinimizedColumns: (tableId, minimized) =>
                set((state) => ({
                    minimizedColumns: {
                        ...state.minimizedColumns,
                        [tableId]: minimized,
                    },
                })),

            resetMinimizedColumns: (tableId) =>
                set((state) => {
                    const newMinimized = { ...state.minimizedColumns };
                    delete newMinimized[tableId];
                    return { minimizedColumns: newMinimized };
                }),

            toggleMinimizedColumn: (tableId, columnId) =>
                set((state) => ({
                    minimizedColumns: {
                        ...state.minimizedColumns,
                        [tableId]: {
                            ...(state.minimizedColumns[tableId] || {}),
                            [columnId]: !(state.minimizedColumns[tableId]?.[columnId] ?? false),
                        },
                    },
                })),
        }),
        {
            name: 'table-storage',
        }
    )
);