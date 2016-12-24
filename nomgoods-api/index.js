import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import Promise from 'bluebird'
import api from './api'
import model from './model'
import repository from './repository'
import auth from './auth'

const port = process.env.PORT || 5000;
const connstr = process.env.CONNSTRING || 'mongodb://localhost/nomgoods';

const app = express();
const _model = model(mongoose);
const _repository = repository(_model);

mongoose.Promise = Promise;

app.use(bodyParser.json());
app.use('/api', auth(_repository), api(express, _repository));

console.log('connecting to mongodb');
mongoose.connect(connstr);

console.log(`starting app on port ${port}`);
app.listen(port);