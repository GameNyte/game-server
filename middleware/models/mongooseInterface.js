'use Strict';

class MongoInterface {

  constructor(schema){
    this.schema = schema;
  }

  get(_id) {
    let searchParam = _id ? {_id} : {};
    return this.schema.find(searchParam);
  }

  create(data) {
    let newObject = new this.schema(data);
    return newObject.save(newObject);
  }

  exists(data) {
    return this.schema.exists(data);
  }

  update(_id, data){
    return this.schema.findByIdAndUpdate(_id, data);
  }

  delete(_id){
    return this.schema.findByIdAndDelete(_id);
  }
}

module.exports = MongoInterface;