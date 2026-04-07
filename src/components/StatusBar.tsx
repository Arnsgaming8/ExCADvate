import { useCADStore, ToolType } from '../store/cadStore';
import { 
  MousePointer2, Hand, Move3d, ZoomIn, Minus, Circle, Square,
  CornerUpLeft, Box, RotateCw, Scissors, Ruler, Eye, Grid3X3,
  Type, Hash, Layers
} from 'lucide-react';

export default function StatusBar() {
  const { 
    project, 
    activeTool, 
    selectedIds, 
    snapPoint,
    currentSketchId 
  } = useCADStore();

  const getToolIcon = () => {
    switch (activeTool) {
      case ToolType.SELECT: return MousePointer2;
      case ToolType.PAN: return Hand;
      case ToolType.ZOOM: return ZoomIn;
      case ToolType.ORBIT: return Move3d;
      case ToolType.LINE: return Minus;
      case ToolType.CIRCLE: return Circle;
      case ToolType.RECTANGLE: return Square;
      case ToolType.ARC: return CornerUpLeft;
      case ToolType.EXTRUDE: return Box;
      case ToolType.REVOLVE: return RotateCw;
      case ToolType.FILLET: return Scissors;
      case ToolType.CHAMFER: return Ruler;
      case ToolType.MEASURE: return Ruler;
      default: return MousePointer2;
    }
  };

  const ToolIcon = getToolIcon();

  return (
    <div className="h-7 bg-cad-panel border-t border-cad-border flex items-center px-3 gap-4 text-xs">
      {/* Tool indicator */}
      <div className="flex items-center gap-2 text-cad-text">
        <ToolIcon size={14} />
        <span className="capitalize">{activeTool.replace('_', ' ')}</span>
      </div>

      <div className="w-px h-4 bg-cad-border" />

      {/* Selection count */}
      <div className="flex items-center gap-2 text-cad-textMuted">
        <span>Selected:</span>
        <span className="text-cad-text">{selectedIds.length}</span>
      </div>

      <div className="w-px h-4 bg-cad-border" />

      {/* Cursor position */}
      <div className="flex items-center gap-2 text-cad-textMuted">
        <span>X:</span>
        <span className="text-cad-text font-mono w-16">
          {snapPoint ? snapPoint.x.toFixed(2) : '---'}
        </span>
        <span>Y:</span>
        <span className="text-cad-text font-mono w-16">
          {snapPoint ? snapPoint.y.toFixed(2) : '---'}
        </span>
        <span>Z:</span>
        <span className="text-cad-text font-mono w-16">
          {snapPoint ? snapPoint.z.toFixed(2) : '---'}
        </span>
      </div>

      <div className="flex-1" />

      {/* Units */}
      <div className="flex items-center gap-2 text-cad-textMuted">
        <Type size={12} />
        <span className="uppercase">{project?.units.length || 'mm'}</span>
      </div>

      <div className="w-px h-4 bg-cad-border" />

      {/* Grid */}
      <div className="flex items-center gap-2 text-cad-textMuted">
        <Grid3X3 size={12} />
        <span>{project?.viewSettings.showGrid ? 'ON' : 'OFF'}</span>
      </div>

      <div className="w-px h-4 bg-cad-border" />

      {/* Sketch status */}
      <div className="flex items-center gap-2 text-cad-textMuted">
        <Layers size={12} />
        <span className={currentSketchId ? 'text-cad-accent' : ''}>
          {currentSketchId ? 'Editing Sketch' : 'No Active Sketch'}
        </span>
      </div>

      <div className="w-px h-4 bg-cad-border" />

      {/* View mode */}
      <div className="flex items-center gap-2 text-cad-textMuted">
        <Eye size={12} />
        <span className="capitalize">{project?.viewSettings.mode || 'shaded'}</span>
      </div>

      <div className="w-px h-4 bg-cad-border" />

      {/* Memory indicator (placeholder) */}
      <div className="flex items-center gap-2 text-cad-textMuted">
        <Hash size={12} />
        <span>Ready</span>
      </div>
    </div>
  );
}
