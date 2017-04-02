'use strict';

const _ = require('lodash');
const Bb = require('bluebird');

class WaterlineDs {

  constructor(ModelClass) {
    this.ModelClass = ModelClass;
  }

  toObject(model) {
    if (_.isArray(model)) {
      if (model.length > 0) return model[0];
      else return null;
    } else return model;
  }

  _addQWhere(q, qFields, where) {
    const or = [];
    let o;
    _.forEach(qFields, (qField) => {
      o = {};
      o[qField] = {
        like: `%${q}%`,
      };
      or.push(o);
      if (or.length > 0) where.or = or;
    });
  }

  find(options) {
    // console.log('WaterlineDs.find(options)...', options);
    const { filter, q, qFields, sort, fields } = options;
    const conditions = {};
    conditions.where = filter || {};
//    conditions.where = filter ? filter : {};

    conditions.limit = parseInt(options.limit, 10);

    if (q) {
      this._addQWhere(q, qFields, conditions.where);
    }

    if (sort && _.isObject(sort)) {
      conditions.sort = sort;
    }

    const query = this.ModelClass.find(conditions);
    const populated = this._getPopulatedFields(fields);
    if (populated.length > 0) {
      populated.forEach(f => query.populate(f));
    }

    return query;
  }

  findOne(options) {
    // const query = this.ModelClass.find(conditions);
    const query = this.ModelClass.findOne(options.filter);
    const populated = this._getPopulatedFields(options.fields);
    if (populated.length > 0) {
      populated.forEach(f => query.populate(f));
    }

    return query;
    // return this.ModelClass.findOne(options.filter);
  }


  create(data) {
//     This should work: new Pet._model(values); This is not official api
//     https://github.com/balderdashy/waterline/issues/763
    return Bb.resolve(data);
  }


  save(doc) {
    if (_.isObject(doc) && doc.hasOwnProperty('associations')) {
      return doc.save();
    } else {
      return this.ModelClass.create(doc);
    }
  }

  remove(doc) {
    return doc.destroy();
  }

  count(options) {
    const { filter, qFields, q } = options;

    const where = filter || {};

    if (q) {
      this._addQWhere(q, qFields, where);
    }

    return this.ModelClass.count(where);
  }

  _getPopulatedFields(fields) {
    const populate = [];
    _.forEach(fields, (field) => {
      if (_.isObject(field) && field.fields && field.name) {
        populate.push(field.name);
      }
    });
    return populate;
  }

  getModelFieldNames() {
    return _.keys(this.ModelClass.attributes);
  }

}


module.exports = WaterlineDs;
