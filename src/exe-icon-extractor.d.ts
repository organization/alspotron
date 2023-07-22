declare module '@bitdisaster/exe-icon-extractor' {
  export function extractIcon(filePath: string, type: 'large' | 'small'): Buffer;
}