export const getUserRoles = (items= ['ROLE_USER']) => {
  const item = items[0]
  let role
  switch (item) {
    case 'ROLE_SUPER_ADMIN':
      role = 'Super admin. (root)'
      break
    case 'ROLE_OWNER_ADMIN':
      role = 'Super admin.'
      break
    default:
      role = 'Utilisateur'
      break
  }
  return role
}
