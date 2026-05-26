/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  try {
    const collection = app.findCollectionByNameOrId("bp3eemabfj23unb")
    collection.fields.removeById("select2363381545")
    return app.save(collection)
  } catch (_) {}
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("bp3eemabfj23unb")
    collection.fields.addAt(7, new Field({
      "hidden": false,
      "id": "select2363381545",
      "maxSelect": 1,
      "name": "type",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "select",
      "values": [
        "show",
        "tour"
      ]
    }))
    return app.save(collection)
  } catch (_) {}
})
