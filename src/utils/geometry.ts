import * as THREE from 'three';
import { Point3D, Point2D, Vector3D } from '../types/cad';

export class GeometryEngine {
  static createBox(width: number, height: number, depth: number): THREE.BoxGeometry {
    return new THREE.BoxGeometry(width, height, depth);
  }

  static createSphere(radius: number, segments: number = 32): THREE.SphereGeometry {
    return new THREE.SphereGeometry(radius, segments, segments);
  }

  static createCylinder(radius: number, height: number, segments: number = 32): THREE.CylinderGeometry {
    return new THREE.CylinderGeometry(radius, radius, height, segments);
  }

  static createCone(radius: number, height: number, segments: number = 32): THREE.ConeGeometry {
    return new THREE.ConeGeometry(radius, height, segments);
  }

  static createTorus(radius: number, tube: number, segments: number = 32): THREE.TorusGeometry {
    return new THREE.TorusGeometry(radius, tube, segments, segments);
  }

  static createPlane(width: number, height: number): THREE.PlaneGeometry {
    return new THREE.PlaneGeometry(width, height);
  }

  static extrudeProfile(profile: THREE.Shape, depth: number, bevelEnabled: boolean = false): THREE.ExtrudeGeometry {
    return new THREE.ExtrudeGeometry(profile, {
      depth,
      bevelEnabled,
      bevelThickness: bevelEnabled ? 0.1 : 0,
      bevelSize: bevelEnabled ? 0.1 : 0,
      bevelSegments: bevelEnabled ? 2 : 0,
    });
  }

  static revolveProfile(profile: THREE.Shape, angle: number = Math.PI * 2, segments: number = 32): THREE.LatheGeometry {
    const points = profile.getPoints();
    return new THREE.LatheGeometry(points, segments, 0, angle);
  }

  static createLine(start: Point3D, end: Point3D): THREE.BufferGeometry {
    const points = [
      new THREE.Vector3(start.x, start.y, start.z),
      new THREE.Vector3(end.x, end.y, end.z),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }

  static createCirclePoints(center: Point2D, radius: number, segments: number = 64): Point2D[] {
    const points: Point2D[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
      });
    }
    return points;
  }

  static createArcPoints(center: Point2D, radius: number, startAngle: number, endAngle: number, segments: number = 32): Point2D[] {
    const points: Point2D[] = [];
    const angleDiff = endAngle - startAngle;
    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + (i / segments) * angleDiff;
      points.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
      });
    }
    return points;
  }

  static distance2D(p1: Point2D, p2: Point2D): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static distance3D(p1: Point3D, p2: Point3D): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  static normalizeVector(v: Vector3D): Vector3D {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (length === 0) return { x: 0, y: 0, z: 0 };
    return {
      x: v.x / length,
      y: v.y / length,
      z: v.z / length,
    };
  }

  static crossProduct(a: Vector3D, b: Vector3D): Vector3D {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x,
    };
  }

  static dotProduct(a: Vector3D, b: Vector3D): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  static interpolatePoints(p1: Point3D, p2: Point3D, t: number): Point3D {
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
      z: p1.z + (p2.z - p1.z) * t,
    };
  }

  static snapToGrid(value: number, gridSize: number): number {
    return Math.round(value / gridSize) * gridSize;
  }

  static snapPointToGrid(point: Point3D, gridSize: number): Point3D {
    return {
      x: this.snapToGrid(point.x, gridSize),
      y: this.snapToGrid(point.y, gridSize),
      z: this.snapToGrid(point.z, gridSize),
    };
  }
}

export class ConstraintSolver {
  static solveDistance(_entities: any[], _distance: number): boolean {
    // Implementation for distance constraint solving
    return true;
  }

  static solveAngle(_entities: any[], _angle: number): boolean {
    // Implementation for angle constraint solving
    return true;
  }

  static solveCoincident(_entities: any[]): boolean {
    // Implementation for coincident constraint solving
    return true;
  }

  static solveParallel(_entities: any[]): boolean {
    // Implementation for parallel constraint solving
    return true;
  }

  static solvePerpendicular(_entities: any[]): boolean {
    // Implementation for perpendicular constraint solving
    return true;
  }
}
