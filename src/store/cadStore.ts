import { create } from 'zustand';
import * as THREE from 'three';
import {
  Project,
  ToolType,
  ViewMode,
  Sketch,
  SketchEntity,
  Feature,
  Body,
  Component,
  Layer,
  Material,
  Constraint,
  Point3D,
  createId,
  defaultMaterial,
  defaultLayer,
  defaultUnits,
  defaultViewSettings,
} from '../types/cad';

// Re-export for convenience
export { ToolType, ViewMode, EntityType } from '../types/cad';

interface CADState {
  // Project
  project: Project | null;
  
  // Tool state
  activeTool: ToolType;
  previousTool: ToolType;
  
  // View state
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  controls: any | null;
  
  // Interaction state
  isDrawing: boolean;
  isDragging: boolean;
  isPanning: boolean;
  isOrbiting: boolean;
  currentSketchId: string | null;
  hoveredEntityId: string | null;
  snapPoint: Point3D | null;
  
  // Selection
  selectedIds: string[];
  
  // History
  undoStack: Project[];
  redoStack: Project[];
  
  // Actions
  setProject: (project: Project) => void;
  createProject: (name: string) => void;
  saveProject: () => void;
  loadProject: (data: string) => void;
  
  // Tool actions
  setActiveTool: (tool: ToolType) => void;
  
  // View actions
  setCamera: (camera: THREE.PerspectiveCamera) => void;
  setRenderer: (renderer: THREE.WebGLRenderer) => void;
  setScene: (scene: THREE.Scene) => void;
  setControls: (controls: any) => void;
  setViewMode: (mode: ViewMode) => void;
  zoomToFit: () => void;
  zoomToSelection: () => void;
  
  // Sketch actions
  createSketch: (planeId: string) => string;
  activateSketch: (sketchId: string) => void;
  deactivateSketch: () => void;
  addSketchEntity: (entity: SketchEntity) => void;
  updateSketchEntity: (entityId: string, updates: Partial<SketchEntity>) => void;
  removeSketchEntity: (entityId: string) => void;
  addConstraint: (constraint: Constraint) => void;
  removeConstraint: (constraintId: string) => void;
  
  // Feature actions
  addFeature: (feature: Feature) => void;
  updateFeature: (featureId: string, updates: Partial<Feature>) => void;
  removeFeature: (featureId: string) => void;
  reorderFeatures: (featureIds: string[]) => void;
  
  // Body actions
  addBody: (body: Body) => void;
  updateBody: (bodyId: string, updates: Partial<Body>) => void;
  removeBody: (bodyId: string) => void;
  
  // Component actions
  addComponent: (component: Component) => void;
  updateComponent: (componentId: string, updates: Partial<Component>) => void;
  removeComponent: (componentId: string) => void;
  
  // Selection actions
  select: (ids: string | string[], append?: boolean) => void;
  deselect: (ids?: string | string[]) => void;
  clearSelection: () => void;
  setHoveredEntity: (id: string | null) => void;
  
  // Layer actions
  addLayer: (layer: Layer) => void;
  updateLayer: (layerId: string, updates: Partial<Layer>) => void;
  removeLayer: (layerId: string) => void;
  setActiveLayer: (layerId: string) => void;
  
  // Material actions
  addMaterial: (material: Material) => void;
  updateMaterial: (materialId: string, updates: Partial<Material>) => void;
  removeMaterial: (materialId: string) => void;
  setBodyMaterial: (bodyId: string, materialId: string) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  pushState: () => void;
  
  // Interaction actions
  setIsDrawing: (value: boolean) => void;
  setIsDragging: (value: boolean) => void;
  setSnapPoint: (point: Point3D | null) => void;
  
  // Import/Export
  exportSTL: () => string;
  exportOBJ: () => string;
  importFile: (content: string, format: string) => void;
}

export const useCADStore = create<CADState>((set, get) => ({
  // Initial state
  project: null,
  activeTool: ToolType.SELECT,
  previousTool: ToolType.SELECT,
  camera: null,
  renderer: null,
  scene: null,
  controls: null,
  isDrawing: false,
  isDragging: false,
  isPanning: false,
  isOrbiting: false,
  currentSketchId: null,
  hoveredEntityId: null,
  snapPoint: null,
  selectedIds: [],
  undoStack: [],
  redoStack: [],

  // Project actions
  setProject: (project) => set({ project }),
  
  createProject: (name) => {
    const rootComponent: Component = {
      id: createId(),
      name: 'Root',
      bodies: [],
      sketches: [],
      features: [],
      transform: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      visible: true,
      suppressed: false,
      childrenIds: [],
      occurrences: [],
    };

    const project: Project = {
      id: createId(),
      name,
      description: '',
      createdAt: new Date(),
      modifiedAt: new Date(),
      units: { ...defaultUnits },
      origin: { x: 0, y: 0, z: 0 },
      assembly: {
        id: createId(),
        name: 'Assembly1',
        components: [rootComponent],
        mates: [],
        rootComponentId: rootComponent.id,
      },
      materials: [{ ...defaultMaterial, id: createId() }],
      layers: [{ ...defaultLayer, id: createId() }],
      selectedEntityIds: [],
      viewSettings: { ...defaultViewSettings },
    };

    set({ project, undoStack: [], redoStack: [] });
  },

  saveProject: () => {
    const { project } = get();
    if (!project) return;
    
    const data = JSON.stringify(project);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}.excad`;
    a.click();
    URL.revokeObjectURL(url);
  },

  loadProject: (data) => {
    try {
      const project: Project = JSON.parse(data);
      project.modifiedAt = new Date(project.modifiedAt);
      project.createdAt = new Date(project.createdAt);
      set({ project, undoStack: [], redoStack: [] });
    } catch (e) {
      console.error('Failed to load project:', e);
    }
  },

  // Tool actions
  setActiveTool: (tool) => set((state) => ({
    previousTool: state.activeTool,
    activeTool: tool,
  })),

  // View actions
  setCamera: (camera) => set({ camera }),
  setRenderer: (renderer) => set({ renderer }),
  setScene: (scene) => set({ scene }),
  setControls: (controls) => set({ controls }),
  
  setViewMode: (mode) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        viewSettings: { ...state.project.viewSettings, mode },
      },
    };
  }),

  zoomToFit: () => {
    const { camera, controls, scene } = get();
    if (!camera || !scene) return;
    
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5;
    
    camera.position.set(center.x, center.y, center.z + cameraZ);
    if (controls) {
      controls.target.copy(center);
      controls.update();
    }
  },

  zoomToSelection: () => {
    // Implementation for zooming to selected objects
  },

  // Sketch actions
  createSketch: (planeId) => {
    const { project } = get();
    if (!project) return '';

    const rootComponent = project.assembly.components.find(
      c => c.id === project.assembly.rootComponentId
    );
    if (!rootComponent) return '';

    const sketch: Sketch = {
      id: createId(),
      name: `Sketch${rootComponent.sketches.length + 1}`,
      planeId,
      entities: [],
      constraints: [],
      visible: true,
      active: false,
      transform: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    };

    rootComponent.sketches.push(sketch);
    set({ project: { ...project } });
    return sketch.id;
  },

  activateSketch: (sketchId) => {
    const { project } = get();
    if (!project) return;

    project.assembly.components.forEach(component => {
      component.sketches.forEach(sketch => {
        sketch.active = sketch.id === sketchId;
      });
    });

    set({ 
      project: { ...project },
      currentSketchId: sketchId,
      activeTool: ToolType.LINE,
    });
  },

  deactivateSketch: () => {
    const { project } = get();
    if (!project) return;

    project.assembly.components.forEach(component => {
      component.sketches.forEach(sketch => {
        sketch.active = false;
      });
    });

    set({ 
      project: { ...project },
      currentSketchId: null,
      activeTool: ToolType.SELECT,
    });
  },

  addSketchEntity: (entity) => {
    const { project, currentSketchId } = get();
    if (!project || !currentSketchId) return;

    const sketch = project.assembly.components
      .flatMap(c => c.sketches)
      .find(s => s.id === currentSketchId);
    
    if (sketch) {
      sketch.entities.push(entity);
      set({ project: { ...project } });
    }
  },

  updateSketchEntity: (entityId, updates) => {
    const { project } = get();
    if (!project) return;

    project.assembly.components.forEach(component => {
      component.sketches.forEach(sketch => {
        const entity = sketch.entities.find(e => e.id === entityId);
        if (entity) {
          Object.assign(entity, updates, { modifiedAt: new Date() });
        }
      });
    });

    set({ project: { ...project } });
  },

  removeSketchEntity: (entityId) => {
    const { project } = get();
    if (!project) return;

    project.assembly.components.forEach(component => {
      component.sketches.forEach(sketch => {
        sketch.entities = sketch.entities.filter(e => e.id !== entityId);
      });
    });

    set({ project: { ...project } });
  },

  addConstraint: (constraint) => {
    const { project, currentSketchId } = get();
    if (!project || !currentSketchId) return;

    const sketch = project.assembly.components
      .flatMap(c => c.sketches)
      .find(s => s.id === currentSketchId);
    
    if (sketch) {
      sketch.constraints.push(constraint);
      set({ project: { ...project } });
    }
  },

  removeConstraint: (constraintId) => {
    const { project } = get();
    if (!project) return;

    project.assembly.components.forEach(component => {
      component.sketches.forEach(sketch => {
        sketch.constraints = sketch.constraints.filter(c => c.id !== constraintId);
      });
    });

    set({ project: { ...project } });
  },

  // Feature actions
  addFeature: (feature) => {
    const { project } = get();
    if (!project) return;

    const rootComponent = project.assembly.components.find(
      c => c.id === project.assembly.rootComponentId
    );
    if (!rootComponent) return;

    rootComponent.features.push(feature);
    set({ project: { ...project } });
  },

  updateFeature: (featureId, updates) => {
    const { project } = get();
    if (!project) return;

    project.assembly.components.forEach(component => {
      const feature = component.features.find(f => f.id === featureId);
      if (feature) {
        Object.assign(feature, updates, { modifiedAt: new Date() });
      }
    });

    set({ project: { ...project } });
  },

  removeFeature: (featureId) => {
    const { project } = get();
    if (!project) return;

    project.assembly.components.forEach(component => {
      component.features = component.features.filter(f => f.id !== featureId);
    });

    set({ project: { ...project } });
  },

  reorderFeatures: (_featureIds) => {
    // Implementation for reordering features
  },

  // Body actions
  addBody: (body) => {
    const { project } = get();
    if (!project) return;

    const rootComponent = project.assembly.components.find(
      c => c.id === project.assembly.rootComponentId
    );
    if (!rootComponent) return;

    rootComponent.bodies.push(body);
    set({ project: { ...project } });
  },

  updateBody: (bodyId, updates) => {
    const { project } = get();
    if (!project) return;

    project.assembly.components.forEach(component => {
      const body = component.bodies.find(b => b.id === bodyId);
      if (body) {
        Object.assign(body, updates);
      }
    });

    set({ project: { ...project } });
  },

  removeBody: (bodyId) => {
    const { project } = get();
    if (!project) return;

    project.assembly.components.forEach(component => {
      component.bodies = component.bodies.filter(b => b.id !== bodyId);
    });

    set({ project: { ...project } });
  },

  // Component actions
  addComponent: (component) => {
    const { project } = get();
    if (!project) return;

    project.assembly.components.push(component);
    set({ project: { ...project } });
  },

  updateComponent: (componentId, updates) => {
    const { project } = get();
    if (!project) return;

    const component = project.assembly.components.find(c => c.id === componentId);
    if (component) {
      Object.assign(component, updates);
    }

    set({ project: { ...project } });
  },

  removeComponent: (componentId) => {
    const { project } = get();
    if (!project) return;

    project.assembly.components = project.assembly.components.filter(
      c => c.id !== componentId
    );

    set({ project: { ...project } });
  },

  // Selection actions
  select: (ids, append = false) => {
    const { selectedIds } = get();
    const idArray = Array.isArray(ids) ? ids : [ids];
    
    if (append) {
      set({ selectedIds: [...new Set([...selectedIds, ...idArray])] });
    } else {
      set({ selectedIds: idArray });
    }
  },

  deselect: (ids) => {
    const { selectedIds } = get();
    if (!ids) {
      set({ selectedIds: [] });
      return;
    }
    const idArray = Array.isArray(ids) ? ids : [ids];
    set({ selectedIds: selectedIds.filter(id => !idArray.includes(id)) });
  },

  clearSelection: () => set({ selectedIds: [] }),
  
  setHoveredEntity: (id) => set({ hoveredEntityId: id }),

  // Layer actions
  addLayer: (layer) => {
    const { project } = get();
    if (!project) return;

    project.layers.push(layer);
    set({ project: { ...project } });
  },

  updateLayer: (layerId, updates) => {
    const { project } = get();
    if (!project) return;

    const layer = project.layers.find(l => l.id === layerId);
    if (layer) {
      Object.assign(layer, updates);
    }

    set({ project: { ...project } });
  },

  removeLayer: (layerId) => {
    const { project } = get();
    if (!project) return;

    project.layers = project.layers.filter(l => l.id !== layerId);
    set({ project: { ...project } });
  },

  setActiveLayer: (_layerId) => {
    // Set as default for new entities
  },

  // Material actions
  addMaterial: (material) => {
    const { project } = get();
    if (!project) return;

    project.materials.push(material);
    set({ project: { ...project } });
  },

  updateMaterial: (materialId, updates) => {
    const { project } = get();
    if (!project) return;

    const material = project.materials.find(m => m.id === materialId);
    if (material) {
      Object.assign(material, updates);
    }

    set({ project: { ...project } });
  },

  removeMaterial: (materialId) => {
    const { project } = get();
    if (!project) return;

    project.materials = project.materials.filter(m => m.id !== materialId);
    set({ project: { ...project } });
  },

  setBodyMaterial: (bodyId, materialId) => {
    const { project } = get();
    if (!project) return;

    const material = project.materials.find(m => m.id === materialId);
    if (!material) return;

    project.assembly.components.forEach(component => {
      const body = component.bodies.find(b => b.id === bodyId);
      if (body) {
        body.material = material;
        body.color = material.color;
      }
    });

    set({ project: { ...project } });
  },

  // History actions
  pushState: () => {
    const { project, undoStack } = get();
    if (!project) return;

    const newStack = [...undoStack, JSON.parse(JSON.stringify(project))];
    if (newStack.length > 50) newStack.shift();
    
    set({ undoStack: newStack, redoStack: [] });
  },

  undo: () => {
    const { project, undoStack, redoStack } = get();
    if (undoStack.length === 0 || !project) return;

    const newUndoStack = [...undoStack];
    const previousState = newUndoStack.pop()!;
    
    set({
      project: previousState,
      undoStack: newUndoStack,
      redoStack: [...redoStack, JSON.parse(JSON.stringify(project))],
    });
  },

  redo: () => {
    const { project, undoStack, redoStack } = get();
    if (redoStack.length === 0 || !project) return;

    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop()!;
    
    set({
      project: nextState,
      undoStack: [...undoStack, JSON.parse(JSON.stringify(project))],
      redoStack: newRedoStack,
    });
  },

  // Interaction actions
  setIsDrawing: (value) => set({ isDrawing: value }),
  setIsDragging: (value) => set({ isDragging: value }),
  setSnapPoint: (point) => set({ snapPoint: point }),

  // Import/Export
  exportSTL: () => {
    // Implementation for STL export
    return '';
  },

  exportOBJ: () => {
    // Implementation for OBJ export
    return '';
  },

  importFile: (_content, _format) => {
    // Implementation for file import
  },
}));
