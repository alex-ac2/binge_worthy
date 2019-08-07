'use strict';

const yelp = require('yelp-fusion');
const stringSimilarity = require('string-similarity');


module.exports = {

  yelpQuery: (userListInput, callback) => {

    const apiKey = process.env.YELP_API_KEY;

    const searchRequest = {
      term: userListInput,
      categories: 'restaurants, All', 
      location: 'toronto, on'
    };

    const client = yelp.client(apiKey);

    client.search(searchRequest).then(response => {
      const firstResult = response.jsonBody.businesses[0];
      //const prettyJson = JSON.stringify(firstResult, null, 4);
      //let returnBody = JSON.parse(prettyJson);
      let returnBody = firstResult;
      //console.log('RETURN BODY: ', returnBody);
      // console.log(typeof returnBody);

      // Determine if yelp request has found a matched restaurant;
      if (typeof returnBody === 'undefined' || !returnBody.hasOwnProperty('name')) {  // has prop
        return callback( {checkValue: false} );
      }

      let returnName = returnBody.name.split(" ").join("").toLocaleLowerCase();
      let cleanReturnName = returnName.replace(/[|&;'$%@"<>()+,]/g, "");

      //let userSearchArray = userSearchWord.split(" ");
      let userSearchInput = userListInput.split(" ").join("");
      
      // console.log('user input: ', userSearchInput);
      // console.log("clean return name: ", cleanReturnName);

      let userInputCompare = stringSimilarity.compareTwoStrings(userSearchInput, cleanReturnName);
      //console.log(userInputCompare);

      switch(true) {
        case (userInputCompare > 0.60):
          // console.log(true);
          callback( {compareRating: userInputCompare, checkValue: true, returnName: returnBody.name} );
          break;
        default:
          // console.log(false);
          callback( {compareRating: userInputCompare, checkValue: false} );
      }

    }).catch(e => {
      //console.log(response);
      console.log('RETURN ERROR: ', e);
    });
  }

}