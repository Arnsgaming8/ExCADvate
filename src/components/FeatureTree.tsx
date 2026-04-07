import { useState } from 'react';
import { 
  ChevronRight, ChevronDown, Eye, EyeOff,
  Box, FileText, Circle, Layers, Settings, MoreVertical
} from 'lucide-react';
import { useCADStore } from '../store/cadStore';

export default function FeatureTree() {
  const { project } = useCADStore();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!project) {
    return (
      <div className="p-4 text-cad-textMuted text-sm">
        No project loaded
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  const rootComponent = project.assembly.components.find(
    c => c.id === project.assembly.rootComponentId
  );

  return (
    <div className="flex-1 overflow-y-auto border-b border-cad-border">
      <div className="sticky top-0 bg-cad-panel z-10 px-3 py-2 border-b border-cad-border flex items-center justify-between">
        <span className="text-xs font-semibold text-cad-text uppercase tracking-wider">
          Feature Tree
        </span>
        <button className="text-cad-textMuted hover:text-cad-text">
          <MoreVertical size={16} />
        </button>
      </div>
      
      <div className="py-2">
        {/* Origin */}
        <TreeItem
          id="origin"
          icon={Circle}
          label="Origin"
          expanded={expandedItems.has('origin')}
          onToggle={() => toggleExpand('origin')}
        />

        {/* Sketches */}
        <TreeItem
          id="sketches"
          icon={FileText}
          label={`Sketches (${rootComponent?.sketches.length || 0})`}
          expanded={expandedItems.has('sketches')}
          onToggle={() => toggleExpand('sketches')}
        >
          {rootComponent?.sketches.map(sketch => (
            <TreeItem
              key={sketch.id}
              id={sketch.id}
              icon={FileText}
              label={sketch.name}
              isActive={sketch.active}
              expanded={expandedItems.has(sketch.id)}
              onToggle={() => toggleExpand(sketch.id)}
              onVisibilityToggle={() => {/* toggle visibility */}}
              visible={sketch.visible}
            />
          ))}
        </TreeItem>

        {/* Bodies */}
        <TreeItem
          id="bodies"
          icon={Box}
          label={`Bodies (${rootComponent?.bodies.length || 0})`}
          expanded={expandedItems.has('bodies')}
          onToggle={() => toggleExpand('bodies')}
        >
          {rootComponent?.bodies.map(body => (
            <TreeItem
              key={body.id}
              id={body.id}
              icon={Box}
              label={body.name}
              expanded={expandedItems.has(body.id)}
              onToggle={() => toggleExpand(body.id)}
              onVisibilityToggle={() => {/* toggle visibility */}}
              visible={body.visible}
            />
          ))}
        </TreeItem>

        {/* Features */}
        <TreeItem
          id="features"
          icon={Layers}
          label={`Features (${rootComponent?.features.length || 0})`}
          expanded={expandedItems.has('features')}
          onToggle={() => toggleExpand('features')}
        >
          {rootComponent?.features.map(feature => (
            <TreeItem
              key={feature.id}
              id={feature.id}
              icon={getFeatureIcon(feature.type)}
              label={feature.name}
              expanded={expandedItems.has(feature.id)}
              onToggle={() => toggleExpand(feature.id)}
              onVisibilityToggle={() => {/* toggle visibility */}}
              visible={feature.enabled && !feature.suppressed}
              suppressed={feature.suppressed}
            />
          ))}
        </TreeItem>

        {/* Materials */}
        <TreeItem
          id="materials"
          icon={Settings}
          label={`Materials (${project.materials.length})`}
          expanded={expandedItems.has('materials')}
          onToggle={() => toggleExpand('materials')}
        >
          {project.materials.map(material => (
            <TreeItem
              key={material.id}
              id={material.id}
              icon={Circle}
              label={material.name}
              color={material.color}
              expanded={expandedItems.has(material.id)}
              onToggle={() => toggleExpand(material.id)}
            />
          ))}
        </TreeItem>
      </div>
    </div>
  );
}

interface TreeItemProps {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  children?: React.ReactNode;
  expanded?: boolean;
  onToggle: () => void;
  onVisibilityToggle?: () => void;
  visible?: boolean;
  isActive?: boolean;
  suppressed?: boolean;
  color?: string;
}

function TreeItem({
  id,
  icon: Icon,
  label,
  children,
  expanded,
  onToggle,
  onVisibilityToggle,
  visible = true,
  isActive = false,
  suppressed = false,
  color
}: TreeItemProps) {
  const hasChildren = Boolean(children);
  const { select, selectedIds } = useCADStore();
  const isSelected = selectedIds.includes(id);

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-cad-border/50 transition-colors ${
          isActive ? 'bg-cad-accent/20' : ''
        } ${isSelected ? 'bg-cad-accent/40' : ''} ${suppressed ? 'opacity-50' : ''}`}
        onClick={() => select(id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="text-cad-textMuted hover:text-cad-text"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-[14px]" />
        )}
        
        {color ? (
          <span
            className="w-3 h-3 rounded-full border border-cad-border"
            style={{ backgroundColor: color }}
          />
        ) : (
          <Icon size={14} className={`${isActive ? 'text-cad-accent' : 'text-cad-textMuted'}`} />
        )}
        
        <span className={`text-sm flex-1 truncate ${suppressed ? 'italic' : ''}`}>
          {label}
        </span>
        
        {onVisibilityToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVisibilityToggle();
            }}
            className="text-cad-textMuted hover:text-cad-text"
          >
            {visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
      </div>
      
      {hasChildren && expanded && (
        <div className="ml-4 border-l border-cad-border">
          {children}
        </div>
      )}
    </div>
  );
}

function getFeatureIcon(type: string): React.ComponentType<any> {
  switch (type) {
    case 'sketch':
      return FileText;
    case 'extrude':
    case 'revolve':
    case 'loft':
    case 'sweep':
      return Box;
    case 'fillet':
    case 'chamfer':
      return Layers;
    default:
      return Circle;
  }
}
