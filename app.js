let mongoose = require('mongoose');
let Contato = require('./contato.model');

let db_path = process.env.LISTA_TELEFONICA_MONGODB_ADDRESS || 'mongodb://127.0.0.1/lista-telefonica';

let options = { 
    useMongoClient: true,
    keepAlive: 300000, 
    connectTimeoutMS: 30000 
};  

mongoose.Promise = Promise;

mongoose.connect(db_path, options)
    .then(() => { console.log(`[OK] => mongoose.connect('${db_path}')`); })
    .catch(err => {
        console.log(`[Error] => mongoose.connect('${db_path}') : ${err.message} `);
    });

let handleError = (err) => {
    var message = (err && err.message) ? err.message : 'Erro desconhecido';
    console.log(`[Error] => ${message}`);
};

let pageNumber = 11;
let numberOfLines = 10;

let skipNumber = (pageNumber -1) * numberOfLines;

let dataPromise = Contato
    .find({})
    .sort({nome: 'asc'})
    .skip(skipNumber)
    .limit(numberOfLines)
    .select({nome: 1, id: -1})
    .exec();

let countPromise = Contato  
    .find({}).count().exec();
        
Promise.all([dataPromise, countPromise])
    .then(result => {
        let totalPages = Math.ceil(result[1] / numberOfLines);
        
        console.log({
            data: result[0],
            totalPages: totalPages,
            pageNumber: pageNumber
        });
        process.exit(0);
    })
    .catch(err => {
        handleError(err);
    });	
