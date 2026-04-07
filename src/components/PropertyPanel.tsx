import { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Type,
  Palette, Box, MoreHorizontal
} from 'lucide-react';
import { useCADStore } from '../store/cadStore';

export default function PropertyPanel() {
  const { project, selectedIds } = useCADStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['general', 'appearance', 'transform'])
  );

  if (!project) {
    return (
      <div className="w-72 bg-cad-panel border-l border-cad-border overflow-y-auto">
        <div className="p-4 text-cad-textMuted text-sm">
          No properties to display
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  const selectedEntity = selectedIds.length === 1
    ? findEntityById(project, selectedIds[0])
    : null;

  return (
    <div className="flex-1 bg-cad-panel border-t border-cad-border overflow-y-auto min-h-0">
      <div className="sticky top-0 bg-cad-panel z-10 px-3 py-2 border-b border-cad-border flex items-center justify-between">
        <span className="text-xs font-semibold text-cad-text uppercase tracking-wider">
          Properties
        </span>
        <div className="flex items-center gap-1">
          <button className="text-cad-textMuted hover:text-cad-text p-1">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="p-3">
        {selectedIds.length === 0 ? (
          <div className="text-cad-textMuted text-sm text-center py-4">
            Select an object to view properties
          </div>
        ) : selectedIds.length > 1 ? (
          <div className="text-cad-textMuted text-sm text-center py-4">
            {selectedIds.length} objects selected
          </div>
        ) : selectedEntity ? (
          <>
            <PropertySection
              title="General"
              icon={Type}
              expanded={expandedSections.has('general')}
              onToggle={() => toggleSection('general')}
            >
              <PropertyField
                label="Name"
                value={selectedEntity.name || ''}
                onChange={(_value) => {/* update name */}}
              />
              <PropertyField
                label="ID"
                value={selectedEntity.id}
                readOnly
              />
              <PropertyField
                label="Type"
                value={selectedEntity.type}
                readOnly
              />
            </PropertySection>

            <PropertySection
              title="Appearance"
              icon={Palette}
              expanded={expandedSections.has('appearance')}
              onToggle={() => toggleSection('appearance')}
            >
              <ColorField
                label="Color"
                value={selectedEntity.color || '#2196F3'}
                onChange={(_value) => {/* update color */}}
              />
              <PropertyField
                label="Visible"
                type="toggle"
                value={selectedEntity.visible !== false}
                onChange={(_value) => {/* update visibility */}}
              />
              <PropertyField
                label="Locked"
                type="toggle"
                value={selectedEntity.locked === true}
                onChange={(_value) => {/* update locked */}}
              />
            </PropertySection>

            {selectedEntity.transform && (
              <PropertySection
                title="Transform"
                icon={Box}
                expanded={expandedSections.has('transform')}
                onToggle={() => toggleSection('transform')}
              >
                <Vector3Field
                  label="Position"
                  value={selectedEntity.transform.position}
                  onChange={(_value) => {/* update position */}}
                />
                <Vector3Field
                  label="Rotation"
                  value={selectedEntity.transform.rotation}
                  onChange={(_value) => {/* update rotation */}}
                />
                <Vector3Field
                  label="Scale"
                  value={selectedEntity.transform.scale}
                  onChange={(_value) => {/* update scale */}}
                />
              </PropertySection>
            )}
          </>
        ) : (
          <div className="text-cad-textMuted text-sm text-center py-4">
            Entity not found
          </div>
        )}
      </div>
    </div>
  );
}

interface PropertySectionProps {
  title: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}

function PropertySection({ title, icon: Icon, children, expanded, onToggle }: PropertySectionProps) {
  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2 py-1.5 text-cad-text hover:bg-cad-border/50 rounded transition-colors"
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <Icon size={14} />
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </button>
      
      {expanded && (
        <div className="mt-2 space-y-2 pl-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface PropertyFieldProps {
  label: string;
  value: string | boolean | number;
  type?: 'text' | 'number' | 'toggle' | 'readonly';
  readOnly?: boolean;
  onChange?: (value: any) => void;
}

function PropertyField({ label, value, type = 'text', readOnly, onChange }: PropertyFieldProps) {
  if (type === 'toggle') {
    return (
      <div className="flex items-center justify-between">
        <span className="text-xs text-cad-textMuted">{label}</span>
        <button
          onClick={() => onChange?.(!value)}
          className={`w-8 h-4 rounded-full transition-colors ${
            value ? 'bg-cad-accent' : 'bg-cad-border'
          }`}
        >
          <span
            className={`block w-3 h-3 rounded-full bg-white transition-transform ${
              value ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-cad-textMuted whitespace-nowrap">{label}</span>
      <input
        type={type === 'number' ? 'number' : 'text'}
        value={String(value)}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`flex-1 min-w-0 bg-cad-bg border border-cad-border rounded px-2 py-1 text-xs text-cad-text ${
          readOnly ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-cad-textMuted">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border-0 p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 bg-cad-bg border border-cad-border rounded px-2 py-1 text-xs text-cad-text"
        />
      </div>
    </div>
  );
}

interface Vector3FieldProps {
  label: string;
  value: { x: number; y: number; z: number };
  onChange: (value: { x: number; y: number; z: number }) => void;
}

function Vector3Field({ label, value, onChange }: Vector3FieldProps) {
  return (
    <div>
      <span className="text-xs text-cad-textMuted block mb-1">{label}</span>
      <div className="flex gap-2">
        {['x', 'y', 'z'].map((axis) => (
          <div key={axis} className="flex-1 flex items-center gap-1">
            <span className={`text-[10px] font-medium ${
              axis === 'x' ? 'text-red-400' : axis === 'y' ? 'text-green-400' : 'text-blue-400'
            }`}>
              {axis.toUpperCase()}
            </span>
            <input
              type="number"
              value={value[axis as keyof typeof value]}
              onChange={(e) => onChange({ ...value, [axis]: parseFloat(e.target.value) || 0 })}
              className="flex-1 bg-cad-bg border border-cad-border rounded px-1.5 py-0.5 text-xs text-cad-text"
              step="0.1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function findEntityById(project: any, id: string): any {
  for (const component of project.assembly.components) {
    // Check sketches
    for (const sketch of component.sketches) {
      if (sketch.id === id) return sketch;
      for (const entity of sketch.entities) {
        if (entity.id === id) return entity;
      }
    }
    // Check bodies
    for (const body of component.bodies) {
      if (body.id === id) return body;
    }
    // Check features
    for (const feature of component.features) {
      if (feature.id === id) return feature;
    }
  }
  return null;
}
