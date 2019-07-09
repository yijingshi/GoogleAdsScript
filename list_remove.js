function main() {
  
  	// have to do a list first, to get the exist webPropertyAdwordsLinkId
  	var accountId = 'id';
    var webPropertyId = 'id';
  	
    var webProperty = Analytics.Management.WebPropertyAdWordsLinks.list(accountId, webPropertyId);
  
  	var adwordsLinks = webProperty.items;
    
  	// look for the account webPropertyLinkId to be removed
    for (var i=0, link; link = adwordsLinks[i]; i++) {
      if (link.name == "Account by Impression") {

        var webPropertyLinkId = link.id;
        Logger.log('Account: ' + webPropertyLinkId);
      }
      
    }
  	
  	var webPropertyLinkIdAds = webPropertyLinkId;
  	//remove the whole group
    var accountId = 'id';
    var webPropertyId = 'id';
  	var webPropertyAdWordsLinkId = webPropertyLinkIdAds;
    var webProperty = Analytics.Management.WebPropertyAdWordsLinks.remove(accountId, webPropertyId, webPropertyAdWordsLinkId);
	
  	Logger.log('result: ', webProperty);
        
  
   
  }
  
