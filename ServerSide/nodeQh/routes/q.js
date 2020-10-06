'use strict'; Object.defineProperty(exports, "__esModule", { value: true }); var _express = require('express');
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _config = require('../config.json'); var _config2 = _interopRequireDefault(_config); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Service Desk Manager 
exports.default = function (config, db) {
  var restURL = _config2.default.CArestURL;
  var q = (0, _express.Router)();

  /* Is Alive */
  q.get('/isAlive', function (req, res) {
    res.end("I am alive"); // Result in JSON format
  });

  /* SQL Query Headers */
  q.get('/qh', function (req, res) {
    const first = decodeURIComponent(req.headers['first']);
    const second = decodeURIComponent(req.headers['second']);
    const third = decodeURIComponent(req.headers['third']) || '';
    let qq = 'select ' + first + ' from ' + second;
    if (third != '')
      qq += ' where ' + third;
    console.log(qq)
    new db.ConnectionPool(config).connect().then(pool => {
      return pool.request().query(qq)
    }).then(result => {
      let rows = result.recordset
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json(rows);
      db.close();
    }).catch(err => {
      res.status(500).send({ message: "${err}" })
      db.close();
    });
  });
  q.put('/qh', function (req, res) {
    const first = decodeURIComponent(req.headers['first']);
    const second = decodeURIComponent(req.headers['second']);
    const third = decodeURIComponent(req.headers['third']) || '';
 
    if(first)
    {
      let firstAr = JSON.parse(first)
      let set_value = '';
      Object.keys(firstAr).forEach( function(key) {
        set_value += ' ' + key + ' = '+ firstAr[key] + ','
      })
      set_value = set_value.substring(0,set_value.length-1)
      let qq = 'update ' + second + ' set  ' + set_value;
      if (third != '')
        qq += ' where ' + third;
      console.log(qq)
      new db.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(qq)
      }).then(result => {
        let rowsAffected = result['rowsAffected']
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json(rowsAffected);
        db.close();
      }).catch(err => {
        res.status(500).send({ message: "${err}" })
        db.close();
      }); 
    } else
    {
      res.status(500).send({ message: "data is null" })
        db.close();
    }

    
  });
  q.post('/qh', function (req, res) {
    //Uniq id
    //alter table users drop column id
    //alter table users ADD id INT IDENTITY(1,1)

    // Default Value
    //alter table users drop column followed
    //alter table users ADD followed INT DEFAULT 0

    const first = decodeURIComponent(req.headers['first']);
    const second = decodeURIComponent(req.headers['second']);
    const third = decodeURIComponent(req.headers['third']);
    if(first)
    {
      //insert into users (status, followed) VALUES  ( 'aaaa' , 0)
      let firstAr = JSON.parse(first)
      let set_keys = '';
      let set_value = '';
      Object.keys(firstAr).forEach( function(key) {
        set_keys += ' ' + key  + ','
        set_value += ' ' + firstAr[key] + ','
      })
      set_keys = set_keys.substring(0,set_keys.length-1)
      set_value = set_value.substring(0,set_value.length-1)
      let qq = 'insert into ' + second + ' ( '+ set_keys +' ) Output Inserted.' + third +' VALUES  (' + set_value + ')';
      console.log(qq)
      new db.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(qq)
      }).then(result => {
        let rows = result.recordset
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json(rows);
        db.close();
      }).catch(err => {
        res.status(500).send({ message: "${err}" })
        db.close();
      }); 
    } else
    {
      res.status(500).send({ message: "data is null" })
        db.close();
    }

    
  });
  q.delete('/qh', function (req, res) {
    const second = decodeURIComponent(req.headers['second']);
    const third = decodeURIComponent(req.headers['third']) ;
      
      let qq = 'delete ' + second 
        qq += ' where ' + third;
      console.log(qq)
      new db.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(qq)
      }).then(result => {
        let rowsAffected = result['rowsAffected']
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json(rowsAffected);
        db.close();
      }).catch(err => {
        res.status(500).send({ message: "${err}" })
        db.close();
      });     
  });
  return q;
};