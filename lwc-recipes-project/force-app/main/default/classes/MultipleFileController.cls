/**
 * @description       : 
 * @author            : Vixit Bhardwaj - TA AtoS
 * @group             : 
 * @last modified on  : 01-11-2021
 * @last modified by  : Vixit Bhardwaj - TA AtoS
 * Modifications Log 
 * Ver   Date         Author                     Modification
 * 1.0   01-11-2021   Vixit Bhardwaj - TA AtoS   Initial Version
**/
public with sharing class MultipleFileController {

    /**
    * @description 
    * @author Vixit Bhardwaj - TA AtoS | 01-11-2021 
    * @param idParent 
    * @param filesToInsert 
    * @param strFileType 
    * @return list<Id> 
    **/
    @AuraEnabled
    public static list<Id> saveFiles(Id idParent, list<Object> filesToInsert, String strFileType) {
        list<Id> lstCntVerIds = new list<Id>();
        List<ContentVersion> lstVersionsToInsert = new List<ContentVersion>();

        for (Object file : filesToInsert) {
            FileInfo fileData = (FileInfo)JSON.deserialize(JSON.serialize(file), FileInfo.class);
            ContentVersion objCntVersion = new ContentVersion();
            objCntVersion.PathOnClient = fileData.Title;
            objCntVersion.Title = fileData.title;
            //objCntVersion.ContentURL = fileData.ContentURL;
            objCntVersion.ContentDocumentId = fileData.contentDocumentId;
            objCntVersion.FirstPublishLocationId = idParent;
            objCntVersion.Document_Type__c = strFileType;
            objCntVersion.VersionData = fileData.VersionData;
            lstVersionsToInsert.add(objCntVersion);
            //System.debug(':::::  '+fileData.title+':::::  '+fileData.contentDocumentId);
        }
        
        list<Database.saveResult> res = Database.insert(lstVersionsToInsert);
        for (Database.SaveResult saveResult : res) {
            if(saveResult.isSuccess()) {
                lstCntVerIds.add(saveResult.getId());
            }
        }
        return lstCntVerIds;
    }
    
    /**
    * @description 
    * @author Vixit Bhardwaj - TA AtoS | 01-11-2021 
    * @param idParent 
    * @return list<contentversion> 
    **/
    @AuraEnabled
    public static list<contentversion> releatedFiles(Id idParent){
        list<id> lstConDocs = new list<id>();
        for(ContentDocumentLink cntLink : [Select Id, ContentDocumentId From ContentDocumentLink Where LinkedEntityId =:idParent]) {
            lstConDocs.add(cntLink.ContentDocumentId);
        }

        if(!lstConDocs.isEmpty()) {
            return [SELECT Id, Title, ContentDocumentId, LastModifiedDate, ContentSize, Owner.name, Document_Type__c, ContentURL FROM ContentVersion WHERE ContentDocumentId IN :lstConDocs];  
        }
        else {
            return null;
        } 
    }
    
    public class FileInfo {
        public String title;
        public Blob versionData;
        public String contentDocumentId;
    }

}
