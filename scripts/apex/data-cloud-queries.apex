List<ssot__Individual__dlm> individuals = [
	SELECT ssot__Id__c,
       ssot__FirstName__c,
       ssot__LastName__c,
       ssot__BirthDate__c,
       ssot__DataSourceId__c
	FROM ssot__Individual__dlm
	WHERE ssot__LastName__c = 'Rodriguez'
];

//collect ssot__Id__c values
Set<String> ssotIds = new Set<String>();
for(ssot__Individual__dlm ind : individuals) {
	ssotIds.add(ind.ssot__Id__c);
}

List<UnifiedLinkssotIndividualCcid__dlm> links = [
	SELECT Id, 
		UnifiedRecordId__c, 
		SourceRecordId__c
	FROM UnifiedLinkssotIndividualCcid__dlm
	WHERE SourceRecordId__c IN :ssotIds
];
System.debug(links);