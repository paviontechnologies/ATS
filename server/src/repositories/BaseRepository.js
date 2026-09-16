export class BaseRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async findById(id) {
    return this.collection.findOne({ _id: id, isDeleted: { $ne: true } });
  }

  async findOne(filter = {}) {
    return this.collection.findOne({ ...filter, isDeleted: { $ne: true } });
  }

  async find(filter = {}, options = {}) {
    return this.collection.find({ ...filter, isDeleted: { $ne: true } }, options);
  }

  async create(data) {
    return this.collection.insertOne({
      ...data,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  async update(id, data) {
    return this.collection.updateById(id, {
      $set: {
        ...data,
        updatedAt: new Date().toISOString()
      }
    });
  }

  async softDelete(id, userId = 'SYSTEM') {
    return this.collection.updateById(id, {
      $set: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: userId
      }
    });
  }

  async count(filter = {}) {
    return this.collection.countDocuments({ ...filter, isDeleted: { $ne: true } });
  }
}
