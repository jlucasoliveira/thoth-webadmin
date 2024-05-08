export enum GendersRoutes {
  List = '/genders',
  Registration = `${List}/manage`,
  View = `${Registration}/:id`,
  Edit = `${View}/?edit`,
}
