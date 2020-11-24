export default function getHitsToBuild(room: Room): number {
  return room
    .find(FIND_MY_CONSTRUCTION_SITES)
    .map(
      (constructionSite) =>
        constructionSite.progressTotal - constructionSite.progress
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}
