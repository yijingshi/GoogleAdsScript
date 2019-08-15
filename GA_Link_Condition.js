/**
**  This script is to add Google ads account by Impressions to google analytics
**
*/
function main() {


  //
  // Step 1. find all the accounts that is already linked on GA
  // This way we can avoid getting an error by trying to link already linked accounts
  //

  var accountId = '12345678';
  var webPropertyId = 'UA-12345678-1';
  var webProperty = Analytics.Management.WebPropertyAdWordsLinks.list(accountId, webPropertyId);
  
  // look for the account webPropertyLinkId that is already linked in GA and also in 'keywordSelector'
  //	TODO: ask if they need to be removed
  
  var adwordsLinks = webProperty.items;
  var linkedAdwordsAccounts = [];
  for (var i=0, link; link = adwordsLinks[i]; i++) {
      var adWordsAccounts = link.adWordsAccounts;
      var total=0;
      for (var j = 0, account; account = adWordsAccounts[j]; j++) {
          linkedAdwordsAccounts.push(account.customerId);
              total ++;
          }
  }
 
  //
  // Step 2. Add links for Google Ads Accounts <-> GA Accounts
  // Only the accounts that were not found above to already be linked.
  //
  var keywordSelector = AdsManagerApp.accounts().withCondition("Impressions > 0").forDateRange("LAST_30_DAYS");
  var accountIterator = keywordSelector.get();
 
  //
  // get all customerIds into an array
  //
  var customerAdsId = [];
  i=0;
  while (accountIterator.hasNext()) {
      var account = accountIterator.next();      
      i++;
      customerAdsId.push(account.getCustomerId());
      //Logger.log(account);
  }
  Logger.log(customerAdsId);
  Logger.log("total added: "+i );
  
  //
  // prepare a list of objects of the format [{customerId: _},{customerId: _},...]
  // to pass into GA API
  //
  // at the same time, we are filtering down to only the accounts that don't
  // already have a link
  //
  //  
  //
  
  var customerIds = [];
  j=0;
  for (var i=0; i<customerAdsId.length; i++){
      // Only add to list if we didn't already have a link)
      if(linkedAdwordsAccounts.indexOf(customerAdsId[i]) === -1){         
          customerIds.push({'customerId': customerAdsId[i]});           
        
          j++; 
      }
  }

  Logger.log("Accounts that hasn't been linked: " + j);
  Logger.log(customerIds);

  //look for the Link View profiledIds 	
  //  This function is to link to a certain view automatically
  var viewProperty = Analytics.Management.Profiles.list(accountId, webPropertyId);
  
  //Logger.log('viewProperty:' + viewProperty.items)
  var viewId = viewProperty.items;
  var viewLinkPropertyId = [];
  for (var i=0, viewName; viewName = viewId[i]; i++){
    if (viewName.name == "Test View") {
      var viewPropertyId = viewName.id;
      viewLinkPropertyId.push(viewPropertyId);
      
    }
  }
   Logger.log(viewLinkPropertyId);
  var now = new Date();

  var resource = {
      "adWordsAccounts": customerIds,
      "name": "New accounts w impressions last 30 days - "+ now,
      "profileIds": viewLinkPropertyId,
    };
    if (customerIds.length == 0) {
      Logger.log("No account needs to be processed.");
  } else {
      var webPropertyNew = Analytics.Management.WebPropertyAdWordsLinks.insert(resource, accountId, webPropertyId);
  }

}





