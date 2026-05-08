/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_1854663078")
    collection.fields.addAt(1, new Field({
      "hidden": false,
      "id": "number1092145443",
      "max": null,
      "min": null,
      "name": "latitude",
      "onlyInt": false,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    }))
    collection.fields.addAt(2, new Field({
      "hidden": false,
      "id": "number2246143851",
      "max": null,
      "min": null,
      "name": "longitude",
      "onlyInt": false,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    }))
    return app.save(collection)
  } catch (_) {}
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_1854663078")
    collection.fields.removeById("number1092145443")
    collection.fields.removeById("number2246143851")
    return app.save(collection)
  } catch (_) {}
})
