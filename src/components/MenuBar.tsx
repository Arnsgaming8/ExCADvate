import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  FileText, Box, Circle, Save, FolderOpen, Download,
  Upload, Settings, HelpCircle, Keyboard,
  ChevronRight, Undo2, Redo2, Copy, Scissors, Clipboard,
  Trash2, ZoomIn, ZoomOut, Maximize, Grid3X3, EyeOff
} from 'lucide-react';
import { useCADStore, ToolType, ViewMode } from '../store/cadStore';

interface MenuItem {
  label?: string;
  shortcut?: string;
  icon?: LucideIcon;
  action?: () => void;
  type?: 'separator';
  submenu?: { label: string; action: () => void }[];
}

export default function MenuBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { project, undo, redo, saveProject } = useCADStore();

  const menus: { name: string; items: MenuItem[] }[] = [
    {
      name: 'File',
      items: [
        { label: 'New', shortcut: 'Ctrl+N', icon: FileText, action: () => useCADStore.getState().createProject('Untitled') },
        { label: 'Open...', shortcut: 'Ctrl+O', icon: FolderOpen, action: () => {} },
        { type: 'separator' },
        { label: 'Save', shortcut: 'Ctrl+S', icon: Save, action: saveProject },
        { label: 'Save As...', shortcut: 'Ctrl+Shift+S', icon: Save, action: () => {} },
        { type: 'separator' },
        { label: 'Import', icon: Upload, action: () => {} },
        { label: 'Export', icon: Download, submenu: [
          { label: 'STL', action: () => {} },
          { label: 'OBJ', action: () => {} },
          { label: 'STEP', action: () => {} },
          { label: 'IGES', action: () => {} },
        ]},
        { type: 'separator' },
        { label: 'Exit', action: () => {} },
      ]
    },
    {
      name: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', icon: Undo2, action: undo },
        { label: 'Redo', shortcut: 'Ctrl+Y', icon: Redo2, action: redo },
        { type: 'separator' },
        { label: 'Cut', shortcut: 'Ctrl+X', icon: Scissors, action: () => {} },
        { label: 'Copy', shortcut: 'Ctrl+C', icon: Copy, action: () => {} },
        { label: 'Paste', shortcut: 'Ctrl+V', icon: Clipboard, action: () => {} },
        { label: 'Delete', shortcut: 'Del', icon: Trash2, action: () => {} },
        { type: 'separator' },
        { label: 'Select All', shortcut: 'Ctrl+A', action: () => {} },
        { label: 'Deselect All', shortcut: 'Ctrl+Shift+A', action: () => {} },
      ]
    },
    {
      name: 'View',
      items: [
        { label: 'Zoom In', shortcut: '+', icon: ZoomIn, action: () => {} },
        { label: 'Zoom Out', shortcut: '-', icon: ZoomOut, action: () => {} },
        { label: 'Zoom to Fit', shortcut: 'F', icon: Maximize, action: () => useCADStore.getState().zoomToFit() },
        { type: 'separator' },
        { label: 'Shaded', icon: Box, action: () => useCADStore.getState().setViewMode(ViewMode.SHADED) },
        { label: 'Wireframe', icon: Grid3X3, action: () => useCADStore.getState().setViewMode(ViewMode.WIREFRAME) },
        { label: 'Hidden Line', icon: EyeOff, action: () => useCADStore.getState().setViewMode(ViewMode.HIDDEN_LINE) },
        { type: 'separator' },
        { label: 'Show Grid', icon: Grid3X3, action: () => {} },
        { label: 'Show Axes', icon: Box, action: () => {} },
      ]
    },
    {
      name: 'Sketch',
      items: [
        { label: 'New Sketch', shortcut: 'Ctrl+Shift+S', icon: Circle, action: () => {} },
        { label: 'Edit Sketch', shortcut: 'E', icon: FileText, action: () => {} },
        { type: 'separator' },
        { label: 'Line', shortcut: 'L', icon: Box, action: () => useCADStore.getState().setActiveTool(ToolType.LINE) },
        { label: 'Circle', shortcut: 'C', icon: Circle, action: () => useCADStore.getState().setActiveTool(ToolType.CIRCLE) },
        { label: 'Rectangle', shortcut: 'R', icon: Box, action: () => useCADStore.getState().setActiveTool(ToolType.RECTANGLE) },
        { label: 'Arc', shortcut: 'A', icon: Circle, action: () => useCADStore.getState().setActiveTool(ToolType.ARC) },
        { type: 'separator' },
        { label: 'Dimension', shortcut: 'D', icon: Box, action: () => {} },
        { label: 'Constraint', icon: Box, action: () => {} },
      ]
    },
    {
      name: 'Features',
      items: [
        { label: 'Extrude', shortcut: 'E', icon: Box, action: () => useCADStore.getState().setActiveTool(ToolType.EXTRUDE) },
        { label: 'Revolve', shortcut: 'V', icon: Circle, action: () => useCADStore.getState().setActiveTool(ToolType.REVOLVE) },
        { label: 'Loft', icon: Box, action: () => useCADStore.getState().setActiveTool(ToolType.LOFT) },
        { label: 'Sweep', icon: Box, action: () => useCADStore.getState().setActiveTool(ToolType.SWEEP) },
        { type: 'separator' },
        { label: 'Fillet', shortcut: 'F', icon: Circle, action: () => useCADStore.getState().setActiveTool(ToolType.FILLET) },
        { label: 'Chamfer', icon: Box, action: () => useCADStore.getState().setActiveTool(ToolType.CHAMFER) },
        { label: 'Shell', icon: Box, action: () => useCADStore.getState().setActiveTool(ToolType.SHELL) },
        { type: 'separator' },
        { label: 'Mirror', shortcut: 'M', icon: Box, action: () => useCADStore.getState().setActiveTool(ToolType.MIRROR) },
        { label: 'Linear Pattern', icon: Box, action: () => useCADStore.getState().setActiveTool(ToolType.PATTERN_LINEAR) },
        { label: 'Circular Pattern', icon: Circle, action: () => useCADStore.getState().setActiveTool(ToolType.PATTERN_CIRCULAR) },
      ]
    },
    {
      name: 'Tools',
      items: [
        { label: 'Measure', shortcut: 'M', icon: Box, action: () => useCADStore.getState().setActiveTool(ToolType.MEASURE) },
        { label: 'Section View', icon: Box, action: () => {} },
        { label: 'Interference Check', icon: Circle, action: () => {} },
        { type: 'separator' },
        { label: 'Parameters', icon: Box, action: () => {} },
        { label: 'Equations', icon: Box, action: () => {} },
        { type: 'separator' },
        { label: 'Macros', icon: FileText, action: () => {} },
        { label: 'Add-ins', icon: Box, action: () => {} },
      ]
    },
    {
      name: 'Help',
      items: [
        { label: 'Documentation', icon: FileText, action: () => {} },
        { label: 'Tutorials', icon: FileText, action: () => {} },
        { label: 'Keyboard Shortcuts', shortcut: '?', icon: Keyboard, action: () => {} },
        { type: 'separator' },
        { label: 'Check for Updates', icon: Box, action: () => {} },
        { label: 'About ExCADvate', icon: Circle, action: () => {} },
      ]
    },
  ];

  return (
    <div className="h-9 bg-cad-panel border-b border-cad-border flex items-center px-2 select-none">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 mr-4">
          <Box className="text-cad-accent" size={20} />
          <span className="font-semibold text-cad-text">ExCADvate</span>
        </div>
        
        {menus.map((menu) => (
          <div
            key={menu.name}
            className="relative"
            onMouseEnter={() => activeMenu && setActiveMenu(menu.name)}
          >
            <button
              onClick={() => setActiveMenu(activeMenu === menu.name ? null : menu.name)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                activeMenu === menu.name
                  ? 'bg-cad-accent text-white'
                  : 'text-cad-text hover:bg-cad-border'
              }`}
            >
              {menu.name}
            </button>
            
            {activeMenu === menu.name && (
              <div 
                className="absolute top-full left-0 mt-1 w-56 bg-cad-panel border border-cad-border rounded-lg shadow-xl z-50 py-1"
                onMouseLeave={() => setActiveMenu(null)}
              >
                {menu.items.map((item, index) => (
                  item.type === 'separator' ? (
                    <div key={index} className="my-1 border-t border-cad-border" />
                  ) : item.submenu ? (
                    <div key={index} className="relative group">
                      <button className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-cad-text hover:bg-cad-accent hover:text-white">
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon size={14} />}
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight size={14} />
                      </button>
                      <div className="absolute left-full top-0 ml-1 w-40 bg-cad-panel border border-cad-border rounded-lg shadow-xl py-1 hidden group-hover:block">
                        {item.submenu.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => {
                              subItem.action();
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-sm text-cad-text hover:bg-cad-accent hover:text-white"
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      key={index}
                      onClick={() => {
                        item.action?.();
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-cad-text hover:bg-cad-accent hover:text-white"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon size={14} />}
                        <span>{item.label}</span>
                      </div>
                      {item.shortcut && (
                        <span className="text-xs text-cad-textMuted">{item.shortcut}</span>
                      )}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <span className="text-xs text-cad-textMuted">
          {project?.name || 'Untitled'}
        </span>
        <button className="p-1.5 text-cad-textMuted hover:text-cad-text hover:bg-cad-border rounded">
          <Settings size={16} />
        </button>
        <button className="p-1.5 text-cad-textMuted hover:text-cad-text hover:bg-cad-border rounded">
          <HelpCircle size={16} />
        </button>
      </div>
    </div>
  );
}
