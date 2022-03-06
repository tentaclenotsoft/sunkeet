interface IAny {
  [key: string]: any
}

export default class Repository {
  mongoose: any
  model: any

  constructor (mongoose, model) {
    this.mongoose = mongoose
    this.model = typeof model === 'string' ? mongoose.model(model) : model
  }

  parse (entity) {
    return entity
      ? entity.toObject({ virtuals: true, versionKey: false })
      : null
  }

  insert (entity: IAny) {
    return this.model.create(entity).then(this.parse)
  }

  findOne (id: string, projection?: IAny) {
    return this.model.findById(id, projection).then(this.parse)
  }

  findAll (query: IAny = {}, projection?: IAny) {
    return this.model
      .find(query, projection)
      .then((entities) => entities.map(this.parse))
  }

  get (query: IAny, projection?: IAny) {
    return this.model.findOne(query, projection).then(this.parse)
  }

  destroy (id: string) {
    return this.model.findByIdAndRemove(id).then(this.parse)
  }

  update (query: IAny, entity: IAny, options = { upsert: true, new: true }) {
    return this.model.findOneAndUpdate(query, entity, options).then(this.parse)
  }
}
