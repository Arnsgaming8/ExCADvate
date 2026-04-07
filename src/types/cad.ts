import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';

// Enums
export enum ToolType {
  SELECT = 'select',
  PAN = 'pan',
  ZOOM = 'zoom',
  ORBIT = 'orbit',
  LINE = 'line',
  CIRCLE = 'circle',
  RECTANGLE = 'rectangle',
  ARC = 'arc',
  POLYGON = 'polygon',
  SPLINE = 'spline',
  EXTRUDE = 'extrude',
  REVOLVE = 'revolve',
  LOFT = 'loft',
  SWEEP = 'sweep',
  FILLET = 'fillet',
  CHAMFER = 'chamfer',
  SHELL = 'shell',
  MIRROR = 'mirror',
  PATTERN_LINEAR = 'pattern_linear',
  PATTERN_CIRCULAR = 'pattern_circular',
  MEASURE = 'measure',
  SECTION = 'section',
  ERASER = 'eraser',
}

export enum ConstraintType {
  COINCIDENT = 'coincident',
  PARALLEL = 'parallel',
  PERPENDICULAR = 'perpendicular',
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  TANGENT = 'tangent',
  CONCENTRIC = 'concentric',
  EQUAL = 'equal',
  SYMMETRIC = 'symmetric',
  FIX = 'fix',
  DISTANCE = 'distance',
  ANGLE = 'angle',
  DIAMETER = 'diameter',
  RADIUS = 'radius',
}

export enum EntityType {
  POINT = 'point',
  LINE = 'line',
  CIRCLE = 'circle',
  ARC = 'arc',
  ELLIPSE = 'ellipse',
  SPLINE = 'spline',
  POLYGON = 'polygon',
  FACE = 'face',
  BODY = 'body',
  SKETCH = 'sketch',
  PLANE = 'plane',
  AXIS = 'axis',
  COORDINATE_SYSTEM = 'coordinate_system',
}

export enum FeatureType {
  SKETCH = 'sketch',
  EXTRUDE = 'extrude',
  REVOLVE = 'revolve',
  LOFT = 'loft',
  SWEEP = 'sweep',
  FILLET = 'fillet',
  CHAMFER = 'chamfer',
  SHELL = 'shell',
  MIRROR = 'mirror',
  PATTERN_LINEAR = 'pattern_linear',
  PATTERN_CIRCULAR = 'pattern_circular',
  HOLE = 'hole',
}

export enum ViewMode {
  WIREFRAME = 'wireframe',
  SHADED = 'shaded',
  HIDDEN_LINE = 'hidden_line',
  RENDERED = 'rendered',
  XRAY = 'xray',
}

// Base types
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Transform {
  position: Point3D;
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

// Entity base
export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  visible: boolean;
  selected: boolean;
  locked: boolean;
  color: string;
  layerId: string;
  createdAt: Date;
  modifiedAt: Date;
}

// Sketch entities
export interface SketchPoint extends Entity {
  type: EntityType.POINT;
  position: Point2D;
  fixed: boolean;
}

export interface SketchLine extends Entity {
  type: EntityType.LINE;
  startPointId: string;
  endPointId: string;
  start: Point2D;
  end: Point2D;
  length?: number;
  construction: boolean;
}

export interface SketchCircle extends Entity {
  type: EntityType.CIRCLE;
  centerId: string;
  center: Point2D;
  radius: number;
  diameter?: number;
  construction: boolean;
}

export interface SketchArc extends Entity {
  type: EntityType.ARC;
  centerId: string;
  startPointId: string;
  endPointId: string;
  center: Point2D;
  radius: number;
  startAngle: number;
  endAngle: number;
  construction: boolean;
}

export interface SketchRectangle extends Entity {
  type: EntityType.POLYGON;
  corner1Id: string;
  corner2Id: string;
  corner1: Point2D;
  corner2: Point2D;
  width: number;
  height: number;
}

export type SketchEntity = SketchPoint | SketchLine | SketchCircle | SketchArc | SketchRectangle;

// Constraints
export interface Constraint {
  id: string;
  type: ConstraintType;
  entityIds: string[];
  value?: number;
  enabled: boolean;
}

// Sketch
export interface Sketch {
  id: string;
  name: string;
  planeId: string;
  entities: SketchEntity[];
  constraints: Constraint[];
  visible: boolean;
  active: boolean;
  transform: Transform;
}

// 3D Features
export interface Feature {
  id: string;
  type: FeatureType;
  name: string;
  sketchId?: string;
  parameters: Record<string, unknown>;
  enabled: boolean;
  suppressed: boolean;
  parentId?: string;
  childrenIds: string[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface ExtrudeFeature extends Feature {
  type: FeatureType.EXTRUDE;
  sketchId: string;
  direction: 'one-sided' | 'two-sided' | 'mid-plane';
  depth: number;
  depth2?: number;
  taperAngle?: number;
  operation: 'new' | 'add' | 'remove' | 'intersect';
}

export interface RevolveFeature extends Feature {
  type: FeatureType.REVOLVE;
  sketchId: string;
  axisId: string;
  angle: number;
  operation: 'new' | 'add' | 'remove' | 'intersect';
}

export interface FilletFeature extends Feature {
  type: FeatureType.FILLET;
  edgeIds: string[];
  radius: number;
  variableRadius?: boolean;
  radii?: number[];
}

export interface ChamferFeature extends Feature {
  type: FeatureType.CHAMFER;
  edgeIds: string[];
  distance: number;
  distance2?: number;
  angle?: number;
}

// Bodies and Geometry
export interface Body {
  id: string;
  name: string;
  faces: Face[];
  edges: Edge[];
  vertices: Vertex[];
  solid: boolean;
  surface: boolean;
  mesh?: THREE.Mesh;
  visible: boolean;
  selected: boolean;
  color: string;
  material: Material;
  featureId?: string;
}

export interface Face {
  id: string;
  surface: Surface;
  outerLoop: Loop;
  innerLoops: Loop[];
  normal: Vector3D;
  area: number;
  perimeter: number;
}

export interface Edge {
  id: string;
  curve: Curve;
  startVertexId: string;
  endVertexId: string;
  length: number;
  convex: boolean;
}

export interface Vertex {
  id: string;
  position: Point3D;
}

export interface Loop {
  id: string;
  edgeIds: string[];
  coedges: Coedge[];
}

export interface Coedge {
  edgeId: string;
  direction: 'forward' | 'reversed';
}

export type Surface = PlaneSurface | CylindricalSurface | SphericalSurface | ToroidalSurface | ConicalSurface;

export interface PlaneSurface {
  type: 'plane';
  origin: Point3D;
  normal: Vector3D;
}

export interface CylindricalSurface {
  type: 'cylinder';
  axis: Axis;
  radius: number;
}

export interface SphericalSurface {
  type: 'sphere';
  center: Point3D;
  radius: number;
}

export interface ToroidalSurface {
  type: 'torus';
  axis: Axis;
  majorRadius: number;
  minorRadius: number;
}

export interface ConicalSurface {
  type: 'cone';
  axis: Axis;
  radius: number;
  halfAngle: number;
}

export type Curve = LineCurve | CircleCurve | EllipseCurve | ParabolaCurve | HyperbolaCurve | BSplineCurve;

export interface LineCurve {
  type: 'line';
  start: Point3D;
  end: Point3D;
}

export interface CircleCurve {
  type: 'circle';
  center: Point3D;
  radius: number;
  axis: Vector3D;
}

export interface EllipseCurve {
  type: 'ellipse';
  center: Point3D;
  majorRadius: number;
  minorRadius: number;
  majorAxis: Vector3D;
}

export interface ParabolaCurve {
  type: 'parabola';
  focalLength: number;
}

export interface HyperbolaCurve {
  type: 'hyperbola';
  majorRadius: number;
  minorRadius: number;
}

export interface BSplineCurve {
  type: 'bspline';
  degree: number;
  controlPoints: Point3D[];
  knots: number[];
  weights?: number[];
}

export interface Axis {
  origin: Point3D;
  direction: Vector3D;
}

// Material
export interface Material {
  id: string;
  name: string;
  color: string;
  ambient: number;
  diffuse: number;
  specular: number;
  shininess: number;
  opacity: number;
  metalness: number;
  roughness: number;
}

// Layer
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
  lineWidth: number;
  lineType: 'solid' | 'dashed' | 'dotted' | 'dashdot';
  entities: string[];
}

// Assembly
export interface Assembly {
  id: string;
  name: string;
  components: Component[];
  mates: Mate[];
  rootComponentId: string;
}

export interface Component {
  id: string;
  name: string;
  bodies: Body[];
  sketches: Sketch[];
  features: Feature[];
  transform: Transform;
  visible: boolean;
  suppressed: boolean;
  parentId?: string;
  childrenIds: string[];
  occurrences: ComponentOccurrence[];
}

export interface ComponentOccurrence {
  id: string;
  componentId: string;
  transform: Transform;
  name: string;
}

export interface Mate {
  id: string;
  type: 'coincident' | 'concentric' | 'distance' | 'angle' | 'tangent' | 'symmetric' | 'gear' | 'rack_pinion' | 'screw' | 'slider' | 'ball';
  componentIds: [string, string];
  entityIds: [string, string];
  value?: number;
  flipAlignment?: boolean;
}

// Project
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  modifiedAt: Date;
  units: Units;
  origin: Point3D;
  assembly: Assembly;
  materials: Material[];
  layers: Layer[];
  activeSketchId?: string;
  selectedEntityIds: string[];
  viewSettings: ViewSettings;
}

export interface Units {
  length: 'mm' | 'cm' | 'm' | 'in' | 'ft';
  angle: 'deg' | 'rad';
  mass: 'kg' | 'g' | 'lb' | 'oz';
  time: 's' | 'min' | 'hr';
}

export interface ViewSettings {
  mode: ViewMode;
  showGrid: boolean;
  gridSize: number;
  showAxes: boolean;
  showOrigin: boolean;
  backgroundColor: string;
  ambientLight: number;
  cameraPosition: Point3D;
  cameraTarget: Point3D;
  zoom: number;
}

// Helper functions
export const createId = (): string => uuidv4();

export const defaultMaterial: Material = {
  id: createId(),
  name: 'Default',
  color: '#2196F3',
  ambient: 0.3,
  diffuse: 0.7,
  specular: 0.5,
  shininess: 30,
  opacity: 1,
  metalness: 0.1,
  roughness: 0.4,
};

export const defaultLayer: Layer = {
  id: createId(),
  name: 'Default',
  visible: true,
  locked: false,
  color: '#e0e0e0',
  lineWidth: 1,
  lineType: 'solid',
  entities: [],
};

export const defaultUnits: Units = {
  length: 'mm',
  angle: 'deg',
  mass: 'kg',
  time: 's',
};

export const defaultViewSettings: ViewSettings = {
  mode: ViewMode.SHADED,
  showGrid: true,
  gridSize: 10,
  showAxes: true,
  showOrigin: true,
  backgroundColor: '#1a1a1a',
  ambientLight: 0.5,
  cameraPosition: { x: 100, y: 100, z: 100 },
  cameraTarget: { x: 0, y: 0, z: 0 },
  zoom: 1,
};
