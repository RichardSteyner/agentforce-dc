Id contactCRM = '003gL00000HzQjlQAF';
//get unified individuals linked to contact
UnifiedLinkssotIndividualCcid__dlm unifiedRecord = [
	SELECT Id, 
		UnifiedRecordId__c, 
		SourceRecordId__c
	FROM UnifiedLinkssotIndividualCcid__dlm
	WHERE SourceRecordId__c = :contactCRM
	LIMIT 1
];

//get other individual records linked to unified individual
List<UnifiedLinkssotIndividualCcid__dlm> individualLinks = [
	SELECT Id,
	   SourceRecordId__c
	FROM UnifiedLinkssotIndividualCcid__dlm
	WHERE UnifiedRecordId__c = :unifiedRecord.UnifiedRecordId__c
];

//collect ssot__Id__c values
Set<String> ssotIds = new Set<String>();
for(UnifiedLinkssotIndividualCcid__dlm link : individualLinks) {
	ssotIds.add(link.SourceRecordId__c);
}

//Get reservations linked to individual records
List<Reservation__dlm> reservations = [
	SELECT Reservation_ID__c ,
		Check_in_Date__c, 
		Check_out_Date__c, 
		Room_Type__c, 
		Room_Number__c, 
		Reservation_Status__c, 
		Total_Price__c,
		Contact_ID__c
	FROM Reservation__dlm 
	WHERE Contact_ID__c  IN :ssotIds
];
System.debug(reservations.size());
for(Reservation__dlm res : reservations) {
	System.debug(res);
}

