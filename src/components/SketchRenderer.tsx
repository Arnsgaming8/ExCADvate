import { Line } from '@react-three/drei';
import { Sketch, SketchEntity, EntityType, SketchLine, SketchCircle, SketchArc } from '../types/cad';

interface SketchRendererProps {
  sketch: Sketch;
}

export default function SketchRenderer({ sketch }: SketchRendererProps) {
  if (!sketch.visible) return null;

  return (
    <group>
      {sketch.entities.map(entity => (
        <SketchEntityRenderer 
          key={entity.id} 
          entity={entity} 
          isActive={sketch.active}
        />
      ))}
    </group>
  );
}

interface SketchEntityRendererProps {
  entity: SketchEntity;
  isActive: boolean;
}

function SketchEntityRenderer({ entity, isActive }: SketchEntityRendererProps) {
  const color = entity.selected ? '#ff9800' : isActive ? '#2196F3' : '#888888';
  const isConstruction = 'construction' in entity && entity.construction;
  const opacity = isConstruction ? 0.5 : 1;

  switch (entity.type) {
    case EntityType.LINE:
      return <LineEntity entity={entity as SketchLine} color={color} opacity={opacity} />;
    case EntityType.CIRCLE:
      return <CircleEntity entity={entity as SketchCircle} color={color} opacity={opacity} />;
    case EntityType.ARC:
      return <ArcEntity entity={entity as SketchArc} color={color} opacity={opacity} />;
    case EntityType.POINT:
      return <PointEntity entity={entity as any} color={color} />;
    default:
      return null;
  }
}

function LineEntity({ entity, color, opacity }: { entity: SketchLine; color: string; opacity: number }) {
  const points: [number, number, number][] = [
    [entity.start.x, entity.start.y, 0],
    [entity.end.x, entity.end.y, 0],
  ];

  return (
    <Line
      points={points}
      color={color}
      lineWidth={'construction' in entity && entity.construction ? 1 : 2}
      transparent
      opacity={opacity}
    />
  );
}

function CircleEntity({ entity, color, opacity }: { entity: SketchCircle; color: string; opacity: number }) {
  const points: [number, number, number][] = [];
  const segments = 64;
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push([
      entity.center.x + Math.cos(angle) * entity.radius,
      entity.center.y + Math.sin(angle) * entity.radius,
      0,
    ]);
  }

  return (
    <Line
      points={points}
      color={color}
      lineWidth={'construction' in entity && entity.construction ? 1 : 2}
      transparent
      opacity={opacity}
    />
  );
}

function ArcEntity({ entity, color, opacity }: { entity: SketchArc; color: string; opacity: number }) {
  const points: [number, number, number][] = [];
  const segments = 32;
  
  const startAngle = entity.startAngle;
  const endAngle = entity.endAngle;
  const angleDiff = endAngle - startAngle;
  
  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (i / segments) * angleDiff;
    points.push([
      entity.center.x + Math.cos(angle) * entity.radius,
      entity.center.y + Math.sin(angle) * entity.radius,
      0,
    ]);
  }

  return (
    <Line
      points={points}
      color={color}
      lineWidth={'construction' in entity && entity.construction ? 1 : 2}
      transparent
      opacity={opacity}
    />
  );
}

function PointEntity({ entity, color }: { entity: any; color: string }) {
  return (
    <mesh position={[entity.position.x, entity.position.y, 0]}>
      <sphereGeometry args={[1.5, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
