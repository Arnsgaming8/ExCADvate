import { 
  MousePointer2, Hand, ZoomIn, Rotate3D,
  Minus, Circle, Square, CornerUpLeft, Hexagon,
  Box, RotateCw, Layers, Copy,
  Scissors, Ruler, Eraser, Grid3X3,
  Undo2, Redo2, Save, FolderOpen, FilePlus
} from 'lucide-react';
import { useCADStore, ToolType } from '../store/cadStore';

export default function Toolbar() {
  const { activeTool, setActiveTool } = useCADStore();

  const toolGroups = [
    {
      name: 'View',
      tools: [
        { type: ToolType.SELECT, icon: MousePointer2, label: 'Select (S)' },
        { type: ToolType.PAN, icon: Hand, label: 'Pan (H)' },
        { type: ToolType.ZOOM, icon: ZoomIn, label: 'Zoom (Z)' },
        { type: ToolType.ORBIT, icon: Rotate3D, label: 'Orbit (O)' },
      ]
    },
    {
      name: 'Sketch',
      tools: [
        { type: ToolType.LINE, icon: Minus, label: 'Line (L)' },
        { type: ToolType.CIRCLE, icon: Circle, label: 'Circle (C)' },
        { type: ToolType.RECTANGLE, icon: Square, label: 'Rectangle (R)' },
        { type: ToolType.ARC, icon: CornerUpLeft, label: 'Arc (A)' },
        { type: ToolType.POLYGON, icon: Hexagon, label: 'Polygon (P)' },
        { type: ToolType.SPLINE, icon: RotateCw, label: 'Spline (Y)' },
      ]
    },
    {
      name: 'Features',
      tools: [
        { type: ToolType.EXTRUDE, icon: Box, label: 'Extrude (E)' },
        { type: ToolType.REVOLVE, icon: RotateCw, label: 'Revolve (V)' },
        { type: ToolType.LOFT, icon: Layers, label: 'Loft' },
        { type: ToolType.SWEEP, icon: Copy, label: 'Sweep' },
        { type: ToolType.FILLET, icon: Scissors, label: 'Fillet (F)' },
        { type: ToolType.CHAMFER, icon: Ruler, label: 'Chamfer' },
        { type: ToolType.SHELL, icon: Grid3X3, label: 'Shell' },
      ]
    },
    {
      name: 'Modify',
      tools: [
        { type: ToolType.MIRROR, icon: Copy, label: 'Mirror (M)' },
        { type: ToolType.PATTERN_LINEAR, icon: Minus, label: 'Linear Pattern' },
        { type: ToolType.PATTERN_CIRCULAR, icon: Circle, label: 'Circular Pattern' },
        { type: ToolType.MEASURE, icon: Ruler, label: 'Measure' },
        { type: ToolType.ERASER, icon: Eraser, label: 'Delete (Del)' },
      ]
    }
  ];

  return (
    <div className="w-16 bg-cad-panel border-r border-cad-border flex flex-col overflow-y-auto">
      <div className="p-2 border-b border-cad-border">
        <div className="flex flex-col gap-1">
          <ToolbarButton
            icon={FilePlus}
            label="New"
            onClick={() => useCADStore.getState().createProject('Untitled')}
          />
          <ToolbarButton
            icon={FolderOpen}
            label="Open"
            onClick={() => {/* Open file dialog */}}
          />
          <ToolbarButton
            icon={Save}
            label="Save"
            onClick={() => useCADStore.getState().saveProject()}
          />
        </div>
      </div>
      
      <div className="p-2 border-b border-cad-border">
        <div className="flex flex-col gap-1">
          <ToolbarButton
            icon={Undo2}
            label="Undo (Ctrl+Z)"
            onClick={() => useCADStore.getState().undo()}
          />
          <ToolbarButton
            icon={Redo2}
            label="Redo (Ctrl+Y)"
            onClick={() => useCADStore.getState().redo()}
          />
        </div>
      </div>

      {toolGroups.map((group) => (
        <div key={group.name} className="p-2 border-b border-cad-border last:border-b-0">
          <div className="text-[10px] text-cad-textMuted uppercase tracking-wider mb-2 text-center">
            {group.name}
          </div>
          <div className="flex flex-col gap-1">
            {group.tools.map((tool) => (
              <ToolButton
                key={tool.type}
                icon={tool.icon}
                label={tool.label}
                isActive={activeTool === tool.type}
                onClick={() => setActiveTool(tool.type)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

function ToolbarButton({ icon: Icon, label, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full aspect-square flex items-center justify-center rounded hover:bg-cad-border transition-colors text-cad-text"
      title={label}
    >
      <Icon size={20} />
    </button>
  );
}

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function ToolButton({ icon: Icon, label, isActive, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full aspect-square flex items-center justify-center rounded transition-colors ${
        isActive
          ? 'bg-cad-accent text-white'
          : 'text-cad-text hover:bg-cad-border'
      }`}
      title={label}
    >
      <Icon size={20} />
    </button>
  );
}
