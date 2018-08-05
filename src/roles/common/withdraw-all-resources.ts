export default function withdrawAllResources(creep: Creep, target: Structure | Tombstone): ScreepsReturnCode {
    const withdrawReturnCodes: ScreepsReturnCode[] = [];
    RESOURCES_ALL
        .forEach((resourceType) => {
            const withdrawReturnCode: ScreepsReturnCode = creep.withdraw(target, resourceType);

            withdrawReturnCodes.push(withdrawReturnCode);
        });

    if (withdrawReturnCodes.find((withdrawReturnCode) => withdrawReturnCode === OK)) {
        return OK;
    }

    return withdrawReturnCodes[0];
}
