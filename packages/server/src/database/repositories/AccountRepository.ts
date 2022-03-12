import Repository from '../Repository'
import AccountSchema from '../schemas/AccountSchema'

export default class AccountRepository extends Repository {
  constructor (mongoose) {
    super(mongoose, mongoose.model('Account', AccountSchema))
  }
}
