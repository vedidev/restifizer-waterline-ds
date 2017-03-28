[![NPM](https://nodei.co/npm/restifizer-waterline-ds.png?compact=true)](https://npmjs.org/package/restifizer-waterline-ds)

> We are working hard to create documentation. If you have exact questions or ideas how we can improve documentation, create a ticket here: https://github.com/vedi/restifizer-waterline-ds/issues

> Any feedback is appreciated.

Wateline ORM Data Source for Restifizer
==========

Restifizer - it's a way to significantly simplify creation of full-functional RESTful services. It's available at:
https://github.com/vedi/restifizer

This Data Source allows you to use waterline models and adapters in your REST service. For example:

```
  WaterlineDataSource = require('restifizer-waterline-ds'),
  User = require('waterline').Waterline.Collection.extend({...})

...

module.exports = BaseController.extend({
  dataSource: new WaterlineDataSource(User),
...

```

