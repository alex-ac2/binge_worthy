'use strict'; //can't use undeclared variables 

const omdb = new (require('omdbapi'))(process.env.OMDB_API_KEY);

module.exports = {

    searchMovie: (userListInput, callback) => {
        omdb.search({
            search: userListInput
        }).then(res => {
            // console.log(res[0].title);
            callback( {checkValue: true, returnName: res[0].title} );
        }).catch((err) => {
            // console.log(err);
            callback( {checkValue: false} );
        })
        //returnValue: true

    }
}