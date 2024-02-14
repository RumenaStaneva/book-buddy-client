import BookCategories from "./constants/bookCategories";

export const REACT_APP_LOCAL_HOST =
  "https://book-buddy-server-6b413ec41906.herokuapp.com";

//measure of the similarity between two strings;
//defined as the minimum number of single-character edits
//(insertions, deletions, or substitutions) required to change one string into the other
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1),
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

export function findExistingCategory(category: string): string | null {
  if (!category) {
    return null;
  }
  const existingCategories = Object.values(BookCategories);

  let minDistance = Number.MAX_SAFE_INTEGER;
  let bestMatch: string | null = null;

  for (const existingCategory of existingCategories) {
    const distance = levenshteinDistance(
      category.toLowerCase(),
      existingCategory.toLowerCase()
    );

    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = existingCategory;
    }
  }

  return bestMatch;
}
