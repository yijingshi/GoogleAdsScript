function main() {
    
    // Step 1: List all the account with no impressions from last 90 days - list one
    // get the date range, From 90 days ago till Today
    var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
    var date = new Date();
    var timeZone = AdsApp.currentAccount().getTimeZone();
    var dateTo = Utilities.formatDate(date, timeZone, 'yyyyMMdd');
    var from = new Date(date.getTime() - 90 * MILLIS_PER_DAY);
    var dateFrom = Utilities.formatDate(from, timeZone, 'yyyyMMdd');
    Logger.log(dateFrom);
    Logger.log(dateTo);  
 
    var keywordSelector = AdsManagerApp.accounts().withCondition("Impressions = 0").forDateRange(dateFrom, dateTo);
    var accountIterator = keywordSelector.get();
    var accountIds = [];
    i=0;
    while (accountIterator.hasNext()) {
        var account = accountIterator.next();      
        i++;
        accountIds.push(account.getCustomerId());
    }
    Logger.log("total accounts has zero impressions during 90 days: "+i );
    
    //Step 2: List all the linked GA account via linking group
    //Filter out the accounts that doesn't have impressions for the last 90 days
    //Update linking group
    var accountId = '12345678';
    var webPropertyId = 'UA-12345678-1';
    var webProperty = Analytics.Management.WebPropertyAdWordsLinks.list(accountId, webPropertyId);
    var adwordsLinks = webProperty.items;
    
    var viewProperty = Analytics.Management.Profiles.list(accountId, webPropertyId);
    var viewId = viewProperty.items;
   
    var linkedViewLinkPropertyId = [];
    for (var i=0, linkedViewName; linkedViewName = viewId[i]; i++){
      if (linkedViewName.name == "Active Google Ads Accounts Linked") {
      var linkedViewPropertyId = linkedViewName.id;
      
      linkedViewLinkPropertyId.push(linkedViewPropertyId);
      }
    }
  	// Look for accounts id that still has impressions under each Linking Group in GA
    // Update Linking Group with new accounts
   
    for (var i=0, link; link = adwordsLinks[i]; i++) {
        var webPropertyLinkId = link.id; 
        var linkName = link.name;
        var adWordsAccounts = link.adWordsAccounts;
        var customerIdsNew = [];        
        for (var j = 0, account; account = adWordsAccounts[j]; j++) {
            if(accountIds.indexOf(account.customerId) === -1){               
                customerIdsNew.push({'customerId':account.customerId});                        
                }
        }
       
  	    var webPropertyAdWordsLinkId = webPropertyLinkId;
        var resource = {
          "adWordsAccounts": customerIdsNew,
          "name": linkName,
          "profileIds": linkedViewLinkPropertyId,
          };
        //If the there is no accounts inside of the 'need-to-update group', we need to remove the whole group
        //otherwise, we update the linking group
        if (customerIdsNew.length == 0) {
           var webProperty = Analytics.Management.WebPropertyAdWordsLinks.remove(accountId, webPropertyId, webPropertyAdWordsLinkId);
        } else {
           var webProperty = Analytics.Management.WebPropertyAdWordsLinks.update(resource, accountId, webPropertyId, webPropertyAdWordsLinkId);
        }
        
    }
 
  }
  
