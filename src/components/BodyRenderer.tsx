import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Body } from '../types/cad';
import { useCADStore } from '../store/cadStore';

interface BodyRendererProps {
  body: Body;
}

export default function BodyRenderer({ body }: BodyRendererProps) {
  const { project } = useCADStore();
  const meshRef = useRef<THREE.Mesh>(null);

  if (!body.visible || !body.mesh) return null;

  const viewMode = project?.viewSettings.mode || 'shaded';

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: body.color,
      metalness: body.material?.metalness ?? 0.1,
      roughness: body.material?.roughness ?? 0.4,
      transparent: (body.material?.opacity ?? 1) < 1,
      opacity: body.material?.opacity ?? 1,
      side: THREE.DoubleSide,
    });

    if (viewMode === 'wireframe') {
      mat.wireframe = true;
    }

    return mat;
  }, [body.color, body.material, viewMode]);

  const edges = useMemo(() => {
    if (!body.mesh || viewMode === 'wireframe') return null;
    
    const geometry = body.mesh.geometry;
    const edgesGeometry = new THREE.EdgesGeometry(geometry, 15);
    return (
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#333333" linewidth={1} />
      </lineSegments>
    );
  }, [body.mesh, viewMode]);

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={body.mesh.geometry}
        material={material}
        castShadow
        receiveShadow
      />
      {edges}
      {body.selected && <SelectionHighlight mesh={body.mesh} />}
    </group>
  );
}

function SelectionHighlight({ mesh }: { mesh: THREE.Mesh }) {
  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: '#ff9800',
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
    depthTest: false,
  });

  return (
    <mesh geometry={mesh.geometry} material={highlightMaterial} scale={1.01} />
  );
}
