const {asClass, asValue, Lifetime, InjectionMode, createContainer, asFunction} = require('awilix');
const container = createContainer({injectionMode : InjectionMode.CLASSIC});

const sqliteConnect = require('../driver/sqlite')
const multerConfig = require('../driver/multer')

function getScope() {
    return {lifetime : Lifetime.SINGLETON}
}

container.register('config', asValue(require('../config/config')));

container.register('sqliteRepo', asClass(require('../data/sqlite-repo')));

container.register('uploadApi', asClass(require('../api/upload-api')));
container.register('trimApi', asClass(require('../api/trim-api')));


container.register('uploadLogic', asClass(require('../logic/upload-logic')));
container.register('trimLogic', asClass(require('../logic/trim-logic')));

container.register('helper', asClass(require('../utils/helper')));

container.register({
    'sqlite': asFunction(sqliteConnect).singleton(),
    'multerConfig': asFunction(multerConfig).singleton(),
})


module.exports = container;