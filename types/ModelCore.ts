import { AbstractMesh } from 'babylonjs'
import { Rectangle } from 'babylonjs-gui'

export default interface ModelCore extends AbstractMesh {
  label?: Rectangle
}
