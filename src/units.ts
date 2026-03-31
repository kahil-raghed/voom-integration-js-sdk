/**
 * Represents a real estate unit in the Voom CRM system.
 */
export interface Unit {
  /** Unique identifier for the unit */
  unit_id: string;
  /** ID of the tenant owning the unit */
  tenant_id: string;
  /** ID of the project the unit belongs to */
  project_id: string;
  /** Name or title of the unit */
  name: string;
  /** Type of unit (e.g., 'Apartment', 'Villa') */
  type: string;
  /** Internal code for the unit */
  code: string;
  /** Current availability status (e.g., 'available', 'sold') */
  availability: string;
  /** Total area of the unit in square meters */
  area: number;
  /** Number of bedrooms */
  bedrooms: number;
  /** Listing price of the unit */
  price: number;
}

/**
 * Factory class for creating Unit objects.
 */
export class UnitFactory {
  private constructor() {}

  /**
   * Creates a new Unit object.
   * 
   * @param unit_id - Unique identifier for the unit.
   * @param tenant_id - ID of the tenant.
   * @param project_id - ID of the project.
   * @param name - Name of the unit.
   * @param type - Type of the unit.
   * @param code - Unit code.
   * @param availability - Availability status.
   * @param area - Total area.
   * @param bedrooms - Number of bedrooms.
   * @param price - Listing price.
   * @param data - Optional additional record data (currently unused in implementation).
   * @returns {Unit} A constructed Unit object.
   */
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
