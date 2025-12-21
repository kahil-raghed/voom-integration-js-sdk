export interface Unit {
  unit_id: string;
  tenant_id: string;
  project_id: string;
  name: string;
  type: string;
  code: string;
  availability: string;
  area: number;
  bedrooms: number;
  price: number;
}

export class UnitFactory {
  private constructor() {}

  static make(
    unit_id: string,
    tenant_id: string,
    project_id: string,
    name: string,
    type: string,
    code: string,
    availability: string,
    area: number,
    bedrooms: number,
    price: number,
    data: Record<string, any> | null = null
  ): Unit {
    return {
      unit_id,
      tenant_id,
      project_id,
      name,
      type,
      code,
      availability,
      area,
      bedrooms,
      price,
    };
  }
}
