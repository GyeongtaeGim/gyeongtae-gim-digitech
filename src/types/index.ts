import * as Three from 'three';

export function isMeshType(object?: Three.Object3D): object is Three.Mesh {
  return object?.type === 'Mesh';
}
