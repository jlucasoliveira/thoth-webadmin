export enum UserRoutes {
  Users = '/users/',
  Registration = '/users/manage',
  View = `${Registration}/:id`,
  Edit = `${View}/?edit`,
}
