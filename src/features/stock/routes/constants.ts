export enum StockRoutes {
  List = '/stocks',
  Registration = `${List}/batch`,
  View = `${List}/manage/:id`,
  Edit = `${View}/?edit`,
}
