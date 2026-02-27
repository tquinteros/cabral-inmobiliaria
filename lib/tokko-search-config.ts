/**
 * Tokko API search configuration.
 * Barrio/division IDs from Tokko localization.
 * Extend with IDs from Tokko API (e.g. /api/v1/location/).
 * Example: Palermo=24728, Belgrano=24682 (Capital Federal)
 */
export const BARRIO_LOCALIZATION_IDS: Record<string, number> = {
  Palermo: 24728,
  Belgrano: 24682,
  // Add more barrios with their Tokko division IDs as needed
};

/** Argentina country ID */
export const ARGENTINA_COUNTRY_ID = 1;

/** Operation types: 1=sale, 2=rent, 3=temporary (typical Tokko mapping) */
export const OPERATION_TYPE_IDS = {
  sell: [1],
  rent: [2],
  all: [1, 2, 3],
} as const;
