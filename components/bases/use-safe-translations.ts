export type SafeTranslateFn = {
  (
    key: string,
    defaultOrValues?: string | Record<string, string | number>,
    values?: Record<string, string | number>
  ): string;
  t: (key: string, fallback?: string) => string;
  raw: (key: string) => unknown;
  [key: string]: unknown;
};

export function useSafeTranslations(
  _namespace?: string,
  fallbacks?: Record<string, string>
): SafeTranslateFn {
  const translate: SafeTranslateFn = ((
    key: string,
    defaultOrValues?: string | Record<string, string | number>,
    _values?: Record<string, string | number>
  ): string => {
    if (typeof defaultOrValues === "string") {
      return defaultOrValues;
    }
    if (fallbacks && typeof fallbacks[key] === "string") {
      return fallbacks[key];
    }
    return key;
  }) as SafeTranslateFn;

  translate.t = (key: string, fallback?: string): string => {
    if (fallback) return fallback;
    if (fallbacks && typeof fallbacks[key] === "string") return fallbacks[key];
    return key;
  };

  translate.raw = (key: string): unknown => {
    return fallbacks?.[key] ?? key;
  };

  return translate;
}

export default useSafeTranslations;
