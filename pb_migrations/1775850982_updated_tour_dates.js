/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_1854663078")
    collection.fields.addAt(2, new Field({
      "hidden": false,
      "id": "json2876557598",
      "maxSize": 0,
      "name": "dates",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "json"
    }))
    return app.save(collection)
  } catch (_) {}
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_1854663078")
    collection.fields.removeById("json2876557598")
    return app.save(collection)
  } catch (_) {}
})
