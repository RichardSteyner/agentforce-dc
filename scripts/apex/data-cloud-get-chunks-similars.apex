
String querySql = '''
    SELECT c.SourceRecordId__c, 
        c.Chunk__c, 
        h.hybrid_score__c, 
        h.KeyWord_Score__c, 
        h.Vector_Score__c
    FROM hybrid_search(table(Case_index__dlm), 'pizza', '', 5) as h
    JOIN Case_chunk__dlm c ON c.RecordId__c = h.SourceRecordId__c
    order by h.hybrid_score__c desc
''';

ConnectApi.CdpQueryInput queryInput = new ConnectApi.CdpQueryInput();
queryInput.sql = querySql;

ConnectApi.CdpQueryOutputV2 queryOutput = 
    ConnectApi.CdpQuery.queryANSISqlV2(queryInput);

System.debug(JSON.serialize(queryOutput.data));