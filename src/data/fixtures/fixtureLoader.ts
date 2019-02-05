export default async (fixtures, service) => {
    let dbData = await service.list();
    if (dbData.length == 0) {
        await service.saveAll(...fixtures);
    } else {
        const update = [];
        for (let fixture of fixtures) {
            let item = dbData.find(x => x.id == fixture.id);
            if (item) {
                Object.assign(item, fixture);
                update.push(item);
                dbData = dbData.filter(x => x.id != item.id);
            } else {
                update.push(fixture);
            }
        }
        if (update.length > 0) {
            await service.saveAll(...update);
        }

        if (dbData.length > 0) {
            await service.deleteAll(...dbData);
        }

    }
}