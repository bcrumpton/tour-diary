/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const shows = app.findCollectionByNameOrId("bp3eemabfj23unb")
  shows.fields.getByName("flyer").thumbs = ["480x640", "1000x0"]
  app.save(shows)

  const tours = app.findCollectionByNameOrId("pbc_3830217189")
  tours.fields.getByName("flyer").thumbs = ["480x640", "1000x0"]
  app.save(tours)
}, (app) => {
  const shows = app.findCollectionByNameOrId("bp3eemabfj23unb")
  shows.fields.getByName("flyer").thumbs = []
  app.save(shows)

  const tours = app.findCollectionByNameOrId("pbc_3830217189")
  tours.fields.getByName("flyer").thumbs = []
  app.save(tours)
})
