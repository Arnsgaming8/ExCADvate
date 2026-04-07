import { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useCADStore, ToolType } from '../store/cadStore';
import SketchRenderer from './SketchRenderer';
import BodyRenderer from './BodyRenderer';

function Scene() {
  const { project, activeTool, setCamera, setRenderer, setScene, setControls } = useCADStore();
  const controlsRef = useRef<any>(null);
  const { camera: cam, scene: scn, gl } = useThree();

  useEffect(() => {
    setCamera(cam as THREE.PerspectiveCamera);
    setRenderer(gl);
    setScene(scn);
    if (controlsRef.current) {
      setControls(controlsRef.current);
    }
  }, [cam, scn, gl, setCamera, setRenderer, setScene, setControls]);

  if (!project) return null;

  const rootComponent = project.assembly.components.find(
    c => c.id === project.assembly.rootComponentId
  );

  return (
    <>
      <color attach="background" args={[project.viewSettings.backgroundColor]} />
      
      {/* Lighting */}
      <ambientLight intensity={project.viewSettings.ambientLight} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      {/* Grid */}
      {project.viewSettings.showGrid && (
        <Grid
          position={[0, 0, 0]}
          args={[1000, 1000]}
          cellSize={project.viewSettings.gridSize}
          cellThickness={0.5}
          cellColor="#444444"
          sectionSize={project.viewSettings.gridSize * 10}
          sectionThickness={1}
          sectionColor="#666666"
          fadeDistance={400}
          fadeStrength={1}
          infiniteGrid
        />
      )}

      {/* Axes */}
      {project.viewSettings.showAxes && (
        <>
          {/* X Axis - Red */}
          <Line
            points={[[0, 0, 0], [100, 0, 0]]}
            color="#ff4444"
            lineWidth={2}
          />
          <Text position={[105, 0, 0]} color="#ff4444" fontSize={8} anchorX="center">
            X
          </Text>
          
          {/* Y Axis - Green */}
          <Line
            points={[[0, 0, 0], [0, 100, 0]]}
            color="#44ff44"
            lineWidth={2}
          />
          <Text position={[0, 105, 0]} color="#44ff44" fontSize={8} anchorX="center">
            Y
          </Text>
          
          {/* Z Axis - Blue */}
          <Line
            points={[[0, 0, 0], [0, 0, 100]]}
            color="#4444ff"
            lineWidth={2}
          />
          <Text position={[0, 0, 105]} color="#4444ff" fontSize={8} anchorX="center">
            Z
          </Text>

          {/* Origin */}
          {project.viewSettings.showOrigin && (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[2, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          )}
        </>
      )}

      {/* Sketches */}
      {rootComponent?.sketches.map(sketch => (
        <SketchRenderer key={sketch.id} sketch={sketch} />
      ))}

      {/* Bodies */}
      {rootComponent?.bodies.map(body => (
        <BodyRenderer key={body.id} body={body} />
      ))}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={activeTool === ToolType.PAN || activeTool === ToolType.SELECT}
        enableZoom={true}
        enableRotate={activeTool === ToolType.ORBIT || activeTool === ToolType.SELECT}
        minDistance={1}
        maxDistance={1000}
      />

      {/* Gizmo */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#ff4444', '#44ff44', '#4444ff']} labelColor="white" />
      </GizmoHelper>
    </>
  );
}

export default function Viewport3D() {
  const { project, activeTool } = useCADStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const getCursorClass = () => {
    switch (activeTool) {
      case ToolType.PAN:
        return 'pan';
      case ToolType.LINE:
      case ToolType.CIRCLE:
      case ToolType.RECTANGLE:
      case ToolType.ARC:
        return 'crosshair';
      default:
        return 'select';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`flex-1 relative cad-canvas ${getCursorClass()}`}
    >
      <Canvas
        camera={{
          position: [project?.viewSettings.cameraPosition.x || 100, 
                    project?.viewSettings.cameraPosition.y || 100, 
                    project?.viewSettings.cameraPosition.z || 100],
          fov: 45,
          near: 0.1,
          far: 10000,
        }}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        <Scene />
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 bg-cad-panel/80 backdrop-blur rounded-lg px-3 py-2 text-xs text-cad-text">
        {project?.name || 'Untitled'}
      </div>
      
      <div className="absolute top-4 right-4 flex gap-2">
        <ViewModeSelector />
        <GridToggle />
      </div>
    </div>
  );
}

function ViewModeSelector() {
  const { project, setViewMode } = useCADStore();
  
  if (!project) return null;

  const modes = [
    { value: 'shaded', label: 'Shaded', icon: '□' },
    { value: 'wireframe', label: 'Wireframe', icon: '☐' },
    { value: 'hidden_line', label: 'Hidden Line', icon: '▣' },
  ];

  return (
    <div className="flex bg-cad-panel/80 backdrop-blur rounded-lg overflow-hidden">
      {modes.map(mode => (
        <button
          key={mode.value}
          onClick={() => setViewMode(mode.value as any)}
          className={`px-3 py-2 text-xs transition-colors ${
            project.viewSettings.mode === mode.value
              ? 'bg-cad-accent text-white'
              : 'text-cad-text hover:bg-cad-border'
          }`}
          title={mode.label}
        >
          {mode.icon}
        </button>
      ))}
    </div>
  );
}

function GridToggle() {
  const { project, setProject } = useCADStore();
  
  if (!project) return null;

  const toggleGrid = () => {
    setProject({
      ...project,
      viewSettings: {
        ...project.viewSettings,
        showGrid: !project.viewSettings.showGrid,
      },
    });
  };

  return (
    <button
      onClick={toggleGrid}
      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
        project.viewSettings.showGrid
          ? 'bg-cad-accent text-white'
          : 'bg-cad-panel/80 text-cad-text hover:bg-cad-border'
      }`}
      title="Toggle Grid"
    >
      #
    </button>
  );
}
