// Copyright 2016, Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @name Large Manager Hierarchy Template
 *
 * @overview The Large Manager Hierarchy Template script provides a general way
 *     to run script logic on all client accounts within a manager account
 *     hierarchy, splitting the work across multiple executions if necessary.
 *     Each execution of the script processes a subset of the hierarchy's client
 *     accounts that it hadn't previously processed, saving the results to a
 *     temporary file on Drive. Once the script processes the final subset of
 *     accounts, the consolidated results can be output and the cycle can begin
 *     again.
 *     See
 *     https://developers.google.com/google-ads/scripts/docs/solutions/adsmanagerapp-manager-template
 *     for more details.
 *
 * @author Google Ads Scripts Team [adwords-scripts@googlegroups.com]
 *
 * @version 1.0
 *
 * @changelog
 * - version 1.0
 *   - Released initial version.
 */

/*************** START OF YOUR IMPLEMENTATION ***************/

var TEMPLATE_CONFIG = {
    // The name of the file that will be created on Drive to store data
    // between executions of the script. You must use a different
    // filename for each each script running in the account, or data
    // from different scripts may overwrite one another.
    FILENAME: 'UNIQUE_FILENAME_HERE',
  
    // The minimum number of days between the start of each cycle.
    MIN_FREQUENCY: 0,
  
    // Controls whether child accounts will be processed in parallel (true)
    // or sequentially (false).
    USE_PARALLEL_MODE: true,
    
    // Controls the maximum number of accounts that will be processed in a
    // single script execution.
    MAX_ACCOUNTS: 3,
  
    // A list of ***ManagedAccountSelector*** conditions to restrict the population
    // of child accounts that will be processed. Leave blank or comment out
    // to include all child accounts.
   
    ACCOUNT_CONDITIONS: ["Conversions <= 4"]
  };
  
  // The possible statuses for the script as a whole or an individual account.
  var Statuses = {
    NOT_STARTED: 'Not Started',
    STARTED: 'Started',
    FAILED: 'Failed',
    COMPLETE: 'Complete'
  };
  
  // Use this to determine the relevant date range for your data.
  // See here for the possible options:
  // https://developers.google.com/google-ads/scripts/docs/reference/adwordsapp/adwordsapp_campaignselector#forDateRange_1
  var DATE_RANGE = 'LAST_30_DAYS';
  
  // Use this to determine the minimum number of impressions a campaign or
  // and ad group should have before being considered.
  var MINIMUM_IMPRESSIONS = 0;
  
  // Use this if you want to exclude some campaigns. Case insensitive.
  // For example ["Brand"] would ignore any campaigns with 'brand' in the name,
  // while ["Brand","Competitor"] would ignore any campaigns with 'brand' or
  // 'competitor' in the name.
  // Leave as [] to not exclude any campaigns.
  var CAMPAIGN_NAME_DOES_NOT_CONTAIN = [];
  
  // Use this if you only want to look at some campaigns.  Case insensitive.
  // For example ["Brand"] would only look at campaigns with 'brand' in the name,
  // while ["Brand","Generic"] would only look at campaigns with 'brand' or 'generic'
  // in the name.
  // Leave as [] to include all campaigns.
  var CAMPAIGN_NAME_CONTAINS = [];
  
  var AUDIENCE_MAPPING_CSV_DOWNLOAD_URL = 'https://developers.google.com/adwords/api/docs/appendix/in-market_categories.csv';
  
  
  /**
   * Your main logic for initializing a cycle for your script.
   *
   * @param {Array.<string>} customerIds The customerIds that this cycle
   *     will process.
   */
  function initializeCycle(customerIds) {
    // REPLACE WITH YOUR IMPLEMENTATION
      /*** To match with any condition that set in ACCOUNT_CONDITIONS 
       */
    // This example simply prints the accounts that will be process in
    // this cycle.
    Logger.log('Accounts to be processed this cycle:');
    for (var i = 0; i < customerIds.length; i++) {
      Logger.log(customerIds[i]);
    }
  }
  
  /**
   * Your main logic for initializing a single execution of the script.
   *
   * @param {Array.<string>} customerIds The customerIds that this
   *     execution will process.
   */
  function initializeExecution(customerIds) {
    // REPLACE WITH YOUR IMPLEMENTATION
      
    // This example simply prints the accounts that will be process in
    // this execution.
    Logger.log('Accounts to be processed this execution:');
    for (var i = 0; i < customerIds.length; i++) {
      Logger.log(customerIds[i]);
    }
  }
  /**
   * Iterator accounts
   */
  
  /**
   * Your main logic for processing a single Google Ads account. This function
   * can perform any sort of processing on the account, followed by
   * outputting results immediately (e.g., sending an email, saving to a
   * spreadsheet, etc.) and/or returning results to be output later, e.g.,
   * to be combined with the output from other accounts.
   *
   * @return {Object} An object containing any results of your processing
   *    that you want to output later.
   */
  
  function processAccount() {
    // REPLACE WITH YOUR IMPLEMENTATION
    
    Logger.log('Getting audience mapping');
    var audienceMapping =
      getInMarketAudienceMapping(AUDIENCE_MAPPING_CSV_DOWNLOAD_URL);
  
    Logger.log('Getting campaign performance');
    var campaignPerformance = getCampaignPerformance();
  
    Logger.log('Getting ad group performance');
    var adGroupPerformance = getAdGroupPerformance();
  
    Logger.log('Making operations');
    var operations = makeAllOperations(
      audienceMapping,
      campaignPerformance,
      adGroupPerformance
    );
    
    
    // !!Uncomment below to applybids!!!
    Logger.log('Applying bids..haha');
  
    
    // This example simply returns the number of campaigns and ad groups
    // in the account.
    /*
    return {
      numCampaigns: AdsApp.campaigns().get().totalNumEntities(),
      numAdGroups: AdsApp.adGroups().get().totalNumEntities()
    };
    */
    return {
      did_we_run: true
    };
  }
  
  function getInMarketAudienceMapping(downloadCsvUrl) {
      var csv = Utilities.parseCsv(
        UrlFetchApp.fetch(downloadCsvUrl).getContentText()
      );
    
      var headers = csv[0];
      var indexOfId = headers.indexOf('Criterion ID');
      var indexOfName = headers.indexOf('Category');
    
      if ((indexOfId === -1) || (indexOfName === -1)) {
        throw new Error('The audience CSV does not have the expected headers');
      }
    
      var mapping = {};
      for (var i = 1; i < csv.length; i++) {
        var row = csv[i];
        mapping[row[indexOfId]] = row[indexOfName];
      }
    
      return mapping;
    }
    
    // get campaign performance report via campaign id
    function getCampaignPerformance() {
      
      var entityIdFieldName = 'CampaignId';
      var reportName = 'CAMPAIGN_PERFORMANCE_REPORT';
      var performance = {};
      
      var query = 
          "SELECT CampaignId, AbsoluteTopImpressionPercentage " +
          "FROM CAMPAIGN_PERFORMANCE_REPORT " +
          "WHERE Impressions > " + String(MINIMUM_IMPRESSIONS) + " " +
          "DURING " + DATE_RANGE;
      
          //create a spreadsheet, change the report name as prefered
      /** 
      var sheet = SpreadsheetApp.create('IM A SHEET').getActiveSheet();
        // set sheet range
      var range = sheet.getRange("B2:I20");
      var cell = range.getValues();
    */
      var rows = AdsApp.report(query).rows();
      /** 
      var i = 1;
      */
      while (rows.hasNext()) {
        var row = rows.next();
        performance[row['CampaignId']] = row.AbsoluteTopImpressionPercentage;
        //place data in cell in the sheet
        /** 
        cell[0][3] = ["CampaignId"];
        cell[0][4] = ["AbsoluteTopImpressionPercentage"];
        cell[i][3] = row["CampaignId"];
        cell[i][4] = row["AbsoluteTopImpressionPercentage"];
        i++;
        **/
        //all the data shows here
        Logger.log('performance = '+JSON.stringify(performance));
        /** 
        range.setValues(cell);
        */
      }   
        
      return performance;
      
    }
    
    // get adgroup performance report via adgroup id
    function getAdGroupPerformance() {
      //return getEntityPerformance('AdGroupId', 'ADGROUP_PERFORMANCE_REPORT');
      var entityIdFieldName = 'AdGroupId';
      var reportName = 'ADGROUP_PERFORMANCE_REPORT';
      var performance = {};
      var query = "SELECT AdGroupId, CostPerAllConversion " +
          "FROM ADGROUP_PERFORMANCE_REPORT " +
          "WHERE Impressions > " + String(MINIMUM_IMPRESSIONS) + " " +
          "DURING " + DATE_RANGE;
      var rows = AdsApp.report(query).rows();
    
      while (rows.hasNext()) {
        var row = rows.next();
        performance[row[ 'AdGroupId']] = row.CostPerAllConversion;
      }
      return performance;
    }
    
    
    
    //
    function makeAllOperations(
      audienceMapping,
      campaignPerformance,
      adGroupPerformance
    ) {
      var operations = [];
    
      
      var allCampaigns =
        filterCampaignsBasedOnName(AdWordsApp.campaigns());
    
    
      var filteredCampaigns =
        filterEntitiesBasedOnDateAndImpressions(allCampaigns)
        .get();
    
      while (filteredCampaigns.hasNext()) {
        var campaign = filteredCampaigns.next();
    
        // Can't have both ad-group-level and campaign-level
        // audiences on any given campaign.
        if (campaignHasAnyCampaignLevelAudiences(campaign)) {
          var operationsFromCampaign = makeOperationsFromEntity(
            campaign,
            campaignPerformance[campaign.getId()],
            audienceMapping
          );
    
          operations = operations.concat(operationsFromCampaign);
        } else {
          var adGroups =
            filterEntitiesBasedOnDateAndImpressions(campaign.adGroups())
            .get();
    
          while (adGroups.hasNext()) {
            var adGroup = adGroups.next();
            var operationsFromAdGroup = makeOperationsFromEntity(
              adGroup,
              adGroupPerformance[adGroup.getId()],
              audienceMapping
            );
    
            operations = operations.concat(operationsFromAdGroup);
          }
        }
      }
    
      return operations;
    }
    
    
    function filterCampaignsBasedOnName(campaigns) {
      CAMPAIGN_NAME_DOES_NOT_CONTAIN.forEach(function(part) {
        campaigns = campaigns.withCondition(
          "CampaignName DOES_NOT_CONTAIN_IGNORE_CASE '" + part.replace(/"/g,'\\\"') + "'"
        );
      });
    
      CAMPAIGN_NAME_CONTAINS.forEach(function(part) {
        campaigns = campaigns.withCondition(
          "CampaignName CONTAINS_IGNORE_CASE '" + part.replace(/"/g,'\\\"') + "'"
        );
      });
    
      return campaigns;
    }
    
    function filterEntitiesBasedOnDateAndImpressions(selector) {
      return selector
        .forDateRange(DATE_RANGE)
        .withCondition('Impressions > ' + String(MINIMUM_IMPRESSIONS));
    }
    
    function makeOperationsFromEntity(entity, entityCpa, audienceMapping) {
        var entityAudiences = getAudiencesFromEntity(entity, audienceMapping);
        return makeOperations(entityCpa, entityAudiences);
    }
    
    function getAudiencesFromEntity(entity, audienceMapping) {
      var inMarketIds = Object.keys(audienceMapping);
    
      var allAudiences = entity
        .targeting()
        .audiences()
        .forDateRange(DATE_RANGE)
        .withCondition('Impressions > ' + String(MINIMUM_IMPRESSIONS))
        .get();
    
      var inMarketAudiences = [];
      while (allAudiences.hasNext()) {
        var audience = allAudiences.next();
        if (isAudienceInMarketAudience(audience, inMarketIds)) {
          inMarketAudiences.push(audience);
        }
      }
    
      return inMarketAudiences;
    }
    
    function isAudienceInMarketAudience(audience, inMarketIds) {
      return inMarketIds.indexOf(audience.getAudienceId()) > -1;
    }
    
    function makeOperations(entityCpa, audiences) {
      var operations = [];
      audiences.forEach(function(audience) {
        var stats = audience.getStatsFor(DATE_RANGE);
        var conversions = stats.getConversions();
        if (conversions > 0) {
          var audienceCpa = stats.getCost() / stats.getConversions();
          entityCpa = parseFloat(entityCpa);
          var modifier = (entityCpa / audienceCpa);
    
          var operation = {};
          operation.audience = audience;
          operation.modifier = modifier;
    
    
          operations.push(operation);
        }
      });
    
      return operations;
    }
    
    function campaignHasAnyCampaignLevelAudiences(campaign) {
      var totalNumEntities = campaign
      .targeting()
      .audiences()
      .get()
      .totalNumEntities();
    
      return totalNumEntities > 0;
    }
  
  /**
   * Your main logic for consolidating or outputting results after
   * a single execution of the script. These single execution results may
   * reflect the processing on only a subset of your accounts.
   *
   * @param {Object.<string, {
   *       status: string,
   *       returnValue: Object,
   *       error: string
   *     }>} results The results for the accounts processed in this
   *    execution of the script, keyed by customerId. The status will be
   *    Statuses.COMPLETE if the account was processed successfully,
   *    Statuses.FAILED if there was an error, and Statuses.STARTED if it
   *    timed out. The returnValue field is present when the status is
   *    Statuses.COMPLETE and corresponds to the object you returned in
   *    processAccount(). The error field is present when the status is
   *    Statuses.FAILED.
   */
  function processIntermediateResults(results) {
    // REPLACE WITH YOUR IMPLEMENTATION
  
    // This example simply logs the number of campaigns and ad groups
    // in each of the accounts successfully processed in this execution.
    Logger.log('Results of this execution:');
    for (var customerId in results) {
      var result = results[customerId];
      if (result.status == Statuses.COMPLETE) {
        Logger.log(customerId + ': ' + result.returnValue.numCampaigns +
                   ' campaigns, ' + result.returnValue.numAdGroups +
                   ' ad groups');
      } else if (result.status == Statuses.STARTED) {
        Logger.log(customerId + ': timed out');
      } else {
        Logger.log(customerId + ': failed due to "' + result.error + '"');
      }
    }
  }
  
  /**
   * Your main logic for consolidating or outputting results after
   * the script has executed a complete cycle across all of your accounts.
   * This function will only be called once per complete cycle.
   *
   * @param {Object.<string, {
   *       status: string,
   *       returnValue: Object,
   *       error: string
   *     }>} results The results for the accounts processed in this
   *    execution of the script, keyed by customerId. The status will be
   *    Statuses.COMPLETE if the account was processed successfully,
   *    Statuses.FAILED if there was an error, and Statuses.STARTED if it
   *    timed out. The returnValue field is present when the status is
   *    Statuses.COMPLETE and corresponds to the object you returned in
   *    processAccount(). The error field is present when the status is
   *    Statuses.FAILED.
   */
  function processFinalResults(results) {
    // REPLACE WITH YOUR IMPLEMENTATION
  
    // This template simply logs the total number of campaigns and ad
    // groups across all accounts successfully processed in the cycle.
    var numCampaigns = 0;
    var numAdGroups = 0;
  
    Logger.log('Results of this cycle:');
    for (var customerId in results) {
      var result = results[customerId];
      if (result.status == Statuses.COMPLETE) {
        Logger.log(customerId + ': successful');
        numCampaigns += result.returnValue.numCampaigns;
        numAdGroups += result.returnValue.numAdGroups;
      } else if (result.status == Statuses.STARTED) {
        Logger.log(customerId + ': timed out');
      } else {
        Logger.log(customerId + ': failed due to "' + result.error + '"');
      }
    }
  
    Logger.log('Total number of campaigns: ' + numCampaigns);
    Logger.log('Total number of ad groups: ' + numAdGroups);
  }
  
  /**************** END OF YOUR IMPLEMENTATION ****************/
  
  /**************** START OF STANDARD TEMPLATE ****************/
  
  // Whether or not the script is running in a manager account.
  var IS_MANAGER = typeof AdsManagerApp !== 'undefined';
  
  // The maximum number of accounts that can be processed when using
  // executeInParallel().
  var MAX_PARALLEL = 50;
  
  // The possible modes in which the script can execute.
  var Modes = {
    SINGLE: 'Single',
    MANAGER_SEQUENTIAL: 'Manager Sequential',
    MANAGER_PARALLEL: 'Manager Parallel'
  };
  
  function main() {
    var mode = getMode();
    stateManager.loadState();
  
    // The last execution may have attempted the final set of accounts but
    // failed to actually complete the cycle because of a timeout in
    // processIntermediateResults(). In that case, complete the cycle now.
    if (stateManager.getAccountsWithStatus().length > 0) {
      completeCycleIfNecessary();
    }
  
    // If the cycle is complete and enough time has passed since the start of
    // the last cycle, reset it to begin a new cycle.
    if (stateManager.getStatus() == Statuses.COMPLETE) {
      if (dayDifference(stateManager.getLastStartTime(), new Date()) >
          TEMPLATE_CONFIG.MIN_FREQUENCY) {
        stateManager.resetState();
      } else {
        Logger.log('Waiting until ' + TEMPLATE_CONFIG.MIN_FREQUENCY +
                   ' days have elapsed since the start of the last cycle.');
        return;
      }
    }
  
    // Find accounts that have not yet been processed. If this is the
    // beginning of a new cycle, this will be all accounts.
    var customerIds =
        stateManager.getAccountsWithStatus(Statuses.NOT_STARTED);
  
    // The status will be Statuses.NOT_STARTED if this is the very first
    // execution or if the cycle was just reset. In either case, it is the
    // beginning of a new cycle.
    if (stateManager.getStatus() == Statuses.NOT_STARTED) {
      stateManager.setStatus(Statuses.STARTED);
      stateManager.saveState();
  
      initializeCycle(customerIds);
    }
  
    // Don't attempt to process more accounts than specified, and
    // enforce the limit on parallel execution if necessary.
    var accountLimit = TEMPLATE_CONFIG.MAX_ACCOUNTS;
  
    if (mode == Modes.MANAGER_PARALLEL) {
      accountLimit = Math.min(MAX_PARALLEL, accountLimit);
    }
  
    var customerIdsToProcess = customerIds.slice(0, accountLimit);
  
    // Save state so that we can detect when an account timed out by it still
    // being in the STARTED state.
    stateManager.setAccountsWithStatus(customerIdsToProcess, Statuses.STARTED);
    stateManager.saveState();
  
    initializeExecution(customerIdsToProcess);
    executeByMode(mode, customerIdsToProcess);
  }
  
  /**
   * Runs the script on a list of accounts in a given mode.
   *
   * @param {string} mode The mode the script should run in.
   * @param {Array.<string>} customerIds The customerIds that this execution
   *     should process. If mode is Modes.SINGLE, customerIds must contain
   *     a single element which is the customerId of the Google Ads account.
   */
  function executeByMode(mode, customerIds) {
    switch (mode) {
      case Modes.SINGLE:
        var results = {};
        results[customerIds[0]] = tryProcessAccount();
        completeExecution(results);
        break;
  
      case Modes.MANAGER_SEQUENTIAL:
        var accounts = AdsManagerApp.accounts().withIds(customerIds).get();
        var results = {};
  
        var managerAccount = AdsApp.currentAccount();
        while (accounts.hasNext()) {
          var account = accounts.next();
          AdsManagerApp.select(account);
          results[account.getCustomerId()] = tryProcessAccount();
        }
        AdsManagerApp.select(managerAccount);
  
        completeExecution(results);
        break;
  
      case Modes.MANAGER_PARALLEL:
        if (customerIds.length == 0) {
          completeExecution({});
        } else {
          var accountSelector = AdsManagerApp.accounts().withIds(customerIds);
          accountSelector.executeInParallel('parallelFunction',
                                            'parallelCallback');
        }
        break;
    }
  }
  
  /**
   * Attempts to process the current Google Ads account.
   *
   * @return {Object} The result of the processing if successful, or
   *     an object with status Statuses.FAILED and the error message
   *     if unsuccessful.
   */
  function tryProcessAccount() {
    try {
      return {
        status: Statuses.COMPLETE,
        returnValue: processAccount()
      };
    } catch (e) {
      return {
        status: Statuses.FAILED,
        error: e.message
      };
    }
  }
  
  /**
   * The function given to executeInParallel() when running in parallel mode.
   * This helper function is necessary so that the return value of
   * processAccount() is transformed into a string as required by
   * executeInParallel().
   *
   * @return {string} JSON string representing the return value of
   *     processAccount().
   */
  function parallelFunction() {
    var returnValue = processAccount();
    return JSON.stringify(returnValue);
  }
  
  /**
   * The callback given to executeInParallel() when running in parallel mode.
   * Processes the execution results into the format used by all execution
   * modes.
   *
   * @param {Array.<Object>} executionResults An array of execution results
   *     from a parallel execution.
   */
  function parallelCallback(executionResults) {
    var results = {};
  
    for (var i = 0; i < executionResults.length; i++) {
      var executionResult = executionResults[i];
      var status;
  
      if (executionResult.getStatus() == 'OK') {
        status = Statuses.COMPLETE;
      } else if (executionResult.getStatus() == 'TIMEOUT') {
        status = Statuses.STARTED;
      } else {
        status = Statuses.FAILED;
      }
      //Logger.log('executionResult = '+JSON.stringify(executionResult));
      //Logger.log('Result = '+JSON.stringify(status));
      
      
      
      
      Logger.log('getCustomerId: '+executionResult.getCustomerId());
      Logger.log('results: '+JSON.stringify(results));
      Logger.log('executionResult.getReturnValue: '+executionResult.getReturnValue());
      results[executionResult.getCustomerId()] = {
        status: status,
        returnValue: JSON.parse(executionResult.getReturnValue()),
        error: executionResult.getError()
      };
    }
  
    // After executeInParallel(), variables in global scope are reevaluated,
    // so reload the state.
    stateManager.loadState();
  
    completeExecution(results);
  }
  
  /**
   * Completes a single execution of the script by saving the results and
   * calling the intermediate and final result handlers as necessary.
   *
   * @param {Object.<string, {
   *       status: string,
   *       returnValue: Object,
   *       error: string
   *     }>} results The results of the current execution of the script.
   */
  function completeExecution(results) {
    for (var customerId in results) {
      var result = results[customerId];
      stateManager.setAccountWithResult(customerId, result);
    }
    stateManager.saveState();
  
    processIntermediateResults(results);
    completeCycleIfNecessary();
  }
  
  /**
   * Completes a full cycle of the script if all accounts have been attempted
   * but the cycle has not been marked as complete yet.
   */
  function completeCycleIfNecessary() {
    if (stateManager.getAccountsWithStatus(Statuses.NOT_STARTED).length == 0 &&
        stateManager.getStatus() != Statuses.COMPLETE) {
      stateManager.setStatus(Statuses.COMPLETE);
      stateManager.saveState();
      processFinalResults(stateManager.getResults());
    }
  }
  
  /**
   * Determines what mode the script should run in.
   *
   * @return {string} The mode to run in.
   */
  function getMode() {
    if (IS_MANAGER) {
      if (TEMPLATE_CONFIG.USE_PARALLEL_MODE) {
        return Modes.MANAGER_PARALLEL;
      } else {
        return Modes.MANAGER_SEQUENTIAL;
      }
    } else {
      return Modes.SINGLE;
    }
  }
  
  /**
   * Finds all customer IDs that the script could process. For a single account,
   * this is simply the account itself.
   *
   * @return {Array.<string>} A list of customer IDs.
   */
  function getCustomerIdsPopulation() {
    if (IS_MANAGER) {
      var customerIds = [];
  
      var selector = AdsManagerApp.accounts();
      var conditions = TEMPLATE_CONFIG.ACCOUNT_CONDITIONS || [];
      for (var i = 0; i < conditions.length; i++) {
        selector = selector.withCondition(conditions[i]);
      }
  
      var accounts = selector.forDateRange('LAST_30_DAYS').get();
      while (accounts.hasNext()) {
        customerIds.push(accounts.next().getCustomerId());
      }
  
      return customerIds;
    } else {
      return [AdsApp.currentAccount().getCustomerId()];
    }
  }
  
  /**
   * Returns the number of days between two dates.
   *
   * @param {Object} from The older Date object.
   * @param {Object} to The newer (more recent) Date object.
   * @return {number} The number of days between the given dates (possibly
   *     fractional).
   */
  function dayDifference(from, to) {
    return (to.getTime() - from.getTime()) / (24 * 3600 * 1000);
  }
  
  /**
   * Loads a JavaScript object previously saved as JSON to a file on Drive.
   *
   * @param {string} filename The name of the file in the account's root Drive
   *     folder where the object was previously saved.
   * @return {Object} The JavaScript object, or null if the file was not found.
   */
  function loadObject(filename) {
    var files = DriveApp.getRootFolder().getFilesByName(filename);
  
    if (!files.hasNext()) {
      return null;
    } else {
      var file = files.next();
  
      if (files.hasNext()) {
        throwDuplicateFileException(filename);
      }
  
      return JSON.parse(file.getBlob().getDataAsString());
    }
  }
  
  /**
   * Saves a JavaScript object as JSON to a file on Drive. An existing file with
   * the same name is overwritten.
   *
   * @param {string} filename The name of the file in the account's root Drive
   *     folder where the object should be saved.
   * @param {obj} obj The object to save.
   */
  function saveObject(filename, obj) {
    var files = DriveApp.getRootFolder().getFilesByName(filename);
  
    if (!files.hasNext()) {
      DriveApp.createFile(filename, JSON.stringify(obj));
    } else {
      var file = files.next();
  
      if (files.hasNext()) {
        throwDuplicateFileException(filename);
      }
  
      file.setContent(JSON.stringify(obj));
    }
  }
  
  /**
   * Throws an exception if there are multiple files with the same name.
   *
   * @param {string} filename The filename that caused the error.
   */
  function throwDuplicateFileException(filename) {
    throw 'Multiple files named ' + filename + ' detected. Please ensure ' +
        'there is only one file named ' + filename + ' and try again.';
  }
  
  var stateManager = (function() {
    /**
     * @type {{
     *   cycle: {
     *     status: string,
     *     lastUpdate: string,
     *     startTime: string
     *   },
     *   accounts: Object.<string, {
     *     status: string,
     *     lastUpdate: string,
     *     returnValue: Object
     *   }>
     * }}
     */
    var state;
  
    /**
     * Loads the saved state of the script. If there is no previously
     * saved state, sets the state to an initial default.
     */
    var loadState = function() {
      state = loadObject(TEMPLATE_CONFIG.FILENAME);
      if (!state) {
        resetState();
      }
    };
  
    /**
     * Saves the state of the script to Drive.
     */
    var saveState = function() {
      saveObject(TEMPLATE_CONFIG.FILENAME, state);
    };
  
    /**
     * Resets the state to an initial default.
     */
    var resetState = function() {
      state = {};
      var date = Date();
  
      state.cycle = {
        status: Statuses.NOT_STARTED,
        lastUpdate: date,
        startTime: date
      };
  
      state.accounts = {};
      var customerIds = getCustomerIdsPopulation();
  
      for (var i = 0; i < customerIds.length; i++) {
        state.accounts[customerIds[i]] = {
          status: Statuses.NOT_STARTED,
          lastUpdate: date
        };
      }
    };
  
    /**
     * Gets the status of the current cycle.
     *
     * @return {string} The status of the current cycle.
     */
    var getStatus = function() {
      return state.cycle.status;
    };
  
    /**
     * Sets the status of the current cycle.
     *
     * @param {string} status The status of the current cycle.
     */
    var setStatus = function(status) {
      var date = Date();
  
      if (status == Statuses.IN_PROGRESS &&
          state.cycle.status == Statuses.NOT_STARTED) {
        state.cycle.startTime = date;
      }
  
      state.cycle.status = status;
      state.cycle.lastUpdate = date;
    };
  
    /**
     * Gets the start time of the current cycle.
     *
     * @return {Object} Date object for the start of the last cycle.
     */
    var getLastStartTime = function() {
      return new Date(state.cycle.startTime);
    };
  
    /**
     * Gets accounts in the current cycle with a particular status.
     *
     * @param {string} status The status of the accounts to get.
     *     If null, all accounts are retrieved.
     * @return {Array.<string>} A list of matching customerIds.
     */
    var getAccountsWithStatus = function(status) {
      var customerIds = [];
  
      for (var customerId in state.accounts) {
        if (!status || state.accounts[customerId].status == status) {
          customerIds.push(customerId);
        }
      }
  
      return customerIds;
    };
  
    /**
     * Sets accounts in the current cycle with a particular status.
     *
     * @param {Array.<string>} customerIds A list of customerIds.
     * @param {string} status A status to apply to those customerIds.
     */
    var setAccountsWithStatus = function(customerIds, status) {
      var date = Date();
  
      for (var i = 0; i < customerIds.length; i++) {
        var customerId = customerIds[i];
  
        if (state.accounts[customerId]) {
          state.accounts[customerId].status = status;
          state.accounts[customerId].lastUpdate = date;
        }
      }
    };
  
    /**
     * Registers the processing of a particular account with a result.
     *
     * @param {string} customerId The account that was processed.
     * @param {{
     *       status: string,
     *       returnValue: Object
     *       error: string
     *     }} result The object to save for that account.
     */
    var setAccountWithResult = function(customerId, result) {
      if (state.accounts[customerId]) {
        state.accounts[customerId].status = result.status;
        state.accounts[customerId].returnValue = result.returnValue;
        state.accounts[customerId].error = result.error;
        state.accounts[customerId].lastUpdate = Date();
      }
    };
  
    /**
     * Gets the current results of the cycle for all accounts.
     *
     * @return {Object.<string, {
     *       status: string,
     *       lastUpdate: string,
     *       returnValue: Object,
     *       error: string
     *     }>} The results processed by the script during the cycle,
     *    keyed by account.
     */
    var getResults = function() {
      return state.accounts;
    };
  
    return {
      loadState: loadState,
      saveState: saveState,
      resetState: resetState,
      getStatus: getStatus,
      setStatus: setStatus,
      getLastStartTime: getLastStartTime,
      getAccountsWithStatus: getAccountsWithStatus,
      setAccountsWithStatus: setAccountsWithStatus,
      setAccountWithResult: setAccountWithResult,
      getResults: getResults
    };
  })();
  
  /***************** END OF STANDARD TEMPLATE *****************/