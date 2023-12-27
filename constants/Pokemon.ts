
type GroupedVersions = {
  [version: string]: {
    start: number;
    end: number
  };
};

export const groupedVersions: GroupedVersions = {
  gen1: { start: 1, end: 151 },
  gen2: { start: 152, end: 251 },
  gen3: { start: 252, end: 386 },
  gen4: { start: 387, end: 493 },
  gen5: { start: 494, end: 649 },
  gen6: { start: 650, end: 721 },
  gen7: { start: 722, end: 809 },
  gen8: { start: 810, end: 905 },
  gen9: { start: 906, end: 1010 },
};

export const versionOptions = [
  { key: 'gen1', label: 'Gen 1' },
  { key: 'gen2', label: 'Gen 2' },
  { key: 'gen3', label: 'Gen 3' },
  { key: 'gen4', label: 'Gen 4' },
  { key: 'gen5', label: 'Gen 5' },
  { key: 'gen6', label: 'Gen 6' },
  { key: 'gen7', label: 'Gen 7' },
  { key: 'gen8', label: 'Gen 8' },
  { key: 'gen9', label: 'Gen 9' },
];