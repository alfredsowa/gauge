export const toHeadline = (value: string|undefined) => {
    if (!value) return '';
    // Replace underscores with spaces
    value = value.replace(/_/g, ' ');
    
    // Insert space before each uppercase letter and convert the string to lowercase
    let result = value.replace(/([A-Z])/g, ' $1').toLowerCase();
    
    // Capitalize the first letter of each word
    result = result.replace(/\b\w/g, function(match) {
        return match.toUpperCase();
    });
    
    return result.trim();
}

export function isStringInArray(str: string|null, array: string[]): boolean {
    if (!str ||!Array.isArray(array)) {
        return false;
    }
    const lowerCaseStr = str.toLowerCase();
    return array.some(item => item.toLowerCase() === lowerCaseStr);
}

export const singleOptionList = (options: string[]) => {
    return options.map((option) => ({
        value: option,
        label: toHeadline(option),
    }));
}