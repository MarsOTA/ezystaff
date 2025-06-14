
// Re-export functions from the refactored modules for backward compatibility
export { getAutocompleteService, handleLocationSearch, handleAddressSearch } from "./googleMaps";
export { combineDateTime, validateEventForm } from "./eventValidation";
export { saveEvent } from "./eventSaving";
