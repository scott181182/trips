export interface Cluster {
  height: number;
  indexes: number[];
  children?: [Cluster, Cluster];
}
export type LinkageFn = (aIndexes: number[], bIndexes: number[], distanceMatrix: number[][]) => number;

export const averageLinkage: LinkageFn = (aIndexes, bIndexes, distanceMatrix) => {
  let totalDistance = 0;
  let count = 0;

  for (const aIndex of aIndexes) {
    for (const bIndex of bIndexes) {
      totalDistance += distanceMatrix[aIndex][bIndex];
      count++;
    }
  }

  return totalDistance / count;
};

/**
 * Hierarchical clustering of data points using a distance matrix and a linkage function.
 *
 * This function was adapted from https://github.com/greenelab/hclust
 *
 * @param data - the data points to cluster
 * @param distance - an NxN distance matrix where `N = data.length`, and the value at `distance[i][j]` is the distance between `data[i]` and `data[j]`.
 * @param linkage - a function that takes two clusters and a distance matrix and returns a distance between the clusters
 * @returns an object containing the final cluster tree, the distance matrix, the order of data points in the final cluster tree, and the clusters at each level of the tree
 */
export function clusterData<T>(data: T[], distances: number[][], linkage: LinkageFn = averageLinkage): Cluster {
  // initialize clusters to match data
  const clusters = data.map<Cluster>((_d, i) => ({
    height: 0,
    indexes: [i],
  }));

  // iterate through data
  for (let iteration = 0; iteration < data.length - 1; iteration++) {
    // initialize smallest distance
    let nearestDistance = Infinity;
    let nearestRow = 0;
    let nearestCol = 0;

    // upper triangular matrix of clusters
    for (let row = 0; row < clusters.length - 1; row++) {
      for (let col = row + 1; col < clusters.length; col++) {
        // calculate distance between clusters
        const distance = linkage(clusters[row].indexes, clusters[col].indexes, distances);
        // update smallest distance
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestRow = row;
          nearestCol = col;
        }
      }
    }

    // merge nearestRow and nearestCol clusters together
    const newCluster: Cluster = {
      indexes: [...clusters[nearestRow].indexes, ...clusters[nearestCol].indexes],
      height: nearestDistance,
      children: [clusters[nearestRow], clusters[nearestCol]],
    };

    // remove nearestRow and nearestCol clusters
    // splice higher index first so it doesn't affect second splice
    clusters.splice(Math.max(nearestRow, nearestCol), 1);
    clusters.splice(Math.min(nearestRow, nearestCol), 1);

    // add new merged cluster
    clusters.push(newCluster);
  }

  return clusters[0];
}

/**
 * Flattens a cluster tree into an ordered list of data point indexes.
 *
 * @param cluster - the cluster tree to flatten
 * @param distances - an optional distance matrix to use as a hint for ordering subclusters
 * @param hintIndex - an optional index to use as a hint for ordering neighboring subclusters
 */
export function flattenCluster(cluster: Cluster, distances?: number[][], hintIndex?: number): number[] {
  if (!cluster.children) {
    return cluster.indexes;
  }

  // If we have a hintIndex, use distance to find which child cluster is closer to the hintIndex, and order that one first.
  if (distances && typeof hintIndex === "number") {
    const leftDistance = Math.min(...cluster.children[0].indexes.map((i) => distances[hintIndex][i]));
    const rightDistance = Math.min(...cluster.children[1].indexes.map((i) => distances[hintIndex][i]));

    if (leftDistance !== rightDistance) {
      const isLeftCloser = leftDistance <= rightDistance;

      const closer = isLeftCloser ? cluster.children[0] : cluster.children[1];
      const farther = isLeftCloser ? cluster.children[1] : cluster.children[0];

      return [
        ...flattenCluster(closer, distances, hintIndex),
        ...flattenCluster(farther, distances, closer.indexes.at(-1)),
      ];
    }
  }

  const isLeftLarger = cluster.children[0].indexes.length >= cluster.children[1].indexes.length;

  const larger = isLeftLarger ? cluster.children[0] : cluster.children[1];
  const smaller = isLeftLarger ? cluster.children[1] : cluster.children[0];

  return [
    ...flattenCluster(larger, distances, hintIndex),
    ...flattenCluster(smaller, distances, larger.indexes.at(-1)),
  ];
}
