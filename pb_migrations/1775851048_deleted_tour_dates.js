/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_1854663078");
    return app.delete(collection);
  } catch (_) {}
}, (app) => {
  try {
    const collection = new Collection({
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
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
        },
        {
          "hidden": false,
          "id": "json2876557598",
          "maxSize": 0,
          "name": "dates",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_1854663078",
      "indexes": [],
      "listRule": null,
      "name": "tour_dates",
      "system": false,
      "type": "base",
      "updateRule": null,
      "viewRule": null
    });
    return app.save(collection);
  } catch (_) {}
})
