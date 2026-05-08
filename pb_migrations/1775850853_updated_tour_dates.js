/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_1854663078")
    collection.fields.addAt(3, new Field({
      "cascadeDelete": false,
      "collectionId": "bp3eemabfj23unb",
      "hidden": false,
      "id": "relation1542800728",
      "maxSelect": 1,
      "minSelect": 0,
      "name": "field",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "relation"
    }))
    return app.save(collection)
  } catch (_) {}
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_1854663078")
    collection.fields.removeById("relation1542800728")
    return app.save(collection)
  } catch (_) {}
})
