export enum CategoriesRoutes {
  List = '/categories',
  Registration = `${List}/manage`,
  View = `${Registration}/:id`,
  Edit = `${View}/?edit`,
}
