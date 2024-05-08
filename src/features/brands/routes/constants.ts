export enum BrandsRoutes {
  List = '/brands',
  Registration = `${List}/manage`,
  View = `${Registration}/:id`,
  Edit = `${View}/?edit`,
}
