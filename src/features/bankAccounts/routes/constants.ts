export enum BankAccountsRoutes {
  List = '/accounts',
  Registration = `${List}/manage`,
  View = `${Registration}/:id`,
  Edit = `${View}/?edit`,
}
