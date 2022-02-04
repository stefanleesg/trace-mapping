import type { SourceMapSegment } from './types';

export default function maybeSort(
  mappings: SourceMapSegment[][],
  owned: boolean,
): SourceMapSegment[][] {
  const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
  if (unsortedIndex === mappings.length) return mappings;

  // If we own the array (meaning we parsed it from JSON), then we're free to directly mutate it. If
  // not, we do not want to modify the consumer's input array.
  if (!owned) mappings = mappings.slice();

  for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1)) {
    mappings[i] = sortSegments(mappings[i], owned);
  }
  return mappings;
}

function nextUnsortedSegmentLine(mappings: SourceMapSegment[][], start: number): number {
  for (let i = start; i < mappings.length; i++) {
    if (!isSorted(mappings[i])) return i;
  }
  return mappings.length;
}

function isSorted(line: SourceMapSegment[]): boolean {
  for (let j = 1; j < line.length; j++) {
    if (line[j][0] < line[j - 1][0]) {
      return false;
    }
  }
  return true;
}

function sortSegments(line: SourceMapSegment[], owned: boolean): SourceMapSegment[] {
  if (!owned) line = line.slice();
  return line.sort(sortComparator);
}

function sortComparator(a: SourceMapSegment, b: SourceMapSegment): number {
  return a[0] - b[0];
}
