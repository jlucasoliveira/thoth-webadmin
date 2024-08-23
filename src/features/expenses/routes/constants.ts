export enum ExpenseRoutes {
  List = '/expenses',
  Registration = `${List}/manage`,
  View = `${Registration}/:id`,
  Edit = `${View}/?edit`,
}
