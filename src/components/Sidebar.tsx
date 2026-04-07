import { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, FolderTree, Layers,
  Palette, Ruler, Box, Grid3X3, Eye
} from 'lucide-react';
import { useCADStore } from '../store/cadStore';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('features');

  const tabs = [
    { id: 'features', icon: FolderTree, label: 'Features' },
    { id: 'layers', icon: Layers, label: 'Layers' },
    { id: 'materials', icon: Palette, label: 'Materials' },
    { id: 'dimensions', icon: Ruler, label: 'Dimensions' },
    { id: 'constraints', icon: Grid3X3, label: 'Constraints' },
  ];

  if (collapsed) {
    return (
      <div className="w-10 bg-cad-panel border-r border-cad-border flex flex-col items-center py-2">
        <button
          onClick={() => setCollapsed(false)}
          className="p-1.5 text-cad-textMuted hover:text-cad-text hover:bg-cad-border rounded mb-2"
        >
          <ChevronRight size={16} />
        </button>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCollapsed(false);
            }}
            className={`p-2 my-1 rounded transition-colors ${
              activeTab === tab.id && !collapsed
                ? 'bg-cad-accent text-white'
                : 'text-cad-textMuted hover:text-cad-text hover:bg-cad-border'
            }`}
            title={tab.label}
          >
            <tab.icon size={18} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 bg-cad-panel border-r border-cad-border flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-cad-border">
        <span className="text-xs font-semibold text-cad-text uppercase tracking-wider">
          {tabs.find(t => t.id === activeTab)?.label}
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 text-cad-textMuted hover:text-cad-text hover:bg-cad-border rounded"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="flex border-b border-cad-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 p-2 transition-colors ${
              activeTab === tab.id
                ? 'bg-cad-accent text-white'
                : 'text-cad-textMuted hover:text-cad-text hover:bg-cad-border'
            }`}
            title={tab.label}
          >
            <tab.icon size={16} className="mx-auto" />
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'features' && <FeaturesTab />}
        {activeTab === 'layers' && <LayersTab />}
        {activeTab === 'materials' && <MaterialsTab />}
        {activeTab === 'dimensions' && <DimensionsTab />}
        {activeTab === 'constraints' && <ConstraintsTab />}
      </div>
    </div>
  );
}

function FeaturesTab() {
  const { project } = useCADStore();
  
  if (!project) return null;

  const rootComponent = project.assembly.components.find(
    c => c.id === project.assembly.rootComponentId
  );

  return (
    <div className="space-y-2">
      <div className="text-xs text-cad-textMuted mb-2">Component Features</div>
      {rootComponent?.features.map((feature, index) => (
        <div
          key={feature.id}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-cad-border/50 cursor-pointer"
        >
          <span className="text-xs text-cad-textMuted w-6">{index + 1}</span>
          <Box size={14} className="text-cad-accent" />
          <span className="text-sm text-cad-text">{feature.name}</span>
          {feature.suppressed && (
            <span className="text-xs text-cad-textMuted italic">(suppressed)</span>
          )}
        </div>
      ))}
      {rootComponent?.features.length === 0 && (
        <div className="text-sm text-cad-textMuted text-center py-4">
          No features yet
        </div>
      )}
    </div>
  );
}

function LayersTab() {
  const { project, updateLayer } = useCADStore();
  
  if (!project) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs text-cad-textMuted mb-2">Layers</div>
      {project.layers.map(layer => (
        <div
          key={layer.id}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-cad-border/50"
        >
          <button
            onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
            className="text-cad-textMuted hover:text-cad-text"
          >
            {layer.visible ? <Eye size={14} /> : <Eye size={14} className="opacity-30" />}
          </button>
          <span
            className="w-3 h-3 rounded border border-cad-border"
            style={{ backgroundColor: layer.color }}
          />
          <span className="text-sm text-cad-text flex-1">{layer.name}</span>
          <span className="text-xs text-cad-textMuted">
            {layer.entities.length}
          </span>
        </div>
      ))}
      <button className="w-full mt-2 px-3 py-1.5 text-xs bg-cad-accent text-white rounded hover:bg-cad-accentHover transition-colors">
        Add Layer
      </button>
    </div>
  );
}

function MaterialsTab() {
  const { project } = useCADStore();
  
  if (!project) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs text-cad-textMuted mb-2">Materials</div>
      {project.materials.map(material => (
        <div
          key={material.id}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-cad-border/50 cursor-pointer"
        >
          <span
            className="w-4 h-4 rounded border border-cad-border"
            style={{ backgroundColor: material.color }}
          />
          <div className="flex-1">
            <div className="text-sm text-cad-text">{material.name}</div>
            <div className="text-xs text-cad-textMuted">
              Metal: {material.metalness} | Rough: {material.roughness}
            </div>
          </div>
        </div>
      ))}
      <button className="w-full mt-2 px-3 py-1.5 text-xs bg-cad-accent text-white rounded hover:bg-cad-accentHover transition-colors">
        Add Material
      </button>
    </div>
  );
}

function DimensionsTab() {
  return (
    <div className="space-y-2">
      <div className="text-xs text-cad-textMuted mb-2">Dimensions</div>
      <div className="text-sm text-cad-textMuted text-center py-4">
        No dimensions added
      </div>
    </div>
  );
}

function ConstraintsTab() {
  const { project } = useCADStore();
  
  if (!project) return null;

  const allConstraints = project.assembly.components
    .flatMap(c => c.sketches)
    .flatMap(s => s.constraints);

  return (
    <div className="space-y-2">
      <div className="text-xs text-cad-textMuted mb-2">Constraints</div>
      {allConstraints.map(constraint => (
        <div
          key={constraint.id}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-cad-border/50"
        >
          <Grid3X3 size={14} className="text-cad-accent" />
          <span className="text-sm text-cad-text capitalize">{constraint.type}</span>
          <span className="text-xs text-cad-textMuted">
            {constraint.entityIds.length} entities
          </span>
        </div>
      ))}
      {allConstraints.length === 0 && (
        <div className="text-sm text-cad-textMuted text-center py-4">
          No constraints
        </div>
      )}
    </div>
  );
}
