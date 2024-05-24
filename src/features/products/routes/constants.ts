export enum ProductRoutes {
  List = '/products',
  Registration = `${List}/manage`,
  View = `${Registration}/:id`,
  Variation = `${View}/variation/:variationId/?edit`,
  Edit = `${View}/?edit`,
}
