export function matchItems(source, targets) {
  if (!targets || targets.length === 0) return [];

  // Helper: Words ko array mein convert karke clean karta hai
  const getWords = (str) => {
    return str ? str.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(w => w.length > 1) : [];
  };

  // Helper: Jaccard Similarity Calculation (0 to 1 scale)
  const calculateSimilarity = (arr1, arr2) => {
    if (arr1.length === 0 || arr2.length === 0) return 0;
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  };

  return targets
    .map(t => {
      let finalScore = 0;

      // 1. Title Match (Weight: 50%) - Precise check
      const sourceTitleWords = getWords(source.title);
      const targetTitleWords = getWords(t.title);
      const titleSim = calculateSimilarity(sourceTitleWords, targetTitleWords);
      finalScore += titleSim * 50;

      // 2. Description Match (Weight: 20%) - Reduced slightly
      const sourceDescWords = getWords(source.description);
      const targetDescWords = getWords(t.description);
      const descSim = calculateSimilarity(sourceDescWords, targetDescWords);
      finalScore += descSim * 20;

      // 3. AI Image Tag Match (Weight: 40%) - NEW! 🤖
      // Agar text mein kuch nahi likha, par photo mein "Laptop" hai, toh yahan pakdega.
      const sourceTags = source.aiTags || [];
      const targetTags = t.aiTags || [];

      // Cross Check: Source Tags vs Target Description/Title/Tags
      // Matlab: Agar photo mein "Backpack" hai, toh check karo kya samne wale ne "Backpack" likha hai?
      const allTargetWords = [...targetTitleWords, ...targetDescWords, ...targetTags];
      const tagSim = calculateSimilarity(sourceTags, allTargetWords);

      // Vice Versa: Check Target Photo Tags vs Source Text
      const allSourceWords = [...sourceTitleWords, ...sourceDescWords, ...sourceTags];//user jldi m sirf photo upload karta hai
      const reverseTagSim = calculateSimilarity(targetTags, allSourceWords);

      finalScore += (tagSim + reverseTagSim) * 30; // 60 max (30 each way)

      // 3. Location Match (Weight: 20%) - Strict check
      if (source.location && t.location) {
        const sLoc = source.location.toLowerCase().trim();
        const tLoc = t.location.toLowerCase().trim();
        if (sLoc === tLoc) {
          finalScore += 20;
        } else if (sLoc.includes(tLoc) || tLoc.includes(sLoc)) {
          finalScore += 10;
        }
      }

      // Percentage ko Round karke integer banana
      const percentage = Math.round(finalScore);

      return { ...t, score: percentage };
    })
    .filter(t => t.score > 10) // Faltu ke results (10% se kam) hata do
    .sort((a, b) => b.score - a.score) // Highest percentage upar
    .slice(0, 3);
}