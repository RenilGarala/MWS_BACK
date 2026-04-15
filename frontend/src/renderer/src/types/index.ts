export interface Project {
  _id?: string
  projectId: string
  projectName: string
  description: string
  numberOfItems: number
  totalItems?: number
  status?: string
  parts?: Part[]
}

export interface Part {
  _id?: string
  partCode: string
  partName: string
  orderQuantity: string | number
  dispatchDate: string
  numberOfPart?: number
  status?: string
}
