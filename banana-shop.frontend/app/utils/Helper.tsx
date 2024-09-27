/**
 * Adds into the existing class names. Use 'override-class' to override the original class name
 * @param originalClass Original class name to modify
 * @param additionalClass Appends to the original class name
 * @param override Overrides the originalClass with additionalClass instead of appending
 * @returns 
 */
export function ModifyClassName(originalClass: string, additionalClass: string, override: boolean = false): string {
    if (override) {
        return additionalClass ?? originalClass;
    } else {
        return originalClass + ' ' + additionalClass;
    }
}