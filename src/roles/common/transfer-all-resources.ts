export default function transferAllResources(
  creep: Creep,
  target: Creep | Structure
): ScreepsReturnCode {
  const transferReturnCodes: ScreepsReturnCode[] = [];
  RESOURCES_ALL.forEach((resourceType) => {
    const withdrawReturnCode: ScreepsReturnCode = creep.transfer(
      target,
      resourceType
    );

    transferReturnCodes.push(withdrawReturnCode);
  });

  if (
    transferReturnCodes.find((transferReturnCode) => transferReturnCode === OK)
  ) {
    return OK;
  }

  return transferReturnCodes[0];
}
