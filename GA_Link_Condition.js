/**
**  This script is to add Google ads account by Impressions to google analytics
**
*/
function main() {
  	
  	var keywordSelector = AdsManagerApp.accounts().withCondition("Impressions > 0").forDateRange("LAST_30_DAYS");
    var accountIterator = keywordSelector.get();
  	
  	/**customerIds pass down to adWordsAccounts when making new accounts
    	customersAdsId creates an arraylist that pass down all the accounts ID 
  	*/
    var customerIds = [];
  	var customerAdsId =[];
    i=0;
  
    while (accountIterator.hasNext()) {
      var accountName = accountIterator.next();      
 
      i++;
      //Logger.log('account: '+ accountName.getCustomerId());
          
      customerIds.push({'customerId': accountName.getCustomerId()}); 
      customerAdsId.push(accountName.getCustomerId());
      
    }
  
   // Logger.log(customerIds);
  	Logger.log(customerAdsId);
  
    Logger.log("total added: "+i );

  	//list all the accounts that is already linked on GA
  	var accountId = 'ID';
    var webPropertyId = 'ID';
  	
    var webProperty = Analytics.Management.WebPropertyAdWordsLinks.list(accountId, webPropertyId);
    
  	// look for the account webPropertyLinkId that is already linked in GA and also in 'keywordSelector'
  	//	TODO: ask if they need to be removed
  
    var adwordsLinks = webProperty.items;
    
    for (var i=0, link; link = adwordsLinks[i]; i++) {
      var adWordsAccounts = link.adWordsAccounts;
        for (var j = 0, account; account = adWordsAccounts[j]; j++) {
          //Logger.log('Account customer Id: ' + account.customerId);
          	var accountId = account.customerId;
            if (customerAdsId.indexOf(accountId) !== -1){
          	Logger.log('same Id: ' + accountId);
          }
        }
        	
   
      }
      

  	//make new links with conditions
    var accountId = 'ID';
    var webPropertyId = 'ID';
  	var resource = {
        'adWordsAccounts': customerIds,
        'name': 'Account has Impression'
      };
  	
   	var webProperty = Analytics.Management.WebPropertyAdWordsLinks.insert(resource, accountId, webPropertyId);
  
  	
  	//Logger.log('Web Property ID: %s, Name: %s, Other: %s', webProperty.accountId, webProperty.name, webProperty.adWordsAccounts);
        

   
  }
  
