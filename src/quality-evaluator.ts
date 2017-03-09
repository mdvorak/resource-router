export function evaluateTypeQuality(type: string): number {
    // Any type is zero
    if (type === '*') return 0;
    // Wildcard or specific?
    return /[*?]/.test(type) ? 0.5 : 1;
}

export function evaluateStatusQuality(status: string): number {
    let m = status.match(/\d/g);
    return m ? (m.length / status.length) : 0;
}
