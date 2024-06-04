export enum StockRoutes {
  List = '/stocks',
  View = `${List}/manage/:id`,
  Edit = `${View}/?edit`,
}
